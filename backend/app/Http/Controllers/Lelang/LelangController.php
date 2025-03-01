<?php

namespace App\Http\Controllers\Lelang;

use App\Http\Controllers\Controller;
use App\Http\Requests\Lelang\CreateLelangRequest;
use App\Models\Lelang;
use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class LelangController extends Controller
{
    public function index()
    {
        try {
            $lelang = Lelang::with([
                'barang.toko', // Eager load toko through barang
                'barang.kategori',
                'pemenang',
                'penawaranTertinggi.user', // Include user data for highest bid
                'createdBy'
            ])
            ->where('is_deleted', false)
            ->get();

            // Transform the data to ensure all relationships are properly handled
            $transformedData = $lelang->map(function ($item) {
                try {
                    return [
                        'id_lelang' => $item->id_lelang,
                        'id_barang' => $item->id_barang,
                        'harga_minimal_bid' => $item->harga_minimal_bid,
                        'tanggal_mulai' => $item->tanggal_mulai,
                        'tanggal_berakhir' => $item->tanggal_berakhir,
                        'status' => $item->status,
                        'jumlah_bid' => $item->jumlah_bid,
                        'barang' => $item->barang ? [
                            'nama_barang' => $item->barang->nama_barang,
                            'deskripsi_barang' => $item->barang->deskripsi_barang,
                            'gambar_barang_url' => $item->barang->gambar_barang_url,
                            'harga_awal' => $item->barang->harga_awal,
                            'toko' => $item->barang->toko ? [
                                'id_toko' => $item->barang->toko->id_toko,
                                'nama_toko' => $item->barang->toko->nama_toko
                            ] : null
                        ] : null,
                        'pemenang' => $item->pemenang ? [
                            'id_user' => $item->pemenang->id_user,
                            'name' => $item->pemenang->name
                        ] : null,
                        'penawaran_tertinggi' => $item->penawaranTertinggi ? [
                            'harga' => $item->penawaranTertinggi->harga,
                            'user_name' => $item->penawaranTertinggi->user ? $item->penawaranTertinggi->user->name : 'Unknown'
                        ] : null,
                        'created_by' => $item->createdBy ? [
                            'id_user' => $item->createdBy->id_user,
                            'name' => $item->createdBy->name
                        ] : null,
                        'created_at' => $item->created_at,
                        'updated_at' => $item->updated_at
                    ];
                } catch (\Exception $e) {
                    Log::error('Error transforming lelang item:', [
                        'id_lelang' => $item->id_lelang,
                        'error' => $e->getMessage()
                    ]);
                    return null;
                }
            })
            ->filter() // Remove any null values from failed transformations
            ->values(); // Reset array keys

            return response()->json([
                'status' => 'success',
                'data' => $transformedData
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching auctions:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch auctions: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(CreateLelangRequest $request)
    {
        try {
            $data = $request->validated();
            $barang = Barang::findOrFail($data['id_barang']);
            
            if ($barang->status_barang === 'lelang') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Barang ini sudah dalam proses lelang'
                ], 422);
            }

            // Create new lelang with exact harga_minimal_bid from input
            $lelang = Lelang::create([
                'id_barang' => $data['id_barang'],
                'harga_minimal_bid' => $data['harga_minimal_bid'], // Use exactly as provided
                'tanggal_mulai' => $data['tanggal_mulai'],
                'tanggal_berakhir' => $data['tanggal_berakhir'],
                'status' => 'berlangsung',
                'jumlah_bid' => 0,
                'created_by' => $data['created_by'],
                'updated_by' => $data['created_by'],
                'is_deleted' => false
            ]);

            // Update barang status
            $barang->update(['status_barang' => 'lelang']);

            // Load relationships
            $lelang->load(['barang']);

            return response()->json([
                'status' => 'success',
                'message' => 'Lelang berhasil dibuat',
                'data' => $lelang
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating auction:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat lelang: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $lelang = Lelang::with([
                'barang.toko',
                'pemenang',
                'penawaranTertinggi.user'
            ])
            ->where('id_lelang', $id)
            ->where('is_deleted', false)
            ->firstOrFail();

            // Transform the data to match frontend expectations
            $transformedData = [
                'id_lelang' => $lelang->id_lelang,
                'id_barang' => $lelang->id_barang,
                'harga_minimal_bid' => $lelang->harga_minimal_bid,
                'tanggal_mulai' => $lelang->tanggal_mulai,
                'tanggal_berakhir' => $lelang->tanggal_berakhir,
                'status' => $lelang->status,
                'jumlah_bid' => $lelang->jumlah_bid,
                'barang' => [
                    'nama_barang' => $lelang->barang->nama_barang,
                    'deskripsi_barang' => $lelang->barang->deskripsi_barang,
                    'gambar_barang_url' => $lelang->barang->gambar_barang_url,
                    'harga_awal' => $lelang->barang->harga_awal,
                    'kondisi_detail' => $lelang->barang->kondisi_detail,
                    'toko' => [
                        'nama_toko' => $lelang->barang->toko->nama_toko ?? 'Unknown'
                    ]
                ],
                'penawaran_tertinggi' => $lelang->penawaranTertinggi ? [
                    'harga' => $lelang->penawaranTertinggi->harga,
                    'user_name' => $lelang->penawaranTertinggi->user->name ?? 'Unknown'
                ] : null
            ];

            return response()->json([
                'status' => 'success',
                'data' => $transformedData
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching auction:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch auction details'
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $lelang = Lelang::findOrFail($id);
            
            // Update validation for new status values
            $request->validate([
                'status' => 'required|in:berlangsung,selesai'
            ]);

            $lelang->update([
                'status' => $request->status,
                'updated_by' => Auth::id()
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Auction status updated successfully',
                'data' => $lelang
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating auction:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update auction'
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $lelang = Lelang::findOrFail($id);
            
            // Only allow deletion if lelang is pending or cancelled
            if (!in_array($lelang->status, ['pending', 'cancelled'])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot delete active or closed auction'
                ], 400);
            }

            $lelang->update([
                'is_deleted' => true,
                'updated_by' => Auth::id()
            ]);

            // Update barang status back to active
            $lelang->barang->update(['status_barang' => 'active']);

            return response()->json([
                'status' => 'success',
                'message' => 'Auction deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting auction:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete auction'
            ], 500);
        }
    }
}
