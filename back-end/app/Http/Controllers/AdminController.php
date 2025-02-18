<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Division;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        $order = in_array(Str::lower($request->order),['desc', 'asc']) ? Str::lower($request->order) : 'asc';

        $page = max(1, intval($request->input('page', 1)));
        $perPage = max(10, min(100, intval($request->input('per_page', 10))));

        $key = $request->search;

        return response()->json([
            'status' => 'successful',
            'message' => 'Successfully get employee(s)',
            'data' => User::select(['username', 'role'])->whereLike('username', "%$key%")->orWhereLike('role', "%$key%")->orderBy('id', $order)->paginate($perPage, ['*'], 'page', $page)
        ], 200);
    }

    public function show(Request $request, $id)
    {
        $user = User::find($id);

        if(!$user) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'status' => 'successful',
            'message' => 'Successfully get employee',
            'data' => $user
        ], 200);
    }

    public function getBods()
    {
        return response()->json([
            'status' => 'successful',
            'message' => 'Successfully get employee',
            'data' => User::select(['id', 'username', 'role'])->where('role', 'bod')->get()
        ], 200);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|min:5|regex:/[A-z0-9_.]+/|unique:users,username',
            'password' => 'required|min:8',
            'role' => 'required|in:bod,user,hr',
            'leader_id' => 'integer|exists:divisions,id',
            'email' => 'email:dns|required|unique:users,email'
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();

        if(array_key_exists('leader_id', $data)) {
            $leader = Division::find($data['leader_id']);

            if($leader->name !== 'bod') {
                return response()->json([
                    'status' => 'unsuccessful',
                    'message' => 'The leader is not bod'
                ], 422);
            }
        }

        $user = User::create($data);

        $division = Division::create([
            'name' => $user->role,
            'user_id' => $user->id
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'User successfully created',
            'data' => $user
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $user = User::find($id);

        if(!$user) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'User not found'
            ], 404);
        }

        $division = Division::firstWhere('user_id', $id);

        $bawahan = User::where('leader_id', $division->id)->get();

        foreach($bawahan as $bawah) {
            $bawah->update([
                'leader_id' => null
            ]);
        }

        $user->delete();

        return response()->json([
            'status' => 'successful',
            'message' => 'User successfully deleted'
        ]);
    }

    public function update(Request $request, $id)
    {
        $rule = [
            'password' => 'min:8',
            'role' => 'in:bod,user,hr',
            'leader_id' => 'integer|exists:divisions,id'
        ];

        $user = User::find($id);

        if(!$user) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'User not found'
            ], 404);
        }

        if(isset($request->username) && $request->username !== $user->username) {
            $rule['username'] = 'unique:users,username|min:5|regex:/[A-z0-9_.]+/';
        }
        if(isset($request->email) && $request->email !== $user->email) {
            $rule['email'] = 'unique:users,email|email:dns';
        }

        $validator = Validator::make($request->all(), $rule);

        if($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();

        if(array_key_exists('leader_id', $data) && $user->leader_id !== $data['leader_id']) {
            $leader = Division::find($data['leader_id']);

            if($leader->name !== 'bod') {
                return response()->json([
                    'status' => 'unsuccessful',
                    'message' => 'The leader is not bod'
                ], 422);
            }

            if($leader->user_id === $id) {
                return response()->json([
                    'status' => 'unsuccessful',
                    'message' => "You can't be the leader of yourself"
                ], 422);
            }
        }

        $user->update($data);

        return response()->json([
            'status' => 'successful',
            'message' => 'User successfully updated',
            'data' => $user
        ], 200);

    }
}
