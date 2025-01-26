import React from 'react'
import { Progress } from '../ui/progress'

type UserSkillBarsProps = {
    skillProgressData: {
        skill: String;
        progress: number;
    }[];
}
const UserSkillBars = ({ skillProgressData }: UserSkillBarsProps) => {
    return (
        <div>
            <h3 className="text-md font-semibold">Skills Progress</h3>
            {skillProgressData.map((item, index) => (
                <div key={index} className="mt-3">
                    <p className="text-sm mb-1 text-gray-300">{item.skill}</p>
                    <Progress value={item.progress} className="h-2 mb-1" />
                </div>
            ))}
        </div>
    )
}

export default UserSkillBars