<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Etablissement extends Model
{
    use HasFactory;

    protected $fillable = [
        'designation_ar',
        'designation_fr',
        'logo',
        'owner_name_ar',
        'owner_name_fr',
        'owner_last_name_ar',
        'owner_last_name_fr',
        'rip',
        'price',
        'wilaya_id',
        'commune_id',
        'adress',
        'phone',
        'email',
        'opening_hour',
        'closing_hour',
        'is_validation',
    ];

    protected $casts = [
        'wilaya_id' => 'integer',
        'commune_id' => 'integer',
        'is_validation' => 'boolean',
    ];

    /**
     * Get the wilaya that owns the etablissement.
     */
    public function wilaya()
    {
        return $this->belongsTo(Wilaya::class);
    }

    /**
     * Get the commune that owns the etablissement.
     */
    public function commune()
    {
        return $this->belongsTo(Commune::class);
    }

    /**
     * Get the users for the etablissement.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the devices for the etablissement.
     */
    public function devices()
    {
        return $this->hasMany(Device::class);
    }
}
