'use client'
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSession, signIn } from "next-auth/react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const FormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(4, 'Password must have more than 4 characters'),
})

const SignInForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

const onSubmit = async (values: z.infer<typeof FormSchema>) => {
  
  setErrorMessage('');

  const res = await signIn("credentials", {
    email: values.email,
    password: values.password,
    redirect: false,
  });

if (res?.ok) {
    const session = await getSession();
    const role = session?.user?.role;

    if (role === "admin") {
      router.push("/app/admin/home");
    } else {
      router.push("/home");
    }
  } else {
    setErrorMessage("Sai email hoặc mật khẩu");
  }
};

  const handleGoogleLogin = async () => {
    await signIn('google', { callbackUrl: `${window.location.origin}/home` });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <input placeholder="mail@example.com" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2 text-center">{errorMessage}</p>
      )}


        <Button className="w-full" type="submit">
          Sign in
        </Button>
      </form>

      <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
        or
      </div>
      <Button onClick={handleGoogleLogin} className="w-full bg-red-500 hover:bg-red-600">
        Sign in with Google
      </Button>
      <p className="text-center text-sm text-gray-600 mt-2">
        If you don&apos;t have an account, please{' '}
        <Link className="text-blue-500 hover:underline" href="/sign_up">
          Sign up
        </Link>
      </p>
    </Form>
  )
}

export default SignInForm;
