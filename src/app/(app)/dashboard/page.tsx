import { getSnippets } from '@/lib/data';
import { DashboardClient } from '@/components/dashboard-client';

export default async function DashboardPage() {
  const snippets = await getSnippets();

  return (
      <DashboardClient snippets={snippets} />
  );
}
