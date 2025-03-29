import React from 'react'
import { Badge } from '../ui/badge'
type UserDetailsProps = {
    user: {
        badges: String[];
        name: String;
    }
}
const UserDetails = ({ user }: UserDetailsProps) => {
    return (
        <div className="mb-6">
            <h2 className="text-lg font-bold">{user.name}</h2>
            <div className="mt-2 space-y-1">
                {user.badges ? user.badges.map((badge, index) => (
                    <Badge key={index} className="bg-purple-500 text-white">
                        {badge}
                    </Badge>
                )): null}
            </div>
        </div>
    )
}

export default UserDetails;