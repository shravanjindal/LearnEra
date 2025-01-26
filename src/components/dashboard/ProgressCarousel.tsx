import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tooltip, Legend, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

type ProgressCarouselProps = {
    user: {
        skills: String[];
    }
    performanceData: {
        month: String;
        score: number;
    }[];
}

const ProgressCarousel = ({ user, performanceData }: ProgressCarouselProps) => {
    return (
        <Card className="mb-6 bg-gray-800 border-gray-700 rounded-lg shadow-lg">
            <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-lg font-semibold text-gray-100">
                    Performance Over Time
                </CardTitle>
                <CardDescription className="text-xs text-gray-400">
                    Track your progress across different skills
                </CardDescription>
            </CardHeader>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full relative group"
            >
                <CarouselContent>
                    {user.skills.map((skill, index) => (
                        <CarouselItem key={index} className="basis-full">
                            <div className="p-2">
                                <div className="bg-gray-900 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <h3 className="text-md font-medium text-gray-100 mb-2">
                                        Performance in {skill}
                                    </h3>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={performanceData}>
                                            <XAxis
                                                dataKey="month"
                                                stroke="#6B7280"
                                                tick={{ fill: "#9CA3AF" }}
                                            />
                                            <YAxis stroke="#6B7280" tick={{ fill: "#9CA3AF" }} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#374151",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                                }}
                                            />
                                            <Legend
                                                wrapperStyle={{ color: "#F3F4F6", paddingTop: "10px" }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="score"
                                                stroke="#818CF8"
                                                strokeWidth={2}
                                                dot={{ r: 4, fill: "#818CF8" }}
                                                activeDot={{ r: 6 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Custom Previous Button */}
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-full p-3 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100" />

                {/* Custom Next Button */}
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-full p-3 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100" />
            </Carousel>
        </Card>
    )
}

export default ProgressCarousel