<?php

namespace App\Http\Controllers\Barang;

use App\Http\Controllers\Controller;
use App\Http\Requests\Barang\CreateBarangRequest;
use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class BarangController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Barang::with(['kategori', 'toko'])
                          ->where('is_deleted', false);

            // Search functionality
            if ($request->has('search')) {
                $search = $request->search;
                $query->where('nama_barang', 'like', "%{$search}%");
            }

            // Status filter
            if ($request->has('status')) {
                if ($request->status === 'active') {
                    $query->where('is_active', true);
                } elseif ($request->status === 'inactive') {
                    $query->where('is_active', false);
                }
            }

            $barang = $query->get();

            return response()->json([
                'status' => 'success',
                'data' => $barang
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching items:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch items'
            ], 500);
        }
    }

    public function store(CreateBarangRequest $request)
    {
        try {
            $data = $request->validated();
            
            Log::info('Received barang data:', $data);

            // Handle file upload
            if ($request->hasFile('gambar_barang')) {
                $file = $request->file('gambar_barang');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('barang', $filename, 'public');
                $data['gambar_barang'] = $path;
                
                Log::info('File uploaded:', ['path' => $path]);
            }
            
            // Ensure numeric fields are cast correctly
            $data['harga_awal'] = (float) $data['harga_awal'];
            $data['berat_barang'] = (float) $data['berat_barang'];
            
            // Set default values if not provided
            $data['status_barang'] = $data['status_barang'] ?? 'Tersedia';
            $data['created_by'] = auth()->id() ?? 1; // Fallback to 1 if not authenticated
            
            Log::info('Processing barang data:', $data);

            $barang = Barang::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Barang berhasil ditambahkan',
                'data' => $barang
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating barang:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            // If there was an error and a file was uploaded, delete it
            if (isset($path)) {
                Storage::disk('public')->delete($path);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menambahkan barang: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $barang = Barang::with(['kategori', 'toko'])
                           ->where('id_barang', $id)
                           ->where('is_deleted', false)
                           ->first();

            if (!$barang) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Item not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $barang
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching item:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch item'
            ], 500);
        }
    }

    public function update(CreateBarangRequest $request, $id)
    {
        try {
            $userId = $request->header('X-User-Id');
            $data = $request->validated();
            
            $barang = Barang::where('id_barang', $id)
                           ->where('is_deleted', false)
                           ->first();

            if (!$barang) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Item not found'
                ], 404);
            }

            // Handle file upload
            if ($request->hasFile('gambar_barang')) {
                // Delete old image if exists
                if ($barang->gambar_barang) {
                    Storage::delete('public/' . $barang->gambar_barang);
                }

                $file = $request->file('gambar_barang');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('public/barang', $filename);
                $data['gambar_barang'] = str_replace('public/', '', $path);
            }

            $barang->fill($data);
            $barang->updated_by = $userId;
            $barang->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Item updated successfully',
                'data' => $barang
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating item:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update item'
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $barang = Barang::where('id_barang', $id)
                           ->where('is_deleted', false)
                           ->first();

            if (!$barang) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Item not found'
                ], 404);
            }

            // Soft delete
            $barang->is_deleted = true;
            $barang->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Item deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting item:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete item'
            ], 500);
        }
    }

    public function getBarangByToko($tokoId)
    {
        try {
            $barang = Barang::where('id_toko', $tokoId)
                ->where('is_deleted', false)
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $barang
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching items by store:', [
                'error' => $e->getMessage(),
                'toko_id' => $tokoId
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch store items'
            ], 500);
        }
    }
}
