import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteClassById,getClassById } from '@/lib/api-service';
import { Class } from '@/types';

export function ClassActions({ classId,isStudent }: { classId: string,isStudent:boolean }) {
  const [open, setOpen] = useState(false);
  const [classDetails, setClassDetails] = useState<Class | null>(null);

  const handleView = async () => {
    try {
      const data = await getClassById(classId);
      setClassDetails(data);
      setOpen(true);
    } catch (err) {
      toast.error("Failed to load class details");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this class?");
    if (!confirmed) return;

    try {
      await deleteClassById(classId);
      toast.success("Class deleted");
      // optional: invalidate query
    } catch (err) {
      toast.error("Failed to delete class");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical className="w-5 h-5 cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Class options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem>
        {  !isStudent&& <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>}
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Class Details</DialogTitle>
        </DialogHeader>
        {classDetails ? (
          <div className="space-y-2">
            <p><strong>Id:</strong> {classDetails._id}</p>
            <p><strong>Subject:</strong> {classDetails.subject}</p>
            <p><strong>Date:</strong> {new Date(classDetails.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {classDetails.time}</p>
            <p><strong>Duration:</strong> {classDetails.duration} minutes</p>
            <p><strong>Description:</strong> {classDetails.description || "N/A"}</p>
            {/* You can list students or materials if needed */}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
