import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type PaginationProps = {
  page: number;
  totalPages: number;
  query: Record<string, string>;
};

export function Pagination({ page, totalPages, query }: PaginationProps) {
  if (totalPages <= 1) return null;

  function hrefFor(target: number) {
    const params = new URLSearchParams(query);
    if (target > 1) params.set('page', String(target));
    else params.delete('page');
    const search = params.toString();
    return search ? `/dashboard/transactions?${search}` : '/dashboard/transactions';
  }

  const linkClass = 'inline-flex h-9 items-center gap-1 rounded-md border px-3 text-sm font-medium transition-colors';

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-4">
      <Link
        href={hrefFor(page - 1)}
        aria-disabled={page <= 1}
        tabIndex={page <= 1 ? -1 : undefined}
        className={cn(linkClass, page <= 1 ? 'pointer-events-none opacity-40' : 'hover:bg-accent')}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Link>
      <span className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span> of {totalPages}
      </span>
      <Link
        href={hrefFor(page + 1)}
        aria-disabled={page >= totalPages}
        tabIndex={page >= totalPages ? -1 : undefined}
        className={cn(linkClass, page >= totalPages ? 'pointer-events-none opacity-40' : 'hover:bg-accent')}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
