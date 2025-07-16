<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Assignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'subject',
        'description',
        'due_date',
        'estimated_hours',
        'priority_level',
        'priority_score',
        'status',
        'completion_date',
        'completion_notes',
        'reminders_sent',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'completion_date' => 'datetime',
        'estimated_hours' => 'decimal:1',
        'priority_score' => 'decimal:2',
        'reminders_sent' => 'array',
    ];

    protected $appends = ['is_overdue', 'days_remaining', 'urgency_level'];

    /**
     * Get the user that owns the assignment
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if the assignment is overdue
     */
    public function getIsOverdueAttribute(): bool
    {
        return $this->due_date->isPast() && $this->status !== 'completed';
    }

    /**
     * Get days remaining until due date
     */
    public function getDaysRemainingAttribute(): int
    {
        return max(0, Carbon::now()->diffInDays($this->due_date, false));
    }

    /**
     * Get urgency level based on days remaining
     */
    public function getUrgencyLevelAttribute(): string
    {
        if ($this->is_overdue) return 'overdue';
        
        $days = $this->days_remaining;
        if ($days <= 1) return 'urgent';
        if ($days <= 3) return 'high';
        if ($days <= 7) return 'medium';
        return 'low';
    }

    /**
     * Calculate and update the smart priority score
     * Based on: due date proximity (40%) + estimated time (30%) + user priority (30%)
     */
    public function calculatePriorityScore(): float
    {
        // Due date proximity score (0-40 points)
        $daysRemaining = $this->days_remaining;
        if ($daysRemaining <= 0) {
            $dateScore = 40; // Overdue gets max points
        } elseif ($daysRemaining <= 1) {
            $dateScore = 35;
        } elseif ($daysRemaining <= 3) {
            $dateScore = 25;
        } elseif ($daysRemaining <= 7) {
            $dateScore = 15;
        } else {
            $dateScore = max(0, 40 - ($daysRemaining * 2)); // Diminishing returns
        }

        // Estimated time score (0-30 points)
        $timeScore = 0;
        if ($this->estimated_hours) {
            if ($this->estimated_hours >= 10) {
                $timeScore = 30;
            } elseif ($this->estimated_hours >= 5) {
                $timeScore = 20;
            } elseif ($this->estimated_hours >= 2) {
                $timeScore = 15;
            } else {
                $timeScore = 10;
            }
        }

        // User priority level score (0-30 points)
        $priorityMap = [
            'critical' => 30,
            'high' => 20,
            'medium' => 10,
            'low' => 5,
        ];
        $userPriorityScore = $priorityMap[$this->priority_level] ?? 10;

        $totalScore = $dateScore + $timeScore + $userPriorityScore;
        
        // Update the model
        $this->priority_score = $totalScore;
        $this->save();

        return $totalScore;
    }

    /**
     * Scope to get assignments ordered by priority
     */
    public function scopeByPriority($query)
    {
        return $query->orderByDesc('priority_score')->orderBy('due_date');
    }

    /**
     * Scope to get pending assignments (not completed)
     */
    public function scopePending($query)
    {
        return $query->where('status', '!=', 'completed');
    }

    /**
     * Scope to get overdue assignments
     */
    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())->where('status', '!=', 'completed');
    }

    /**
     * Scope to get assignments due soon (within specified days)
     */
    public function scopeDueSoon($query, $days = 7)
    {
        return $query->where('due_date', '<=', now()->addDays($days))
                    ->where('due_date', '>=', now())
                    ->where('status', '!=', 'completed');
    }
}
