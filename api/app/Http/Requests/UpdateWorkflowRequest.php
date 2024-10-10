<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWorkflowRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [            
            'name' => 'required|string|max:255',    
            'status' => 'required|string|in:new,active,inactive,completed',
            'tasks' => 'nullable|array',  
            'tasks.*.id' => 'nullable|integer|exists:workflow_tasks,id',       
            'tasks.*.task' => 'required|string',   
            'tasks.*.status' => 'nullable|string|in:new,pending,completed,in_progress',
            'tasks.*.order_no' => 'required|integer',
        ];
    }
}
