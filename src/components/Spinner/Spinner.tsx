import { Loader2 } from 'lucide-react';
import { FC } from 'react';

type SpinnerProps = {};

const Spinner: FC<SpinnerProps> = ({}) => {
  return <Loader2 className="animate-spin" />;
};

export { Spinner };
