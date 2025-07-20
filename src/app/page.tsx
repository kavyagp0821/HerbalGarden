// src/app/page.tsx
'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Leaf } from 'lucide-react';

export default function AuthenticationPage() {
  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="hidden bg-muted lg:flex items-center justify-center relative">
        <Image
          src="https://images.unsplash.com/photo-1491841550275-5b462bf48545?q=80&w=1800"
          alt="Lush herbal garden"
          fill
          className="object-cover"
          data-ai-hint="lush herbal garden"
          priority
        />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative z-10 flex flex-col items-center text-white text-center p-8">
          <Leaf className="w-16 h-16 mb-4 text-primary-foreground" />
          <h1 className="text-5xl font-bold font-headline">Virtual Vana</h1>
          <p className="mt-4 text-lg max-w-md text-primary-foreground/90">
            Explore the ancient wisdom of AYUSH medicinal plants through an immersive, interactive experience.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-[380px] gap-6">
          <Tabs defaultValue="sign-in" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sign-in">Sign In</TabsTrigger>
              <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="sign-in">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Welcome Back</CardTitle>
                  <CardDescription>
                    Enter your email below to login to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LoginForm />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="sign-up">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Create an Account</CardTitle>
                  <CardDescription>
                    Enter your details to start your journey with Virtual Vana.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RegisterForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
