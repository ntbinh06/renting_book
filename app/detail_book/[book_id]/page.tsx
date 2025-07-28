import Navbar from "@/components/Navbar";
import { db } from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";


type PageProps = {
  params: {
    book_id: string;
  };
};


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Chi tiết sách #${params.book_id}`,
  };
}


const BookDetailPage = async ({ params }: PageProps) => {
  const book_id = parseInt(params.book_id);

  const book = await db.book.findUnique({
    where: {
      id: book_id,
    },
    include: {
      lender: true,
      category: true,
    },
  });

  if (!book) return notFound();

  const lender = book.lender;

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-6 px-4">
        <div className="flex flex-col lg:flex-row gap-6">

          <div className="w-full lg:w-1/3 flex justify-center items-start">
            <img
              src={book.image || "/default-book.jpg"}
              alt={book.book_name || "Sách"}
              className="w-full max-w-xs h-auto rounded-lg object-cover shadow"
            />
          </div>

          <div className="w-full lg:w-1/3 space-y-4">
            <h1 className="text-2xl font-bold">{book.book_name}</h1>
            <p className="text-red-600 text-lg font-semibold">
              {Number(book.rental_price).toLocaleString("vi-VN")} VNĐ / {book.rental_days} ngày
            </p>
            <p>
              <span className="font-medium">Thể loại:</span> {book.category?.name || "Không rõ"}
            </p>
            <p>
              <span className="font-medium">Người cho thuê:</span> {book.lender?.name || "Không rõ"}
            </p>
            <p>
              <span className="font-medium">Giá gốc sách:</span>{" "}
              {Number(book.book_price).toLocaleString("vi-VN")} VNĐ
            </p>
            <p>
              <span className="font-medium">Mô tả:</span> {book.description || "Không có mô tả"}
            </p>
            <a
              href={`/rent/${book.id}`}
              className="inline-block px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Thuê ngay
            </a>
          </div>

          <div className="w-full lg:w-1/3 bg-gray-50 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3">Thông tin người cho thuê</h2>
            {lender ? (
              <>
                <div className="flex justify-center mb-4">
                  <img
                    src={lender.avatar || "/default-avatar.png"}
                    alt="Avatar người cho thuê"
                    className="w-24 h-24 rounded-full object-cover shadow"
                  />
                </div>

                <div className="space-y-2 text-gray-800 text-sm">
                  <p>
                    <span className="font-medium">Số điện thoại:</span> {lender.numberphone}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {lender.email}
                  </p>
                  <p>
                    <span className="font-medium">Địa chỉ:</span> {lender.address}
                  </p>
                  <p>
                    <span className="font-medium">Hình thức giao sách:</span>{" "}
                    {lender.delivery === "direct" ? "Giao sách" : "Đến nhận sách"}
                  </p>
                </div>
              </>
            ) : (
              <p>Không có thông tin người cho thuê.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookDetailPage;
