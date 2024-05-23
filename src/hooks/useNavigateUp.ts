import { usePathname, useRouter } from 'next/navigation';

//not sure why you can't navigate upwards like react router in nextjs
export const useNavigateUp = () => {
  const router = useRouter();
  const path = usePathname();

  return (count: number = 1) => {
    let splitPath = path.split('/');
    splitPath.splice(splitPath.length - count, count);
    console.log(splitPath);
    router.push(splitPath.join('/'));
  };
};
