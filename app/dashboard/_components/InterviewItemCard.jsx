import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from 'lucide-react';
import { db } from '@/utils/db';
import { MockInterview, UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { toast } from 'sonner';

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
      await db.delete(UserAnswer).where(eq(UserAnswer.mockIdref, interview.mockId));
      await db.delete(MockInterview).where(eq(MockInterview.mockId, interview.mockId));

      router.refresh();
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
    <div className="relative bg-white rounded-2xl shadow-xl p-4 sm:p-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl animate-fadeIn w-full">
      
      {/* Delete Button */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 sm:top-3 sm:right-3 h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition"
            aria-label="Delete interview"
          >
            <Trash2 className="h-5 w-5 text-blue-600" />
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[95%] max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Interview</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this interview? This action cannot be undone.
              All related answers and feedback will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
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

      {/* Card Content */}
      <div className="mb-4">
        <h2 className="font-semibold text-blue-800 text-base sm:text-lg truncate">
          {interview?.jobPosition}
        </h2>
        <p className="text-sm text-gray-500">{interview.jobExperience} Years of Experience</p>
        <p className="text-xs text-gray-400 mt-1">Created At: {interview.createdAt}</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onFeedbackPress} 
          className="flex-1 transition hover:scale-105"
        >
          Feedback
        </Button>
        <Button 
          size="sm" 
          onClick={onStart} 
          className="flex-1 transition hover:scale-105"
        >
          Start
        </Button>
      </div>
    </div>
  );
}

export default InterviewItemCard;
