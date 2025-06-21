"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/geminiaimodel";
import { LoaderCircle } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { MockInterview } from "@/utils/schema";
import { db } from "@/utils/db";
import { useRouter } from "next/navigation";

function AddnewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDes, setJobDes] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setJSONResponse] = useState("");
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const interviewCount = process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || jobExperience;
    const InputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDes}, Years of Experience: ${interviewCount}. 
      Based on this information, please provide 5 interview questions with answers in JSON format.
      Output fields should be "question" and "answer".`;

    try {
      const result = await chatSession.sendMessage(InputPrompt);
      const responseText = await result.response.text();
      const cleanJsonString = responseText.replace('```json', '').replace('```', '');

      setJSONResponse(cleanJsonString);

      if (!cleanJsonString) return;

      const resp = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: cleanJsonString,
        jobPosition,
        jobDescription: jobDes,
        jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy')
      }).returning({ mockId: MockInterview.mockId });

      if (resp[0]?.mockId) {
        router.push(`/dashboard/interview/${resp[0].mockId}`);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-4 md:p-10 border rounded-lg border-gray-200 cursor-pointer hover:scale-105 hover:shadow-md transition-all duration-300"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="font-medium text-center text-base md:text-lg">+ Add new</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl w-[95%] sm:w-full">
          <DialogHeader>
            <DialogTitle>
              <h2 className="font-bold text-xl sm:text-2xl text-center sm:text-left">
                Tell us more about your profession
              </h2>
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit} className="space-y-6 mt-4">
                <div className="space-y-5">
                  <div>
                    <label className="text-blue-800 font-medium block mb-1">
                      Job Role/Position
                    </label>
                    <Input
                      placeholder="Ex. Full Stack Developer"
                      required
                      value={jobPosition}
                      onChange={(e) => setJobPosition(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-blue-800 font-medium block mb-1">
                      Job Description/Tech Stack (In short)
                    </label>
                    <Textarea
                      placeholder="Ex. Frontend Developer, MERN Stack"
                      required
                      value={jobDes}
                      onChange={(e) => setJobDes(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-blue-800 font-medium block mb-1">
                      Years of Experience
                    </label>
                    <Input
                      placeholder="5"
                      type="number"
                      value={jobExperience}
                      onChange={(e) => setJobExperience(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      'Start Interview'
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddnewInterview;
