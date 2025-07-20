
// src/components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { firebaseSignIn, firebaseSignInWithGoogle, firebaseSendPasswordReset } from '@/lib/firebase';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const resetFormSchema = z.object({
    resetEmail: z.string().email({ message: 'Please enter a valid email address.' }),
});

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const resetForm = useForm<z.infer<typeof resetFormSchema>>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: {
        resetEmail: '',
    }
  });


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await firebaseSignIn(values.email, values.password);
      toast({
        title: 'Login Successful',
        description: "Welcome back! Redirecting you to the dashboard...",
      });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        title: 'Login Failed',
        description: error.message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePasswordReset(values: z.infer<typeof resetFormSchema>) {
    setIsResetting(true);
    try {
        await firebaseSendPasswordReset(values.resetEmail);
        toast({
            title: 'Password Reset Email Sent',
            description: 'Please check your inbox to reset your password.',
        });
        // We can close the dialog here by managing its open state, or rely on user to click cancel/action.
        // For simplicity, we'll let the user close it.
    } catch (error: any) {
         console.error("Password reset failed:", error);
         toast({
            title: 'Password Reset Failed',
            description: error.message || 'Please make sure the email is correct.',
            variant: 'destructive',
        });
    } finally {
        setIsResetting(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    try {
        await firebaseSignInWithGoogle();
        toast({
            title: 'Login Successful',
            description: "Welcome! Redirecting you to the dashboard...",
        });
        router.push('/dashboard');
    } catch (error: any) {
        console.error("Google Sign-In failed:", error);
        toast({
            title: 'Google Sign-In Failed',
            description: error.message || 'Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input placeholder="name@example.com" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                    <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="link" className="ml-auto inline-block px-0 text-sm">Forgot password?</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <Form {...resetForm}>
                                <form onSubmit={resetForm.handleSubmit(handlePasswordReset)}>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Reset Password</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Enter your email address and we will send you a link to reset your password.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="py-4">
                                     <FormField
                                        control={resetForm.control}
                                        name="resetEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="name@example.com" {...field} disabled={isResetting} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isResetting}>Cancel</AlertDialogCancel>
                                    <Button type="submit" disabled={isResetting}>
                                        {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Send Reset Link
                                    </Button>
                                </AlertDialogFooter>
                                </form>
                                </Form>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                <FormControl>
                    <div className="relative">
                        <Input type={showPassword ? "text" : "password"} {...field} disabled={isLoading} className="pr-10" />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-0 h-full px-3 flex items-center justify-center text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
            </Button>
            <Button variant="outline" type="button" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 177.2 56.4l-64.4 64.4c-33.3-30.3-76.2-49.2-124.7-49.2-94.3 0-171.3 76.4-171.3 171.3s77 171.3 171.3 171.3c108.3 0 151.8-83.3 155.8-123.3H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>}
            Sign in with Google
            </Button>
        </form>
        </Form>
    </>
  );
}
