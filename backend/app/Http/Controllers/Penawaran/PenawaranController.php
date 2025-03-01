<?php

namespace App\Http\Controllers\Penawaran;

use App\Http\Controllers\Controller;
use App\Models\Penawaran;
use App\Models\Lelang;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PenawaranController extends Controller
{
    public function store(Request $request, $lelangId)
    {
        try {
            DB::beginTransaction();

            $lelang = Lelang::with('barang')->findOrFail($lelangId);

            // Check if auction is still ongoing
            if ($lelang->status !== 'berlangsung') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Lelang sudah berakhir'
                ], 400);
            }

            // Get highest bid
            $highestBid = Penawaran::where('id_lelang', $lelangId)
                ->orderBy('harga_bid', 'desc')
                ->first();

            $minimumBid = $highestBid 
                ? $highestBid->harga_bid + $lelang->harga_minimal_bid
                : $lelang->barang->harga_awal + $lelang->harga_minimal_bid;

            // Validate bid amount
            if ($request->harga < $minimumBid) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Harga bid harus lebih tinggi dari bid tertinggi + minimal kenaikan'
                ], 400);
            }

            // Create new bid
            $penawaran = new Penawaran();
            $penawaran->id_lelang = $lelangId;
            $penawaran->id_user = $request->id_user;
            $penawaran->harga_bid = $request->harga;
            $penawaran->waktu_bid = now();
            $penawaran->save();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Bid berhasil disimpan',
                'data' => $penawaran
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getByLelang($lelangId)
    {
        try {
            \Log::info('Fetching bids for lelang ID: ' . $lelangId);

            // Changed from 'name' to 'username' to match User model
            $bids = DB::table('penawaran as p')
                ->join('users as u', 'p.id_user', '=', 'u.id_user')
                ->where('p.id_lelang', $lelangId)
                ->where('p.is_deleted', false)
                ->select([
                    'p.id_penawaran',
                    'u.username as user_name', // Changed from 'name' to 'username'
                    'p.harga_bid as harga',
                    'p.created_at'
                ])
                ->orderBy('p.harga_bid', 'desc')
                ->get();

            \Log::info('Found bids:', ['count' => $bids->count(), 'bids' => $bids]);

            return response()->json([
                'status' => 'success',
                'data' => $bids
            ]);

        } catch (\Exception $e) {
            \Log::error('Error fetching bids: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }
}
