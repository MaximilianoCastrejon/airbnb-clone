import {
  actionColorVariants,
  actionLayoutVariants,
  linkColorVariants,
  linkLayoutVariants,
  linkTextStyleVariants,
  triggerColorVariants,
  triggerLayoutVariants,
  triggerTextStyleVariants
} from '@components/dropdown/styles';
import { LinkProps } from 'react-router-dom';

export type DropdownActionProps = {
  children: React.ReactNode;
  color?: keyof typeof actionColorVariants;
  layout?: keyof typeof actionLayoutVariants;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export type DropdownLinkProps = {
  to: string;
  children: React.ReactNode;
  color?: keyof typeof linkColorVariants;
  layout?: keyof typeof linkLayoutVariants;
  textStyle?: keyof typeof linkTextStyleVariants;
} & LinkProps;

export type DropdownModalProps = {
  text: string;
  color?: keyof typeof triggerColorVariants;
  textStyle?: keyof typeof triggerTextStyleVariants;
  layout?: keyof typeof triggerLayoutVariants;
  modal: React.ReactComponentElement<any>;
  onOpen?: Partial<ModalEffect>;
  onClose?: Partial<ModalEffect>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export type ModalEffect = {
  animation: string;
  effect: (e: React.MouseEvent<HTMLElement>) => void;
};
