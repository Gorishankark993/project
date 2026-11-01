import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Search, Wallet } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MobileNav } from '@/components/dashboard/mobile-nav';
import { NavLinks } from '@/components/dashboard/nav-links';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserMenu } from '@/components/dashboard/user-menu';
import { signOut } from '@/lib/auth/actions';
import { getCurrentUser } from '@/lib/auth/session';

export async function DashboardShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-background px-4 py-6 lg:flex">
        <Link href="/dashboard" className="mb-10 flex items-center gap-2 px-3 text-lg font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
            <Wallet className="h-4 w-4" />
          </span>
          SpendWise
        </Link>
        <NavLinks />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <MobileNav />
            <form action="/dashboard/transactions" className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                type="search"
                placeholder="Search transactions"
                aria-label="Search transactions"
                className="h-10 pl-9"
              />
            </form>
            <div className="ml-auto flex items-center gap-1">
              <ThemeToggle />
              <UserMenu name={user.name} email={user.email} signOutAction={signOut} />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
