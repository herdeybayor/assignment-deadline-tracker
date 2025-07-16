// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'));
    };

    return (
        <AuthLayout title="Confirm your password" description="This is a secure area. Please confirm your password before continuing.">
            <Head title="Confirm Password - LASU Assignment Tracker" />

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                For your security, please confirm your password to access this feature of your LASU Assignment Tracker account.
            </div>

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="current-password"
                        autoFocus
                        required
                        disabled={processing}
                        placeholder="Enter your current password"
                    />
                    <InputError message={errors.password} />
                </div>

                <Button type="submit" disabled={processing}>
                    {processing && <LoaderCircle className="animate-spin" />}
                    Confirm password
                </Button>
            </form>

            <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                <p>🎓 LASU Assignment Deadline Tracker</p>
                <p>Keeping your account secure while you manage your assignments</p>
            </div>
        </AuthLayout>
    );
}
