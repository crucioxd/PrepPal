"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function StartInterview() {
  const params = useParams();
  const interviewId = params.interviewId;

  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQues, setMockInterviewQues] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(0);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));

    if (result.length > 0) {
      setInterviewData(result[0]);
      const jsonMockResp = JSON.parse(result[0].jsonMockResp);
      setMockInterviewQues(jsonMockResp);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-6">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <QuestionsSection
          mockInterviewQues={mockInterviewQues}
          activeQuestion={activeQuestion}
          setActiveQuestion={setActiveQuestion}
        />
        <RecordAnswerSection
          mockInterviewQues={mockInterviewQues}
          activeQuestion={activeQuestion}
          setActiveQuestion={setActiveQuestion}
          interviewData={interviewData}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-4 justify-end">
        {activeQuestion > 0 && (
          <Button onClick={() => setActiveQuestion(activeQuestion - 1)}>
            Previous Question
          </Button>
        )}

        {activeQuestion !== mockInterviewQues?.length - 1 && (
          <Button onClick={() => setActiveQuestion(activeQuestion + 1)}>
            Next Question
          </Button>
        )}

        {activeQuestion === mockInterviewQues?.length - 1 && interviewData && (
          <Link href={`/dashboard/interview/${interviewData.mockId}/feedback`}>
            <Button>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default StartInterview;
