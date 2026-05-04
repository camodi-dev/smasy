<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\FirebaseAuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SocialAuthController extends Controller
{
    public function __construct(protected FirebaseAuthService $firebase) {}

    public function handle(Request $request)
    {
        $request->validate(['token' => 'required|string']);

        try {
            $payload = $this->firebase->verifyIdToken($request->token);

            $user = User::updateOrCreate(
                ['email' => $payload['email']],
                [
                    'name'         => $payload['name']    ?? 'Unknown',
                    'avatar'       => $payload['picture'] ?? null,
                    'firebase_uid' => $payload['sub'],
                    'provider'     => $payload['firebase']->sign_in_provider,
                    'password'     => null,
                ]
            );

            // Login and regenerate session
            Auth::login($user);
            $request->session()->regenerate();

            return response()->json(['redirect' => '/dashboard']);

        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'file'    => basename($e->getFile()),
                'line'    => $e->getLine(),
            ], 401);
        }
    }
}