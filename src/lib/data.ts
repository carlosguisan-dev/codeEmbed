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

// In-memory array to simulate a database
export let snippets: Snippet[] = [
    {
        id: 'snip_1',
        userId: 'user_1',
        title: 'React Server Component',
        description: 'A simple async server component in Next.js.',
        code: `async function getData() {
  const res = await fetch('https://api.example.com/...')
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
 
  if (!res.ok) {
    // This will activate the closest 'error.js' Error Boundary
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}
 
export default async function Page() {
  const data = await getData()
 
  return <main></main>
}`,
        language: 'typescript',
        theme: 'dark',
        lineNumbers: true,
        isPublic: true,
        createdAt: '2023-10-26T10:00:00Z',
        updatedAt: '2023-10-26T10:00:00Z',
        viewCount: 128,
    },
    {
        id: 'snip_2',
        userId: 'user_1',
        title: 'Python FastAPI Endpoint',
        description: 'A basic GET endpoint using FastAPI.',
        code: `from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}`,
        language: 'python',
        theme: 'dark',
        lineNumbers: true,
        isPublic: false,
        createdAt: '2023-10-25T14:30:00Z',
        updatedAt: '2023-10-25T14:30:00Z',
        viewCount: 42,
    },
    {
        id: 'snip_3',
        userId: 'user_1',
        title: 'Tailwind CSS Button',
        description: 'A button component with hover and focus styles.',
        code: `<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
  Sign In
</button>`,
        language: 'html',
        theme: 'light',
        lineNumbers: false,
        isPublic: true,
        createdAt: '2023-10-24T09:00:00Z',
        updatedAt: '2023-10-24T09:00:00Z',
        viewCount: 356,
    }
];

// Mock API functions
export async function getSnippets(userId: string = 'user_1'): Promise<Snippet[]> {
  // In a real app, you'd filter by userId in your DB query
  return Promise.resolve(snippets.filter(s => s.userId === userId));
}

export async function getSnippetById(id: string): Promise<Snippet | undefined> {
  return Promise.resolve(snippets.find(s => s.id === id));
}

export function getUser(): User {
    return currentUser;
}
