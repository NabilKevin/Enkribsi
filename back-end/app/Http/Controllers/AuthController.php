<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\PasswordReset;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTFactory;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
            'remember_me' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Invalid fields',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only(['email', 'password']);

        if($token = JWTAuth::attempt($data)) {

            $ttl = $request->remember_me ? 43200 : 1440; // 30 hari vs 24 jam

            // Set TTL secara dinamis menggunakan JWTFactory
            $customClaims = ['exp' => now()->addMinutes($ttl)->timestamp];
            $payload = JWTFactory::customClaims($customClaims)->make();

            $token = JWTAuth::encode($payload);

            return response()->json([
                'status' => 'successful',
                'message' => 'Login successfully'
            ], 200)->withCookie(
                'a913h9a0dsj',
                $token,
                $ttl,
                '/',
                null,
                env('APP_ENV') === 'production',
                true,
                false
            );
        }
        return response()->json([
            'status' => 'unsuccessful',
            'message' => 'Email or password is incorrect'
        ], 401);
    }

    public function logout()
    {
        return response()->json([
            'status' => 'successful',
            'message'=> 'Logout successful'
        ],200)->withCookie(Cookie::forget('a913h9a0dsj'));
    }

    public function forgotPassword(Request $request)
    {
        $email = $request->cookie('d3jm80eqhda');

        if(!$email) {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'unsuccessful',
                    'message' => 'Invalid fields',
                    'errors' => $validator->errors()
                ], 422);
            }

            $email = $request->email;
        } else {
            $email = Crypt::decryptString($email);
        }

        $user = User::firstWhere('email', $email);

        if($user) {
            $token = strtoupper(Str::random(6));
            $data = [
                'subject' => 'Permintaan Reset Password',
                'name' => $user->username,
                'token' => $token,
                'view' => 'emails.reset_password'
            ];

            PasswordReset::where('email', $email)->delete();

            PasswordReset::create([
                'email' => $email,
                'token' => $token,
                'created_at' => now()
            ]);

            sendEmail($email, $data);

            $time = Carbon::now()->addMinute();

            $response = response()->json([
                'status' => 'successful',
                'message' => 'Email terkirim',
                'time' => $time
            ], 200);

            $cookies = ['d3jm80eqhda' => Crypt::encryptString($email), 'oefsd835ndf' => $time];

            foreach($cookies as $key => $value) {
                $response->withCookie(
                    $key,
                    $value,
                    15,
                    '/',
                    null,
                    env('APP_ENV') === 'production',
                    true,
                    false
                );
            }

            return $response;
        } else {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Email tidak terdaftar'
            ], 404);
        }
    }

    public function checkTokenForgotPassword(Request $request)
    {
        $email = $request->cookie('d3jm80eqhda');
        if(!$email) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Anda belum submit email'
            ], 403);
        }
        $validator = Validator::make($request->all(), [
            'token' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Invalid fields',
                'errors' => $validator->errors()
            ], 422);
        }

        $passwordReset = PasswordReset::firstWhere('email', Crypt::decryptString($email))->firstWhere('token',$request->token);

        if($passwordReset) {
            if(Carbon::parse($passwordReset->created_at)->addMinutes(15)->isFuture()) {
                $response = response()->json([
                    'status' => 'successful',
                    'message' => 'Token is valid'
                ], 200);

                $response->withCookie(
                    'dfs973erh9s',
                    Crypt::encryptString($request->token),
                    15,
                    '/',
                    null,
                    env('APP_ENV') === 'production',
                    true,
                    false
                );

                $response->withCookie(Cookie::forget('oefsd835ndf'));

                return $response;
            } else {
                $passwordReset->delete();
                return response()->json([
                    'status' => 'unsuccessful',
                    'message' => 'Token is expired'
                ], 401);
            }
        } else {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Token is invalid'
            ], 401);
        }
    }

    public function resetPassword(Request $request)
    {
        $email = $request->cookie('d3jm80eqhda');
        $token = $request->cookie('dfs973erh9s');
        if(!$token || !$email) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Anda belum memverifikasi kode'
            ], 403);
        }
        $validator = Validator::make($request->all(), [
            'password' => 'required|min:8|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => $validator->errors()->get('password')
            ], 422);
        }

        $user = User::firstWhere('email', Crypt::decryptString($email));

        $passwordReset = PasswordReset::firstWhere('email', Crypt::decryptString($email))->firstWhere('token',Crypt::decryptString($token));

        if($user) {
            if($passwordReset) {
                $cookies = ['d3jm80eqhda', 'dfs973erh9s'];
                $passwordReset->delete();
                $user->update([
                    'password' => bcrypt($request->password)
                ]);

                $response = response()->json([
                    'status' => 'successful',
                    'message' => 'Password reset successful'
                ], 200);

                foreach ($cookies as $name) {
                    $response->withCookie(Cookie::forget($name));
                }

                return $response;
            } else {
                return response()->json([
                    'status' => 'unsuccessful',
                    'message' => 'Token is invalid'
                ], 401);
            }
        } else {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'User not found'
            ], 404);
        }
    }

    public function hasSubmitEmail(Request $request) {
        $email = $request->cookie('d3jm80eqhda');
        $time = $request->cookie('oefsd835ndf');
        if($email) {
            $passwordReset = PasswordReset::firstWhere('email', Crypt::decryptString($email));
            if(Carbon::parse($passwordReset->created_at)->addMinutes(15)->isFuture()) {
                $arr = [];

                if($time) {
                    $arr['time'] = $time;
                }
                return response()->json($arr, 200);
            } else {
                $passwordReset->delete();
                return response()->json([
                    'status' => 'unsuccessful',
                    'message' => 'Token is expired'
                ], 401);
            }
        }

        return response()->json([
            'status' => 'unsuccessful',
            'message' => 'Anda belum submit email'
        ], 403);
    }
    public function hasSubmitVerifCode(Request $request) {
        $email = $request->cookie('d3jm80eqhda');
        $token = $request->cookie('dfs973erh9s');
        if($email) {
            if($token) {
                return response()->json([], 200);
            }
            $passwordReset = PasswordReset::firstWhere('email', Crypt::decryptString($email));
            if(Carbon::parse($passwordReset->created_at)->addMinutes(15)->isFuture()) {
                return response()->json([
                    'status' => 'unsuccessful',
                    'message' => 'Anda belum submit kode verifikasi'
                ], 403);
            } else {
                $passwordReset->delete();
                return response()->json([
                    'status' => 'unsuccessful',
                    'message' => 'Token is expired'
                ], 401);
            }
        }
        return response()->json([
            'status' => 'unsuccessful',
            'message' => 'Anda belum submit email'
        ], 403);

    }
}
