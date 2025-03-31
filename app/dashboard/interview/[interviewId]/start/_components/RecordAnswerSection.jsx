"use client";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, StopCircle, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/utils/db";
import { chatSession } from "@/utils/geminiaimodel";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";

function RecordAnswerSection({
  mockInterviewQues,
  activeQuestion,
  setActiveQuestion,
  interviewData,
}) {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const {
    error,
    interimResult,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    crossBrowser: true,
    timeout: 10000,
    onStart: () => console.log("Started recording..."),
    onError: (err) => {
      console.error("Error:", err);
      toast.error("Recording error: " + err.message);
    },
  });

  // Consolidated transcription effect
  useEffect(() => {
    const fullTranscript = results.map(r => r?.transcript).join(' ');
    setUserAnswer(fullTranscript);
  }, [results]);

  const handleStartRecording = async () => {
    try {
      setUserAnswer('');
      setResults([]);
      await startSpeechToText();
      toast.info("Recording started");
    } catch (err) {
      console.error("Start recording failed:", err);
      toast.error("Failed to start recording");
    }
  };

  const handleStopRecording = async () => {
    try {
      await stopSpeechToText();
      toast.info("Recording stopped");
      if (userAnswer.trim().length > 0) {
        await handleSaveAnswer();
      }
    } catch (err) {
      console.error("Stop recording failed:", err);
      toast.error("Failed to stop recording");
    }
  };

  const handleSaveAnswer = async () => {
    if (!userAnswer || processing) return;
    
    setProcessing(true);
    try {
      const feedBackprompt = `Question: ${mockInterviewQues[activeQuestion]?.question}
        User Answer: ${userAnswer}
        Please provide rating (0-10) and brief feedback in JSON format:
        { "rating": number, "feedback": string }`;

      const result = await chatSession.sendMessage(feedBackprompt);
      const rawResponse = result.response.text();
      const cleanResponse = rawResponse.replace(/```json|```/g, '');
      const JsonFeedbackResp = JSON.parse(cleanResponse);

      const resp = await db.insert(UserAnswer).values({
        mockIdref: interviewData?.mockId,
        question: mockInterviewQues[activeQuestion]?.question,
        correctAns: mockInterviewQues[activeQuestion]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy')
      });

      if (resp) {
        toast.success("Answer saved successfully");
        setActiveQuestion(prev => Math.min(prev + 1, mockInterviewQues.length - 1));
      }
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save answer");
    } finally {
      setProcessing(false);
      setUserAnswer('');
      setResults([]);
    }
  };

  if (error) return (
    <div className="text-red-500 p-4 border rounded-lg bg-red-50">
      Microphone error: {error.message}
      <Button className="mt-2" onClick={() => window.location.reload()}>
        Reload Page
      </Button>
    </div>
  );

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="relative flex flex-col mt-20 justify-center items-center bg-secondary rounded-lg p-5 my-5">
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
            borderRadius: 8,
          }}
        />
        {isRecording && (
          <div className="absolute top-2 right-2 flex items-center gap-2">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            <span className="text-red-600 text-sm">Recording</span>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button 
          variant="outline" 
          className="my-4 w-48"
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          disabled={processing}
        >
          {processing ? (
            <LoaderCircle className="animate-spin mr-2" />
          ) : isRecording ? (
            <>
              <StopCircle className="mr-2 text-red-900" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="mr-2 text-blue-600" />
              Start Recording
            </>
          )}
        </Button>

        <Button
          
          onClick={handleSaveAnswer}
          disabled={!userAnswer || processing}
          className="my-4 bg-blue-200 text-black-900"
        >
          {processing ? "Saving..." : "Save Answer"}
        </Button>
      </div>

      {userAnswer && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg w-full max-w-2xl">
          <h3 className="text-sm font-semibold mb-2">Current Answer:</h3>
          <p className="text-gray-700">{userAnswer}</p>
        </div>
      )}
    </div>
  );
}

export default RecordAnswerSection;