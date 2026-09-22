<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'designation',
        'document_type_id',
        'document_date',
        'document_deposite_date',
        'is_privet',
        'joiner_id',
        'description',
        'pdf_path',
    ];

    protected $casts = [
        'is_privet' => 'boolean',
        'document_date' => 'date',
        'document_deposite_date' => 'date',
    ];

    public function documentType()
    {
        return $this->belongsTo(DocumentType::class);
    }

    public function joiner()
    {
        return $this->belongsTo(User::class, 'joiner_id');
    }
}
