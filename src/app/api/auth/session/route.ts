import { getFirebaseAdmin } from '@/lib/firebase-admin';
import type { auth } from 'firebase-admin';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

function getAuth(): auth.Auth {
    return getFirebaseAdmin().auth;
}

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();

  if (!idToken) {
    return NextResponse.json({ error: 'ID token is required.' }, { status: 400 });
  }

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  try {
    const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn });

    // Set cookie policy for session cookie.
    cookies().set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Session cookie creation failed:', error);
    return NextResponse.json({ error: 'Failed to create session.' }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest) {
    try {
        cookies().delete('session');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete session cookie", error);
        return NextResponse.json({ error: "Failed to log out." }, { status: 500 });
    }
}
