<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WorkflowController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/workflows', [WorkflowController::class, 'workFlows']);
    Route::get('/workflows/getData/{id}', [WorkflowController::class, 'getData']);
    Route::post('/workflows/create', [WorkflowController::class, 'createWorkFlow']);
    Route::put('/workflows/update/{id}', [WorkflowController::class, 'updateWorkFlow']);
    Route::delete('/workflows/delete/{id}', [WorkflowController::class, 'deleteWorkflow']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});


