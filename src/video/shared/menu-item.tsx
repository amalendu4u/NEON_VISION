/** @jsxImportSource react */

import { Menu as MenuPrimitive } from '@videojs/react';
import { CheckIcon as CheckIconPrimitive } from '@videojs/react/icons/scaffold';

import { cn } from '@/lib/resolve-class-name';

export function RadioItem({ children, className, ...props }: MenuPrimitive.RadioItemProps) {
  return (
    <MenuPrimitive.RadioItem className={cn('media-menu-radio-item', className)} {...props}>
      {children}
      <MenuPrimitive.ItemIndicator forceMount className={'media-menu-indicator'}>
        <CheckIconPrimitive className={'media-menu-radio-icon'} />
      </MenuPrimitive.ItemIndicator>
    </MenuPrimitive.RadioItem>
  );
}
