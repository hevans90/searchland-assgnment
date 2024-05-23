import { usePathname, useRouter } from 'next/navigation';

export const useRelativeNavigate = () => {
  const router = useRouter();
  const path = usePathname();

  return (newPath: string) => router.push(path + newPath);
};
