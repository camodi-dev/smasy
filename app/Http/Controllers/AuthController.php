<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthController extends Controller
{
    /**
     * Handle social login callback
     */
    public function handleSocial(Request $request)
    {
        try {
            $idToken = $request->input('token');
            
            // Verify the Firebase ID token
            $verifiedIdToken = $this->verifyFirebaseIdToken($idToken);
            
            // Extract user data from token
            $firebaseUid = $verifiedIdToken['uid'];
            $email = $verifiedIdToken['email'];
            $name = $verifiedIdToken['name'] ?? '';
            $avatar = $verifiedIdToken['picture'] ?? null;
            
            // Find or create user
            $user = User::where('firebase_uid', $firebaseUid)->first();
            
            if (!$user) {
                // Check if user exists with same email (for account linking)
                $user = User::where('email', $email)->first();
                
                if (!$user) {
                    // Create new user
                    $user = User::create([
                        'name' => $name,
                        'email' => $email,
                        'firebase_uid' => $firebaseUid,
                        'avatar' => $avatar,
                        'email_verified_at' => now(),
                    ]);
                } else {
                    // Link existing account with Firebase UID
                    $user->update([
                        'firebase_uid' => $firebaseUid,
                        'avatar' => $avatar,
                    ]);
                }
            } else {
                // Update avatar if changed
                if ($user->avatar !== $avatar) {
                    $user->update(['avatar' => $avatar]);
                }
            }
            
            // Login the user
            Auth::login($user);
            
            // Redirect to intended page or dashboard
            return response()->json([
                'redirect' => url()->previous() ?? '/dashboard'
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Social login failed: ' . $e->getMessage());
            return response()->json([
                'error' => 'Authentication failed'
            ], 401);
        }
    }
    
    /**
     * Verify Firebase ID token
     */
    private function verifyFirebaseIdToken($idToken)
    {
        $projectId = config('services.firebase.project_id');
        
        try {
            $verifiedIdToken = JWT::decode(
                $idToken,
                new Key(file_get_contents(base_path('firebase-credentials.json')), 'RS256')
            );
            
            return (array) $verifiedIdToken;
        } catch (\Exception $e) {
            throw new \Exception('Invalid Firebase token: ' . $e->getMessage());
        }
    }
    
    /**
     * Show login form with multiple options
     */
    public function showLoginForm()
    {
        return inertia('Auth/Login');
    }
    
    /**
     * Handle unified login (email or matricule with password)
     */
    public function login(Request $request)
    {
        $request->validate([
            'credential' => 'required|string',
            'password' => 'required',
        ]);
        
        $credential = $request->input('credential');
        $isEmail = filter_var($credential, FILTER_VALIDATE_EMAIL);
        
        if ($isEmail) {
            // Validate as email
            $request->validate([
                'credential' => 'email',
            ]);
            
            $credentials = [
                'email' => $credential,
                'password' => $request->input('password')
            ];
            
            if (Auth::attempt($credentials, $request->filled('remember'))) {
                $request->session()->regenerate();
                
                return redirect()->intended('/dashboard');
            }
            
            return back()->withErrors([
                'credential' => 'The provided credentials do not match our records.',
            ])->onlyInput('credential');
        } else {
            // Validate as matricule
            $request->validate([
                'credential' => 'string',
            ]);
            
            // Find user by matricule
            $user = User::where('matricule', $credential)->first();
            
            if ($user && Hash::check($request->input('password'), $user->password)) {
                Auth::login($user, $request->filled('remember'));
                
                $request->session()->regenerate();
                
                return redirect()->intended('/dashboard');
            }
            
            return back()->withErrors([
                'credential' => 'The provided credentials do not match our records.',
            ])->onlyInput('credential');
        }
    }
    
    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        Auth::logout();
        
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect('/');
    }
}