<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkflowTask extends Model
{
    use HasFactory;

    protected $fillable = ['task', 'status', 'task_id', 'workflow_id', 'order_no'];
}
