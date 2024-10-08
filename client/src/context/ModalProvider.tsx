import { createContext, useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ModalEffect } from '../interfaces/dropdown.interfaces';
import useEscapeKey from '../hooks/useEscapeKey';

// export type ModalContextType = [boolean, (open: boolean) => void];
// const ModalContext = createContext<ModalContextType | null>(null);
type ModalContextType = {
  setModal: (content: React.ReactNode | null) => void;
  openEffect: (params: ModalEffect) => void;
  closeEffect: (params: ModalEffect) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: React.ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(
    null
  );
  const [open, setOpen] = useState<ModalEffect | null>(null);
  const [close, setClose] = useState<ModalEffect | null>(null);

  // Animation
  const [isClosing, setIsClosing] = useState(false);
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  const modalContainerRef = useRef<HTMLDivElement | null>(null);
  useEscapeKey(backgroundRef, () => setModal(null));

  const openEffect = ({ animation, effect }: ModalEffect) => {
    setOpen({ animation: animation || 'open', effect: effect });
  };
  const closeEffect = ({ animation, effect }: ModalEffect) => {
    setClose({ animation: animation || 'close', effect: effect });
  };

  // Render & Animation logic
  const setModal = (content: React.ReactNode | null) => {
    if (content) return setModalContent(content);

    const handleAnimationEnd = (element: HTMLElement) =>
      new Promise<void>((resolve) => {
        setIsClosing(true);
        element.addEventListener('animationend', () => resolve(), {
          once: true
        });
      });

    if (modalContainerRef.current && backgroundRef.current) {
      Promise.all([
        handleAnimationEnd(backgroundRef.current),
        handleAnimationEnd(modalContainerRef.current)
      ]).then(() => {
        setModalContent(null);
        setIsClosing(false);
      });
    }
  };
  return (
    <ModalContext.Provider value={{ setModal, openEffect, closeEffect }}>
      {children}
      {/* TODO: Set up a prop to choose the type of Modal that will determine the modal's position,  */}
      {modalContent &&
        createPortal(
          <div
            ref={backgroundRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className={`modal-background ${
              modalContent && !isClosing ? open?.animation : close?.animation
            } fixed inset-0 z-50 flex items-center justify-center`}
          >
            <div
              ref={modalContainerRef}
              className={`modal ${
                modalContent && !isClosing ? open?.animation : close?.animation
              }`}
            >
              {modalContent}
            </div>
          </div>,
          document.getElementById('modal-root')!
        )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
// const useModal = (): ModalContextType => {
//   const context = useContext(ModalContext);
//   if (!context)
//     throw new Error('useModal must be used within an ModalProvider');
//   const [isOpen, setIsOpen] = context;
//   return [isOpen, setIsOpen];
// };
// export { useModal, ModalContext };
