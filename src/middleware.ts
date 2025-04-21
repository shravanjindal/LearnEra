// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    if (!token) {
        // No token, proceed as usual
        return NextResponse.next()
    }

    try {
        // Decode token (replace 'your-secret' with your actual secret if verifying)
        const decoded = jwt.decode(token) as { userId?: string }
        if (decoded?.userId) {
            const url = new URL(`/dashboard/${decoded.userId}`, request.url)
            return NextResponse.redirect(url)
        }
    } catch (error) {
        console.error('Invalid token:', error)
        // If token is invalid, proceed without redirect
    }

    return NextResponse.next()
}

// Define which paths this middleware runs on
export const config = {
    matcher: '/',
}
