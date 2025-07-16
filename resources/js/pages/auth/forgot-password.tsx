// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout title="Reset your password" description="Enter your email address and we'll send you a password reset link">
            <Head title="Forgot Password - LASU Assignment Tracker" />

            {status && <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">{status}</div>}

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-2">
                    <Label htmlFor="email">Student Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        autoFocus
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        disabled={processing}
                        placeholder="your.email@student.lasu.edu.ng"
                    />
                    <InputError message={errors.email} />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Enter the email address associated with your LASU Assignment Tracker account
                    </p>
                </div>

                <Button type="submit" disabled={processing}>
                    {processing && <LoaderCircle className="animate-spin" />}
                    Send password reset link
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Remember your password? </span>
                <TextLink href={route('login')} className="underline">
                    Back to login
                </TextLink>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                <p>🎓 LASU Assignment Deadline Tracker</p>
                <p>We'll help you get back to tracking your assignments</p>
            </div>
        </AuthLayout>
    );
}
