'use server';
import { getUser } from '@/actions/user';
import { FormContainer } from '@/components/FormContainer/FormContainer';
import { UserForm } from '@/components/UserForm/UserForm';
import { redirect } from 'next/navigation';

const EditUser = async ({
  params: { userId },
}: {
  params: { userId: string | undefined };
}) => {
  if (!userId) {
    redirect('/users');
  }

  //todo error handling of this
  const existingUser = await getUser(userId);

  return (
    <FormContainer>
      <UserForm initialValues={existingUser} />
    </FormContainer>
  );
};

export default EditUser;
