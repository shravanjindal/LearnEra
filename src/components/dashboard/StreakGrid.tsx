import React from 'react'
const days = Array.from({ length: 365 }, (_, i) => ({
    date: i,
    submissions: 0, // Random submission count for demo
}));

const getColor = (submissions: number) => {
    if (submissions === 1) return "bg-green-300";
    if (submissions === 2) return "bg-green-500";
    if (submissions >= 3) return "bg-green-700";
    return "bg-gray-400"; // No submissions
};

const StreakGrid = () => {
    return (
        <div className="flex justify-center mb-6">
            <div className="w-full p-2">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-md font-semibold">0 submissions in the past one year</h1>
                </div>

                {/* Streak Grid */}
                <div className="grid grid-rows-7 grid-flow-col gap-1">
                    {days.map((day, index) => (
                        <div
                            key={index}
                            className={`w-4.5 h-3 rounded-sm ${getColor(day.submissions)}`}
                            title={`Day ${index + 1}: ${day.submissions} submissions`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default StreakGrid