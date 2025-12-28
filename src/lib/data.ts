import type { Snippet, User } from './definitions';

// In a real app, this would come from your database
export const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'json', label: 'JSON' },
];

export const THEMES = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
];

let currentUser: User = {
    id: 'user_1',
    name: 'Carlos Guisan',
    email: 'carlos@example.com',
    avatarUrl: 'https://picsum.photos/seed/1/100/100',
};

// In-memory array to simulate a database. This will be removed.
export let snippets: Snippet[] = [];

// Mock API functions - These will be replaced by Firestore calls.
export async function getSnippets(userId: string = 'user_1'): Promise<Snippet[]> {
  return Promise.resolve([]);
}

export async function getSnippetById(id: string): Promise<Snippet | undefined> {
  return Promise.resolve(undefined);
}

export function getUser(): User {
    return currentUser;
}
