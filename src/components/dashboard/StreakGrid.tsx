import React from 'react';

// Define the type for each streak day
type StreakDay = {
    date: Date | string; // Date might come as string
    submissions: number;
};

type StreakGridProps = {
    streakData: StreakDay[];
};

// Function to get a color based on submissions
const getColor = (submissions: number): string => {
    if (submissions === 1) return "bg-green-300";
    if (submissions === 2) return "bg-green-500";
    if (submissions >= 3) return "bg-green-700";
    return "bg-gray-400"; // No submissions
};

// Function to generate an array of 365 days
const generateDaysArray = (streakData: StreakDay[]): StreakDay[] => {
    const today = new Date();
    const pastYear = new Date();
    pastYear.setDate(today.getDate() - 364);

    const daysMap = new Map(
        streakData.map(day => [
            new Date(day.date).toISOString().split('T')[0], // Handle both Date and string
            day.submissions
        ])
    );

    return Array.from({ length: 365 }, (_, i) => {
        const date = new Date(pastYear);
        date.setDate(pastYear.getDate() + i);
        const formattedDate = date.toISOString().split('T')[0]; // Format date as yyyy-mm-dd
        return {
            date: formattedDate,
            submissions: daysMap.get(formattedDate) || 0
        };
    });
};

const StreakGrid: React.FC<StreakGridProps> = ({ streakData }) => {
    const days = generateDaysArray(streakData);

    return (
        <div className="flex justify-center mb-6">
            <div className="w-full p-2">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-md font-semibold">
                        {streakData.reduce((sum, day) => sum + day.submissions, 0)} submissions in the past year
                    </h1>
                </div>

                {/* Streak Grid */}
                <div className="grid grid-rows-7 grid-flow-col gap-1">
                    {days.map((day, index) => (
                        <div
                            key={index}
                            className={`w-4.5 h-3 rounded-sm ${getColor(day.submissions)}`}
                            title={`Date: ${day.date}, Submissions: ${day.submissions}`}
                            style={{ transition: "all 0.2s ease-in-out" }} // Add smooth transition for hover effect
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StreakGrid;
