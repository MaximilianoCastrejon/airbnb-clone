import { useAuth } from '../../context/AuthProvider';
import paths from '../../assets/svg_paths';
import useUserPFP from '../../hooks/userUserPFP';
// justify-center w-10 h-10 p-[3px] ml-4 mr-6
export const buttonPaddingVariants = {
  'icon-left': 'py-1 md:pl-2.5 sm:pl-2.5 pr-1 lg:pl-3',
  'icon-right': 'py-1 md:pr-2.5 sm:pr-2.5 pl-1 lg:pr-3',
  default: 'p-1'
} as const;
function ButtonWith({
  children,
  padding,
  ...props
}: {
  children: React.ReactNode;
  padding?: keyof typeof buttonPaddingVariants;
} & React.HTMLAttributes<HTMLElement>) {
  const baseVariant = 'flex items-center border border-gray-300 rounded-full';

  const paddingVariant = padding
    ? buttonPaddingVariants[padding]
    : buttonPaddingVariants['default'];
  const combinedVariants = `${baseVariant} ${paddingVariant}`;
  return (
    <div className={`${combinedVariants}`} {...props}>
      {children}
    </div>
  );
}

export const profileImgSizeVariants = {
  default: 'lg:h-8 md:h-6 sm:h-5'
} as const;
function ProfileImgButton({
  size,
  ...props
}: {
  size?: keyof typeof profileImgSizeVariants;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { userContext } = useAuth();
  const [profileImageURL] = useUserPFP(userContext?.id || '');
  const sizeVariant = size
    ? profileImgSizeVariants[size]
    : profileImgSizeVariants['default'];
  const combinedVariants = `${sizeVariant}`;

  return (
    <div {...props}>
      {profileImageURL ? (
        <img
          src={profileImageURL}
          className={`${combinedVariants} rounded-full`}
        />
      ) : (
        <div className="bg-gray-500 text-white rounded-full border-2 border-gray-500 overflow-hidden flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            className={`mx-auto ${combinedVariants}`}
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 512 512"
          >
            <path d={`${paths.USER_ICON}`} transform="translate(32, 25)" />
          </svg>
        </div>
      )}
    </div>
  );
}

export const hamIconSizeVariants = {
  default: 'lg:h-4 md:h-4 sm:h-3'
} as const;
function HamburgerIcon({
  size,
  ...props
}: {
  size?: keyof typeof profileImgSizeVariants;
} & React.HTMLAttributes<HTMLOrSVGElement>) {
  const sizeVariant = size
    ? hamIconSizeVariants[size]
    : hamIconSizeVariants['default'];
  const combinedVariants = `${sizeVariant}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      className={`${combinedVariants}`}
      {...props}
    >
      <path d={`${paths.HAMBURGER_ICON}`} />
    </svg>
  );
}

export { ButtonWith, ProfileImgButton, HamburgerIcon };
