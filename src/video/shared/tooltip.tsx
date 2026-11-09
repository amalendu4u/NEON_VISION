/** @jsxImportSource react */

import { Tooltip } from '@videojs/react';
import type { ClassValue } from 'cn';
import type { ReactElement, ReactNode } from 'react';

import { cn } from '@/lib/resolve-class-name';

export function ButtonTooltip({
  children,
  delay,
  disabled,
  label,
  popupClassName,
  shortcutLabel,
  side = 'top',
  sticky,
}: {
  children: ReactElement;
  delay?: number;
  disabled?: boolean;
  label?: ReactNode;
  popupClassName?: ClassValue;
  shortcutLabel?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  sticky?: boolean;
}) {
  return (
    <Tooltip.Root delay={delay} disabled={disabled} side={side} sticky={sticky}>
      <Tooltip.Trigger render={children} />
      <Tooltip.Popup className={cn('media-popup', 'media-popup-safe-area', 'media-tooltip-popup', popupClassName)}>
        {label ?? <Tooltip.Label />}
        {shortcutLabel ? <span className="media-tooltip-shortcut">{shortcutLabel}</span> : <Tooltip.Shortcut className={'media-tooltip-shortcut'} />}
      </Tooltip.Popup>
    </Tooltip.Root>
  );
}
