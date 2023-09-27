import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const middleware = async (req: NextRequest) => {
  const user = await getToken({
    req,
    cookieName: 'next-auth.session-token',
    secret: process.env.NEXT_AUTH_SECRET,
  });
  const url = req.nextUrl.pathname;

  if (user && url.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!user && !url.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export default middleware;
