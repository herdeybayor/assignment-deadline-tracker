import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

interface Assignment {
    id: number;
    title: string;
    subject: string | null;
    description: string | null;
    due_date: string;
    estimated_hours: number | null;
    priority_level: 'critical' | 'high' | 'medium' | 'low';
    status: 'not_started' | 'in_progress' | 'completed';
    completion_notes: string | null;
}

interface AssignmentEditProps {
    assignment: Assignment;
}

export default function AssignmentEdit({ assignment }: AssignmentEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'All Assignments',
            href: '/assignments',
        },
        {
            title: assignment.title,
            href: `/assignments/${assignment.id}`,
        },
        {
            title: 'Edit',
            href: `/assignments/${assignment.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: assignment.title,
        subject: assignment.subject || '',
        description: assignment.description || '',
        due_date: assignment.due_date ? new Date(assignment.due_date).toISOString().slice(0, 16) : '',
        estimated_hours: assignment.estimated_hours?.toString() || '',
        priority_level: assignment.priority_level,
        status: assignment.status,
        completion_notes: assignment.completion_notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('assignments.update', assignment.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${assignment.title} - Assignment Tracker`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">✏️ Edit Assignment</h1>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">Update your assignment details and track your progress</p>
                    </div>
                    <Button variant="outline" asChild>
                        <a href={route('assignments.show', assignment.id)}>← Back to Assignment</a>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Form */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span>📝</span>
                                        Basic Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="title">Assignment Title *</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="e.g., CSC 301 Final Project"
                                            required
                                            className="mt-1"
                                        />
                                        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="subject">Subject/Course</Label>
                                        <Input
                                            id="subject"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            placeholder="e.g., Computer Science, MTH 201"
                                            className="mt-1"
                                        />
                                        {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Description & Requirements</Label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Describe the assignment requirements, what needs to be done, any special instructions..."
                                            rows={4}
                                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                        />
                                        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Timeline & Priority */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span>⏰</span>
                                        Timeline & Priority
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor="due_date">Due Date & Time *</Label>
                                            <Input
                                                id="due_date"
                                                type="datetime-local"
                                                value={data.due_date}
                                                onChange={(e) => setData('due_date', e.target.value)}
                                                required
                                                className="mt-1"
                                            />
                                            {errors.due_date && <p className="mt-1 text-sm text-red-500">{errors.due_date}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="estimated_hours">Estimated Hours</Label>
                                            <Input
                                                id="estimated_hours"
                                                type="number"
                                                step="0.5"
                                                min="0.1"
                                                max="999.9"
                                                value={data.estimated_hours}
                                                onChange={(e) => setData('estimated_hours', e.target.value)}
                                                placeholder="e.g., 3.5"
                                                className="mt-1"
                                            />
                                            {errors.estimated_hours && <p className="mt-1 text-sm text-red-500">{errors.estimated_hours}</p>}
                                            <p className="mt-1 text-xs text-gray-500">How long do you think this will take to complete?</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor="priority_level">Priority Level</Label>
                                            <select
                                                id="priority_level"
                                                value={data.priority_level}
                                                onChange={(e) => setData('priority_level', e.target.value as Assignment['priority_level'])}
                                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                            >
                                                <option value="low">🟢 Low Priority</option>
                                                <option value="medium">🟡 Medium Priority</option>
                                                <option value="high">🟠 High Priority</option>
                                                <option value="critical">🔴 Critical Priority</option>
                                            </select>
                                            {errors.priority_level && <p className="mt-1 text-sm text-red-500">{errors.priority_level}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="status">Current Status</Label>
                                            <select
                                                id="status"
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value as Assignment['status'])}
                                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                            >
                                                <option value="not_started">📋 Not Started</option>
                                                <option value="in_progress">🔄 In Progress</option>
                                                <option value="completed">✅ Completed</option>
                                            </select>
                                            {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Completion Notes (only if completed) */}
                            {data.status === 'completed' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <span>✅</span>
                                            Completion Notes
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div>
                                            <Label htmlFor="completion_notes">How did it go?</Label>
                                            <textarea
                                                id="completion_notes"
                                                value={data.completion_notes}
                                                onChange={(e) => setData('completion_notes', e.target.value)}
                                                placeholder="Add notes about how the assignment went, what you learned, any challenges you faced..."
                                                rows={4}
                                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                            />
                                            {errors.completion_notes && <p className="mt-1 text-sm text-red-500">{errors.completion_notes}</p>}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Save Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span>💾</span>
                                        Save Changes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button type="submit" disabled={processing} className="w-full">
                                        {processing ? '⏳ Updating...' : '💾 Update Assignment'}
                                    </Button>

                                    <Button variant="outline" asChild className="w-full">
                                        <a href={route('assignments.show', assignment.id)}>Cancel</a>
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Priority Help */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span>💡</span>
                                        Priority Guide
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div>
                                        <div className="mb-1 flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                            <span className="font-medium">Critical</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400">Major exams, final projects, important deadlines</p>
                                    </div>
                                    <div>
                                        <div className="mb-1 flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                                            <span className="font-medium">High</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400">Significant assignments, midterm prep</p>
                                    </div>
                                    <div>
                                        <div className="mb-1 flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                            <span className="font-medium">Medium</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400">Regular homework, weekly assignments</p>
                                    </div>
                                    <div>
                                        <div className="mb-1 flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                            <span className="font-medium">Low</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400">Optional readings, extra credit</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Smart Features */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span>🤖</span>
                                        Smart Features
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <p>
                                        📊 <strong>Priority Score:</strong> Automatically calculated based on due date, estimated time, and your
                                        priority level.
                                    </p>
                                    <p>
                                        🚨 <strong>Urgency Levels:</strong> Dynamically updated based on how close the deadline is.
                                    </p>
                                    <p>
                                        📈 <strong>Smart Sorting:</strong> Your assignments are sorted by priority to help you focus on what matters
                                        most.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
