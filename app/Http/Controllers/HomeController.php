<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('home');
    }


    public function adminHome()
    {
        return view('admin-home');
    }

    // Show user edit form
    public function edit($id)
    {
        $user = User::findOrFail($id);
        return view('user.edit', compact('user'));
    }

    // Update user details
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        // Validate and update user data
        // Example: $user->update($request->only(['name', 'email']));

        // Redirect back with a success message
        return redirect()->back()->with('success', 'User details updated successfully.');
    }

    // Delete user
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        // Delete user (you can add confirmation logic here)

        // Redirect back with a success message
        return redirect()->back()->with('success', 'User deleted successfully.');
    }
}
