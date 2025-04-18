// app/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Welcome to StoryTime Adventures</h1>
      <Button onClick={() => router.push('/books')} className="text-lg px-6 py-3">
        Books
      </Button>
    </main>
  );
}
