<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit(Request $request)
    {
        return Inertia::render('Admin/Settings', [
            'user' => $request->user(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $request->user()->id,
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $request->user()->name = $validated['name'];
        $request->user()->email = $validated['email'];

        if (!empty($validated['password'])) {
            $request->user()->password = Hash::make($validated['password']);
        }

        $request->user()->save();

        return back()->with('success', 'Profile settings updated successfully.');
    }
}
