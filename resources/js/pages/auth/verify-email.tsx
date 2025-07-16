// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

interface VerifyEmailProps {
    status?: string;
}

export default function VerifyEmail({ status }: VerifyEmailProps) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <AuthLayout
            title="Verify your email address"
            description="We've sent a verification link to your email. Please check your inbox and click the link to continue."
        >
            <Head title="Email Verification - LASU Assignment Tracker" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                    A new verification link has been sent to your email address.
                </div>
            )}

            <div className="space-y-4 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Before you can start tracking your assignments, please verify your email address.</p>
                    <p className="mt-2">Check your inbox for a verification email from LASU Assignment Tracker.</p>
                </div>

                <form onSubmit={submit}>
                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="animate-spin" />}
                        Resend verification email
                    </Button>
                </form>

                <div className="text-sm">
                    <TextLink href={route('logout')} method="post" as="button" className="underline">
                        Log out
                    </TextLink>
                </div>

                <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
                    <p>🎓 LASU Assignment Deadline Tracker</p>
                    <p>Once verified, you'll be ready to organize your academic life!</p>
                </div>
            </div>
        </AuthLayout>
    );
}
