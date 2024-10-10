<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\WorkflowTask; 

class Workflow extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'status', 'user_id'];

    public function tasks()
    {
        return $this->hasMany(WorkflowTask::class)->orderBy('order_no');
    }
}
