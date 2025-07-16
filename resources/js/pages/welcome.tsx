import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Assignment Deadline Tracker">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-gray-800 lg:justify-center lg:p-8 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100">
                <header className="mb-8 w-full max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-lg border border-blue-200 bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:border-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-lg border border-transparent px-6 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-lg border border-blue-200 bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:border-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <div className="flex w-full max-w-6xl items-center justify-center">
                    <main className="text-center">
                        <div className="mb-8">
                            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                                <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                    />
                                </svg>
                            </div>
                            <h1 className="mb-4 text-4xl font-bold text-gray-900 lg:text-6xl dark:text-white">Assignment Deadline Tracker</h1>
                            <p className="mb-8 text-lg text-gray-600 lg:text-xl dark:text-gray-300">
                                Never miss a deadline again. Organize, prioritize, and track all your assignments in one place.
                            </p>
                        </div>

                        <div className="mb-12 grid gap-8 md:grid-cols-3">
                            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-green-100 p-3 dark:bg-green-900">
                                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Smart Prioritization</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Automatic priority calculation based on due dates and estimated time needed.
                                </p>
                            </div>

                            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-4h5v4z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7H4l5-5 5 5H9v4H4V7z" />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Progress Tracking</h3>
                                <p className="text-gray-600 dark:text-gray-300">Visual progress bars and status tracking for all your assignments.</p>
                            </div>

                            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                                    <svg
                                        className="h-6 w-6 text-purple-600 dark:text-purple-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-4h5v4z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7H4l5-5 5 5H9v4H4V7z" />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Smart Reminders</h3>
                                <p className="text-gray-600 dark:text-gray-300">Email notifications and reminders at customizable intervals.</p>
                            </div>
                        </div>

                        {!auth.user && (
                            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-lg font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                                >
                                    Start Tracking Now
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-lg border border-gray-300 px-8 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    Already have an account?
                                </Link>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}
