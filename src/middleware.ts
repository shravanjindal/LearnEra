import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value; // Retrieve token from cookie
  console.log('Token from cookie:', token);

  if (token) {
    try {
      console.log('Token exists, verifying...');
      
      // Explicitly type the decoded token as JwtPayload
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as JwtPayload;
      console.log('Decoded token:', decoded);

      // Safely access userId from decoded token
      const userId = decoded.userId;

      // If token is valid, redirect to the user's dashboard
      return NextResponse.redirect(new URL(`/dashboard/${userId}`, req.url));
    } catch (err) {
      console.error('Token verification failed:', err);

      // If the token is invalid or expired, clear the cookie and redirect to login
      const response = NextResponse.next();
      response.cookies.delete('token'); // Delete the invalid token cookie
      return response;
    }
  }

  // If there's no token, proceed as normal (let the user visit the login page)
  return NextResponse.next();
}
