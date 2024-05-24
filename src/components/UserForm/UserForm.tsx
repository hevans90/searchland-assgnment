'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useNavigateUp } from '@/hooks/useNavigateUp';
import { createUserRequest, editUserRequest } from '@/lib/queries';
import { validateEmail, validateUsername } from '@/lib/validation';
import { insertUserSchema } from '@/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type UserFormProps = {
  initialValues?: z.infer<typeof insertUserSchema>;
};

const formSchema = insertUserSchema.omit({ createdAt: true, id: true });
type UserFormValidation = z.infer<typeof formSchema>;

const UserForm: FC<UserFormProps> = ({ initialValues }) => {
  const { toast } = useToast();
  const navigateUp = useNavigateUp();
  const router = useRouter();

  const form = useForm<UserFormValidation>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      email: initialValues?.email ?? '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const errors = {} as Record<'name' | 'email', string>;
    if (!validateEmail(values.email)) {
      errors['email'] = 'Invalid email format';
    }
    if (!validateUsername(values.name)) {
      errors['name'] = 'Invalid name format';
    }

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([key, value]) => {
        form.setError(key as 'name' | 'email', { message: value });
      });
      return;
    }

    const res =
      initialValues && initialValues.id
        ? await editUserRequest(values, initialValues.id)
        : await createUserRequest(values);

    //if error print otherwise redirect
    if (res instanceof Error) {
      toast({
        title: 'Failed',
        description:
          (initialValues && initialValues.id
            ? 'Failed to edit user: '
            : 'Failed to create user: ') + res.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title:
          initialValues && initialValues.id ? 'User edited' : 'User created',
        description:
          initialValues && initialValues.id
            ? `User ${res.name} was edited successfully`
            : `User ${res.name} was created successfully`,
      });
      setTimeout(() => {
        if (!(initialValues && initialValues.id)) navigateUp();
        else router.push('/users');
        router.refresh();
      }, 500);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={form.formState.isSubmitting} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export { UserForm };
