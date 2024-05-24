'use client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRelativeNavigate } from '@/hooks/useNavigate';
import { SelectUser } from '@/schema';
import { ArrowUpDown, Pencil, Plus, Trash } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { GetUsersSettings } from '@/actions/user';
import { USER_PAGINATION_LIMIT } from '@/lib/constants';
import { deleteUserRequest } from '@/lib/queries';
import { FC, useCallback, useState } from 'react';
import { Spinner } from '../Spinner/Spinner';
import { Button } from '../ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '../ui/pagination';
import { useToast } from '../ui/use-toast';

type UserTableProps = {
  users: SelectUser[];
  settings: GetUsersSettings;
  userCount: number;
};

const UserTable: FC<UserTableProps> = ({ users, settings, userCount }) => {
  const path = usePathname();
  const navigate = useRelativeNavigate();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (page: number, sortyBy: string, asc: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      params.set('sortBy', sortyBy);
      params.set('asc', asc);

      return params.toString();
    },
    [searchParams],
  );

  const handleSort = useCallback(
    (sortBy: string) => {
      router.replace(
        pathname +
          '?' +
          createQueryString(
            settings.page,
            sortBy,
            settings.sortBy.asc === 'asc' ? 'desc' : 'asc',
          ),
      );
    },
    [createQueryString, pathname, router, settings.page, settings.sortBy.asc],
  );

  const getQueryString = useCallback(
    (page: number) => {
      return (
        pathname +
        '?' +
        createQueryString(page, settings.sortBy.key, settings.sortBy.asc)
      );
    },
    [createQueryString, pathname, settings.sortBy.key, settings.sortBy.asc],
  );

  const { toast } = useToast();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = useCallback(
    async (id: string) => {
      setDeletingId(id);
      const res = await deleteUserRequest(id);

      if (res instanceof Error) {
        toast({
          title: 'Failed',
          description: 'Failed to delete user: ' + res.message,
          variant: 'destructive',
        });
        setDeletingId(null);
      } else {
        toast({
          title: 'User delete',
          description: `User was deleted successfully`,
        });
        router.refresh();
      }
    },
    [router, toast],
  );

  const totalPageCount = Math.ceil(userCount / USER_PAGINATION_LIMIT);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <Button
                className="p-0"
                variant="ghost"
                onClick={() => {
                  handleSort('id');
                }}
              >
                Id
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                className="p-0"
                variant="ghost"
                onClick={() => {
                  handleSort('name');
                }}
              >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                className="p-0"
                variant="ghost"
                onClick={() => {
                  handleSort('email');
                }}
              >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="cursor-pointer"
              onClick={() => {
                navigate(`/${user.id}`);
              }}
            >
              <TableCell className="font-medium truncate">{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="p-0">
                <Button
                  onClick={(e) => {
                    router.push(`${path}/${user.id}/edit`);
                    e.stopPropagation();
                  }}
                >
                  <Pencil />
                </Button>
              </TableCell>
              <TableCell className="p-0">
                {' '}
                {user.id === deletingId ? (
                  <Spinner />
                ) : (
                  <Button
                    onClick={(e) => {
                      handleDelete(user.id);
                      e.stopPropagation();
                    }}
                  >
                    <Trash />
                  </Button>
                )}{' '}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption className=" w-full">
          <div className="flex items-center">
            <Pagination>
              <PaginationContent className="cursor-pointer">
                {settings.page > 1 && (
                  <PaginationItem>
                    <PaginationLink href={getQueryString(settings.page - 1)}>
                      {settings.page - 1}
                    </PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink isActive>{settings.page}</PaginationLink>
                </PaginationItem>
                {settings.page < totalPageCount && (
                  <PaginationItem>
                    <PaginationLink
                      className="cursor-pointer"
                      href={getQueryString(settings.page + 1)}
                    >
                      {settings.page + 1}
                    </PaginationLink>
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
            <Button
              className="flex gap-4"
              onClick={() => {
                navigate('/new');
              }}
            >
              New user
              <Plus />
            </Button>
          </div>
        </TableCaption>
      </Table>
    </div>
  );
};

export { UserTable };
