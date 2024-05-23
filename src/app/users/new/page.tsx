import { FormContainer } from '@/components/FormContainer/FormContainer';
import { UserForm } from '@/components/UserForm/UserForm';
import { FC } from 'react';

type CreateUserProps = {};

const CreateUser: FC<CreateUserProps> = ({}) => {
  return (
    <FormContainer>
      <UserForm />
    </FormContainer>
  );
};

export default CreateUser;
