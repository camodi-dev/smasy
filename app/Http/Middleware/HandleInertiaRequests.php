<?php

namespace App\Http\Middleware;

use App\Models\Announcement;
use App\Models\AnnouncementRead;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();
        $notifications = [
            'unread_count' => 0,
            'items' => [],
        ];

        if ($user) {
            $visibleAnnouncements = Announcement::query()
                ->whereIn('target_role', ['all', $user->role])
                ->where(function ($query) {
                    $query->whereNull('published_at')
                        ->orWhere('published_at', '<=', now());
                })
                ->where(function ($query) {
                    $query->whereNull('expires_at')
                        ->orWhere('expires_at', '>=', now());
                })
                ->orderByDesc('published_at')
                ->orderByDesc('created_at')
                ->limit(8)
                ->get(['id', 'title', 'content', 'target_role', 'published_at', 'created_at']);

            $readIds = AnnouncementRead::query()
                ->where('user_id', $user->id)
                ->whereIn('announcement_id', $visibleAnnouncements->pluck('id'))
                ->pluck('announcement_id')
                ->all();

            $notifications['items'] = $visibleAnnouncements->map(function ($announcement) use ($readIds) {
                return [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'content' => $announcement->content,
                    'target_role' => $announcement->target_role,
                    'published_at' => optional($announcement->published_at)->toIso8601String(),
                    'created_at' => optional($announcement->created_at)->toIso8601String(),
                    'is_read' => in_array($announcement->id, $readIds, true),
                ];
            })->values()->all();

            $notifications['unread_count'] = collect($notifications['items'])
                ->where('is_read', false)
                ->count();
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id'     => $user->id,
                    'name'   => $user->name,
                    'email'  => $user->email,
                    'role'   => $user->role,
                    'avatar' => $user->avatar,
                ] : null,
            ],
            'notifications' => $notifications,
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }
}