import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Welcome back, LASU student!" description="Log in to track your assignments and never miss another deadline">
            <Head title="Log in - Assignment Deadline Tracker" />

            {status && <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">{status}</div>}

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Student Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="username"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="your.email@student.lasu.edu.ng"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            {canResetPassword && (
                                <TextLink className="text-sm underline" href={route('password.request')} tabIndex={4}>
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Enter your password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', checked as boolean)}
                            tabIndex={3}
                            disabled={processing}
                        />
                        <Label
                            htmlFor="remember"
                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Remember me on this device
                        </Label>
                    </div>
                </div>

                <Button type="submit" disabled={processing} tabIndex={5}>
                    {processing && <LoaderCircle className="animate-spin" />}
                    Sign in to your account
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">New to LASU Assignment Tracker? </span>
                <TextLink href={route('register')} className="underline">
                    Create your account
                </TextLink>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                <p>🎓 Built specifically for Lagos State University students</p>
                <p>Stay on top of your assignments, projects, and deadlines</p>
            </div>
        </AuthLayout>
    );
}
