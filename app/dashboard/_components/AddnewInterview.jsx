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
    const {user} = useUser();

    const onSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      console.log(jobPosition, jobDes, jobExperience);
    
      const interviewCount = process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || jobExperience;
    
      const InputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDes}, Years of Experience: ${interviewCount}. 
        Based on this information, please provide 5 interview questions with answers in JSON format.
        Output fields should be "question" and "answer".`;
    
      try {
        const result = await chatSession.sendMessage(InputPrompt);
        const responseText = await result.response.text();
        const cleanJsonString = responseText.replace('```json', '').replace('```', '');
        console.log(JSON.parse(cleanJsonString));
    
        setJSONResponse(cleanJsonString);
    
        if (!cleanJsonString) {
          console.log("No response from AI model");
          return; // Exit early if no response
        }
    
        // Perform the database insert
        const resp = await db.insert(MockInterview).values({
          mockId: uuidv4(),
          jsonMockResp: cleanJsonString,
          jobPosition: jobPosition,
          jobDescription: jobDes,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-yyyy')
        }).returning({ mockId: MockInterview.mockId });
    
        console.log("Inserted Id:", resp);
    
        // Redirect to the new interview page using the mockId
        if (resp[0]?.mockId) {
          router.push(`/dashboard/interview/${resp[0].mockId}`);
        } else {
          console.error("No mockId returned from insert operation");
        }
    
      } catch (error) {
        console.error("Error fetching AI response or inserting data:", error);
      } finally {
        setLoading(false); // Ensure loading is turned off
      }
    };

    return (
      <div>
        <div
          className="p-10 border rounded-lg border-gray-200 cursor-pointer hover:scale-105 hover:shadow-md transition-all duration-300"
          onClick={() => setOpenDialog(true)}
        >
          <h2 className="font-medium text-center text-lg">+ Add new</h2>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                <h2 className="font-bold text-2xl">Tell us more about your profession</h2>
              </DialogTitle>
              <DialogDescription>
                <form onSubmit={onSubmit}>
                  <div>
                    <h2>Add details about your Job position/role, Job description, and years of experience</h2>
                    <div className="mt-7 my-2">
                      <label className="text-blue-800 font-medium">Job Role/Position</label>
                      <Input
                        className="mt-2"
                        placeholder="Ex. Full Stack Developer"
                        required
                        value={jobPosition}
                        onChange={(event) => setJobPosition(event.target.value)}
                      />
                    </div>
                    <div className="mt-7 my-2">
                      <label className="text-blue-800 font-medium">Job Description/Tech Stack (In short)</label>
                      <Textarea
                        className="mt-2"
                        placeholder="Ex. Frontend Developer, MERN Stack"
                        required
                        value={jobDes}
                        onChange={(event) => setJobDes(event.target.value)}
                      />
                    </div>
                    <div className="mt-3 my-2">
                      <label className="text-blue-800 font-medium">Years of Experience</label>
                      <Input
                        className="mt-2"
                        placeholder="5"
                        type="number"
                        value={jobExperience}
                        onChange={(event) => setJobExperience(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-5 justify-end mt-5">
                    <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <LoaderCircle className="animate-spin" /> Generating from AI
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
