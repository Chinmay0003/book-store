"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Image from "next/image";
// import bookImage from '../../../public/1.jpg';
const allBooks = [
  {
    title: "When I am Playful",
    price: 5.99,
    currency: "GBP",
    ageGroup: "toddler",
    bookImage: "/1.jpg",
  },
  {
    title: "When I am Kind",
    price: 5.99,
    currency: "GBP",
    ageGroup: "toddler",
    bookImage: "/1.jpg",
  },
  {
    title: "Adventures in Village",
    price: 7.99,
    currency: "GBP",
    ageGroup: "playful",
    bookImage: "/1.jpg",
  },
  {
    title: "Adventures in Space",
    price: 7.99,
    currency: "GBP",
    ageGroup: "school",
    bookImage: "/1.jpg",
  },
];
console.log(allBooks[0].bookImage.toString);

function BooksPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "all";

  const [sort, setSort] = useState("new");
  const [filterType, setFilterType] = useState("all");

  const books = allBooks
    .filter((book) => (category === "all" ? true : book.ageGroup === category))
    .sort((a, b) => {
      if (sort === "new") return b.title.localeCompare(a.title);
      if (sort === "old") return a.title.localeCompare(b.title);
      return 0;
    });

  const ageTitle =
    category === "toddler"
      ? "Ages 0–3"
      : category === "playful"
        ? "Ages 4–7"
        : category === "school"
          ? "Ages 8–12"
          : "All Ages";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Books for {ageTitle}</h1>

          <div className="flex flex-wrap gap-4">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm text-sm text-gray-700"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="picture">Picture Book</option>
              <option value="chapter">Chapter Book</option>
            </select>

            <select
              className="border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm text-sm text-gray-700"
              value={sort}
              onChange={(e) => setSort(e.target.value)}>
              <option value="new">Date, new to old</option>
              <option value="old">Date, old to new</option>
            </select>
          </div>
        </div>

        {/* Book Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <Image
                src={book.bookImage}
                alt={book.title}
                width={400}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{book.title}</h2>
                <p className="text-blue-600 font-medium mt-1">
                  £{book.price.toFixed(2)} {book.currency}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BooksPage />
    </Suspense>
  );
}
