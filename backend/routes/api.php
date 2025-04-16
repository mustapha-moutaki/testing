<?php
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::prefix('tasks')->group(function () {
    Route::get('/', [TaskController::class, 'index']);
    Route::post('/', [TaskController::class, 'store']);
    Route::get('/{id}', [TaskController::class, 'show']);
    Route::patch('/{task}', [TaskController::class, 'update']); 
    Route::delete('/{task}', [TaskController::class, 'destroy']); 


    Route::patch('/{id}/toggle-status', [TaskController::class, 'toggleStatus']);
});
Route::get('/', [TaskController::class, 'index']);
