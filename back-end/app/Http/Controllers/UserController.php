<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function addPhotoProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'photo' => 'required|string',
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Invalid fields',
                'errors' => $validator->errors()
            ], 422);
        }

        $photo = preg_replace('/^data:image\/\w+;base64,/', '', $request->photo);

        $url = env("PYTHON_URL") . '/cekwajah';
        
        $data = [
            'image' => $photo
        ];
        
        $response = Http::post($url, $data);

        if($response->failed()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => $response->json()
            ], $response->status());
        }

        $photo = base64_decode($photo);

        $photoName = 'photos/'. time() . '.jpg';

        Storage::disk('public')->put($photoName, $photo);

        $request->user()->update([
            'face_img' => $photoName
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'Photo successfuly uploaded',
            'data' => $response->json()
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'status' => 'successful',
            'message' => 'Successfully get your data',
            'data' => $request->user()
        ], 200);
    }
}
