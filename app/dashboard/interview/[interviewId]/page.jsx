"use client";

import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { MockInterview } from "@/utils/schema";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [webcamEnabled, setWebcamEnabled] = useState(false);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));
    setInterviewData(result[0]);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 md:px-8 lg:px-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-6xl mx-auto w-full"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Let's Get Started
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                Position Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Job Role/Position</p>
                  <p className="text-base font-medium text-gray-900 truncate">
                    {interviewData?.jobPosition || "Loading..."}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tech Stack</p>
                  <p className="text-base font-medium text-gray-900">
                    {interviewData?.jobDescription || "Loading..."}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Experience Required</p>
                  <p className="text-base font-medium text-gray-900">
                    {interviewData?.jobExperience || "Loading..."} years
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              className="bg-white border-l-4 border-blue-500 rounded-xl p-6 shadow-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-blue-600" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  Information
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {process.env.NEXT_PUBLIC_INFORMATION}
              </p>
            </motion.div>
          </motion.div>

          {/* Right Section */}
          <motion.div
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="w-full max-w-md aspect-video max-h-[50vh] bg-gray-100 rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200">
              {webcamEnabled ? (
                <Webcam
                  onUserMedia={() => setWebcamEnabled(true)}
                  onUserMediaError={() => setWebcamEnabled(false)}
                  mirrored
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-4 p-6">
                  <WebcamIcon className="w-16 h-16 text-gray-400" />
                  <Button
                    onClick={() => setWebcamEnabled(true)}
                    className="gap-2 transition-transform hover:scale-105"
                  >
                    Enable Webcam & Microphone
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Start Button */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full max-w-xs"
          >
            <Link href={`/dashboard/interview/${params.interviewId}/start`}>
              <Button className="w-full px-6 py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Start Interview
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Interview;
