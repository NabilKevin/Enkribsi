<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
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

        $photo = base64_decode(preg_replace('/^data:image\/\w+;base64,/', '', $request->photo));

        $photoName = 'photos/'. time() . '.jpg';

        $reference = Storage::disk('public')->put($photoName, $photo);

        $projectRoot = base_path() . '/../py';
        $scriptPath = './cekwajah.py';
        $command = "cd {$projectRoot} && python {$scriptPath} " . escapeshellarg(storage_path("app/public/{$photoName}"));
        $output = json_decode(exec($command), true);

        if($output['status'] === 'unsuccessful') {
            return response()->json($output, 422);
        }

        $request->user()->update([
            'face_img' => $photoName
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'Photo successfuly uploaded',
            'data' => $output
        ]);
    }
}
