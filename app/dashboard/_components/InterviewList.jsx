"use client";

import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import InterviewItemCard from "./InterviewItemCard";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function InterviewList() {
  const { user } = useUser();
  const router = useRouter();
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
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-10 relative">
      <h2 className="font-semibold mb-8 text-2xl sm:text-3xl text-blue-800 text-center sm:text-left animate-fadeInDown">
        Previous Mock Interviews
      </h2>

      {/* Optional Responsive Background Image */}
      {/* <img 
        src="/inter-bg1.jpg" 
        alt="Decorative" 
        className="absolute top-0 right-0 w-40 sm:w-64 opacity-10 pointer-events-none"
      /> */}

      {interviewList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {interviewList.map((interview, index) => (
            <InterviewItemCard interview={interview} key={index} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col items-center justify-center mt-10 sm:mt-20 relative z-10"
        >
          <h2 className="text-2xl sm:text-3xl font-medium text-blue-800 mb-4 text-center">
            No Previous Interviews Found
          </h2>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            Start your preparation now with PrepPal! Create your first mock interview and unlock your full potential.
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default InterviewList;
