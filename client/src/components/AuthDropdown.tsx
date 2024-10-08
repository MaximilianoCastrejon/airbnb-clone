import { useAuth } from '../context/AuthProvider.tsx';
import {
  ButtonWith,
  HamburgerIcon,
  ProfileImgButton
} from './buttons/ButtonWith.tsx';
import {
  Dropdown,
  DropdownAction,
  DropdownButton,
  DropdownLink,
  DropdownMenu,
  Group
} from './dropdown/DropdownMenu.tsx';

function AuthDropdown() {
  const { logout, userContext } = useAuth();

  return (
    <Dropdown>
      <DropdownButton>
        <ButtonWith padding="icon-left">
          <HamburgerIcon />
          <ProfileImgButton className="ml-3" />
        </ButtonWith>
      </DropdownButton>{' '}
      <DropdownMenu>
        <Group>
          <DropdownLink to={'/messages'}>Messages</DropdownLink>
          <DropdownLink to={'/notifications'}>Notifications</DropdownLink>
          <DropdownLink to={'/trips'}>Trips</DropdownLink>
          <DropdownLink to={'/wishlist'}>Wishlists</DropdownLink>
        </Group>
        <Group>
          {userContext && userContext.listings && (
            <DropdownLink to={'/hosting'}>Manage listings</DropdownLink>
          )}
          {userContext && !userContext.listings && (
            <DropdownLink to={'/host/homes'}>Airbnb your home</DropdownLink>
          )}
        </Group>
        <Group>
          <DropdownLink to={'/refer'}>Refer a Host</DropdownLink>
          <DropdownLink to={'/account'}>Account</DropdownLink>
          <DropdownLink to={'/gift-card'}>Gift cards</DropdownLink>
          <DropdownLink to={'/help-center'}>Help Center</DropdownLink>
        </Group>
        <Group>
          <DropdownAction onClick={logout}>Log out</DropdownAction>
        </Group>
      </DropdownMenu>
    </Dropdown>
  );
}

export default AuthDropdown;
