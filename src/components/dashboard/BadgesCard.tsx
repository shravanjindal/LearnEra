import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Badge } from '../ui/badge'

type BadgesCardProps = {
    user: { badges: String[]; }
}

const BadgesCard = ({ user }: BadgesCardProps) => {
    return (
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg shadow-2xl hover:shadow-3xl transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="text-white text-lg font-bold">Badges</CardTitle>
                <CardDescription className="text-gray-300">Your earned badges</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                {user.badges.map((badge, index) => (
                    <Badge
                        key={index}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 text-xs"
                    >
                        {badge}
                    </Badge>
                ))}
            </CardContent>
        </Card>
    )
}

export default BadgesCard