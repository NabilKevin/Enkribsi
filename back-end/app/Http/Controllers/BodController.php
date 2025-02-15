<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Office;
use App\Models\Permit;
use App\Models\Division;
use App\Models\Schedule;
use App\Models\Attendance;
use App\Models\Announcement;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Models\WfaWfhSchedule;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
class BodController extends Controller
{
    public function denyPermit(Request $request, $id)
    {
        $permit = Permit::find($id);

        if(!$permit) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Permit not found'
            ], 404);
        }

        $user = User::find($permit->user_id);
        $myDivision = Division::firstWhere('user_id', $request->user()->id);
        $validator = Validator::make($request->all(), [
            'bod_reason' => 'required|string'
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Invalid fields',
                'errors' => $validator->errors()
            ], 422);
        }

        if($user->leader_id !== $myDivision->id) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'You are not the leader of this user'
            ], 403);
        }
        if($permit->status === 'approved') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Permit has been approved'
            ], 403);
        }
        if($permit->status === 'denied') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Permit has been denied'
            ], 403);
        }
        if($permit->status === 'canceled') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'User has canceled his permit'
            ], 403);
        }

        $permit->update([
            'status' => 'denied',
            'bod_reason' => $request->bod_reason
        ]);
        return response()->json([
            'status' => 'successful',
            'message' => 'Permit successfuly denied',
            'data' => $permit
        ], 200);
    }
    public function approvePermit(Request $request, $id)
    {
        $permit = Permit::find($id);

        if(!$permit) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Permit not found'
            ], 404);
        }

        $user = User::find($permit->user_id);
        $myDivision = Division::firstWhere('user_id', $request->user()->id);
        if($user->leader_id !== $myDivision->id) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'You are not the leader of this user'
            ], 403);
        }
        if($permit->status === 'approved') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Permit has been approved'
            ], 403);
        }
        if($permit->status === 'denied') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Permit has been denied'
            ], 403);
        }
        if($permit->status === 'canceled') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'User has canceled his permit'
            ], 403);
        }

        $permit->update([
            'status' => 'approved'
        ]);

        $absent = Attendance::where('user_id', $permit->user_id)
            ->firstWhere('date', $permit->date);

        if($absent) {
            $absent->update([
                'status' => $permit->permit_type === 'sakit' ? 'izin' : $permit->permit_type,
                'check_out_time' => $permit->permit_type === 'sakit' || $permit->permit_type === 'izin' ? Carbon::now()->toTimeString() : null
            ]);
        } else {
            if(Carbon::parse($permit->date)->isToday()) {
                Attendance::create([
                    'user_id' => $permit->user_id,
                    'date' => Carbon::now()->toDateString(),
                    'status' => $permit->permit_type === 'sakit' ? 'izin' : $permit->permit_type
                ]);
            }
        }

        Notification::create([
            'user_id' => $permit->user_id,
            'title' => 'Perizinan Anda Telah Disetujui!',
            'content' => 'Kami dengan senang hati memberitahukan bahwa permohonan izin Anda telah disetujui. Terima kasih atas kerja sama Anda.'
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'Permit successfuly approved',
            'data' => $permit
        ], 200);
    }

    public function getPermits(Request $request)
    {
        $division = Division::firstWhere('user_id', $request->user()->id);
        $permits = Permit::where('leader_id', $division->id)->where('status', 'pending')->get();
        return response()->json([
            'status' => 'successful',
            'message' => 'Successfully get permits',
            'data' => $permits
        ], 200);
    }

    public function getPendingAnnouncements()
    {
        $announcements = Announcement::where('status', 'pending')->get();
        return response()->json([
            'status'=> 'successful',
            'message'=> 'Successfully get pending announcements',
            'data'=> $announcements,
        ], 200);
    }

    public function approveAnnouncement(Request $request, $id)
    {
        $announcement = Announcement::find($id);

        if(!$announcement) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Announcement not found'
            ], 404);
        }

        if($announcement->status === 'approved') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Announcement has already been approved'
            ], 403);
        }
        if($announcement->status === 'denied') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Announcement has already been denied'
            ], 403);
        }

        $announcement->update([
            'status' => 'approved'
        ]);

        Notification::create([
            'user_id' => $announcement->user_id,
            'title' => 'Pengumuman Anda Telah Disetujui!',
            'content' => 'Pengumuman Anda telah disetujui oleh BOD'
        ]);

        if(isset($announcement->target_audience)) {
            $users = User::where('leader_id', $announcement->target_audience)->get();
            foreach($users as $user) {
                Notification::create([
                    'user_id' => $user->id,
                    'title'=> $announcement->title,
                    'content'=> $announcement->content
                ]);
            }
        }

        return response()->json([
            'status' => 'successful',
            'message' => 'Announcement successfully approved',
            'data' => $announcement
        ], 200);
    }

    public function denyAnnouncement(Request $request, $id)
    {
        $announcement = Announcement::find($id);

        if(!$announcement) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Announcement not found'
            ], 404);
        }

        if($announcement->status === 'approved') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Announcement has already been approved'
            ], 403);
        }
        if($announcement->status === 'denied') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Announcement has already been denied'
            ], 403);
        }

        $announcement->update([
            'status' => 'denied'
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'Announcement successfully denied',
            'data' => $announcement
        ], 200);
    }

    public function destroyAnnouncement(Request $request, $id)
    {
        $announcement = Announcement::find($id);

        if(! $announcement) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Announcement not found'
            ], 404);
        }

        $announcement->delete();

        return response()->json([
            'status' => 'successful',
            'message' => 'Announcement successfully deleted'
        ], 200);
    }

    public function getPendingSchedules()
    {
        $schedule = Schedule::where('status', 'pending')->get();
        return response()->json([
            'status'=> 'successful',
            'message'=> 'Successfully get pending schedule',
            'data'=> $schedule,
        ], 200);
    }
    public function approveSchedule(Request $request, $id)
        {
        $schedule = Schedule::find($id); // Corrected method

        if (!$schedule) {
            return response()->json(
                [
                    'status' => 'unsuccessful',
                    'message'=> 'Schedule not found'
                ], 404);
        }

        $schedule->update(['status' => 'approved']);

        return response()->json(
        [
            'status' => 'successful',
            'message'=> 'Schedule successfully approved',
            'data' => $schedule
        ], 200);
    }
    public function destroySchedule(Request $request, $id)
    {
        $schedule = Schedule::find($id);

        if(! $schedule) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Schedule not found'
            ], 404);
        }

        $schedule->delete();

        return response()->json([
            'status' => 'successful',
            'message' => 'Schedule successfully deleted'
        ], 200);
    }
    public function denySchedule(Request $request, $id)
    {
        $schedule = Schedule::find($id);

        if(!$schedule) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Schedule not found'
            ], 404);
        }

        if($schedule->status === 'approved') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Schedule has already been approved'
            ], 403);
        }
        if($schedule->status === 'denied') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Schedule has already been denied'
            ], 403);
        }

        $schedule->update([
            'status' => 'denied'
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'Schedule successfully denied',
            'data' => $schedule
        ], 200);
    }

    public function getPendingOffices()
    {
        $office = Office::where('status', 'pending')->get();
        return response()->json([
            'status'=> 'successful',
            'message'=> 'Successfully get pending office',
            'data'=> $office,
        ], 200);
    }
    public function approveOffice(Request $request, $id)
    {
        $Office = Office::find($id);

        if(!$Office) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Office not found'
            ], 404);
        }

        if($Office->status === 'approved') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Office has already been approved'
            ], 403);
        }
        if($Office->status === 'denied') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Office has already been denied'
            ], 403);
        }

        $Office->update([
            'status' => 'approved'
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'Office successfully approved',
            'data' => $Office
        ], 200);
    }
    public function denyOffice(Request $request, $id)
    {
        $Office = Office::find($id);

        if(!$Office) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Office not found'
            ], 404);
        }

        if($Office->status === 'approved') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Office has already been approved'
            ], 403);
        }
        if($Office->status === 'denied') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Office has already been denied'
            ], 403);
        }

        $Office->update([
            'status' => 'denied'
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'Office successfully denied',
            'data' => $Office
        ], 200);
    }
    public function destroyOffice(Request $request, $id)
    {
        $office = Office::find($id);

        if(!$office) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Office not found'
            ], 404);
        }

        $office->delete();

        return response()->json([
            'status' => 'successful',
            'message' => 'Office successfully deleted'
        ], 200);
    }

    public function getPendingWFHs()
    {
        $wfaWfhSchedule = WfaWfhSchedule::where('status', 'pending')->get();
        return response()->json([
            'status'=> 'successful',
            'message'=> 'Successfully get pending wfaWfhSchedule',
            'data'=> $wfaWfhSchedule,
        ], 200);
    }
    public function approveWFH(Request $request, $id)
    {
        $WfhWfhSchedule = wfaWfhSchedule::find($id);

        if (!$WfhWfhSchedule) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Schedule not found'
            ], 404);
        }

        if ($WfhWfhSchedule->status === 'approved') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Schedule has already been approved'
            ], 403);
        }
        if ($WfhWfhSchedule->status === 'denied') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Schedule has already been denied'
            ], 403);
        }

        $WfhWfhSchedule->update([
            'status' => 'approved'
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'Schedule successfully approved',
            'data' => $WfhWfhSchedule
        ], 200);
    }
    public function denyWFH(Request $request, $id)
    {
        $WfaWfhSchedule = WfaWfhSchedule::find($id);

        if (!$WfaWfhSchedule) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'WFA/WFH not found'
            ], 404);
        }

        if ($WfaWfhSchedule->status === 'approved') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'WFA/WFH has already been approved'
            ], 403);
        }
        if ($WfaWfhSchedule->status === 'denied') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'WFA/WFH has already been denied'
            ], 403);
        }

        $WfaWfhSchedule->update([
            'status' => 'denied'
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'WFA/WFH successfully denied',
            'data' => $WfaWfhSchedule
        ], 200);
    }
    public function destroyWfh(Request $request, $id)
    {
        $wfaWfhSchedule = WfaWfhSchedule::find($id);

        if(!$wfaWfhSchedule) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Wfa/Wfh schedule not found'
            ], 404);
        }

        $wfaWfhSchedule->delete();

        return response()->json([
            'status' => 'successful',
            'message' => 'Wfa/Wfh schedule successfully deleted'
        ], 200);
    }

    public function getEmployeeStatistics(Request $request, $userId)
    {
        $bodDivision = Division::firstWhere('user_id', $request->user()->id);
        $user = User::where('leader_id' , $bodDivision)->get();

        if (Count($user) <= 0) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'You have no employees'
            ], 404);
        }

        $attendanceStats = Attendance::whereIn('user_id', $user->id)->get();

        return response()->json([
            'status' => 'successful',
            'message' => 'Successfully retrieved employee statistics',
            'data' => $attendanceStats
        ], 200);
    }
}
