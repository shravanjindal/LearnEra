import React from 'react';

type StreakDay = {
    date: Date; // Handle cases where the date might be a string
    submissions: number;
};

type StreakGridProps = {
    streakData: StreakDay[];
};

const getColor = (submissions: number): string => {
    if (submissions === 1) return "bg-green-300";
    if (submissions === 2) return "bg-green-500";
    if (submissions >= 3) return "bg-green-700";
    return "bg-gray-400"; // No submissions
};

const generateDaysArray = (streakData: StreakDay[]): StreakDay[] => {
    const today = new Date();
    const pastYear = new Date();
    pastYear.setDate(today.getDate() - 364);

    const daysMap = new Map(
        streakData.map(day => [
            new Date(day.date).toISOString().split('T')[0], 
            day.submissions
        ])
    );

    return Array.from({ length: 365 }, (_, i) => {
        const date = new Date(pastYear);
        date.setDate(pastYear.getDate() + i);
        return {
            date,
            submissions: daysMap.get(date.toISOString().split('T')[0]) || 0
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
                        {streakData.reduce((sum, day) => sum + day.submissions, 0)} submissions in the past one year
                    </h1>
                </div>

                {/* Streak Grid */}
                <div className="grid grid-rows-7 grid-flow-col gap-1">
                    {days.map((day, index) => (
                        <div
                            key={index}
                            className={`w-4.5 h-3 rounded-sm ${getColor(day.submissions)}`}
                            title={`Date: ${new Date(day.date).toISOString().split('T')[0]}, Submissions: ${day.submissions}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StreakGrid;
