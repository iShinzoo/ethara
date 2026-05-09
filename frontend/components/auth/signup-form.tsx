'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useSignup } from '@/hooks/queries/useAuth';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const { setUser, setToken } = useAuth();
  const signupMutation = useSignup();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await signupMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setUser(response.user);
      setToken(response.token);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <Card className="border border-slate-700 bg-slate-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-white">Create Account</CardTitle>
        <CardDescription className="text-slate-400">
          Enter your details to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-slate-200">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-400">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-200">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-400">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-200">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-400">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-200">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              {...form.register('confirmPassword')}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-400">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
