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
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username'=> 'required|string|max:255|unique:users,username',
            'password'=> 'required|string',
            'email'=> 'required|email|unique:users,email',
            'face_img' => 'required|string'
        ]);

        if($validator->fails()) {
            return response()->json([
                'message'=> 'Invalid fields',
                'errors'=> $validator->errors()
            ],422);
        }

        $data = $request->only(['username', 'password', 'email']);

        $fileName = null;

        $base64Image = $request->input('face_img');

        if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
            $base64Image = substr($base64Image, strpos($base64Image, ',') + 1);
            $type = strtolower($type[1]); // jpg, png, gif, dll.

            // Dekode Base64 menjadi binary
            $image = base64_decode($base64Image);

            // Nama file unik
            $fileName = time() . uniqid() . '.' . $type;

            // Simpan file di storage (misalnya, public/photos)
            $path = public_path('storage/photos/' . $fileName);
            file_put_contents($path, $image);
        } else {
            return response()->json(['error' => 'Invalid image data'], 400);
        }

        $data['face_img'] = $fileName;

        $user = User::create($data);

        $token = $user->createToken('login')->plainTextToken;
        $user['token'] = $token;
        Auth::login($user);

        return response()->json([
            'message'=> 'Register successful',
            'user'=> $user
        ],200);
    }

}
