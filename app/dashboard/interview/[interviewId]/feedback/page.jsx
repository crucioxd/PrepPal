"use client";

import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { UserAnswer } from "@/utils/schema";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdref, params.interviewId))
      .orderBy(UserAnswer.id);

    console.log(result);
    setFeedbackList(result);
  };

  const calculateOverallRating = () => {
    if (feedbackList.length === 0) return 0;

    const total = feedbackList.reduce((sum, item) => {
      return sum + (Number(item.rating) || 0);
    }, 0);

    return (total / feedbackList.length).toFixed(1);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      {/* Heading Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-4xl font-extrabold text-green-600">🎉 Congratulations!</h2>
        <p className="text-gray-600 mt-2 text-lg">
          Here's your interview feedback with detailed insights.
        </p>
      </motion.div>

      {/* Overall Rating */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3, duration: 0.5 }}
        className="my-6 text-center"
      >
        <h2 className="text-2xl font-semibold text-blue-800">
          ⭐ Overall Rating: <span className="font-bold">{calculateOverallRating()}/10</span>
        </h2>
        <p className="text-gray-500 text-sm">Based on your responses</p>
      </motion.div>

      {/* Feedback List */}
      <div className="space-y-4">
        {feedbackList.map((item, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.2 * index, duration: 0.4 }}
            className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm"
          >
            <Collapsible>
              <CollapsibleTrigger className="w-full flex justify-between items-center p-3 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-900 font-medium transition duration-300">
                {item.question}
                <ChevronsUpDown className="ml-2" />
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="mt-3 space-y-3">
                  <div className="p-3 border rounded-lg bg-red-100 text-red-800">
                    <strong>Rating: </strong>{item.rating}
                  </div>
                  <div className="p-3 border rounded-lg bg-red-50 text-red-900">
                    <strong>Your Answer: </strong>{item.userAns}
                  </div>
                  <div className="p-3 border rounded-lg bg-green-50 text-green-900">
                    <strong>Correct Answer: </strong>{item.correctAns}
                  </div>
                  <div className="p-3 border rounded-lg bg-blue-50 text-blue-900">
                    <strong>Feedback: </strong>{item.feedback}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>
        ))}
      </div>

      {/* Go Home Button */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-center mt-6"
      >
        <Button 
          onClick={() => router.replace('/dashboard')} 
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg shadow-md transition duration-300"
        >
          Go Home
        </Button>
      </motion.div>
    </div>
  );
}

export default Feedback;
