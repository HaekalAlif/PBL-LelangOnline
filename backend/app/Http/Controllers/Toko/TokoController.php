<?php

namespace App\Http\Controllers\Toko;

use App\Http\Controllers\Controller;
use App\Http\Requests\Toko\CreateTokoRequest;
use App\Models\Toko;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class TokoController extends Controller
{

    public function index(Request $request)
    {
        try {
            $query = Toko::select('toko.*', 'users.username')
                ->join('users', 'toko.id_user', '=', 'users.id_user')
                ->where('toko.is_deleted', false);

            // Search functionality
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('nama_toko', 'like', "%{$search}%")
                      ->orWhere('alamat', 'like', "%{$search}%")
                      ->orWhere('kontak', 'like', "%{$search}%")
                      ->orWhere('users.username', 'like', "%{$search}%");
                });
            }

            // Status filter
            if ($request->has('status')) {
                if ($request->status === 'active') {
                    $query->where('toko.is_active', true);
                } elseif ($request->status === 'inactive') {
                    $query->where('toko.is_active', false);
                }
            }

            $toko = $query->get();

            return response()->json([
                'status' => 'success',
                'data' => $toko
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching stores:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch stores data'
            ], 500);
        }
    }

   public function myStore(Request $request)
    {
        try {
            // Get user ID from request header
            $userId = $request->header('X-User-Id');

            if (!$userId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User ID not provided'
                ], 400);
            }

            // Find store for the user
            $toko = Toko::where('id_user', $userId)
                ->where('is_deleted', false)
                ->first();

            if (!$toko) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Store not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $toko
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching store:', [
                'error' => $e->getMessage(),
                'user_id' => $userId ?? null
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch store data'
            ], 500);
        }
    }


   public function store(CreateTokoRequest $request)
    {
        try {
            // Check for existing store
            $existingToko = Toko::where('id_user', $request->id_user)
                               ->where('is_deleted', false)
                               ->first();

            if ($existingToko) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User already has an active store'
                ], 400);
            }

            $toko = Toko::create($request->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Store created successfully',
                'data' => $toko
            ], 201);

        } catch (\Exception $e) {
            Log::error('Store creation failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create store',
                'debug' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function getTokoByUserId($userId)
    {
        try {
            $toko = Toko::where('id_user', $userId)
                ->where('is_deleted', false)
                ->first();

            if (!$toko) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Store not found for this user'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $toko
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching store by user ID:', [
                'error' => $e->getMessage(),
                'user_id' => $userId
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch store data'
            ], 500);
        }
    }
}