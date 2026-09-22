<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JoinerRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'joiner_id',
        'user_id',
        'type',
        'state',
        'pdf_path',
        'pdf_state',
    ];

    protected $casts = [
        'type' => 'integer',
        'state' => 'integer',
        'pdf_state' => 'integer',
        'joiner_id' => 'integer',
        'user_id' => 'integer',
    ];

    /**
     * Get the joiner that owns the request.
     */
    public function joiner()
    {
        return $this->belongsTo(User::class, 'joiner_id');
    }

    /** 
     * Get the user who created the request.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
