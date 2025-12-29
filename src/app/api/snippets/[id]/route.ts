
import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// Initialize Firebase on the server side (Edge environment)
// This ensures we have an app instance to work with.
if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const snippetId = params.id;

  if (!snippetId) {
    return NextResponse.json({ error: 'Snippet ID is required' }, { status: 400 });
  }

  try {
    // We get the firestore instance from the initialized client SDK
    const db = getFirestore();
    const snippetDocRef = doc(db, 'snippets', snippetId);
    const snippetDoc = await getDoc(snippetDocRef);

    if (!snippetDoc.exists()) {
       return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
    }

    const snippetData = snippetDoc.data();
    
    if (snippetData.isPublic !== true) {
         return NextResponse.json({ error: 'This snippet is private and cannot be accessed via the API.' }, { status: 403 });
    }
    
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
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
