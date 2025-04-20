"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [buttonText, setButtonText] = useState<String>("Login");
  const handleSignupClick = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/onboarding'); // Navigate to the /onboarding page
  };
  const validateStep = (formData: FormData): boolean => {
    if (!formData.email.trim() || !formData.password.trim()) {
      alert("Please fill in all fields: Email and Password.");
      return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (validateStep(formData)) {
      try {
        setButtonText("Processing...");
  
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include", // Include credentials in the request
        });
  
        if (response.ok) {
          const data = await response.json();
          alert("Logged in!");
          router.push(`/dashboard/${data.user._id}`);
        } else {
          const errorData = await response.json();
          alert(`Failed to login. ${errorData.message}`);
          setButtonText("Login");
        }
      } catch (error) {
        alert(`An error occurred. Please try again.`);
        setButtonText("Login");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-4xl flex"
      >
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-b from-purple-600 to-indigo-700 text-white p-8 w-1/2">
          <h2 className="text-3xl font-bold mb-4 animate-bounce">Welcome back to LearnEra</h2>
          <p className="text-lg text-center mb-6">Do you think AGI is here?</p>
        </div>
        <div className="p-8 w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div whileFocus={{ scale: 1.05 }}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                required
              />
            </motion.div>
            <motion.div whileFocus={{ scale: 1.05 }}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                required
              />
            </motion.div>
            <div className="flex gap-3 text-center mt-4">
              <Button type="submit" className="w-full bg-purple-700 px-4 py-2 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4">
                {buttonText}
              </Button>
              <Button onClick={handleSignupClick} className="w-full px-4 bg-purple-700 py-2 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4">
                or Signup
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;