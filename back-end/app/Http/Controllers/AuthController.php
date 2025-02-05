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
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid fields',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();


        if(Auth::attempt($data)) {
            $user = User::firstWhere('username', $data['username']);
            $token = $user->createToken('login')->plainTextToken;
            $user['token'] = $token;

            return response()->json([
                'message' => 'Login successful',
                'user'=> $user
            ], 200);
        } else {
            return response()->json([
                'message' => 'Username or password is incorrect'
            ], 401);
        }
    }

    public function logout(Request $request)
    {
        $user = User::firstWhere('username', $request->username);
        if($user) {
            $user->delete();
            return response()->json([
                'message'=> 'Logout successful'
                ],200);
        } else {
            return response()->json([
                'message'=> 'User not found'
            ],404);
        }
    }

    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json([
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
                'message' => 'Email sent'
            ], 200);
        } else {
            return response()->json([
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
                'message' => 'Invalid fields',
                'errors' => $validator->errors()
            ], 422);
        }

        $passwordReset = PasswordReset::firstWhere('email', $request->email)->firstWhere('token',$request->token);

        if($passwordReset) {
            if(Carbon::parse($passwordReset->created_at)->addMinutes(15)->isFuture()) {
                return response()->json([
                    'message' => 'Token is valid'
                ], 200);
            } else {
                $passwordReset->delete();
                return response()->json([
                    'message' => 'Token is expired'
                ], 401);
            }
        } else {
            return response()->json([
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
                    'message' => 'Password reset successful'
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Token is invalid'
                ], 401);
            }
        } else {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
    }
}
