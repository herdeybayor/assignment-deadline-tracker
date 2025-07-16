<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AssignmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Auth::user()->assignments();

        // Filter by status if provided
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by urgency if provided
        if ($request->filled('urgency')) {
            switch ($request->urgency) {
                case 'overdue':
                    $query->overdue();
                    break;
                case 'due_soon':
                    $query->dueSoon(7);
                    break;
            }
        }

        // Search by title or subject
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        $assignments = $query->byPriority()->paginate(20);

        return Inertia::render('assignments/index', [
            'assignments' => $assignments,
            'filters' => $request->only(['status', 'urgency', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('assignments/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subject' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'required|date|after:now',
            'estimated_hours' => 'nullable|numeric|min:0.1|max:999.9',
            'priority_level' => 'required|in:critical,high,medium,low',
        ]);

        $assignment = Auth::user()->assignments()->create($validated);
        
        // Calculate initial priority score
        $assignment->calculatePriorityScore();

        return redirect()->route('dashboard')->with('success', 'Assignment created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Assignment $assignment): Response
    {
        // Ensure user can only view their own assignments
        $this->authorize('view', $assignment);

        return Inertia::render('assignments/show', [
            'assignment' => $assignment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Assignment $assignment): Response
    {
        $this->authorize('update', $assignment);

        return Inertia::render('assignments/edit', [
            'assignment' => $assignment,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Assignment $assignment)
    {
        $this->authorize('update', $assignment);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subject' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'required|date|after:now',
            'estimated_hours' => 'nullable|numeric|min:0.1|max:999.9',
            'priority_level' => 'required|in:critical,high,medium,low',
            'status' => 'required|in:not_started,in_progress,completed',
            'completion_notes' => 'nullable|string',
        ]);

        // If marking as completed, set completion date
        if ($validated['status'] === 'completed' && $assignment->status !== 'completed') {
            $validated['completion_date'] = now();
        }

        // If changing from completed to another status, clear completion date
        if ($validated['status'] !== 'completed' && $assignment->status === 'completed') {
            $validated['completion_date'] = null;
        }

        $assignment->update($validated);
        
        // Recalculate priority score
        $assignment->calculatePriorityScore();

        return redirect()->route('assignments.show', $assignment)->with('success', 'Assignment updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Assignment $assignment)
    {
        $this->authorize('delete', $assignment);

        $assignment->delete();

        return redirect()->route('dashboard')->with('success', 'Assignment deleted successfully!');
    }

    /**
     * Mark assignment as completed
     */
    public function complete(Assignment $assignment)
    {
        $this->authorize('update', $assignment);

        $assignment->update([
            'status' => 'completed',
            'completion_date' => now(),
        ]);

        return back()->with('success', 'Assignment marked as completed!');
    }

    /**
     * Update assignment status
     */
    public function updateStatus(Request $request, Assignment $assignment)
    {
        $this->authorize('update', $assignment);

        $validated = $request->validate([
            'status' => 'required|in:not_started,in_progress,completed',
        ]);

        $updateData = ['status' => $validated['status']];

        // Handle completion
        if ($validated['status'] === 'completed') {
            $updateData['completion_date'] = now();
        } elseif ($assignment->status === 'completed') {
            $updateData['completion_date'] = null;
        }

        $assignment->update($updateData);
        $assignment->calculatePriorityScore();

        return back()->with('success', 'Assignment status updated!');
    }

    /**
     * Recalculate all priority scores for the user's assignments
     */
    public function recalculatePriorities()
    {
        $assignments = Auth::user()->assignments()->pending()->get();

        foreach ($assignments as $assignment) {
            $assignment->calculatePriorityScore();
        }

        return back()->with('success', 'Priority scores recalculated!');
    }
}
