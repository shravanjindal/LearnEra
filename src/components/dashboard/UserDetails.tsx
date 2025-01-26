import React from 'react'
import { Badge } from '../ui/badge'
type UserDetailsProps = {
    user: {
        badges: String[];
        name: String;
        solved: number;
    }
}
const UserDetails = ({ user }: UserDetailsProps) => {
    return (
        <div className="mb-6">
            <h2 className="text-lg font-bold">{user.name}</h2>
            <p className="text-xs text-gray-400">Solved Tasks: {user.solved}</p>
            <div className="mt-2 space-y-1">
                {user.badges.map((badge, index) => (
                    <Badge key={index} className="bg-purple-500 text-white">
                        {badge}
                    </Badge>
                ))}
            </div>
        </div>
    )
}

export default UserDetails;