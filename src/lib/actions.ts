'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { snippets, getUser } from './data';
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

// In a real app, you would use a proper DB like Firestore.
// For this example, we'll mutate an in-memory array.

export async function createSnippetAction(formData: unknown): Promise<ActionResponse> {
  const validatedFields = snippetSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid form data.' };
  }

  const user = getUser();
  const newSnippet: Snippet = {
    id: `snip_${Date.now()}`,
    userId: user.id,
    ...validatedFields.data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 0,
  };

  snippets.unshift(newSnippet);
  
  revalidatePath('/dashboard');
  return { success: true, message: 'Snippet created successfully.', data: newSnippet };
}

export async function updateSnippetAction(formData: unknown): Promise<ActionResponse> {
  const updateSchema = snippetSchema.extend({
      id: z.string(),
  });
  const validatedFields = updateSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid form data for update.' };
  }

  const { id, ...data } = validatedFields.data;
  const snippetIndex = snippets.findIndex(s => s.id === id);

  if (snippetIndex === -1) {
    return { success: false, message: 'Snippet not found.' };
  }
  
  const updatedSnippet: Snippet = {
      ...snippets[snippetIndex],
      ...data,
      updatedAt: new Date().toISOString(),
  };

  snippets[snippetIndex] = updatedSnippet;

  revalidatePath('/dashboard');
  revalidatePath(`/snippets/${id}/edit`);
  revalidatePath(`/embed/${id}`);
  
  return { success: true, message: 'Snippet updated successfully.', data: updatedSnippet };
}

export async function deleteSnippetAction(id: string): Promise<ActionResponse> {
    const snippetIndex = snippets.findIndex(s => s.id === id);

    if (snippetIndex === -1) {
        return { success: false, message: 'Snippet not found.' };
    }

    snippets.splice(snippetIndex, 1);

    revalidatePath('/dashboard');

    return { success: true, message: 'Snippet deleted successfully.' };
}

export async function duplicateSnippetAction(id: string): Promise<ActionResponse> {
    const originalSnippet = snippets.find(s => s.id === id);

    if (!originalSnippet) {
        return { success: false, message: 'Original snippet not found.' };
    }

    const user = getUser();
    const newSnippet: Snippet = {
        ...originalSnippet,
        id: `snip_${Date.now()}`,
        userId: user.id,
        title: `${originalSnippet.title} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewCount: 0,
    };

    snippets.unshift(newSnippet);

    revalidatePath('/dashboard');
    return { success: true, message: 'Snippet duplicated successfully.', data: newSnippet };
}


export async function updateSnippetViewCount(id: string): Promise<ActionResponse> {
    const snippetIndex = snippets.findIndex(s => s.id === id);

    if (snippetIndex === -1) {
        return { success: false, message: 'Snippet not found.' };
    }

    snippets[snippetIndex].viewCount += 1;
    console.log(`View count for ${id} incremented to ${snippets[snippetIndex].viewCount}`);

    // In a real app, revalidate if you show view count on a public page.
    // For this mock, it's a background task.
    
    return { success: true, message: 'View count updated.' };
}
