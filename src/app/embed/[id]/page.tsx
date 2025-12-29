
import { notFound } from 'next/navigation';
import type { Snippet } from '@/lib/definitions';
import { Metadata, ResolvingMetadata } from 'next';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import EmbedPageContent from './embed-page-content';
import { Timestamp } from 'firebase-admin/firestore';


type Props = {
  params: { id: string };
};

// This function fetches data on the server
async function getSnippet(id: string): Promise<Snippet | null> {
    try {
        const { db } = getFirebaseAdmin();
        const snippetDoc = await db.collection('snippets').doc(id).get();

        if (!snippetDoc.exists) {
            console.log(`Snippet with ID ${id} not found.`);
            return null;
        }

        const snippetData = snippetDoc.data();
        if (!snippetData) {
            console.log(`Snippet data is empty for ID ${id}.`);
            return null;
        }

        // Temporarily removed for debugging 404s.
        // This allows private snippets to be viewed via direct link.
        // TODO: Re-implement with a proper "This snippet is private" page.
        /*
        if (snippetData.isPublic !== true) {
            console.log(`Snippet with ID ${id} is not public.`);
            return null;
        }
        */
        
        // Safely handle Timestamps
        const createdAt = snippetData.createdAt instanceof Timestamp 
            ? snippetData.createdAt.toDate().toISOString() 
            : new Date().toISOString();
        
        const updatedAt = snippetData.updatedAt instanceof Timestamp 
            ? snippetData.updatedAt.toDate().toISOString() 
            : new Date().toISOString();

        return {
            id: snippetDoc.id,
            userId: snippetData.userId,
            title: snippetData.title,
            description: snippetData.description || '',
            code: snippetData.code,
            language: snippetData.language,
            theme: snippetData.theme,
            lineNumbers: snippetData.lineNumbers,
            isPublic: snippetData.isPublic,
            viewCount: snippetData.viewCount || 0,
            createdAt,
            updatedAt,
        };
    } catch (error) {
        console.error("Error fetching snippet server-side:", error);
        return null;
    }
}


// This function generates the metadata on the server
export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const snippet = await getSnippet(params.id);

  if (!snippet) {
    return {
      title: 'Snippet Not Found',
    };
  }

  const title = `${snippet.title} - Compartido desde CodeEmbed por carlosguisan`;
  const description = snippet.description || 'Echa un vistazo a este snippet de código en CodeEmbed.';

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      // You can add a specific image for each snippet if you have one
    },
    twitter: {
        title: title,
        description: description,
    }
  };
}


// This is the main page component (Server Component)
export default async function EmbedPage({ params }: Props) {
  const snippet = await getSnippet(params.id);

  if (!snippet) {
    notFound();
  }

  // We pass the server-fetched snippet to the client component
  return <EmbedPageContent snippet={snippet} id={params.id} />;
}


