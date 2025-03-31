"use client"

import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import InterviewItemCard from "./InterviewItemCard";

function InterviewList() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    if (user) {
      GetInterviewList();
    }
  }, [user]);

  const GetInterviewList = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(MockInterview.id));

    console.log(result);
    setInterviewList(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10">
      <h2 className="font-medium  mb-8 text-2xl text-left text-blue-800  animate-fadeInDown">
        Previous Mock Interviews
      </h2>
      <img 
        src="/inter-bg1.jpg" 
        alt="Decorative" 
        className="absolute top-20 right-40 h-100 w-130 "
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {interviewList &&
          interviewList.map((interview, index) => (
            <InterviewItemCard interview={interview} key={index} />
          ))}
      </div>
    </div>
  );
}

export default InterviewList;
