<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\CreateWorkflowRequest;
use App\Http\Requests\UpdateWorkflowRequest;
use App\Models\Workflow; 
use App\Models\WorkflowTask; 
use App\Models\WorkflowLogs; 
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class WorkflowController extends Controller
{

    public function workFlows(Request $request){
        try {
            $userId = Auth::id(); 
            $workflows = Workflow::where('user_id', $userId)->get();
            return response()->json([
                'success' => true,
                'data' => $workflows,
            ], 200);
        } catch (Exception $e) {         
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching workflows.',
            ], 500);
        }
    }
   
    public function createWorkFlow(CreateWorkflowRequest $request): JsonResponse
    {        
        $userId = Auth::id();    
        $status = $this->determineWorkflowStatus($request->tasks);    
        $workflow = Workflow::create([
            'name' => $request->name,
            'status' => $status,
            'user_id' => $userId,
        ]);    
        $workflowId = $workflow->id;
        $workflowStatus = $workflow->status;   
        $logs = [
            [
                "workflow_id" => $workflowId,
                "action" => "create",
                "workflow_status" => $workflow->status,
                "task_id" => null,
                "task_status" => null,
            ]
        ]; 
        $tasks = [];
        if ($request->tasks) {
            foreach ($request->tasks as $task) {
                $tasks[] = [
                    "task" => $task['task'],
                    "order_no" => $task['order_no'],
                    "status" => $task['status']??'new',
                    "workflow_id" => $workflowId,
                ];
            }               
            WorkflowTask::insert($tasks);  

            $insertedTaskIds = WorkflowTask::where('workflow_id', $workflowId)->pluck('id')->toArray();          
            foreach ($insertedTaskIds as $index => $taskId) {
                $logs[] = [
                    "workflow_id" => $workflowId,
                    "action" => "create",
                    "task_id" => $taskId,
                    "task_status" => $tasks[$index]['status'],
                    "workflow_status"=> $workflowStatus
                ];
            }
            WorkflowLogs::insert($logs);
        }
       
        return response()->json([
            'workflow' => $workflow,           
            'success' => true
        ], 201);
    }   
    
    public function getData($id): JsonResponse
    {
        
        $workflow = Workflow::with('tasks')->findOrFail($id);
        return response()->json([
            'success' => true,
            'workflow' => $workflow,
        ], 200);
    }

    private function determineWorkflowStatus(array $tasks): string
    {
        $status = "new"; 
        $hasActiveTasks = false; 
        $allTasksCompleted = true; 
        foreach ($tasks as $task) {
            if ($task['status'] === "completed") {    
                $hasActiveTasks = true;          
                continue;
            } elseif ($task['status'] === "in_progress") {              
                $hasActiveTasks = true;
                $allTasksCompleted = false; 
            } else {
                $allTasksCompleted = false; 
            }
        }
        if ($allTasksCompleted) {
            $status = "completed"; 
        } elseif ($hasActiveTasks) {
            $status = "active"; 
        }
        return $status;
    }
    
    public function updateWorkFlow(UpdateWorkflowRequest $request, $id): JsonResponse
    {
        $workflow = Workflow::findOrFail($id);           
        DB::transaction(function () use ($request, $workflow) {  
            $status = $this->determineWorkflowStatus($request->tasks);    
            $workflow->update([
                'name' => $request->name,
                'status' =>  $status,
            ]);
            
            $workflowId = $workflow->id;
            $workflowStatus = $workflow->status;
            $logs = [];

            if ($request->tasks) {
                $currentTaskIds = WorkflowTask::where('workflow_id', $workflowId)->pluck('id')->toArray();
                $updatedTaskIds = [];

                foreach ($request->tasks as $task) {
                    if (isset($task['id'])) {                      
                        $existingTask = WorkflowTask::find($task['id']);
                        if (!$existingTask) {
                            throw new \Exception('Task not found.', 404);
                        }
                      
                        $existingTask->update([
                            'task' => $task['task'],
                            'order_no' => $task['order_no'],
                            'status' => $task['status'] ?? 'new',
                        ]);

                        $updatedTaskIds[] = $existingTask->id;
                      
                        $logs[] = [
                            "workflow_id" => $workflowId,
                            "action" => "update",
                            "task_id" => $existingTask->id,
                            "task_status" => $task['status'] ?? 'new',
                            "workflow_status" => $workflowStatus,
                        ];
                    } else {
                   
                        $newTask = WorkflowTask::create([
                            "task" => $task['task'],
                            "order_no" => $task['order_no'],
                            "status" => $task['status'] ?? 'new',
                            "workflow_id" => $workflowId,
                        ]);

                        $updatedTaskIds[] = $newTask->id;
                      
                        $logs[] = [
                            "workflow_id" => $workflowId,
                            "action" => "create",
                            "task_id" => $newTask->id,
                            "task_status" => $newTask->status,
                            "workflow_status" => $workflowStatus,
                        ];
                    }
                }

               
                $tasksToDelete = array_diff($currentTaskIds, $updatedTaskIds);
                if (!empty($tasksToDelete)) {
                    WorkflowTask::whereIn('id', $tasksToDelete)->delete();
                   
                    foreach ($tasksToDelete as $taskId) {
                        $logs[] = [
                            "workflow_id" => $workflowId,
                            "action" => "delete",
                            "task_id" => $taskId,
                            "task_status" => null,
                            "workflow_status" => $workflowStatus,
                        ];
                    }
                }
              
                WorkflowLogs::insert($logs);
            }
        });

        return response()->json([
            'workflow' => $workflow,
            'success' => true
        ], 200);
    }
        

    public function deleteWorkflow($id): JsonResponse
    {
        
        $workflow = Workflow::findOrFail($id);       
        WorkflowTask::where('workflow_id', $id)->delete();      
        WorkflowLogs::create([
            "workflow_id" => $workflow->id,
            "action" => "delete",
            "workflow_status" => $workflow->status,
            "task_id" => null,
            "task_status" => null,
        ]);       
        $workflow->delete();

        return response()->json([
            'success' => true,
            'message' => 'Workflow deleted successfully.',
        ], 200);
    } 

}
