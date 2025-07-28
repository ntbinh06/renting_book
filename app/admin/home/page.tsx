import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, UserIcon } from 'lucide-react';

export default function AdminHomePage() {
  return (
    <div className="flex h-screen">

      <aside className="w-64 bg-gray-100 p-4 border-r space-y-4">
        <div className="bg-gray-400 text-white rounded-full w-20 h-20 flex items-center justify-center text-xl font-bold mx-auto mb-6">Logo</div>
        <nav className="space-y-2">
          <Button variant="outline" className="w-full">Trang chủ</Button>
          <Button variant="outline" className="w-full">Quản lý người dùng</Button>
          <Button variant="outline" className="w-full">Quản lý danh mục</Button>
          <Button variant="outline" className="w-full">Duyệt bài đăng</Button>
          <Button variant="outline" className="w-full">Thống kê</Button>
        </nav>
      </aside>


      <main className="flex-1 p-6 bg-white overflow-y-auto">

        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard Admin</h1>
          <div className="flex items-center gap-4">
            <UserIcon className="w-6 h-6" />
            <ShoppingCart className="w-6 h-6" />
          </div>
        </header>


        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card><CardContent className="text-center py-6"><h2 className="text-lg font-semibold">300 người dùng</h2></CardContent></Card>
          <Card><CardContent className="text-center py-6"><h2 className="text-lg font-semibold">300 bài đăng</h2></CardContent></Card>
          <Card><CardContent className="text-center py-6"><h2 className="text-lg font-semibold">300 quyển sách</h2></CardContent></Card>
        </div>


        <div className="grid grid-cols-3 gap-6 mb-6">

          <Card className="col-span-2">
            <CardContent className="py-4">
              <h3 className="text-md font-semibold mb-2">Lượt thuê</h3>
              <div className="h-40 bg-gray-200 flex items-center justify-center">[Biểu đồ]</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-4">
              <h3 className="text-md font-semibold mb-2">Top người dùng nhiệt tình:</h3>
              <ul className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-white">👩‍💼</span>
                    <div>
                      <p className="text-sm font-medium">Nguyễn Thị A</p>
                      <p className="text-xs text-gray-500">{i % 2 === 0 ? 'Người yêu sách' : 'Người cho thuê'}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>


        <Card>
          <CardContent className="py-4">
            <h3 className="text-md font-semibold mb-2">Top đầu sách cho thuê nhiều nhất</h3>
            <table className="w-full text-sm text-left mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4">Tên sách</th>
                  <th className="py-2 px-4">Thể loại</th>
                  <th className="py-2 px-4">Tác giả</th>
                  <th className="py-2 px-4">Năm xuất bản</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4">Sách A</td>
                  <td className="py-2 px-4">Kỹ năng</td>
                  <td className="py-2 px-4">Tác giả A</td>
                  <td className="py-2 px-4">2020</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-2 px-4">Sách B</td>
                  <td className="py-2 px-4">Tiểu thuyết</td>
                  <td className="py-2 px-4">Tác giả B</td>
                  <td className="py-2 px-4">2019</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
