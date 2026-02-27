<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = $request->user()->tasks()
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high'
        ]);

        $task = $request->user()->tasks()->create($request->all());
        
        return response()->json($task, 201);
    }

    public function show(Request $request, Task $task)
    {
        if ($request->user()->id !== $task->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        return response()->json($task);
    }

    public function update(Request $request, Task $task)
    {
        if ($request->user()->id !== $task->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'sometimes|in:low,medium,high',
            'completed' => 'sometimes|boolean'
        ]);

        $task->update($request->all());
        
        return response()->json($task);
    }

    public function destroy(Request $request, Task $task)
    {
        if ($request->user()->id !== $task->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->delete();
        
        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function stats(Request $request)
    {
        $user = $request->user();
        
        $stats = [
            'total' => $user->tasks()->count(),
            'completed' => $user->tasks()->where('completed', true)->count(),
            'pending' => $user->tasks()->where('completed', false)->count(),
            'high_priority' => $user->tasks()->where('priority', 'high')->count()
        ];
        
        return response()->json($stats);
    }
}