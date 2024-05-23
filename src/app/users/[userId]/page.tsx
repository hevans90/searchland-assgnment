'use server';
import { getUser } from '@/actions/user';
import { FormContainer } from '@/components/FormContainer/FormContainer';
import { redirect } from 'next/navigation';

const ShowUser = async ({
  params: { userId },
}: {
  params: { userId: string | undefined };
}) => {
  if (!userId) {
    redirect('/users');
  }

  //todo error handling of this
  const existingUser = await getUser(userId);

  if (!existingUser) {
    redirect('/users');
  }

  return (
    <FormContainer>
      <div className="flex flex-col">
        <div className="flex flex-row gap-5">
          <div className="font-bold">Name</div>
          <div>{existingUser.name}</div>
        </div>
        <div className="flex flex-row gap-5">
          <div className="font-bold">Email</div>
          <div>{existingUser.email}</div>
        </div>
        <div className="flex flex-row gap-5">
          <div className="font-bold">Created at</div>
          <div>{existingUser.createdAt.toDateString()}</div>
        </div>
      </div>
    </FormContainer>
  );
};

export default ShowUser;
