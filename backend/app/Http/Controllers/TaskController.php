<?php

namespace App\Http\Controllers;


use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
  
    public function index(Request $request)
    {
        $query = Task::query();
    
        if ($request->has('status')) {
            $status = filter_var($request->status, FILTER_VALIDATE_BOOLEAN);
            $query->where('status', $status);
        }
    
        
        $query->orderBy('created_at', 'desc');
    
        $tasks = $query->get();
        return response()->json(['tasks' => $tasks]);
    }
    

   
    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'status' => 'nullable|boolean',
        'image' => 'required|image|max:2048',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $task = new Task();
    $task->title = $request->title;
    $task->description = $request->description;
    $task->status = $request->status ?? false;

    if ($request->hasFile('image')) {
        $image = $request->file('image');
        $imagePath = $image->store('task-images', 'public');
        $task->image_path = 'storage/' . $imagePath;
    }

    $task->save();

    return response()->json(['task' => $task, 'message' => 'Task created successfully'], 201);
}


    /**
     * Display the specified task.
     */
    public function show($id)
    {
        $task = Task::findOrFail($id);
        return response()->json(['task' => $task]);
    }

    /**
     * Update the specified task.
     */
    public function update(Request $request, Task $task)
    {
        $task->title = $request->input('title');
        $task->description = $request->input('description');
        $task->status = $request->input('status');
        $task->image_path = $request->input('image_path');
    
        $task->save();
    
        return response()->json(['task' => $task, 'message' => 'Task updated successfully']);
    }
    
    
    

    

    /**
     * Toggle task status.
     */
    public function toggleStatus($id)
    {
        $task = Task::findOrFail($id);
        $task->status = !$task->status;
        $task->save();

        return response()->json(['task' => $task, 'message' => 'Task status updated successfully']);
    }

    /**
     * Remove the specified task.
     */
  
     public function destroy(Task $task)
     {
         // Delete the task
         $task->delete();
     
         return response()->json(['message' => 'Task deleted successfully'], 200);
     }

     
    
}