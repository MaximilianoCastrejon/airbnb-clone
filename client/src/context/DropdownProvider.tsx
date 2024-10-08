import { createContext, useContext } from 'react';

export type DropdownContextType = [boolean, (open: boolean) => void];

const DropdownContext = createContext<DropdownContextType | null>(null);

const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context)
    throw new Error('useDropdown must be used within an DropdownProvider');
  return context;
};
export { useDropdown, DropdownContext };
