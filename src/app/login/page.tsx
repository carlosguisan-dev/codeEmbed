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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/icons';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

function LoginPageContent() {
  const { auth } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast({
        variant: 'destructive',
        title: t('toast_error_title'),
        description: 'Firebase not initialized.',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      router.push('/dashboard');

    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.code === 'auth/invalid-credential'
          ? t('login_error_invalid_credentials')
          : error.message || t('toast_error_title');
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: t('login_error_title'),
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo width={200} height={50} />
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">{t('login_title')}</CardTitle>
            <CardDescription>
              {t('login_desc')}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">{t('email_label')}</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder={t('email_placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">{t('password_label')}</Label>
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
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('login_button')}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginPageContent />;
}
