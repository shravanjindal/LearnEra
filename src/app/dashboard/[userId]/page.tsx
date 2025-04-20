"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/dashboard/Navbar";
import UserDetails from "@/components/dashboard/UserDetails";
import UserSkillBars from "@/components/dashboard/UserSkillBars";
import PieChartCard from "@/components/dashboard/PieChartCard";
import BadgesCard from "@/components/dashboard/BadgesCard";
import StreakGrid from "@/components/dashboard/StreakGrid";
import TaskHistory from "@/components/dashboard/TaskHistory";
import Chatbot from "@/components/dashboard/Chatbot";
import { IUser } from "../../../models/user";
import AddSkillDialogBox from "@/components/dashboard/AddSkillDialogBox";
import GoalDialogBox from "@/components/dashboard/GoalDialogBox";
import DeleteSkillDialogBox from "@/components/dashboard/DeleteSkillDialogBox";
import { buyTokens } from "@/lib/buyTokens";
import Link from "next/link";  
import BuyTokensDialogBox from "@/components/dashboard/BuyTokensDialogBox";
import ProfileBox from "@/components/dashboard/ProfileBox";
const Dashboard = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<(IUser & { _id: string }) | null>(null);
  const [streakData, setStreakData] = useState<{ date: Date; submissions: number }[]>([]);
  const [progressData, setProgressData] = useState<{ skill: string; progress: number }[]>([]);
  const [tasksDoneData, setTasksDoneData] = useState<{ skill: string; tasksDone: number }[]>([]);
  const [tasksHistoryData, setTasksHistoryData] = useState<{ date: Date; topic: string; skill: string; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skillDialogBoxOpen, setSkillDialogBoxOpen] = useState(false);
  const [goalDialogBoxOpen, setGoalDialogBoxOpen] = useState(false);
  const [skill, setSkill] = useState("");
  const [goal, setGoal] = useState("");
  const [deleteDialogBoxOpen, setDeleteDialogBoxOpen] = useState(false);
  const [verified, setVerified] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [price, setPrice] = useState("0.1");
  const [priceDialogBoxOpen, setPriceDialogBoxOpen] = useState(false);
  const [amount, setAmount] = useState<string>("0");
  const [tokenCount, setTokenCount] = useState<string>("0");
  const [profileBoxOpen, setProfileBoxOpen] = useState<boolean>(false);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/dashboard/${userId}/api`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUser(data);

        setVerified(data.isVerified);
        // Fetch the streak data after user data
        const streakResponse = await fetch(`/dashboard/${userId}/api/getStreakData`);
        if (!streakResponse.ok) throw new Error("Failed to fetch streak data");

        const streakData = await streakResponse.json();
        setStreakData(streakData);

        // Fetch progress data
        const progressResponse = await fetch(`/dashboard/${userId}/api/getProgressData`);
        if (!progressResponse.ok) throw new Error("Failed to fetch progress data");

        const progressData = await progressResponse.json();
        setProgressData(progressData);

        // Fetch tasks done data
        const tasksDoneResponse = await fetch(`/dashboard/${userId}/api/getTasksDoneData`);
        if (!tasksDoneResponse.ok) throw new Error("Failed to fetch tasks done data");

        const tasksDoneData = await tasksDoneResponse.json();
        setTasksDoneData(tasksDoneData);

        // Fetch tasks history data
        const tasksHistoryResponse = await fetch(`/dashboard/${userId}/api/getTasksHistory`);
        if (!tasksHistoryResponse.ok) throw new Error("Failed to fetch tasks history");

        const tasksHistoryData = await tasksHistoryResponse.json();
        setTasksHistoryData(Array.isArray(tasksHistoryData) ? tasksHistoryData : []);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleAddSkill = () => {
    setSkillDialogBoxOpen(false);
    fetch(`/dashboard/${userId}/api/addSkill`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ skill }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to add skill");
        return response.json();
      })
      .then((data) => {
        if (data.message == "Skill already exists") {
          alert("Skill already exists");
          return;
        }
        progressData.push({ skill, progress: 0 });
        tasksDoneData.push({ skill, tasksDone: 0 });
      })
      .then((data) => {
        setSkill("");
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  };
  const handleUpdateGoal = () => {
    fetch(`/dashboard/${userId}/api/updateGoal`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ goal }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update goal");
        return response.json();
      })
      .then(() => {
        setGoalDialogBoxOpen(false);
        setGoal("");
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }
  const handleDeleteGoal = () => {
    fetch(`/dashboard/${userId}/api/deleteGoal`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ goal }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete goal");
        return response.json();
      })
      .then(() => {
        setGoalDialogBoxOpen(false);
        setGoal("");
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }
  const onDeleteSkill = (skill: string) => {
    setSkill(skill);
    setDeleteDialogBoxOpen(true);
  }

  const handleDeleteSkill = () => {
    setDeleteDialogBoxOpen(false);
    fetch(`/dashboard/${userId}/api/deleteSkill`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ skill }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete skill");
        return response.json();
      })
      .then((data) => {
        setProgressData(progressData.filter((item => item.skill !== skill)));
        setTasksDoneData(tasksDoneData.filter((item => item.skill !== skill)));
      })
      .then((data) => {
        setSkill("");
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }
  const handleResendVerification = async () => {
    try {
      const response = await fetch("/api/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user?.email }),
      });

      const data = await response.json();
      alert(data.message);
    } catch (err) {
      console.error("Failed to resend verification email", err);
      alert("Something went wrong while resending the email.");
    }
  };
  const handleConfirm = async () => {
    await buyTokens(parseInt(amount), parseInt(tokenCount), user?.email!);
    setPriceDialogBoxOpen(false);
    setTokenCount("0");
    setAmount("0");
  };

  const handleTokenChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const tokens = e.target.value;
    setTokenCount(tokens);
    const totalAmount = parseFloat(tokens) * parseFloat(price);
    setAmount(isNaN(totalAmount) ? "0" : totalAmount.toFixed(2));
  };
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/'; // redirect to login page
  };
  
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-300">AI</span>
            </div>
          </div>
          <p className="text-base font-medium tracking-wide text-gray-300">Just a moment...</p>
        </div>
      </div>
    );
  
  
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-red-300">
        <div className="text-center">
          <p className="text-lg font-medium">⚠️ Sorry, some error occurred. Consider refreshing!</p>
        </div>
      </div>
    );
  
  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">
        <div className="text-center">
          <p className="text-lg font-medium">No user data available.</p>
        </div>
      </div>
    );
  

  return (
    
    <div className="min-h-screen bg-[#121212] text-gray-100 overflow-x-hidden">
      {!verified && (
        <div className="bg-[#ff9900] text-black p-4 text-center">
          <p>
            Your email is not verified. Please verify to unlock full access.
            <button
              onClick={handleResendVerification}
              className="ml-4 bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
            >
              Resend Email
            </button>
          </p>
        </div>
      )}
      
      <Navbar
        user={{ name: user.name, id: user._id.toString(), verified }}
        setSkillDialogBoxOpen={setSkillDialogBoxOpen}
        setGoalDialogBoxOpen={setGoalDialogBoxOpen}
        setSidebarOpen={setSidebarOpen}
        setPriceDialogBoxOpen={setPriceDialogBoxOpen}
        setProfileBoxOpen={setProfileBoxOpen}
      />
      {profileBoxOpen && (
        <ProfileBox 
          user={{ name: user.name, email: user.email, tokenBalance: user.tokenBalance }}
          handleLogout={handleLogout}
          setPriceDialogBoxOpen={setPriceDialogBoxOpen}
          setProfileBoxOpen={setProfileBoxOpen}
        />
      )}

      <div className="flex p-6 overflow-y-auto scrollbar-custom">
        {/* Sidebar for desktop */}
        <div className="hidden lg:block w-1/4 bg-[#1e1e1e] p-6 rounded-xl shadow-md mr-6">
          <UserDetails user={{ name: user.name, badges: user.badges }} />
          <UserSkillBars skillProgressData={progressData} onDeleteSkill={onDeleteSkill} />
        </div>

        {/* Sidebar for mobile, toggled by hamburger */}
        {sidebarOpen && (
          <div className="lg:hidden fixed top-0 left-0 w-3/4 h-full bg-[#1e1e1e] p-6 shadow-lg z-50 overflow-y-auto">
            <button
              className="text-white text-2xl mb-4"
              onClick={() => setSidebarOpen(false)}
            >
              ×
            </button>

            <UserDetails user={{ name: user.name, badges: user.badges }} />
            <UserSkillBars skillProgressData={progressData} onDeleteSkill={onDeleteSkill} />

            <div className="lg:hidden md:hidden sm:block mt-6 space-y-4">
              {user.isVerified && (
                <Link
                  href={`/tasks/${user._id}`}
                  className="block text-gray-300 hover:text-white transition duration-200"
                >
                  Tasks
                </Link>
              )}

              <button
                onClick={() => {
                  setSkillDialogBoxOpen(true);
                  setSidebarOpen(false);
                }}
                className="block text-gray-300 hover:text-white transition duration-200"
              >
                Add Skill
              </button>

              <button
                onClick={() => {
                  setGoalDialogBoxOpen(true);
                  setSidebarOpen(false);
                }}
                className="block text-gray-300 hover:text-white transition duration-200"
              >
                Set Goals
              </button>
            </div>
          </div>
        )}


        
        <div className="w-3/4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <PieChartCard tasksDoneData={tasksDoneData} />
            <BadgesCard user={{ badges: user.badges }} />
          </div>
          <StreakGrid streakData={streakData} />
          <TaskHistory taskHistory={tasksHistoryData} />
        </div>
      </div>
      
      <Chatbot userId={String(userId)} progressData={progressData} />

      {/* Skill Dialog Box */}
      {skillDialogBoxOpen && (
        <AddSkillDialogBox
          skill={skill}
          setSkill={setSkill}
          handleAddSkill={handleAddSkill}
          setSkillDialogBoxOpen={setSkillDialogBoxOpen}
        />
      )}

      {/* Goal Dialog Box */}
      {goalDialogBoxOpen && (
        <GoalDialogBox
          user={user}
          goal={goal}
          setGoal={setGoal}
          handleDeleteGoal={handleDeleteGoal}
          handleUpdateGoal={handleUpdateGoal}
          setGoalDialogBoxOpen={setGoalDialogBoxOpen}
        />
      )}

      {/* Delete Skill Dialog Box */}
      {deleteDialogBoxOpen && (
        <DeleteSkillDialogBox
          skill={skill}
          handleDeleteSkill={handleDeleteSkill}
          setDeleteDialogBoxOpen={setDeleteDialogBoxOpen}
        />
      )}
      {priceDialogBoxOpen && (
        <BuyTokensDialogBox 
          tokenCount={parseInt(tokenCount)}
          amount={parseFloat(amount)}
          handleTokenChange={handleTokenChange}
          handleConfirm={handleConfirm}
          setPriceDialogBoxOpen={setPriceDialogBoxOpen}
        />
    )}

    </div>

  );
};

export default Dashboard;
