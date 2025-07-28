import Navbar from "@/components/Navbar";
import { db } from "@/lib/db";

interface PageProps {
  searchParams: {
    category_id?: string;
  };
}

export default async function HomePage(props: PageProps) {
  const searchParams = props.searchParams || {};

  const categoryIdRaw = searchParams.category_id;
  const categoryFilter = categoryIdRaw ? parseInt(categoryIdRaw) : undefined;

  const categories = await db.category.findMany();

  const books = await db.book.findMany({
    where: {
      state: "not_rented",
      ...(categoryFilter && { category_id: categoryFilter }),
    },
    include: {
      lender: true,
      category: true,
    },
  });

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-6 px-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Thể loại</h2>
          <div className="flex flex-wrap gap-3">
            <a
              href="/home"
              className={`px-4 py-2 rounded-full text-sm border ${
                !categoryFilter ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Tất cả
            </a>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/home?category_id=${cat.id}`}
                className={`px-4 py-2 rounded-full text-sm border ${
                  categoryFilter === cat.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-6">Sách dành cho bạn</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <a
              href={`/detail_book/${book.id}`}
              key={book.id}
              className="no-underline text-black"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform h-full">
                <img
                  src={book.image || "/default-book.jpg"}
                  alt={book.book_name || "Sách"}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{book.book_name}</h3>
                  <p className="text-red-600 font-bold mb-1">
                    {Number(book.rental_price).toLocaleString("vi-VN")} VNĐ
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    Thể loại: {book.category?.name || "Không rõ"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Cho thuê: {book.rental_days} ngày
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};


