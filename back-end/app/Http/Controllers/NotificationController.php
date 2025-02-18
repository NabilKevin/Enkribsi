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
            'data' => $notifications
        ], 200);
    }
    public function getNotifications(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)->get();
        return response()->json([
            'status' => 'successful',
            'message' => 'Notifications successfully gotten',
            'data' => $notifications->select(['title', 'excerpt', 'slug'])
        ], 200);
    }
    public function getNotification($slug)
    {
        $notification = Notification::firstWhere('slug', $slug);
        if(!$notification) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Notifications not found'
            ], 404);
        }
        $notification->update(['is_read' => true]);
        return response()->json([
            'status' => 'successful',
            'message' => 'Notification successfully gotten',
            'data' => $notification
        ], 200);
    }
    public function deleteNotifications(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'slugs' => 'required|array',
            'slugs.*' => 'string|exists:notifications,slug'
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 422);
        }

        foreach($request->slugs as $slug) {
            Notification::firstWhere('slug', $slug)->delete();
        }
        return response()->json([
            'status' => 'successful',
            'message' => 'Berhasil menghapus notifikasi!'
        ], 200);
    }
}
