'use server';
import {
  GetUsersSettings,
  getUserCount,
  getUsers,
  isSortByKey,
} from '@/actions/user';
import { UserTable } from '@/components/UserTable/UserTable';
import { USER_PAGINATION_LIMIT } from '@/lib/constants';
import { redirect } from 'next/navigation';

const ascOptions = ['asc', 'desc'];

const Users = async ({
  searchParams: { page, sortBy, asc },
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const ascValue = (asc && ascOptions.includes(asc) ? asc : 'asc') as
    | 'asc'
    | 'desc';

  const settings: GetUsersSettings = {
    page: page ? parseInt(page) : 1,
    sortBy: {
      key: isSortByKey(sortBy) ? sortBy : 'name',
      asc: ascValue,
    },
  };

  const users = await getUsers(settings);
  const userCount = await getUserCount();

  if (settings.page > userCount / USER_PAGINATION_LIMIT + 1) redirect('/users');

  return <UserTable settings={settings} users={users} userCount={userCount} />;
};

export default Users;
