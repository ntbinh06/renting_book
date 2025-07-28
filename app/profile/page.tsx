'use client';

import { getSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    avatar: '',
    numberphone: '',
    address: '',
    delivery: 'direct',
  });
  const [role, setRole] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getSession().then((session) => {
      if (session?.user) {
        setForm((prev) => ({
          ...prev,
          user_name: session.user.name || '',
          email: session.user.email || '',
          avatar: session.user.avatar || '',
          numberphone: session.user.numberphone || '',
          address: session.user.address || '',
          delivery: session.user.delivery || 'direct',
        }));
        setRole(session.user.role || null);
      }
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const dataToSend = {
    ...form,
    delivery: role === 'lender' ? form.delivery : null,
  };

  const res = await fetch('/api/user/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataToSend),
  });

  const data = await res.json();
  if (data.success) {
    alert("Cập nhật thành công!");
// Gán lại dữ liệu UI từ response thay vì getSession()
  setForm({
    name: data.user.name || "",
    email: data.user.email || "",
    avatar: data.user.avatar || "",
    numberphone: data.user.numberphone || "",
    address: data.user.address || "",
    delivery: data.user.delivery || "direct",
  });

  } else {
    alert("Cập nhật thất bại: " + (data.message || "Lỗi không xác định"));
  }
};


  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <div className="flex flex-col sm:flex-row gap-6">

        <div className="flex flex-col items-center sm:w-1/3">
          {form.avatar && (
            <img
              src={form.avatar}
              alt="Avatar Preview"
              className="w-32 h-32 object-cover rounded-full mb-2"
            />
          )}
          <input
            type="file"
            onChange={handleAvatarChange}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleFileButtonClick}
            className="bg-gray-700 text-white px-4 py-2 rounded text-sm"
          >
            Chọn ảnh đại diện
          </button>
        </div>


        <div className="sm:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="user_name"
            value={form.name}
            onChange={handleChange}
            placeholder="Họ tên"
            className="border p-2 w-full"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 w-full"
            disabled
          />
          <input
            type="text"
            name="numberphone"
            value={form.numberphone}
            onChange={handleChange}
            placeholder="Số điện thoại"
            className="border p-2 w-full"
          />
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Địa chỉ"
            className="border p-2 w-full"
          />
          {role === 'lender' && (
            <select
              name="delivery"
              value={form.delivery}
              onChange={handleChange}
              className="border p-2 w-full col-span-full"
            >
              <option value="direct">Giao trực tiếp</option>
              <option value="ship">Giao qua vận chuyển</option>
            </select>
          )}
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Cập nhật
        </button>
      </div>
    </form>
  );
}
