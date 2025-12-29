
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { NextRequest, NextResponse } from 'next/server';

const BASE_LINE_HEIGHT = 24; // Estimated height per line of code in pixels
const PADDING_AND_HEADER = 150; // Estimated height for padding, header, footer, etc.

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const format = searchParams.get('format');

  if (format && format !== 'json') {
    return new NextResponse('Format not supported', { status: 501 });
  }

  if (!url) {
    return new NextResponse('URL parameter is required', { status: 400 });
  }

  const urlPattern = /\/embed\/([a-zA-Z0-9]+)/;
  const match = url.match(urlPattern);
  
  if (!match || !match[1]) {
    return new NextResponse('Invalid snippet URL', { status: 400 });
  }
  
  const snippetId = match[1];
  const origin = new URL(request.url).origin;

  try {
    const { db } = getFirebaseAdmin();
    const snippetDoc = await db.collection('snippets').doc(snippetId).get();

    if (!snippetDoc.exists) {
      return new NextResponse('Snippet not found', { status: 404 });
    }

    const snippetData = snippetDoc.data();
    if (!snippetData) {
        return new NextResponse('Snippet data not found', { status: 404 });
    }
    
    // Quick check if snippet is public
    if (snippetData.isPublic !== true) {
         return new NextResponse('This snippet is private', { status: 403 });
    }

    const lineCount = snippetData.code.split('\n').length;
    const calculatedHeight = lineCount * BASE_LINE_HEIGHT + PADDING_AND_HEADER;

    const iframeHtml = `<iframe src="${origin}/embed/${snippetId}" data-code-embed-id="${snippetId}" style="width:100%; border:0; overflow:hidden;" title="${snippetData.title}" allow="clipboard-write" sandbox="allow-scripts allow-same-origin" loading="lazy"></iframe><script src="${origin}/embed-resizer.js" async></script>`;

    const response = {
      version: '1.0',
      type: 'rich',
      provider_name: 'CodeEmbed',
      provider_url: origin,
      title: snippetData.title,
      html: iframeHtml,
      width: '100%',
      height: calculatedHeight, 
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('oEmbed error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
