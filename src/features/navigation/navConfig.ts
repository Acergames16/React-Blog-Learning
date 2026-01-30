
import { Rss, LayoutList, Settings, type LucideIcon } from 'lucide-react';

export interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
};


export const APP_NAVIGATION: NavItem[] = [
  { name: 'Feed', path: '/feed', icon: Rss },
  { name: 'Publish', path: '/publish', icon: Settings },
  { name: 'My Blog List', path: '/my-blogs', icon: LayoutList },
  { name: 'Settings', path: '/settings', icon: Settings },
  
];