import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

// NOTE: We did not use React Components for Icons, because
//  you may one to get the config from the server.

// NOTE: First level elements are groups.

export interface LayoutConfig {
  navItems: NavItemConfig[];
}

export const layoutConfig = {
  navItems: [{
    key: 'menu',
    title: 'Menu',
    items: [
      { key: 'Home', title: 'บันทึกขางาน', href: paths.home, icon: 'house' },
    ],
  }]
} satisfies LayoutConfig;
