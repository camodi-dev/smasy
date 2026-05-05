<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\AnnouncementRead;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function markAsRead(Request $request, Announcement $announcement)
    {
        $user = $request->user();

        if (!$user) {
            abort(403);
        }

        if (!$this->isVisibleToUser($announcement, $user->role)) {
            abort(403);
        }

        AnnouncementRead::updateOrCreate(
            [
                'announcement_id' => $announcement->id,
                'user_id' => $user->id,
            ],
            [
                'read_at' => now(),
            ]
        );

        return back();
    }

    public function markAllAsRead(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            abort(403);
        }

        $announcementIds = Announcement::query()
            ->whereIn('target_role', ['all', $user->role])
            ->where(function ($query) {
                $query->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>=', now());
            })
            ->pluck('id');

        foreach ($announcementIds as $announcementId) {
            AnnouncementRead::updateOrCreate(
                [
                    'announcement_id' => $announcementId,
                    'user_id' => $user->id,
                ],
                [
                    'read_at' => now(),
                ]
            );
        }

        return back();
    }

    private function isVisibleToUser(Announcement $announcement, string $role): bool
    {
        return in_array($announcement->target_role, ['all', $role], true);
    }
}
