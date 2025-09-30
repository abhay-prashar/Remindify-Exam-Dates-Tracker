import logo from "../assets/logo.svg";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar({ onSearch }) {
  return (
    <nav className="flex flex-wrap items-center justify-between bg-white px-4 py-2 shadow-sm gap-2">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src={logo}
          alt="Remindify Logo"
          className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
        />
        <span className="text-lg font-semibold text-gray-800 sm:text-xl">
          Remindify
        </span>
      </Link>

      {/* Search Bar */}
      <form
        className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
        onSubmit={(e) => e.preventDefault()}
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search exams..."
          className="w-full rounded-full border border-gray-300 bg-gray-50 pl-10 pr-4 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </form>

      {/* Add Button*/}
      <Link to="/add"
        type="button"
        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 whitespace-nowrap"
      >
        <span className="block sm:hidden">+</span>
        <span className="hidden sm:block">+ Add</span>
      </Link>
    </nav>
  );
}

export default Navbar;
