<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JoiningType extends Model
{
    use HasFactory;

    protected $fillable = [
        'designation_ar',
        'designation_fr',
        'card_validity',
        'enrollment_code',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
