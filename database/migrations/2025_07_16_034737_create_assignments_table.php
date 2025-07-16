<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('subject')->nullable(); // Course/Subject name
            $table->text('description')->nullable();
            $table->dateTime('due_date');
            $table->decimal('estimated_hours', 4, 1)->nullable(); // e.g., 2.5 hours
            $table->enum('priority_level', ['critical', 'high', 'medium', 'low'])->default('medium');
            $table->decimal('priority_score', 5, 2)->nullable(); // Calculated smart priority (0-100)
            $table->enum('status', ['not_started', 'in_progress', 'completed'])->default('not_started');
            $table->dateTime('completion_date')->nullable();
            $table->text('completion_notes')->nullable();
            $table->json('reminders_sent')->nullable(); // Track which reminders have been sent
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['user_id', 'due_date']);
            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'priority_score']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};
