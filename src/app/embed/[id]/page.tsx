
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
            return null;
        }

        const snippetData = snippetDoc.data() as Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'> & { createdAt: Timestamp, updatedAt: Timestamp};

        // Ensure that the snippet is public before returning it
        if (!snippetData.isPublic) {
            return null;
        }
        
        return {
            id: snippetDoc.id,
            ...snippetData,
            // Firestore Timestamps need to be converted to strings for serialization
            createdAt: snippetData.createdAt.toDate().toISOString(),
            updatedAt: snippetData.updatedAt.toDate().toISOString(),
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
