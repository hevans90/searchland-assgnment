import { InsertUser, SelectUser } from '@/schema';

const createUserRequest = async (user: InsertUser) => {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    return new Error((await res.json()).message);
  }

  return (await res.json()) as SelectUser;
};

const editUserRequest = async (user: InsertUser, id: string) => {
  const res = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    return new Error((await res.json()).message);
  }

  return (await res.json()) as SelectUser;
};

const deleteUserRequest = async (id: string) => {
  const res = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    return new Error((await res.json()).message);
  }

  return;
};

export { createUserRequest, deleteUserRequest, editUserRequest };
