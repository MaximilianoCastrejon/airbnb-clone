import { useNavigate } from 'react-router-dom';

function AccountOptionCard({
  path,
  name,
  description,
  page
}: {
  path: string;
  page: string;
  name: string;
  description: string;
}) {
  const navigate = useNavigate();
  return (
    <>
      <div
        onClick={() => {
          navigate(page);
        }}
        className="cursor-pointer m-3 p-4 flex flex-row flex-wrap w-full min-h-[172px] rounded-lg shadow-lg max-w-[300px]"
      >
        <div className="w-full flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="32px"
            width="32px"
            display="block"
            fill="currentcolor"
            viewBox="0 0 32 32"
          >
            <path d={path} />
          </svg>
        </div>
        <div className="flex flex-col items-start justify-end">
          <p className="font-medium">{name}</p>
          <p className="font-thin text-sm">{description}</p>
        </div>
      </div>
    </>
  );
}

export default AccountOptionCard;
