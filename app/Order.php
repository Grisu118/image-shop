<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['album_id', 'firstname', 'lastname', 'street', 'zip', 'village', 'email', 'price'];

    public function album() {
        return $this->hasOne('App\Album');
    }

    public function photo() {
        return $this->hasMany('App\Photo');
    }
}
