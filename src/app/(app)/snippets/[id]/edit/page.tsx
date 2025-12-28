import { SnippetForm } from '@/components/snippet-form';
import { getSnippetById } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function EditSnippetPage({ params }: { params: { id: string } }) {
  const snippet = await getSnippetById(params.id);

  if (!snippet) {
    notFound();
  }

  return <SnippetForm snippet={snippet} />;
}
