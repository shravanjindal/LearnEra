import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Badge } from "../ui/badge";

type BadgesCardProps = {
  user: { badges: string[] };
};

const BadgesCard = ({ user }: BadgesCardProps) => {
  return (
    <Card className="bg-[#1e1e1e] border border-[#2c2c2c] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-white text-lg font-semibold">
          Badges
        </CardTitle>
        <CardDescription className="text-gray-400">
          Your earned badges
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {user.badges.length === 0 ? (
          <div className="text-center text-gray-400">No badges earned yet.</div>
        ) : (
          user.badges.map((badge, index) => (
            <Badge
              key={index}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 text-xs"
            >
              {badge}
            </Badge>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default BadgesCard;
