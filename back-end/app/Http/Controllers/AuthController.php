<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
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

}
