import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Assignment {
    id: number;
    title: string;
    subject: string | null;
    due_date: string;
    estimated_hours: number | null;
    priority_level: 'critical' | 'high' | 'medium' | 'low';
    priority_score: number;
    status: 'not_started' | 'in_progress' | 'completed';
    urgency_level: 'overdue' | 'urgent' | 'high' | 'medium' | 'low';
    days_remaining: number;
    is_overdue: boolean;
}

interface DashboardProps {
    assignments: {
        data: Assignment[];
    };
    stats: {
        total: number;
        pending: number;
        overdue: number;
        due_soon: number;
    };
}

export default function Dashboard({ assignments, stats }: DashboardProps) {
    const [showQuickAdd, setShowQuickAdd] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<{
        title: string;
        subject: string;
        due_date: string;
        estimated_hours: string;
        priority_level: 'critical' | 'high' | 'medium' | 'low';
    }>({
        title: '',
        subject: '',
        due_date: '',
        estimated_hours: '',
        priority_level: 'medium',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('assignments.store'), {
            onSuccess: () => {
                reset();
                setShowQuickAdd(false);
            },
        });
    };

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

    const updateStatus = (assignmentId: number, status: string) => {
        router.patch(route('assignments.status', assignmentId), { status });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* Stats Overview */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats?.pending || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats?.overdue || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats?.due_soon || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Add Assignment */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Quick Add Assignment</CardTitle>
                            <Button onClick={() => setShowQuickAdd(!showQuickAdd)} variant={showQuickAdd ? 'secondary' : 'default'}>
                                {showQuickAdd ? 'Cancel' : 'Add Assignment'}
                            </Button>
                        </div>
                    </CardHeader>
                    {showQuickAdd && (
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="title">Assignment Title</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="e.g., Math Homework Chapter 5"
                                            required
                                        />
                                        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="subject">Subject/Course</Label>
                                        <Input
                                            id="subject"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            placeholder="e.g., Mathematics, CSC 301"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="due_date">Due Date</Label>
                                        <Input
                                            id="due_date"
                                            type="datetime-local"
                                            value={data.due_date}
                                            onChange={(e) => setData('due_date', e.target.value)}
                                            required
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
                                            value={data.estimated_hours}
                                            onChange={(e) => setData('estimated_hours', e.target.value)}
                                            placeholder="e.g., 2.5"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="priority_level">Priority Level</Label>
                                    <select
                                        id="priority_level"
                                        value={data.priority_level}
                                        onChange={(e) => setData('priority_level', e.target.value as 'critical' | 'high' | 'medium' | 'low')}
                                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Assignment'}
                                </Button>
                            </form>
                        </CardContent>
                    )}
                </Card>

                {/* Assignments List */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Your Assignments</CardTitle>
                            <Button variant="outline" asChild>
                                <a href={route('assignments.index')}>View All</a>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {assignments?.data?.length > 0 ? (
                            <div className="space-y-4">
                                {assignments.data.slice(0, 5).map((assignment) => (
                                    <div key={assignment.id} className="space-y-2 rounded-lg border p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold">{assignment.title}</h3>
                                                {assignment.subject && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{assignment.subject}</p>
                                                )}
                                                <p className="text-sm text-gray-500">
                                                    Due: {new Date(assignment.due_date).toLocaleDateString()} at{' '}
                                                    {new Date(assignment.due_date).toLocaleTimeString()}
                                                </p>
                                                {assignment.estimated_hours && (
                                                    <p className="text-sm text-gray-500">Estimated: {assignment.estimated_hours} hours</p>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-end space-y-2">
                                                <Badge className={getUrgencyColor(assignment.urgency_level)}>{assignment.urgency_level}</Badge>
                                                <div className="flex items-center space-x-2">
                                                    <div className={`h-3 w-3 rounded-full ${getPriorityColor(assignment.priority_level)}`}></div>
                                                    <span className="text-sm font-medium">Score: {assignment.priority_score}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <select
                                                    value={assignment.status}
                                                    onChange={(e) => updateStatus(assignment.id, e.target.value)}
                                                    className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                                                >
                                                    <option value="not_started">Not Started</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                                <span className="text-sm text-gray-500">
                                                    {assignment.is_overdue ? 'Overdue!' : `${assignment.days_remaining} days left`}
                                                </span>
                                            </div>
                                            <Button variant="ghost" size="sm" asChild>
                                                <a href={route('assignments.show', assignment.id)}>View</a>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-gray-500">
                                <p>No assignments yet. Create your first assignment to get started!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
