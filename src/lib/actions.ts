'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { addDoc, collection, updateDoc, doc, deleteDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseAdmin } from './firebase-admin';
import { auth } from 'firebase-admin';
import { cookies } from 'next/headers';
import type { Snippet } from './definitions';

const snippetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  code: z.string().min(1, 'Code cannot be empty'),
  language: z.string(),
  theme: z.enum(['light', 'dark']),
  lineNumbers: z.boolean(),
  isPublic: z.boolean(),
});

type ActionResponse = {
  success: boolean;
  message: string;
  data?: Snippet;
};

// This function can be used in Server Actions to get the UID of the logged-in user.
// It relies on the session cookie being set, which is no longer the case with the new auth flow.
// We will need to adapt Server Actions to receive the userId from the client if needed,
// or use a different method to authenticate server-side requests.
// For now, let's assume we will pass the UID from the client.
async function getUserIdFromSession(): Promise<string | null> {
    try {
        const sessionCookie = cookies().get('session')?.value;
        if (!sessionCookie) return null;
        const decodedToken = await auth().verifySessionCookie(sessionCookie, true);
        return decodedToken.uid;
    } catch (error) {
        console.error("Failed to verify session cookie:", error);
        return null;
    }
}

// TODO: All server actions need to be re-evaluated.
// We'll need a way to get the authenticated user on the server.
// A common pattern is to have the client send the user's ID token with the request.
// For now, let's modify the actions to require the userId to be passed in.

export async function createSnippetAction(payload: { formData: unknown, userId: string }): Promise<ActionResponse> {
  const { formData, userId } = payload;
  if (!userId) {
    return { success: false, message: 'User not authenticated.' };
  }

  const validatedFields = snippetSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid form data.' };
  }
  
  const { db } = getFirebaseAdmin();

  try {
    const newDocRef = await addDoc(collection(db, 'snippets'), {
        ...validatedFields.data,
        userId,
        viewCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    const newSnippet: Snippet = {
        id: newDocRef.id,
        userId: userId,
        ...validatedFields.data,
        viewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    
    revalidatePath('/dashboard');
    return { success: true, message: 'Snippet created successfully.', data: newSnippet };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to create snippet.' };
  }
}

export async function updateSnippetAction(payload: { formData: unknown, userId: string }): Promise<ActionResponse> {
  const { formData, userId } = payload;
  if (!userId) {
    return { success: false, message: 'User not authenticated.' };
  }

  const updateSchema = snippetSchema.extend({
      id: z.string(),
  });
  const validatedFields = updateSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid form data for update.' };
  }

  const { id, ...data } = validatedFields.data;
  const { db } = getFirebaseAdmin();
  const snippetRef = doc(db, 'snippets', id);

  const docSnap = await getDoc(snippetRef);
  if (!docSnap.exists() || docSnap.data().userId !== userId) {
      return { success: false, message: 'Snippet not found or you do not have permission to edit it.' };
  }
  
  try {
    await updateDoc(snippetRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });

    const updatedSnippet: Snippet = {
        ...docSnap.data(),
        ...data,
        id,
        updatedAt: new Date().toISOString(),
    } as Snippet;

    revalidatePath('/dashboard');
    revalidatePath(`/snippets/${id}/edit`);
    revalidatePath(`/embed/${id}`);
    
    return { success: true, message: 'Snippet updated successfully.', data: updatedSnippet };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to update snippet.' };
  }
}

export async function deleteSnippetAction(payload: { id: string, userId: string }): Promise<ActionResponse> {
    const { id, userId } = payload;
    if (!userId) {
        return { success: false, message: 'User not authenticated.' };
    }
    
    const { db } = getFirebaseAdmin();
    const snippetRef = doc(db, 'snippets', id);

    const docSnap = await getDoc(snippetRef);
    if (!docSnap.exists() || docSnap.data().userId !== userId) {
        return { success: false, message: 'Snippet not found or you do not have permission to delete it.' };
    }

    try {
        await deleteDoc(snippetRef);
        revalidatePath('/dashboard');
        return { success: true, message: 'Snippet deleted successfully.' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Failed to delete snippet.' };
    }
}

export async function duplicateSnippetAction(payload: { id: string, userId: string }): Promise<ActionResponse> {
    const { id, userId } = payload;
    if (!userId) {
        return { success: false, message: 'User not authenticated.' };
    }

    const { db } = getFirebaseAdmin();
    const originalSnippetRef = doc(db, 'snippets', id);
    
    try {
        const docSnap = await getDoc(originalSnippetRef);
        if (!docSnap.exists()) {
            return { success: false, message: 'Original snippet not found.' };
        }
        if (docSnap.data().userId !== userId) {
             return { success: false, message: 'You do not have permission to duplicate this snippet.' };
        }

        const originalData = docSnap.data();

        const { id: oldId, createdAt, updatedAt, ...restOfData } = originalData;

        const newDocRef = await addDoc(collection(db, 'snippets'), {
            ...restOfData,
            title: `${originalData.title} (Copy)`,
            userId: userId, // associate with current user
            viewCount: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        
        const newSnippet = {
            id: newDocRef.id,
            ...restOfData,
            title: `${originalData.title} (Copy)`,
            userId: userId,
            viewCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as Snippet;

        revalidatePath('/dashboard');
        return { success: true, message: 'Snippet duplicated successfully.', data: newSnippet };
    } catch (error: any) {
        return { success: false, message: error.message || 'Failed to duplicate snippet.' };
    }
}


export async function updateSnippetViewCount(id: string): Promise<ActionResponse> {
    // This is now handled client-side in the embed page component
    return { success: true, message: 'View count update initiated by client.' };
}
