'use client';
import { useFirebase } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function DashboardLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

export default function DashboardPage() {
  const { user, isUserLoading } = useFirebase();

  // Show the loading skeleton while the user authentication state is being determined.
  if (isUserLoading) {
    return <DashboardLoading />;
  }

  // If there's no user, we can show a message or redirect, but for now, we'll show the loading state
  // as the layout should handle the redirect to login.
  if (!user) {
    return <DashboardLoading />;
  }

  // Once we have a user, render a simple welcome message to confirm login works.
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Login Successful</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome, you are logged in as:</p>
          <p className="font-mono mt-2 p-2 bg-muted rounded">{user.email}</p>
        </CardContent>
      </Card>
    </div>
  );
}
