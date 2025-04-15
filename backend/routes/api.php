<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;



Route::prefix('tasks')->group(function () {
    Route::get('/', [TaskController::class, 'index']);
    Route::post('/', [TaskController::class, 'store']);
    Route::get('/{id}', [TaskController::class, 'show']);
    Route::post('/{id}', [TaskController::class, 'update']);
    Route::delete('/{id}', [TaskController::class, 'destroy']);
    Route::patch('/{id}/toggle-status', [TaskController::class, 'toggleStatus']);
});