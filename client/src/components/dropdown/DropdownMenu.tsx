import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useClickOutside from '../../hooks/useClickOutside.js';
import {
  DropdownContext,
  DropdownContextType,
  useDropdown
} from '../../context/DropdownProvider.js';
import {
  DropdownActionProps,
  DropdownLinkProps,
  DropdownModalProps
} from '../../interfaces/dropdown.interfaces.js';
import {
  actionColorVariants,
  actionLayoutVariants,
  linkColorVariants,
  linkLayoutVariants,
  linkTextStyleVariants,
  triggerColorVariants,
  triggerLayoutVariants,
  triggerTextStyleVariants
} from './styles.js';
import { useModal } from '../../context/ModalProvider.js';

const Dropdown = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
  } & React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const switchDropdown = (open: boolean) => {
    setIsOpen(open);
  };

  const value: DropdownContextType = [isOpen, switchDropdown];
  return (
    <div className="relative self-center" ref={dropdownRef} {...props}>
      <DropdownContext.Provider value={value}>
        <div ref={ref}>{children}</div>
      </DropdownContext.Provider>
    </div>
  );
});

const DropdownButton = forwardRef<
  HTMLButtonElement,
  {
    children: React.ReactNode;
    onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  } & React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, onKeyDown, ...props }, ref) => {
  const [isOpen, switchDropdown] = useDropdown();
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      switchDropdown(!isOpen);
    } else if (e.key === 'Escape') {
      switchDropdown(false);
    }
    if (onKeyDown) onKeyDown(e);
  };
  return (
    <button
      onClick={(e) => {
        switchDropdown(!isOpen);
        if (onClick) onClick(e);
      }}
      onKeyDown={handleKeyDown}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

const DropdownMenu = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    className?: string;
  } & React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const [isOpen] = useDropdown();
  const baseStyle =
    'bg-white rounded-lg py-2 text-sm shadow w-44 absolute mt-1 right-0';
  const style = `${baseStyle} ${className} `;
  return (
    <>
      {isOpen && (
        <div className={`z-50 menu-shadow ${style}`} ref={ref} {...props}>
          {children}
        </div>
      )}
    </>
  );
});
function Group({
  title,
  children
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    // ChatGPT reference class
    <div className="dropdown-group">
      {title && <div className="dropdown-group-title">{title}</div>}
      <div className="py-2 text-gray-700">{children}</div>
      <div className="border-b border-gray-200 w-full"></div>
    </div>
  );
}

function DropdownLink({
  color,
  layout,
  textStyle,
  children,
  ...props
}: DropdownLinkProps) {
  const [isOpen, switchDropdown] = useDropdown();

  const baseVariant = 'block w-full text-left font-semibold';
  const colorVariant = color
    ? linkColorVariants[color]
    : linkColorVariants['default'];
  const layoutVariant = layout
    ? linkLayoutVariants[layout]
    : linkLayoutVariants['default'];
  const textStyleVariant = textStyle
    ? linkTextStyleVariants[textStyle]
    : linkTextStyleVariants['default'];

  const combinedVariants = `${baseVariant} ${colorVariant} ${layoutVariant} ${textStyleVariant}`;
  return (
    <Link className={combinedVariants} {...props}>
      <div onClick={() => switchDropdown(!isOpen)}>{children}</div>
    </Link>
  );
}

function DropdownModal({
  text,
  color,
  layout,
  textStyle,
  modal,
  onClose,
  onOpen,
  onClick,
  ...props
}: DropdownModalProps) {
  const [, setIsDropdownOpen] = useDropdown();
  const { setModal, openEffect, closeEffect } = useModal();
  useEffect(() => {
    openEffect({
      animation: onOpen?.animation ?? '',
      effect: onOpen?.effect ?? (() => {})
    });
    closeEffect({
      animation: onOpen?.animation ?? '',
      effect: onOpen?.effect ?? (() => {})
    });
  }, []);
  // Styling
  const baseVariant = 'block w-full text-left font-semibold';
  const colorVariant = color
    ? triggerColorVariants[color]
    : triggerColorVariants['default'];
  const layoutVariant = layout
    ? triggerLayoutVariants[layout]
    : triggerLayoutVariants['default'];
  const textStyleVariant = textStyle
    ? triggerTextStyleVariants[textStyle]
    : triggerTextStyleVariants['default'];

  const combinedVariants = `${baseVariant} ${colorVariant} ${layoutVariant} ${textStyleVariant}`;

  return (
    <button
      onClick={(e) => {
        setModal(modal);
        setIsDropdownOpen(false);
        if (onClick) onClick(e);
      }}
      className={combinedVariants}
      aria-haspopup="dialog"
      {...props}
    >
      {text}
    </button>
  );
}

//function DropdownSubMenu() {}

const DropdownAction = forwardRef<HTMLButtonElement, DropdownActionProps>(
  ({ children, color, layout, ...props }, ref) => {
    const baseVariant = 'block w-full text-left font-semibold';
    const colorVariant = color
      ? actionColorVariants[color]
      : actionColorVariants['default'];
    const layoutVariant = layout
      ? actionLayoutVariants[layout]
      : actionLayoutVariants['default'];

    const combinedVariants = `${baseVariant} ${colorVariant} ${layoutVariant}`;
    return (
      <button {...props} className={combinedVariants} ref={ref}>
        {children}
      </button>
    );
  }
);

export {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  Group,
  DropdownLink,
  DropdownModal,
  DropdownAction
};
