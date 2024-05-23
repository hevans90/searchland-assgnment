import { db } from '@/db';
import { USER_PAGINATION_LIMIT } from '@/lib/constants';
import { user } from '@/schema';
import { asc, count, desc, eq } from 'drizzle-orm';

export const deleteUser = async (id: string) =>
  db.delete(user).where(eq(user.id, id));

export const addUser = async (newUser: typeof user.$inferInsert) =>
  db.insert(user).values({
    ...newUser,
  });

export const editUser = async (newUser: typeof user.$inferSelect) =>
  db
    .update(user)
    .set({
      ...newUser,
    })
    .where(eq(user.id, newUser.id))
    .returning();

export const getUserByEmail = async (email: string) =>
  db.query.user.findFirst({
    where(fields) {
      return eq(fields.email, email);
    },
  });

export const getUser = async (id: string) =>
  db.query.user.findFirst({
    where(fields) {
      return eq(fields.id, id);
    },
  });

export const getUserByName = async (name: string) =>
  db.query.user.findFirst({
    where(fields) {
      return eq(fields.name, name);
    },
  });

export const upsertUser = async (newUser: typeof user.$inferInsert) =>
  db
    .insert(user)
    .values({
      ...newUser,
    })
    .onConflictDoUpdate({
      target: user.id,
      set: newUser,
    })
    .returning();

export const userSortableCols = ['name', 'email', 'id'] as const;
export type UserSortKeyByType = (typeof userSortableCols)[number];
export const isSortByKey = (
  sortByMaybe: unknown,
): sortByMaybe is UserSortKeyByType => {
  return (
    typeof sortByMaybe === 'string' &&
    userSortableCols.includes(sortByMaybe as UserSortKeyByType)
  );
};

export type GetUsersSettings = {
  page: number;
  sortBy: {
    key: UserSortKeyByType;
    asc: 'asc' | 'desc';
  };
};

export const getUsers = async ({
  page = 1,
  sortBy: { key: sortBy = 'name', asc: ascString = 'asc' },
}: GetUsersSettings) => {
  const ascFunc = ascString === 'asc' ? asc : desc;

  return db
    .select()
    .from(user)
    .orderBy(ascFunc(user[sortBy]))
    .limit(USER_PAGINATION_LIMIT)
    .offset((page - 1) * USER_PAGINATION_LIMIT);
};

export const getUserCount = async () =>
  (await db.select({ count: count() }).from(user))[0].count;
