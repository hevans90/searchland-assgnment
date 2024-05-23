import { getUserByEmail, upsertUser } from '@/actions/user';
import { validateEmail, validateUsername } from '@/lib/validation';
import { insertUserSchema } from '@/schema';
import { NextRequest } from 'next/server';

export const POST = async (req: NextRequest) => {
  const jsonBody = await req.json();

  const { data, success, error } = insertUserSchema
    .omit({ createdAt: true, id: true })
    .safeParse(jsonBody);

  if (!success) {
    return Response.json(
      { message: 'Invalid request body' },
      { headers: { 'Content-Type': 'application/json' }, status: 400 },
    );
  }

  if (!validateEmail(data.email)) {
    return Response.json(
      { message: 'Invalid email format' },
      { headers: { 'Content-Type': 'application/json' }, status: 400 },
    );
  }

  if (!validateUsername(data.name)) {
    return Response.json(
      { message: 'Invalid name format' },
      { headers: { 'Content-Type': 'application/json' }, status: 400 },
    );
  }

  const userByEmail = await getUserByEmail(data.email);

  if (userByEmail) {
    return Response.json(
      { message: 'User with this email already exists' },
      { headers: { 'Content-Type': 'application/json' }, status: 400 },
    );
  }

  try {
    const res = await upsertUser(data);
    return Response.json(res, {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (e) {
    return Response.json(
      { message: 'Failed to create user' },
      { headers: { 'Content-Type': 'application/json' }, status: 500 },
    );
  }
};
