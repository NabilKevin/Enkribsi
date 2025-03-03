<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
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
            'email' => 'required|email:dns',
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
                'jwt_token', // Nama cookie
                $token, // Token JWT
                $ttl, // Durasi (menit)
                '/', // Path
                null, // Domain
                env('APP_ENV') === 'production', // Secure (true jika HTTPS)
                true, // HttpOnly
                false // SameSite = None
            );
        }
        return response()->json([
            'status' => 'unsuccessful',
            'message' => 'Email or password is incorrect'
        ], 401);
    }

    public function logout(Request $request)
    {
        return response()->json([
            'status' => 'successful',
            'message'=> 'Logout successful'
        ],200)->withCookie(Cookie::forget('jwt_token'));
    }

    public function forgotPassword(Request $request)
    {
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

        $user = User::firstWhere('email', $request->email);

        if($user) {
            $token = strtoupper(Str::random(6));
            $data = [
                'subject' => 'Permintaan Reset Password',
                'name' => $user->username,
                'token' => $token,
                'view' => 'emails.reset_password'
            ];

            PasswordReset::where('email', $request->email)->delete();

            PasswordReset::create([
                'email' => $request->email,
                'token' => $token,
                'created_at' => now()
            ]);

            sendEmail($request->email, $data);

            return response()->json([
                'status' => 'successful',
                'message' => 'Email sent'
            ], 200);
        } else {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'User not found'
            ], 404);
        }
    }

    public function checkTokenForgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'token' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Invalid fields',
                'errors' => $validator->errors()
            ], 422);
        }

        $passwordReset = PasswordReset::firstWhere('email', $request->email)->firstWhere('token',$request->token);

        if($passwordReset) {
            if(Carbon::parse($passwordReset->created_at)->addMinutes(15)->isFuture()) {
                return response()->json([
                    'status' => 'successful',
                    'message' => 'Token is valid'
                ], 200);
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
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Invalid fields',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::firstWhere('email', $request->email);

        $passwordReset = PasswordReset::firstWhere('email', $request->email)->firstWhere('token',$request->token);

        if($user) {
            if($passwordReset) {
                $passwordReset->delete();
                $user->update([
                    'password' => bcrypt($request->password)
                ]);
                return response()->json([
                    'status' => 'successful',
                    'message' => 'Password reset successful'
                ], 200);
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
}
