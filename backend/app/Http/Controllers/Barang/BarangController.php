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
            $query = Barang::with(['kategori', 'toko.user'])
                          ->where('is_deleted', false);

            // Search functionality
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('nama_barang', 'like', "%{$search}%")
                      ->orWhereHas('toko', function($query) use ($search) {
                          $query->where('nama_toko', 'like', "%{$search}%")
                                ->orWhereHas('user', function($q) use ($search) {
                                    $q->where('username', 'like', "%{$search}%");
                                });
                      });
                });
            }

            // Category filter
            if ($request->has('category') && $request->category !== 'all') {
                $query->where('id_kategori', $request->category);
            }

            // Status filter
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status_barang', $request->status);
            }

            $barang = $query->get();

            // Add image URLs
            $barang->each(function ($item) {
                $item->gambar_barang_url = $item->gambar_barang 
                    ? config('app.url') . '/storage/' . $item->gambar_barang 
                    : null;
            });

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
                // Store the relative path
                $data['gambar_barang'] = $path;
                // Add the full URL
                $data['gambar_barang_url'] = config('app.url') . '/storage/' . $path;
                
                Log::info('File uploaded:', [
                    'path' => $data['gambar_barang'],
                    'url' => $data['gambar_barang_url']
                ]);
            }
            
            // Ensure numeric fields are cast correctly
            $data['harga_awal'] = (float) $data['harga_awal'];
            $data['berat_barang'] = (float) $data['berat_barang'];
            
            // Set default values if not provided
            $data['status_barang'] = $data['status_barang'] ?? 'tersedia';
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
                $path = $file->storeAs('barang', $filename, 'public');
                $data['gambar_barang'] = $path;
                $data['gambar_barang_url'] = config('app.url') . '/storage/' . $path;
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
            // Begin transaction
            \DB::beginTransaction();

            $barang = Barang::where('id_barang', $id)
                           ->where('is_deleted', false)
                           ->first();

            if (!$barang) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Item not found'
                ], 404);
            }

            // Soft delete related lelang records
            \DB::table('lelang')
                ->where('id_barang', $id)
                ->update(['is_deleted' => true]);

            // Soft delete related penawaran records
            \DB::table('penawaran')
                ->whereIn('id_lelang', function($query) use ($id) {
                    $query->select('id_lelang')
                          ->from('lelang')
                          ->where('id_barang', $id);
                })
                ->update(['is_deleted' => true]);

            // Finally, soft delete the barang
            $barang->is_deleted = true;
            $barang->save();

            // Commit transaction
            \DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Item and all related records deleted successfully'
            ]);

        } catch (\Exception $e) {
            // Rollback transaction if any error occurs
            \DB::rollBack();

            Log::error('Error deleting item and related records:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete item and related records'
            ], 500);
        }
    }

    public function getBarangByToko($tokoId)
    {
        try {
            Log::info('Fetching items for store:', ['toko_id' => $tokoId]);

            $query = Barang::with(['kategori', 'toko'])
                ->where('id_toko', $tokoId)
                ->where('is_deleted', false);

            // Log the generated SQL query
            Log::info('Generated SQL:', [
                'sql' => $query->toSql(),
                'bindings' => $query->getBindings()
            ]);

            $barang = $query->get();

            Log::info('Query result count:', ['count' => $barang->count()]);

            // Transform the data to include full image URL
            $barang->map(function ($item) {
                if ($item->gambar_barang) {
                    $item->gambar_barang_url = config('app.url') . '/storage/' . $item->gambar_barang;
                }
                return $item;
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Successfully retrieved store items',
                'data' => $barang,
                'debug' => [
                    'toko_id' => $tokoId,
                    'total_items' => $barang->count(),
                    'has_items' => $barang->isNotEmpty()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching items by store:', [
                'error' => $e->getMessage(),
                'toko_id' => $tokoId,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch store items: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getBarangById($id)
    {
        try {
            $barang = Barang::with(['kategori', 'toko'])
                           ->where('id_barang', $id)
                           ->where('is_deleted', false)
                           ->first();

            if (!$barang) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Barang tidak ditemukan'
                ], 404);
            }

            // Add full URL for image
            if ($barang->gambar_barang) {
                $barang->gambar_barang_url = config('app.url') . '/storage/' . $barang->gambar_barang;
            }

            return response()->json([
                'status' => 'success',
                'data' => $barang
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching barang by ID:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data barang'
            ], 500);
        }
    }

    public function getBarangByUser($userId)
    {
        try {
            $barang = Barang::with(['kategori', 'toko'])
                           ->whereHas('toko', function($query) use ($userId) {
                               $query->where('id_user', $userId);
                           })
                           ->where('is_deleted', false)
                           ->get();

            // Add full URL for images
            $barang->each(function ($item) {
                if ($item->gambar_barang) {
                    $item->gambar_barang_url = config('app.url') . '/storage/' . $item->gambar_barang;
                }
            });

            return response()->json([
                'status' => 'success',
                'data' => $barang
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching barang by user:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data barang'
            ], 500);
        }
    }

    public function getBarangByTokoAndUser($tokoId, $userId)
    {
        try {
            $barang = Barang::with(['kategori', 'toko'])
                           ->whereHas('toko', function($query) use ($tokoId, $userId) {
                               $query->where('id', $tokoId)
                                   ->where('id_user', $userId);
                           })
                           ->where('is_deleted', false)
                           ->get();

            // Add full URL for images
            $barang->each(function ($item) {
                if ($item->gambar_barang) {
                    $item->gambar_barang_url = config('app.url') . '/storage/' . $item->gambar_barang;
                }
            });

            return response()->json([
                'status' => 'success',
                'data' => $barang
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching barang by toko and user:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data barang'
            ], 500);
        }
    }
}
