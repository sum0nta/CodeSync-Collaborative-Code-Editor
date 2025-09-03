export const config = {
  matcher: [
    // Skip API routes, static files, and images
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};

export default function middleware(req) {
  // You can add custom middleware logic here if needed
  return null;
}
