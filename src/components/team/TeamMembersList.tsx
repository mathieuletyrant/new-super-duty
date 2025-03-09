import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { TeamMember } from "@/types/types";
import TeamMemberForm from "./TeamMemberForm";

interface TeamMembersListProps {
  initialMembers?: TeamMember[];
}

export default function TeamMembersList({
  initialMembers = [
    {
      id: "1",
      name: "Jane Smith",
      email: "jane@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      active: true,
      createdAt: new Date(2023, 0, 15),
    },
    {
      id: "2",
      name: "John Doe",
      email: "john@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      active: true,
      createdAt: new Date(2023, 1, 20),
    },
    {
      id: "3",
      name: "Alice Johnson",
      email: "alice@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      active: true,
      createdAt: new Date(2023, 2, 10),
    },
    {
      id: "4",
      name: "Bob Williams",
      email: "bob@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      active: false,
      createdAt: new Date(2023, 3, 5),
    },
  ],
}: TeamMembersListProps) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const handleAddMember = (member: Partial<TeamMember>) => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: member.name || "",
      email: member.email || "",
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`,
      active: member.active !== undefined ? member.active : true,
      createdAt: new Date(),
    };

    setMembers([...members, newMember]);
    setIsAddDialogOpen(false);
  };

  const handleEditMember = (member: Partial<TeamMember>) => {
    if (!currentMember) return;

    const updatedMembers = members.map((m) =>
      m.id === currentMember.id ? { ...m, ...member } : m,
    );

    setMembers(updatedMembers);
    setIsEditDialogOpen(false);
    setCurrentMember(null);
  };

  const handleDeleteMember = () => {
    if (!memberToDelete) return;

    const updatedMembers = members.filter((m) => m.id !== memberToDelete.id);
    setMembers(updatedMembers);
    setMemberToDelete(null);
  };

  const openEditDialog = (member: TeamMember) => {
    setCurrentMember(member);
    setIsEditDialogOpen(true);
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage your team members for rotation
          </CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
            </DialogHeader>
            <TeamMemberForm
              onSubmit={handleAddMember}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No team members added yet
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className={`flex items-center justify-between p-3 rounded-md ${member.active ? "bg-white" : "bg-gray-50"}`}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {member.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!member.active && (
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                      Inactive
                    </span>
                  )}
                  <Dialog
                    open={isEditDialogOpen && currentMember?.id === member.id}
                    onOpenChange={setIsEditDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Team Member</DialogTitle>
                      </DialogHeader>
                      {currentMember && (
                        <TeamMemberForm
                          member={currentMember}
                          onSubmit={handleEditMember}
                          onCancel={() => setIsEditDialogOpen(false)}
                        />
                      )}
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMemberToDelete(member)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove {member.name} from the
                          team? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => setMemberToDelete(null)}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteMember}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
