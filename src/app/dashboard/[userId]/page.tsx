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

const Dashboard = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<(IUser & { _id: string }) | null>(null);
  const [streakData, setStreakData] = useState<{ date: Date; submissions: number }[]>([]);
  const [progressData, setProgressData] = useState<{ skill: string; progress: number }[]>([]);
  const [tasksDoneData, setTasksDoneData] = useState<{ skill: string; tasksDone: number }[]>([]);
  const [tasksHistoryData, setTasksHistoryData] = useState<{ date: Date; topic: string; skill: string; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogBoxOpen, setDialogBoxOpen] = useState(false);
  const [skill, setSkill] = useState("");
  const [deleteDialogBoxOpen, setDeleteDialogBoxOpen] = useState(false);
  const [verified, setVerified] = useState(false);
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
    setDialogBoxOpen(false);
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
  
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
        <p className="text-lg font-semibold animate-pulse">Loading...</p>
      </div>
    );
  
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No user found</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
      {!verified && (
        <div className="bg-yellow-500 text-black p-4 text-center">
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
      <Navbar user={{ name: user.name, streak: 0, id: user._id.toString(), verified }} setDialogBoxOpen={setDialogBoxOpen} />
      <div className="container flex p-4 overflow-y-auto scrollbar-custom">
        <div className="w-1/4 bg-gray-800 p-4 rounded-lg mr-4">
          <UserDetails user={{ name: user.name, badges: user.badges }} />
          <UserSkillBars skillProgressData={progressData} onDeleteSkill={onDeleteSkill}/>
        </div>
        <div className="w-3/4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <PieChartCard tasksDoneData={tasksDoneData} />
            <BadgesCard user={{ badges: user.badges }} />
          </div>
          <StreakGrid streakData={streakData} />
          <div id="progress-section">
            {/* <ProgressCarousel user={user} performanceData={user} /> */}
          </div>
          <TaskHistory taskHistory={tasksHistoryData} />
        </div>
      </div>
      <Chatbot />
      {dialogBoxOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-96 max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-white">Add Skill</h2>
          <input
            type="text"
            placeholder="Enter a skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full px-4 py-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            required
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={handleAddSkill}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setDialogBoxOpen(false)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}

    {deleteDialogBoxOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-96 max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-white">Delete Skill</h2>
          <p className="text-white mb-6">Are you sure you want to delete the skill: <span className="font-bold">{skill}</span>?</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={handleDeleteSkill}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setDeleteDialogBoxOpen(false)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              No
            </button>
          </div>
        </div>
      </div>
    )}
    

    </div>
  );
};

export default Dashboard;
