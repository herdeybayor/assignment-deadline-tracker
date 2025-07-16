import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

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
        title: 'Create New',
        href: '/assignments/create',
    },
];

export default function AssignmentCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        subject: '',
        description: '',
        due_date: '',
        estimated_hours: '',
        priority_level: 'medium' as 'critical' | 'high' | 'medium' | 'low',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('assignments.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create New Assignment - Assignment Tracker" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📝 Create New Assignment</h1>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">Add a new assignment to track and never miss a deadline again</p>
                    </div>
                    <Button variant="outline" asChild>
                        <a href={route('assignments.index')}>← Back to Assignments</a>
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
                                            placeholder="e.g., CSC 301 Final Project, MTH 201 Assignment 3"
                                            required
                                            className="mt-1"
                                        />
                                        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                                        <p className="mt-1 text-xs text-gray-500">Give your assignment a clear, descriptive title</p>
                                    </div>

                                    <div>
                                        <Label htmlFor="subject">Subject/Course</Label>
                                        <Input
                                            id="subject"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            placeholder="e.g., Computer Science, Mathematics, Physics"
                                            className="mt-1"
                                        />
                                        {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
                                        <p className="mt-1 text-xs text-gray-500">What course or subject is this assignment for?</p>
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Description & Requirements</Label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Describe what needs to be done for this assignment..."
                                            rows={4}
                                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                        />
                                        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                                        <p className="mt-1 text-xs text-gray-500">Optional: Add details about requirements, instructions, or notes</p>
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
                                            <p className="mt-1 text-xs text-gray-500">When is this assignment due?</p>
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
                                            <p className="mt-1 text-xs text-gray-500">How long do you think this will take? (optional)</p>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="priority_level">Priority Level</Label>
                                        <select
                                            id="priority_level"
                                            value={data.priority_level}
                                            onChange={(e) => setData('priority_level', e.target.value as 'critical' | 'high' | 'medium' | 'low')}
                                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                        >
                                            <option value="low">🟢 Low Priority - Optional work, extra credit</option>
                                            <option value="medium">🟡 Medium Priority - Regular homework, weekly assignments</option>
                                            <option value="high">🟠 High Priority - Important assignments, midterm prep</option>
                                            <option value="critical">🔴 Critical Priority - Major exams, final projects</option>
                                        </select>
                                        {errors.priority_level && <p className="mt-1 text-sm text-red-500">{errors.priority_level}</p>}
                                        <p className="mt-1 text-xs text-gray-500">How important is this assignment to you?</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Save Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span>💾</span>
                                        Create Assignment
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button type="submit" disabled={processing} className="w-full">
                                        {processing ? '⏳ Creating...' : '✨ Create Assignment'}
                                    </Button>

                                    <Button variant="outline" asChild className="w-full">
                                        <a href={route('dashboard')}>Cancel & Go to Dashboard</a>
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Quick Tips */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span>💡</span>
                                        Quick Tips
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                    <div>
                                        <span className="font-medium">📊 Smart Prioritization:</span>
                                        <p>
                                            Your assignments will be automatically sorted by priority score, calculated from due date, estimated time,
                                            and your priority level.
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium">🚨 Urgency Tracking:</span>
                                        <p>The system will automatically flag assignments as urgent based on how close the deadline is.</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">⏰ Time Estimates:</span>
                                        <p>Adding time estimates helps the system better prioritize your workload and plan your schedule.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Priority Guide */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span>🎯</span>
                                        Priority Guide
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div>
                                        <div className="mb-1 flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                            <span className="font-medium">Critical</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400">Major exams, final projects, thesis deadlines</p>
                                    </div>
                                    <div>
                                        <div className="mb-1 flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                                            <span className="font-medium">High</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400">Significant assignments, midterm prep, presentations</p>
                                    </div>
                                    <div>
                                        <div className="mb-1 flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                            <span className="font-medium">Medium</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400">Regular homework, weekly assignments, labs</p>
                                    </div>
                                    <div>
                                        <div className="mb-1 flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                            <span className="font-medium">Low</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400">Optional readings, extra credit, review materials</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Example Assignments */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span>📚</span>
                                        Examples
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div>
                                        <p className="font-medium">📖 "CSC 301 Final Project"</p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Subject: Computer Science
                                            <br />
                                            Priority: Critical
                                            <br />
                                            Estimated: 20 hours
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-medium">📝 "MTH 201 Assignment 5"</p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Subject: Mathematics
                                            <br />
                                            Priority: Medium
                                            <br />
                                            Estimated: 2 hours
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
