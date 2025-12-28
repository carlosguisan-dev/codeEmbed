import { getSnippetById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { CodePreview } from '@/components/code-preview';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { updateSnippetViewCount } from '@/lib/actions';

export default async function EmbedPage({ params }: { params: { id: string } }) {
  const snippet = await getSnippetById(params.id);

  if (!snippet) {
    notFound();
  }

  // This is where you would increment the view count in a real DB
  // For this mock, we'll call a server action that logs to the console
  await updateSnippetViewCount(snippet.id);

  return (
    <div className="p-4 sm:p-6 md:p-8">
       <Card className="w-full max-w-4xl mx-auto border-2 border-primary/20 shadow-xl">
          <CardHeader>
            <div className="flex items-start gap-4">
              <FileText className="w-8 h-8 text-primary mt-1" />
              <div>
                <CardTitle className="font-headline text-2xl">{snippet.title}</CardTitle>
                <CardDescription>{snippet.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CodePreview
              code={snippet.code}
              language={snippet.language}
              theme={snippet.theme}
              showLineNumbers={snippet.lineNumbers}
              isEmbed={true}
            />
          </CardContent>
       </Card>
    </div>
  );
}
