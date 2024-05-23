import { deleteUser, upsertUser } from '@/actions/user';
import { validateEmail, validateUsername } from '@/lib/validation';
import { insertUserSchema } from '@/schema';
import { NextRequest } from 'next/server';

export const DELETE = async (
  req: NextRequest,
  { params: { userId } }: { params: { userId: string } },
) => {
  try {
    const res = await deleteUser(userId);
    return Response.json(
      {},
      { headers: { 'Content-Type': 'application/json' }, status: 200 },
    );
  } catch (e) {
    console.error(e);
    return Response.json(
      { message: 'Failed to delete user' },
      { headers: { 'Content-Type': 'application/json' }, status: 500 },
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params: { userId } }: { params: { userId: string } },
) => {
  const jsonBody = await req.json();

  const { data, success, error } = insertUserSchema
    .omit({ createdAt: true })
    .safeParse({ ...jsonBody, id: userId });

  if (!success) {
    return Response.json(
      { message: 'Invalid request body' },
      { headers: { 'Content-Type': 'application/json' }, status: 400 },
    );
  }

  if (validateEmail(data.email) === false) {
    return Response.json(
      { message: 'Invalid email format' },
      { headers: { 'Content-Type': 'application/json' }, status: 400 },
    );
  }

  if (validateUsername(data.name) === false) {
    return Response.json(
      { message: 'Invalid name format' },
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
    console.error(e);
    return Response.json(
      { message: 'Failed to edit user' },
      { headers: { 'Content-Type': 'application/json' }, status: 500 },
    );
  }
};
