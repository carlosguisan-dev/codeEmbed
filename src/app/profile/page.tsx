'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirebase } from '@/firebase';
import { useTranslation } from '@/hooks/use-translation';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';
import { Loader2, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user, auth } = useFirebase();
  const { t, language, setLanguage } = useTranslation();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [displayName, setDisplayName] = useState('');
  
  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !auth) {
      toast({
        variant: 'destructive',
        title: t('toast_error_title'),
        description: 'You must be logged in.',
      });
      return;
    }

    startTransition(async () => {
      try {
        await updateProfile(user, { displayName });
        toast({
          title: 'Perfil actualizado',
          description: 'Tu nombre se ha guardado correctamente.',
        });
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: t('toast_error_title'),
          description: error.message,
        });
      }
    });
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
       <div className="flex flex-wrap gap-4 justify-between items-start">
            <h1 className="text-3xl font-bold font-headline">{t('profile_settings_title')}</h1>
       </div>
      <form onSubmit={handleSaveChanges}>
        <Card>
          <CardHeader>
            <CardTitle>{t('personal_info_title')}</CardTitle>
            <CardDescription>{t('personal_info_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">{t('full_name_label')}</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t('full_name_placeholder')}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('email_label')}</Label>
              <Input id="email" value={user?.email || ''} disabled />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{t('language_settings_title')}</CardTitle>
            <CardDescription>{t('language_settings_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="language">{t('language_label')}</Label>
              <Select
                value={language}
                onValueChange={(value) => setLanguage(value as 'en' | 'es')}
                disabled={isPending}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {t('save_changes_button')}
            </Button>
        </div>
      </form>
    </div>
  );
}
