import Login from './modals/Login';
import SignUp from './modals/SignUp';
import {
  Dropdown,
  DropdownButton,
  DropdownLink,
  DropdownMenu,
  DropdownModal,
  Group
} from './dropdown/DropdownMenu';
import {
  ButtonWith,
  HamburgerIcon,
  ProfileImgButton
} from './buttons/ButtonWith';
import { ModalProvider } from '../context/ModalProvider';

function UnauthDropdown() {
  return (
    <ModalProvider>
      <Dropdown>
        <DropdownButton>
          <ButtonWith padding="icon-left">
            <HamburgerIcon />
            <ProfileImgButton className="ml-3" />
          </ButtonWith>
        </DropdownButton>
        <DropdownMenu>
          <Group>
            <DropdownModal text="Login" modal={<Login />} />
            <DropdownModal text="Sing up" modal={<SignUp />} />
          </Group>
          <Group>
            <DropdownLink to={'/airbnb-your-home'}>
              Airbnb your home
            </DropdownLink>
            <DropdownLink to={'/help-center'}>Help Center</DropdownLink>
          </Group>
        </DropdownMenu>
      </Dropdown>
    </ModalProvider>
  );
}

export default UnauthDropdown;
