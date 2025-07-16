import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Assignment {
    id: number;
    title: string;
    subject: string | null;
    description: string | null;
    due_date: string;
    estimated_hours: number | null;
    priority_level: 'critical' | 'high' | 'medium' | 'low';
    priority_score: number;
    status: 'not_started' | 'in_progress' | 'completed';
    urgency_level: 'overdue' | 'urgent' | 'high' | 'medium' | 'low';
    days_remaining: number;
    is_overdue: boolean;
    completion_date: string | null;
    completion_notes: string | null;
    created_at: string;
    updated_at: string;
}

interface AssignmentShowProps {
    assignment: Assignment;
}

export default function AssignmentShow({ assignment }: AssignmentShowProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showCompletionNotes, setShowCompletionNotes] = useState(false);

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
    ];

    const { data, setData, processing } = useForm({
        status: assignment.status,
        completion_notes: assignment.completion_notes || '',
    });

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'overdue':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'urgent':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
            case 'high':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'medium':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical':
                return 'bg-red-500';
            case 'high':
                return 'bg-orange-500';
            case 'medium':
                return 'bg-yellow-500';
            default:
                return 'bg-green-500';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const updateStatus = (newStatus: string) => {
        router.patch(
            route('assignments.status', assignment.id),
            { status: newStatus },
            {
                preserveScroll: true,
            },
        );
    };

    const handleComplete = () => {
        if (data.status === 'completed') {
            router.patch(
                route('assignments.status', assignment.id),
                {
                    status: 'completed',
                    completion_notes: data.completion_notes,
                },
                {
                    preserveScroll: true,
                },
            );
        } else {
            updateStatus('completed');
        }
    };

    const deleteAssignment = () => {
        router.delete(route('assignments.destroy', assignment.id));
    };

    const timeLeft = () => {
        if (assignment.is_overdue) {
            return 'Overdue!';
        }

        const days = assignment.days_remaining;
        if (days === 0) return 'Due today!';
        if (days === 1) return 'Due tomorrow';
        return `${days} days remaining`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${assignment.title} - Assignment Details`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{assignment.title}</h1>
                        {assignment.subject && <p className="mt-1 text-lg font-medium text-blue-600 dark:text-blue-400">📖 {assignment.subject}</p>}
                        <div className="mt-3 flex items-center space-x-4">
                            <Badge className={getUrgencyColor(assignment.urgency_level)}>{assignment.urgency_level.replace('_', ' ')}</Badge>
                            <Badge className={getStatusColor(assignment.status)}>{assignment.status.replace('_', ' ')}</Badge>
                            <div className="flex items-center space-x-2">
                                <div className={`h-4 w-4 rounded-full ${getPriorityColor(assignment.priority_level)}`}></div>
                                <span className="text-sm font-medium capitalize">{assignment.priority_level} Priority</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button variant="outline" asChild>
                            <a href={route('assignments.edit', assignment.id)}>✏️ Edit</a>
                        </Button>
                        <Button variant="outline" asChild>
                            <a href={route('assignments.index')}>← Back to List</a>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Details */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Due Date & Time Info */}
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
                                        <h4 className="font-medium text-gray-900 dark:text-white">Due Date & Time</h4>
                                        <p className="text-lg">
                                            📅{' '}
                                            {new Date(assignment.due_date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                        <p className="text-lg">
                                            🕐{' '}
                                            {new Date(assignment.due_date).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                        <p className={`mt-2 text-sm font-medium ${assignment.is_overdue ? 'text-red-600' : 'text-gray-600'}`}>
                                            {timeLeft()}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Priority Information</h4>
                                        <p className="text-lg">📊 Priority Score: {assignment.priority_score}</p>
                                        {assignment.estimated_hours && <p className="text-lg">⏱️ Estimated: {assignment.estimated_hours} hours</p>}
                                        <p className="mt-2 text-sm text-gray-500">Created {new Date(assignment.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        {assignment.description && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span>📝</span>
                                        Description & Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <p className="whitespace-pre-wrap">{assignment.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Completion Notes */}
                        {assignment.status === 'completed' && assignment.completion_notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span>✅</span>
                                        Completion Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <p className="whitespace-pre-wrap">{assignment.completion_notes}</p>
                                    </div>
                                    {assignment.completion_date && (
                                        <p className="mt-3 text-sm text-gray-500">
                                            Completed on {new Date(assignment.completion_date).toLocaleDateString()}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Actions Sidebar */}
                    <div className="space-y-6">
                        {/* Status Control */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span>🔄</span>
                                    Status Control
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Update Status</label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => {
                                            setData('status', e.target.value as Assignment['status']);
                                            updateStatus(e.target.value);
                                        }}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                        disabled={processing}
                                    >
                                        <option value="not_started">📋 Not Started</option>
                                        <option value="in_progress">🔄 In Progress</option>
                                        <option value="completed">✅ Completed</option>
                                    </select>
                                </div>

                                {/* Quick Complete Button */}
                                {assignment.status !== 'completed' && (
                                    <Button onClick={handleComplete} disabled={processing} className="w-full" variant="default">
                                        ✅ Mark as Completed
                                    </Button>
                                )}

                                {/* Completion Notes for completed assignments */}
                                {assignment.status === 'completed' && (
                                    <div>
                                        <Button
                                            onClick={() => setShowCompletionNotes(!showCompletionNotes)}
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                        >
                                            {assignment.completion_notes ? 'Edit' : 'Add'} Completion Notes
                                        </Button>

                                        {showCompletionNotes && (
                                            <div className="mt-3 space-y-2">
                                                <textarea
                                                    value={data.completion_notes}
                                                    onChange={(e) => setData('completion_notes', e.target.value)}
                                                    placeholder="Add notes about how the assignment went..."
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                                    rows={3}
                                                />
                                                <Button
                                                    onClick={() => {
                                                        router.patch(
                                                            route('assignments.update', assignment.id),
                                                            {
                                                                ...assignment,
                                                                completion_notes: data.completion_notes,
                                                            },
                                                            {
                                                                onSuccess: () => setShowCompletionNotes(false),
                                                            },
                                                        );
                                                    }}
                                                    disabled={processing}
                                                    size="sm"
                                                    className="w-full"
                                                >
                                                    Save Notes
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span>⚙️</span>
                                    Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" asChild className="w-full">
                                    <a href={route('assignments.edit', assignment.id)}>✏️ Edit Assignment</a>
                                </Button>

                                <Button variant="outline" className="w-full" onClick={() => router.post(route('assignments.recalculate'))}>
                                    🔄 Recalculate Priority
                                </Button>

                                <Button variant="destructive" className="w-full" onClick={() => setShowDeleteConfirm(true)}>
                                    🗑️ Delete Assignment
                                </Button>

                                {showDeleteConfirm && (
                                    <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3">
                                        <p className="mb-3 text-sm text-red-800">
                                            Are you sure you want to delete this assignment? This action cannot be undone.
                                        </p>
                                        <div className="flex space-x-2">
                                            <Button variant="destructive" size="sm" onClick={deleteAssignment}>
                                                Yes, Delete
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span>📈</span>
                                    Quick Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Status:</span>
                                    <span className="font-medium capitalize">{assignment.status.replace('_', ' ')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Priority:</span>
                                    <span className="font-medium capitalize">{assignment.priority_level}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Urgency:</span>
                                    <span className="font-medium capitalize">{assignment.urgency_level.replace('_', ' ')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Score:</span>
                                    <span className="font-medium">{assignment.priority_score}</span>
                                </div>
                                {assignment.estimated_hours && (
                                    <div className="flex justify-between">
                                        <span>Est. Hours:</span>
                                        <span className="font-medium">{assignment.estimated_hours}h</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
