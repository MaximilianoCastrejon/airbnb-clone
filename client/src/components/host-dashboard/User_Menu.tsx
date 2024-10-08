import {
  ButtonWith,
  ProfileImgButton
} from '../../components/buttons/ButtonWith';
import {
  Dropdown,
  DropdownAction,
  DropdownButton,
  DropdownLink,
  DropdownMenu,
  Group
} from '../../components/dropdown/DropdownMenu';
import { useAuth } from '../../context/AuthProvider';

function User_Menu() {
  const { logout } = useAuth();
  return (
    <Dropdown>
      <DropdownButton>
        <ButtonWith>
          <ProfileImgButton />
        </ButtonWith>
      </DropdownButton>
      <DropdownMenu className="w-64">
        <Group>
          <DropdownLink to={'/user/show'}>Profile</DropdownLink>
          <DropdownLink to={'/account-settings'}>Account</DropdownLink>
          <DropdownLink to={'/help/hosting'}>
            Visit the Help Center
          </DropdownLink>
          <DropdownLink to={'/help/contact-us?role=host'}>
            Get help with safety issue
          </DropdownLink>
          <DropdownLink to={'/giftcards'}>Gift cards</DropdownLink>
        </Group>
        <Group>
          <DropdownLink to={'/account-settings/preferences/language'}>
            Language and translation
          </DropdownLink>
          <DropdownLink to={'/account-settings/preferences/currency'}>
            $ MXN
          </DropdownLink>
        </Group>
        <Group>
          <DropdownLink to={'/refer'}>
            <div className="flex flex-col">
              Refer a Host
              <span className="text-xs font-normal text-neutral-500">
                Earn $1,701 MXN for each host you refer.
              </span>
            </div>
          </DropdownLink>
          <DropdownLink to={'/'}>Switch to traveling</DropdownLink>
          <DropdownAction onClick={logout}>Log out</DropdownAction>
        </Group>
      </DropdownMenu>
    </Dropdown>
  );
}

export default User_Menu;
