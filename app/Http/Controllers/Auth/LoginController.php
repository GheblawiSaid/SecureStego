<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    public function username()
    {
        $loginValue = request('username');
        $username = filter_var($loginValue, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        request()->merge([$username => $loginValue]);
        return property_exists($this, 'username') ? $username : 'username';
    }

    public function login(Request $_request)
    {
        $input = $_request->all();
        // dd($input);
        $this->validate($_request, [
            'email' => 'required',
            'password' => 'required',
        ]);

        if (auth()->attempt(array('email' => $input['email'], 'password' => $input['password']))) {
            if (!auth()->user()->is_admin) {
                return redirect()->route('home');
            }
        } else {
            return redirect()->route('login')->with('error', 'Username And Password Are Wrong.');
        }
    }
}
