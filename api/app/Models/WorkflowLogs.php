<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkflowLogs extends Model
{
    use HasFactory;

    protected $fillable = ['action', 'status', 'workflow_id'];

}
