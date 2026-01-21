import { Logo } from '@/components/ui/Logo';
import { NavbarMenuClient } from './NavbarMenu.client';
import { NavbarScrollClient } from './NavbarScroll.client';

export function Navbar() {
  return (
    <NavbarScrollClient>
      <div className="w-full">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-6 xl:px-8">
          <div className="flex h-16 md:h-20 items-center justify-between">
            <div>
              <Logo />
            </div>
            <NavbarMenuClient />
          </div>
        </div>
      </div>
    </NavbarScrollClient>
  );
}
