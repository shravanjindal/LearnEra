import React from "react";
import Link from "next/link";  // Import Next.js Link for navigation
import { ParamValue } from "next/dist/server/request/params";

type NavbarProps = {
  user: {
    streak: number;
    name: string;
    id: ParamValue;
  };
};

const Navbar = ({ user }: NavbarProps) => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">LearnEra</h1>
        <div className="flex space-x-6">
          <Link href="#" className="text-gray-300 hover:text-white">Roadmap</Link>
          <Link href={`/tasks/${user.id}`} className="text-gray-300 hover:text-white">Tasks</Link> {/* Updated Link */}
          <Link href={`/tests/${user.id}`} className="text-gray-300 hover:text-white">Tests</Link>
          <Link href="#progress-section" className="text-gray-300 hover:text-white">Progress</Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Streak:</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user.streak > 0 ? "bg-green-500" : "bg-gray-700"}`}>
              <span className="text-sm">{user.streak}</span>
            </div>
          </div>
          <span className="text-sm">{user.name}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
