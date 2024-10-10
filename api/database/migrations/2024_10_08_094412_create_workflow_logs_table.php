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
        Schema::create('workflow_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workflow_id')->constrained('workflows')->onDelete('cascade'); 
            $table->foreignId('task_id')->nullable()->constrained('workflow_tasks')->onDelete('set null'); 
            $table->integer('order_no')->nullable();
            $table->string('action'); 
            $table->enum('workflow_status', ['new', 'active', 'inactive','completed'])->nullable(); 
            $table->enum('task_status', ['new', 'pending', 'completed', 'in_progress'])->nullable(); 
            $table->timestamps(); 
            $table->softDeletes(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workflow_logs');
    }
};
