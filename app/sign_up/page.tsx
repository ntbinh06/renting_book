'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const FormSchema = z
  .object({
    name: z.string().min(1, 'Username is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z.string().min(4, 'Password must have more than 4 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'], 
    message: 'Confirm Password does not match Password',
  })


const SignUpForm = () => {
    const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const response = await fetch('/api/register',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
        })
    })
    if (response.ok) {
        router.push('/sign_in')
    }else{
        console.error('Registration failed');
        
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      <div>
        <label>Username</label>
        <input
          {...register('name')}
          className="w-full border px-2 py-1"
          placeholder="Enter your username"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label>Email</label>
        <input
          {...register('email')}
          className="w-full border px-2 py-1"
          placeholder="mail@example.com"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          {...register('password')}
          className="w-full border px-2 py-1"
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div>
        <label>Confirm Password</label>
        <input
          type="password"
          {...register('confirmPassword')}
          className="w-full border px-2 py-1"
          placeholder="Re-enter your password"
        />
        {errors.confirmPassword && (
          <p className="text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>



      <button type="submit" className="w-full bg-blue-500 text-white py-2">
        Sign up
      </button>

      <div className="mx-auto my-4 flex items-center justify-evenly text-gray-400">
        <hr className="flex-grow border-t" />
        <span className="mx-2">or</span>
        <hr className="flex-grow border-t" />
      </div>

      <p className="text-center text-sm text-gray-600">
        If you already have an account, please&nbsp;
        <Link className="text-blue-500 hover:underline" href="/sign_in">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default SignUpForm;
