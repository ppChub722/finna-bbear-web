'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Render the default Next.js 404 page when a route
// is requested that doesn't match the middleware and
// therefore doesn't have a locale associated with it.

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-4xl font-bold tracking-tight lg:text-5xl">404</h2>
      <p className="text-xl text-muted-foreground">
        ไม่พบหน้าที่คุณต้องการ
      </p>

      <div className="mt-4">
        <Link href="/">
          <Button variant="default">
            กลับสู่หน้าหลัก
          </Button>
        </Link>
      </div>
    </div>
  );
}
