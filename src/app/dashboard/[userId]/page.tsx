"use client"
import React from 'react'
import { useParams } from 'next/navigation'

const page = () => {
  const params = useParams();
  return (
    <div>Welcome to the dashboard {params.userId}</div>
  )
}

export default page