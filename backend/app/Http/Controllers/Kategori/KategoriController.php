<?php

namespace App\Http\Controllers\Kategori;

use App\Http\Controllers\Controller;
use App\Http\Requests\Kategori\CreateKategoriRequest;
use App\Http\Requests\Kategori\UpdateKategoriRequest;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class KategoriController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Kategori::where('is_deleted', false);

            // Search functionality
            if ($request->has('search')) {
                $search = $request->search;
                $query->where('nama_kategori', 'like', "%{$search}%");
            }

            // Status filter
            if ($request->has('status')) {
                if ($request->status === 'active') {
                    $query->where('is_active', true);
                } elseif ($request->status === 'inactive') {
                    $query->where('is_active', false);
                }
            }

            $categories = $query->get();

            return response()->json([
                'status' => 'success',
                'data' => $categories
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching categories:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch categories'
            ], 500);
        }
    }

    public function store(CreateKategoriRequest $request)
    {
        try {
            $userId = $request->header('X-User-Id');
            
            $kategori = new Kategori($request->validated());
            $kategori->created_by = $userId;
            $kategori->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Category created successfully',
                'data' => $kategori
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating category:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create category'
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $kategori = Kategori::where('id_kategori', $id)
                               ->where('is_deleted', false)
                               ->first();

            if (!$kategori) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Category not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $kategori
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching category:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch category'
            ], 500);
        }
    }

    public function update(UpdateKategoriRequest $request, $id)
    {
        try {
            $userId = $request->header('X-User-Id');
            
            $kategori = Kategori::where('id_kategori', $id)
                               ->where('is_deleted', false)
                               ->first();

            if (!$kategori) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Category not found'
                ], 404);
            }

            $kategori->fill($request->validated());
            $kategori->updated_by = $userId;
            $kategori->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Category updated successfully',
                'data' => $kategori
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating category:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update category'
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $kategori = Kategori::where('id_kategori', $id)
                               ->where('is_deleted', false)
                               ->first();

            if (!$kategori) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Category not found'
                ], 404);
            }

            // Soft delete
            $kategori->is_deleted = true;
            $kategori->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Category deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting category:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete category'
            ], 500);
        }
    }
}