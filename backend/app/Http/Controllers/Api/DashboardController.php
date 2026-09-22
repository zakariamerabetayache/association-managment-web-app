<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getDashboardStats(Request $request)
    {
        $month = (int) $request->input('month', now()->month);
        $year = (int) $request->input('year', now()->year);

        // Basic counts for association
        $stats = [
            'total_joiners' => User::where('role_id', 'joiner')->count(),
            'approved_joiners' => User::where('role_id', 'joiner')->where('state', 1)->count(),
            'total_national' => User::where('role_id', 'national')->count(),
            'total_wilaya' => User::where('role_id', 'wilaya')->count(),
            'total_baladi' => User::where('role_id', 'baladi')->count(),
        ];

        // Payment stats for the requested month/year
        $paymentsForMonth = Payment::whereMonth('date', $month)
            ->whereYear('date', $year);

        $stats['total_payments'] = (int) $paymentsForMonth->count();
        $stats['approved_payments'] = (int) (clone $paymentsForMonth)->where('state', 1)->count();
        $stats['pending_payments'] = (int) (clone $paymentsForMonth)->where('state', 0)->count();
        $stats['total_revenue'] = Payment::where('state', 1)
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->sum('amount');
    
        // Monthly payments (for the whole selected year)
        $monthly = Payment::whereYear('date', $year)
            ->selectRaw('MONTH(date) as month')
            ->selectRaw('SUM(CASE WHEN state = 1 THEN 1 ELSE 0 END) as approved_count')
            ->selectRaw('SUM(CASE WHEN state = 0 THEN 1 ELSE 0 END) as pending_count')
            ->selectRaw('COUNT(*) as total_count')
            ->groupByRaw('MONTH(date)')
            ->orderByRaw('MONTH(date)')
            ->get();

        $stats['monthly_payments'] = $monthly->map(function ($row) use ($year) {
            $monthNum = (int) $row->month;
            $monthName = Carbon::createFromDate($year, $monthNum, 1)->format('F');

            return [
                'month' => $monthNum,
                'month_name' => $monthName,
                'approved_count' => (int) $row->approved_count,
                'pending_count' => (int) $row->pending_count,
                'total' => (int) $row->total_count,
            ];
        })->values()->toArray();

        // RFID stats
        $stats['rfid'] = [
            'total' => User::whereNotNull('rfid')->count(),
            'joiners' => User::where('role_id', 'joiner')->whereNotNull('rfid')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
