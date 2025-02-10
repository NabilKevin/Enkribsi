<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    public function getNotificationsCount(Request $request)
    {
        $notifications = Count(Notification::where('user_id', $request->user()->id)->where('is_read', false)->get());
        return response()->json([
            'status' => 'successful',
            'message' => 'Notification count successfully gotten',
            'data' => [
                'count' => $notifications
            ]
        ], 200);
    }
    public function getNotifications(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)->get();
        return response()->json([
            'status' => 'successful',
            'message' => 'Notifications successfully gotten',
            'data' => $notifications->select(['title', 'content'])
        ], 200);
    }
    public function getNotification($id)
    {
        $notification = Notification::find($id);
        if(!$notification) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Notifications not found'
            ], 404);
        }
        $notification->update(['is_read', true]);
        return response()->json([
            'status' => 'successful',
            'message' => 'Notification successfully gotten',
            'data' => $notification
        ], 200);
    }
    public function deleteNotifications(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|array',
            'id.*' => 'integer|exists:notifications,id'
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 200);
        }

        foreach($request->id as $id) {
            Notification::find($id)->delete();
        }
        return response()->json([
            'status' => 'successful',
            'message' => 'Notification(s) successfully deleted'
        ], 200);
    }
}
