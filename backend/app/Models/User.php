<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom_ar',
        'nom_fr',
        'prenom_ar',
        'prenom_fr',
        'app_id',
        'role_id',
        'email',
        'password',
        'etablissement_id',
        
        // Joiner-specific fields
        'identity_image',
        'self_photo',
        'date_nais',
        'sex',
        'nb_crt',
        'nin',
        'adress',
        'wilaya_id',
        'commune_id',
        'wilaya_res_id',
        'commune_res_id',
        'telephone',
        
        'state',
        'price_receipt',
        'rfid',
        'profession',
        'joining_type_id',
        'joining_date',
        'expiration_date',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
       'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'state' => 'integer',
        'password' => 'hashed',
        'app_id' => 'integer',
        'role_id' => 'string',
        // Parent field casts
        'date_nais' => 'date',
        'sex' => 'integer',
        'wilaya_id' => 'integer',
        'commune_id' => 'integer',
        'wilaya_res_id' => 'integer',
        'commune_res_id' => 'integer',
        'joining_type_id' => 'integer',
        'joining_date' => 'date',
        'expiration_date' => 'date',
    ];

    /**
     * Get the etablissement that owns the user.
     */
    public function etablissement()
    {
        return $this->belongsTo(Etablissement::class);
    }

    /**
     * Get the birth wilaya for parent users.
     */
    public function wilaya()
    {
        return $this->belongsTo(Wilaya::class, 'wilaya_id');
    }

    /**
     * Get the birth commune for parent users.
     */
    public function commune()
    {
        return $this->belongsTo(Commune::class, 'commune_id');
    }

    /**
     * Get the residence wilaya for parent users.
     */
    public function wilayaResidence()
    {
        return $this->belongsTo(Wilaya::class, 'wilaya_res_id');
    }

    /**
     * Get the residence commune for parent users.
     */
    public function communeResidence()
    {
        return $this->belongsTo(Commune::class, 'commune_res_id');
    }

    /**
     * Get the joining type for the user.
     */
    public function joiningType()
    {
        return $this->belongsTo(JoiningType::class);
    }





    /**
     * Get the payments for this user (joiner).
     */
    public function payments()
    {
        return $this->hasMany(Payment::class, 'user_id');
    }





}
