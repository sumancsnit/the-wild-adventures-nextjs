import { auth } from '@/app/_lib/auth';
// import { NextResponse } from 'next/server';

// export const middleware = (request) => {
//   return NextResponse.redirect(new URL('/', request.url));
// };

export const middleware = auth;

export const config = {
  matcher: ['/account'],
};
