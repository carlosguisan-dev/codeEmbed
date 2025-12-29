
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { NextRequest, NextResponse } from 'next/server';

// Force Node.js runtime to ensure compatibility with Firebase Admin SDK
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const snippetId = params.id;
  console.log(`API request for snippet ID: ${snippetId}`);

  if (!snippetId) {
    return NextResponse.json({ error: 'Snippet ID is required' }, { status: 400 });
  }

  try {
    const { db } = getFirebaseAdmin();
    const snippetDoc = await db.collection('snippets').doc(snippetId).get();

    if (!snippetDoc.exists) {
       return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
    }

    const snippetData = snippetDoc.data();
    if (!snippetData) {
        return NextResponse.json({ error: 'Snippet data not found' }, { status: 404 });
    }
    
    if (snippetData.isPublic !== true) {
         return NextResponse.json({ error: 'This snippet is private and cannot be accessed via the API.' }, { status: 403 });
    }
    
    // We don't need to convert timestamps, JSON serialization handles it.
    // We can select which fields to return to avoid exposing sensitive data if any.
    const publicSnippet = {
        id: snippetDoc.id,
        title: snippetData.title,
        description: snippetData.description,
        code: snippetData.code,
        language: snippetData.language,
        theme: snippetData.theme,
        lineNumbers: snippetData.lineNumbers,
    };

    return NextResponse.json(publicSnippet);
  } catch (error) {
    console.error('API Snippet Error:', error);
    // Ensure we provide a clear error message in the response
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
