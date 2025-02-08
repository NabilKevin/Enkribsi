<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\PasswordReset;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required',
            'password' => 'required|min:6',
            'remember_me' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'unsuccesful',
                'message' => 'Invalid fields',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only(['username', 'password']);

        if(Auth::attempt($data)) {
            $user = User::firstWhere('username', $data['username']);
            $token = $request->remember_me ? $user->createToken('login')->plainTextToken : $user->createToken('login', ['*'], Carbon::now()->addDay())->plainTextToken;
            $user['token'] = $token;

            return response()->json([
                'status' => 'successful',
                'message' => 'Login successful',
                'user'=> $user
            ], 200);
        } else {
            return response()->json([
                'status' => 'unsuccesful',
                'message' => 'Username or password is incorrect'
            ], 401);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'status' => 'successful',
            'message'=> 'Logout successful'
        ],200);
    }

    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'unsuccesful',
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
                'token' => $token
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
                'status' => 'unsuccesful',
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
                'status' => 'unsuccesful',
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
                    'status' => 'unsuccesful',
                    'message' => 'Token is expired'
                ], 401);
            }
        } else {
            return response()->json([
                'status' => 'unsuccesful',
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
                'status' => 'unsuccesful',
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
                    'status' => 'unsuccesful',
                    'message' => 'Token is invalid'
                ], 401);
            }
        } else {
            return response()->json([
                'status' => 'unsuccesful',
                'message' => 'User not found'
            ], 404);
        }
    }
}
