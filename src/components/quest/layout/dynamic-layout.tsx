'use client';

import * as React from 'react';

import { VerticalLayout } from './vertical/vertical-layout';

export interface DynamicLayoutProps {
  children: React.ReactNode;
}

export function DynamicLayout({ children }: DynamicLayoutProps): React.JSX.Element {

  return (
    <VerticalLayout>{children}</VerticalLayout>
  );

}
