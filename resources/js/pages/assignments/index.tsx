import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'All Assignments',
        href: '/assignments',
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
    created_at: string;
}

interface AssignmentsIndexProps {
    assignments: {
        data: Assignment[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        status?: string;
        urgency?: string;
        search?: string;
    };
}

export default function AssignmentsIndex({ assignments, filters }: AssignmentsIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [urgencyFilter, setUrgencyFilter] = useState(filters.urgency || '');

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (statusFilter) params.set('status', statusFilter);
        if (urgencyFilter) params.set('urgency', urgencyFilter);

        router.get(route('assignments.index'), Object.fromEntries(params));
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setUrgencyFilter('');
        router.get(route('assignments.index'));
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

    const updateStatus = (assignmentId: number, status: string) => {
        router.patch(route('assignments.status', assignmentId), { status });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Assignments - LASU Assignment Tracker" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📚 All Assignments</h1>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">Manage all your Lagos State University assignments in one place</p>
                    </div>
                    <Button asChild>
                        <a href={route('assignments.create')}>➕ Add New Assignment</a>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span>🔍</span>
                            Search & Filter
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div>
                                <Label htmlFor="search">Search assignments</Label>
                                <Input
                                    id="search"
                                    placeholder="Search by title or subject..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                                />
                            </div>
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="not_started">📋 Not Started</option>
                                    <option value="in_progress">🔄 In Progress</option>
                                    <option value="completed">✅ Completed</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="urgency">Urgency</Label>
                                <select
                                    id="urgency"
                                    value={urgencyFilter}
                                    onChange={(e) => setUrgencyFilter(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="">All Urgencies</option>
                                    <option value="overdue">🚨 Overdue</option>
                                    <option value="due_soon">⚡ Due Soon</option>
                                </select>
                            </div>
                            <div className="flex items-end gap-2">
                                <Button onClick={applyFilters} size="sm">
                                    Apply Filters
                                </Button>
                                <Button onClick={clearFilters} variant="outline" size="sm">
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Assignments List */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>
                                {assignments.total} Assignment{assignments.total !== 1 ? 's' : ''} Found
                            </CardTitle>
                            <Button variant="outline" size="sm" onClick={() => router.post(route('assignments.recalculate'))}>
                                🔄 Recalculate Priorities
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {assignments.data.length > 0 ? (
                            <div className="space-y-4">
                                {assignments.data.map((assignment) => (
                                    <div key={assignment.id} className="space-y-4 rounded-lg border p-6 transition-shadow hover:shadow-lg">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{assignment.title}</h3>
                                                {assignment.subject && (
                                                    <p className="mb-2 text-base font-medium text-blue-600 dark:text-blue-400">
                                                        📖 {assignment.subject}
                                                    </p>
                                                )}
                                                <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 md:grid-cols-3 dark:text-gray-300">
                                                    <p>
                                                        📅 Due: {new Date(assignment.due_date).toLocaleDateString()} at{' '}
                                                        {new Date(assignment.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    {assignment.estimated_hours && <p>⏱️ Estimated: {assignment.estimated_hours} hours</p>}
                                                    <p>📊 Priority Score: {assignment.priority_score}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end space-y-3">
                                                <div className="flex items-center space-x-2">
                                                    <Badge className={getUrgencyColor(assignment.urgency_level)}>
                                                        {assignment.urgency_level.replace('_', ' ')}
                                                    </Badge>
                                                    <Badge className={getStatusColor(assignment.status)}>{assignment.status.replace('_', ' ')}</Badge>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div
                                                        className={`h-4 w-4 rounded-full ${getPriorityColor(assignment.priority_level)}`}
                                                        title={`${assignment.priority_level} priority`}
                                                    ></div>
                                                    <span className="text-sm font-medium capitalize">{assignment.priority_level}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t pt-4">
                                            <div className="flex items-center space-x-4">
                                                <select
                                                    value={assignment.status}
                                                    onChange={(e) => updateStatus(assignment.id, e.target.value)}
                                                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:bg-gray-800"
                                                >
                                                    <option value="not_started">📋 Not Started</option>
                                                    <option value="in_progress">🔄 In Progress</option>
                                                    <option value="completed">✅ Completed</option>
                                                </select>
                                                <span className="text-sm font-medium text-gray-500">
                                                    {assignment.is_overdue ? (
                                                        <span className="text-red-600">❌ Overdue!</span>
                                                    ) : (
                                                        <span>⏰ {assignment.days_remaining} days remaining</span>
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={route('assignments.edit', assignment.id)}>Edit</a>
                                                </Button>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <a href={route('assignments.show', assignment.id)}>View Details</a>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <div className="mb-4 text-6xl">🔍</div>
                                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No assignments found</h3>
                                <p className="mb-4 text-gray-500">
                                    {Object.values(filters).some(Boolean)
                                        ? 'Try adjusting your filters or search terms'
                                        : 'Create your first assignment to get started with tracking your deadlines!'}
                                </p>
                                {Object.values(filters).some(Boolean) ? (
                                    <Button onClick={clearFilters}>Clear Filters</Button>
                                ) : (
                                    <Button asChild>
                                        <a href={route('assignments.create')}>📝 Create Your First Assignment</a>
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {assignments.last_page > 1 && (
                            <div className="mt-6 flex items-center justify-between border-t pt-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing {assignments.data.length} of {assignments.total} assignments
                                </p>
                                <div className="flex items-center space-x-2">
                                    {assignments.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(route('assignments.index'), { ...filters, page: assignments.current_page - 1 })}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Page {assignments.current_page} of {assignments.last_page}
                                    </span>
                                    {assignments.current_page < assignments.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(route('assignments.index'), { ...filters, page: assignments.current_page + 1 })}
                                        >
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
