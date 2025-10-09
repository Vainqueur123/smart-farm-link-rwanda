import * as React from 'react';

declare module '@radix-ui/react-checkbox' {
  export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof import('react').forwardRef> {
    checked?: boolean | 'indeterminate';
    onCheckedChange?: (checked: boolean | 'indeterminate') => void;
  }
}
