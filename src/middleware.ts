import { NextRequest, NextResponse } from 'next/server';

export default function middleware(req: NextRequest) {
    // All pages are public. Authentication is handled via API calls.
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
