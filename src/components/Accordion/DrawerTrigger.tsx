import React, { ReactElement, useContext } from 'react';
import { DrawerContext } from './Drawer';

interface Props {
  asChild?: boolean;
  children: ReactElement<any>;
}

const DrawerTrigger: React.FC<Props> = ({ asChild, children }) => {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error('DrawerTrigger must be used within a Drawer!');

  const trigger = () => {
    ctx.open();
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as ReactElement<any>, {
      onClick: trigger,
    });
  }

  return <button onClick={trigger}>{children}</button>;
};

export default DrawerTrigger;
