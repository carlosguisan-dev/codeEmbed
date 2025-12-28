'use client';
import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/icons';
import { Loader2 } from 'lucide-react';

// Wrap the main content in a component that uses the hooks
function LoginPageContent() {
  const { auth } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const handleAuthAction = async (action: 'login' | 'signup') => {
    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firebase not initialized.',
      });
      return;
    }

    if (action === 'signup' && password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Passwords do not match.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const userCredential =
        action === 'login'
          ? await signInWithEmailAndPassword(auth, email, password)
          : await createUserWithEmailAndPassword(auth, email, password);
      
      // Force token refresh to get the latest token.
      const idToken = await userCredential.user.getIdToken(true);

      // Send token to server to create session cookie
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        // IMPORTANT: Let the UserProvider and Layout redirect, don't push here.
        // The onAuthStateChanged listener will trigger the redirect.
        // This avoids race conditions.
        // router.push('/dashboard');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create session.');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description:
          error.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Clear form fields when switching tabs
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-[400px]">
        <div className="flex justify-center mb-4">
            <Logo width={200} height={50} />
        </div>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Access your account to manage your code snippets.
              </CardDescription>
            </CardHeader>
            <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleAuthAction('login'); }}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create an account to start creating and sharing snippets.
              </CardDescription>
            </CardHeader>
            <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleAuthAction('signup'); }}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>                <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// The main export needs to be a default export.
// It will render the content, which is already wrapped in the provider in the root layout.
export default function LoginPage() {
    return <LoginPageContent />;
}
