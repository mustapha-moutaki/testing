<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    /**
     * Display a listing of tasks.
     */
    public function index(Request $request)
    {
        $query = Task::query();
        
        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status === 'true' || $request->status === '1');
        }
        
        // Sort by created_at
        if ($request->has('sort') && in_array($request->sort, ['asc', 'desc'])) {
            $query->orderBy('created_at', $request->sort);
        } else {
            $query->orderBy('created_at', 'desc'); // Default sorting
        }
        
        $tasks = $query->get();
        return response()->json(['tasks' => $tasks]);
    }

    /**
     * Store a newly created task.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|boolean',
            'image' => 'required|image|max:2048', // Image is required for new tasks
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $task = new Task();
        $task->title = $request->title;
        $task->description = $request->description;
        $task->status = $request->status ?? false;

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->store('task-images', 'public');
            $task->image_path = $imagePath;
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
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|boolean',
            'image' => 'nullable|image|max:2048', // Image is optional for updates
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $task = Task::findOrFail($id);
        
        if ($request->has('title')) {
            $task->title = $request->title;
        }
        
        if ($request->has('description')) {
            $task->description = $request->description;
        }
        
        if ($request->has('status')) {
            $task->status = $request->status;
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($task->image_path && Storage::disk('public')->exists($task->image_path)) {
                Storage::disk('public')->delete($task->image_path);
            }
            
            $image = $request->file('image');
            $imagePath = $image->store('task-images', 'public');
            $task->image_path = $imagePath;
        }

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
    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        
        // Delete associated image if exists
        if ($task->image_path && Storage::disk('public')->exists($task->image_path)) {
            Storage::disk('public')->delete($task->image_path);
        }
        
        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }
}