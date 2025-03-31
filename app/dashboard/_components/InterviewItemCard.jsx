import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2 } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview, UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'

function InterviewItemCard({ interview }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const onStart = () => {
    router.push('/dashboard/interview/' + interview?.mockId);
  };

  const onFeedbackPress = () => {
    router.push('/dashboard/interview/' + interview?.mockId + '/feedback');
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Delete related answers first
      await db.delete(UserAnswer)
        .where(eq(UserAnswer.mockIdref, interview.mockId));

      // Then delete the interview
      await db.delete(MockInterview)
        .where(eq(MockInterview.mockId, interview.mockId));

      router.refresh(); // Refresh the list
      toast.success('Interview deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete interview');
    } finally {
      setIsDeleting(false);
      setOpenDeleteDialog(false);
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-xl p-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl animate-fadeIn">
      {/* Floating Delete Button */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-3 right-3 h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition"
            aria-label="Delete interview"
          >
            <Trash2 className="h-5 w-5 text-blue-600" />
          </Button>
        </DialogTrigger>
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Interview</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this interview? This action cannot be undone.
              All related answers and feedback will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOpenDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mb-4">
        <h2 className="font-medium text-l text-blue-800">{interview?.jobPosition}</h2>
        <p className="text-sm text-gray-500">{interview.jobExperience} Years of Experience</p>
        <p className="text-xs text-gray-400 mt-1">Created At: {interview.createdAt}</p>
      </div>
      
      <div className="flex justify-between mt-6 gap-3">
        <Button size="sm" variant="outline" onClick={onFeedbackPress} className="flex-1 transition hover:scale-105">
          Feedback
        </Button>
        <Button size="sm" onClick={onStart} className="flex-1 transition hover:scale-105">
          Start
        </Button>
      </div>
    </div>
  )
}

export default InterviewItemCard;
