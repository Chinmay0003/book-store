import { BookOpen, IndianRupee } from "lucide-react";
import Image from "next/image";
interface BookCategoryProps {
  category: string;
  img: string;
}
const BookCategory = ({ category, img }: BookCategoryProps) => {
  return (
    <>
      <div className="bg-white border border-blue-100 rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 flex flex-col items-center p-0 mx-auto min-h-[340px] md:min-h-[370px] max-w-[280px] md:max-w-xs hover:scale-105 overflow-hidden">
        {/* Clickable Preview */}
        <div className="relative w-full h-72 md:h-80 group cursor-pointer">
          <Image
            src={img}
            alt={category}
            fill
            objectFit="cover"
            className="object-cover transition-opacity duration-300 group-hover:opacity-60 rounded-t-xl"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
        </div>

        {/* Book Info */}
        <div className="flex flex-col items-center gap-3 w-full mb-4 px-4 mt-4">
          <div className="flex items-center gap-2 w-full">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg md:text-xl bold text-[#22223b] truncate">
              {category}
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookCategory;
