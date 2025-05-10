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
  setPriceDialogBoxOpen: (value: boolean) => void;
  setProfileBoxOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Navbar = ({ user, setSkillDialogBoxOpen, setGoalDialogBoxOpen, setSidebarOpen, setPriceDialogBoxOpen, setProfileBoxOpen }: NavbarProps) => {
  return (
    <nav className="bg-[#1e1e1e] p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Title */}
        <div className="flex items-center gap-2 lg:flex hidden">
        <img className="w-[30px] h-[30px]" src="/BrivonLogo.png" alt="Zovite's Logo"/>
        <div className="flex items-center"><h1 className="text-xl font-bold text-white">Zovite</h1></div>
        </div>
        
        {/* Hamburger icon on small screens */}
        <button
          className="lg:hidden text-white"
          onClick={() => setSidebarOpen(true)}
          >
          ☰
        </button>
        {/* Navbar Links and Actions */}
        <div className="hidden md:flex items-center space-x-8">
          
          <Link href={`/dashboard/${user.id}/skilltrackers`} className="text-gray-300 hover:text-white transition duration-200">
            Tasks
          </Link>
          
          
          <button
            onClick={() => setSkillDialogBoxOpen(true)}
            className="text-gray-300 hover:text-white transition duration-200"
          >
            Add Skill
          </button>
          
          {/* <button
            onClick={() => setGoalDialogBoxOpen(true)}
            className="text-gray-300 hover:text-white transition duration-200"
          >
            Set Goals
          </button> */}
          {/* <button
            onClick={() => setPriceDialogBoxOpen(true)}
            className="text-gray-300 hover:text-white transition duration-200"
          >
            Buy Tokens
          </button> */}
        </div>
        
        {/* User Name */}
        <button
        onClick={() => setProfileBoxOpen(true)}
        >
        <div className="hidden md:block lg:block flex items-center space-x-4">
          <span className="text-md text-white"><b>{user.name}</b></span>
        </div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
