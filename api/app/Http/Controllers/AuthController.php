<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{    

    public function login(Request $request)
    {
        try {          
    
            $credentials = $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);
        
            $user = User::where('email', $credentials['email'])->first();            
        
            $errors = [];
        
            if (!$user) {
                $errors['email'] = 'Invalid email.';
                return response()->json([
                    'errors' => $errors,
                    'success' => false
                ], 401);  
            }
        
            if (Auth::attempt($credentials)) {          
                $user = Auth::user();
                $token = $user->createToken('api-token')->plainTextToken;

                return response()->json([
                    'token' => $token,
                    'success' => true,
                    'user' => $user
                ], 200);
            } else {               
                $errors['password'] = 'Invalid password.'; 
                return response()->json([
                    'errors' => $errors,
                    'success' => false
                ], 401);               
            }  
             
        } catch (Exception $e) {        

            return response()->json([
                'message' => 'An error occurred. Please try again later.',
                'success' => false
            ], 500);

        }        
    }

    public function logout(Request $request)
    {
        try {  
            $user = $request->user();          

            if (!$user) {
                return response()->json([
                    'message' => 'Unauthenticated. Please log in.',
                    'success' => false
                ], 401); 
            }else{
                $user->tokens()->delete();          
                return response()->json([
                    'message' => 'Logged out successfully',
                    'success' => true 
                ], 200);
            }
           

        } catch (Exception $e) {   

            return response()->json([
                'message' => 'An error occurred while logging out. Please try again later.',
                'success' => false
            ], 500);

        }
    }
    
}
