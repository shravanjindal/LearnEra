import React from 'react'
import { Progress } from '../ui/progress'
import { Trash2 } from 'lucide-react' // or any other icon you prefer

type UserSkillBarsProps = {
    skillProgressData: {
        skill: string;
        progress: number;
    }[];
    onDeleteSkill?: (skill: string) => void;
}

const UserSkillBars = ({ skillProgressData, onDeleteSkill }: UserSkillBarsProps) => {
    return (
        <div>
            <h3 className="text-md font-semibold">Skills Progress</h3>
            {skillProgressData && skillProgressData.length > 0 ? skillProgressData.map((item, index) => (
                <div key={index} className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-sm text-gray-300">{item.skill}</p>
                        {onDeleteSkill && (
                            <button
                                onClick={() => onDeleteSkill(item.skill)}
                                className="text-gray-400 hover:text-red-500"
                                aria-label={`Delete ${item.skill}`}
                            >
                                <Trash2 size={13} />
                            </button>
                        )}
                    </div>
                    <Progress value={item.progress} className="h-2" />
                </div>
            )) : <div>No skills to display</div>}
        </div>
    )
}

export default UserSkillBars
