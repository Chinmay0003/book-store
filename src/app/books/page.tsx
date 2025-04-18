'use client';
import { useSearchParams, useRouter } from 'next/navigation';

const categories = ['Toddler', 'Playful', 'School going'];

export default function BooksPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get('category');

  const handleCategorySelect = (category: string) => {
    router.push(`/books?category=${encodeURIComponent(category)}`);
  };

  return (
    <main className="p-6">
      <h2 className="text-2xl font-bold mb-4">Choose a Category</h2>
      <div className="flex space-x-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {selectedCategory ? (
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Showing books for: {selectedCategory}
          </h3>
          {/* Replace this with actual book fetching logic */}
          <ul className="list-disc pl-5">
            <li>Book 1 in {selectedCategory}</li>
            <li>Book 2 in {selectedCategory}</li>
          </ul>
        </div>
      ) : (
        <p>Select a category to view books.</p>
      )}
    </main>
  );
}
