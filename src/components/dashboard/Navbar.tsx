import React from "react";
import Link from "next/link";  // Import Next.js Link for navigation
import { ParamValue } from "next/dist/server/request/params";

type NavbarProps = {
  user: {
    name: string;
    id: ParamValue;
    verified: boolean;
  };
  setSkillDialogBoxOpen: (value: boolean) => void;
  setGoalDialogBoxOpen: (value: boolean) => void;
  setSidebarOpen: (value: boolean) => void;
};

const Navbar = ({ user, setSkillDialogBoxOpen, setGoalDialogBoxOpen, setSidebarOpen }: NavbarProps) => {
  return (
    <nav className="bg-[#1e1e1e] p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Title */}
        <h1 className="hidden lg:block text-xl font-bold text-white">LearnEra</h1>
        {/* Hamburger icon on small screens */}
        <button
          className="lg:hidden text-white"
          onClick={() => setSidebarOpen(true)}
          >
          ☰
        </button>
        {/* Navbar Links and Actions */}
        <div className="flex items-center space-x-8">
          {user.verified && (
            <Link href={`/tasks/${user.id}`} className="text-gray-300 hover:text-white transition duration-200">
              Tasks
            </Link>
          )}
          
          <button
            onClick={() => setSkillDialogBoxOpen(true)}
            className="text-gray-300 hover:text-white transition duration-200"
          >
            Add Skill
          </button>
          
          <button
            onClick={() => setGoalDialogBoxOpen(true)}
            className="text-gray-300 hover:text-white transition duration-200"
          >
            Set Goals
          </button>
        </div>
        
        {/* User Name */}
        <div className="hidden lg:block flex items-center space-x-4">
          <span className="text-sm text-white"><b>{user.name}</b></span>
        </div>
        <div className="lg:hidden flex items-center space-x-4">
          <h1 className="text-xl font-bold text-white">LearnEra</h1>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
