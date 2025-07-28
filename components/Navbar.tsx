import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  console.log("Session in Navbar:", session);

  return (
    <div className="flex gap-4 items-center">
      {session?.user ? (
        <>
          <span className="text-sm">
            Xin chào, {session.user.name || session.user.email}
          </span>
          <Link href="/profile">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs sm:text-sm">
              Profile
            </button>
          </Link>
          <form action="/api/auth/signout" method="POST">
            <input type="hidden" name="callbackUrl" value="/home" />
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-full text-xs sm:text-sm"
            >
              Sign Out
            </button>
          </form>
        </>
      ) : (
        <>
          <Link href="/sign_in">
            <button className="bg-gray-600 text-white px-5 py-2 rounded-full text-xs sm:text-sm">
              Login
            </button>
          </Link>
          <Link href="/sign_up">
            <button className="bg-gray-600 text-white px-5 py-2 rounded-full text-xs sm:text-sm">
              Register
            </button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Navbar;
