import { useState, useContext, createContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Users, ArrowUp, ArrowDown } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface Rotation {
  id: string;
  name: string;
  description: string;
  type: "weekly" | "daily" | "monthly";
  teamMembers: string[];
  color?: string;
  active?: boolean;
  memberOrder?: string[];
}

// Create a context to share rotation data across components
interface RotationContextType {
  rotations: Rotation[];
  addRotation: (rotation: Rotation) => void;
  updateRotation: (id: string, rotation: Partial<Rotation>) => void;
  deleteRotation: (id: string) => void;
}

const defaultRotations: Rotation[] = [
  {
    id: "1",
    name: "Maintenance",
    description:
      "Weekly maintenance rotation for system upkeep and regular checks",
    type: "weekly",
    teamMembers: ["1", "2", "3"],
    color: "#4f46e5",
    active: true,
    memberOrder: ["1", "2", "3"],
  },
  {
    id: "2",
    name: "On-Call Support",
    description:
      "Daily on-call support rotation for urgent issues and customer requests",
    type: "daily",
    teamMembers: ["2", "4"],
    color: "#10b981",
    active: true,
    memberOrder: ["2", "4"],
  },
  {
    id: "3",
    name: "Security Audit",
    description:
      "Monthly security audit rotation for compliance and vulnerability checks",
    type: "monthly",
    teamMembers: ["1", "3"],
    color: "#f59e0b",
    active: true,
    memberOrder: ["3", "1"],
  },
];

export const RotationContext = createContext<RotationContextType>({
  rotations: defaultRotations,
  addRotation: () => {},
  updateRotation: () => {},
  deleteRotation: () => {},
});

export const useRotations = () => useContext(RotationContext);

export const RotationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [rotations, setRotations] = useState<Rotation[]>(defaultRotations);

  const addRotation = (rotation: Rotation) => {
    setRotations([...rotations, rotation]);
  };

  const updateRotation = (id: string, updatedData: Partial<Rotation>) => {
    setRotations(
      rotations.map((rotation) =>
        rotation.id === id ? { ...rotation, ...updatedData } : rotation,
      ),
    );
  };

  const deleteRotation = (id: string) => {
    setRotations(rotations.filter((rotation) => rotation.id !== id));
  };

  return (
    <RotationContext.Provider
      value={{ rotations, addRotation, updateRotation, deleteRotation }}
    >
      {children}
    </RotationContext.Provider>
  );
};

const colorOptions = [
  { name: "Blue", value: "#4f46e5" },
  { name: "Green", value: "#10b981" },
  { name: "Yellow", value: "#f59e0b" },
  { name: "Red", value: "#ef4444" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
];

// Mock team members for selection
const teamMembers = [
  { id: "1", name: "Jane Smith" },
  { id: "2", name: "John Doe" },
  { id: "3", name: "Alice Johnson" },
  { id: "4", name: "Bob Williams" },
  { id: "5", name: "Charlie Brown" },
];

function RotationOrderManager({ rotation }: { rotation: Rotation }) {
  const { updateRotation } = useRotations();
  const [members, setMembers] = useState<string[]>(
    rotation.memberOrder || rotation.teamMembers || [],
  );
  const [isSaved, setIsSaved] = useState(false);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newMembers = [...members];
    [newMembers[index - 1], newMembers[index]] = [
      newMembers[index],
      newMembers[index - 1],
    ];
    setMembers(newMembers);
    setIsSaved(false);
  };

  const moveDown = (index: number) => {
    if (index === members.length - 1) return;
    const newMembers = [...members];
    [newMembers[index], newMembers[index + 1]] = [
      newMembers[index + 1],
      newMembers[index],
    ];
    setMembers(newMembers);
    setIsSaved(false);
  };

  const handleSave = () => {
    updateRotation(rotation.id, { memberOrder: members });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const getTeamMember = (id: string) => {
    return teamMembers.find((m) => m.id === id);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {members.map((memberId, index) => {
          const member = getTeamMember(memberId);
          if (!member) return null;

          return (
            <div
              key={memberId}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 text-center font-medium text-gray-500">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{member.name}</div>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveDown(index)}
                  disabled={index === members.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <Button
        onClick={handleSave}
        className="w-full mt-4 flex items-center justify-center gap-2"
      >
        {isSaved ? "Order Saved!" : "Save Rotation Order"}
      </Button>
    </div>
  );
}

export default function RotationList() {
  const { rotations, addRotation, updateRotation, deleteRotation } =
    useRotations();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentRotation, setCurrentRotation] = useState<Rotation | null>(null);
  const [rotationToDelete, setRotationToDelete] = useState<Rotation | null>(
    null,
  );
  const [teamMembersDialogOpen, setTeamMembersDialogOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<Rotation>>({
    name: "",
    description: "",
    type: "weekly",
    teamMembers: [],
    color: "#4f46e5",
    active: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type: "weekly" | "daily" | "monthly") => {
    setFormData((prev) => ({ ...prev, type }));
  };

  const handleColorChange = (color: string) => {
    setFormData((prev) => ({ ...prev, color }));
  };

  const handleTeamMemberToggle = (memberId: string) => {
    setFormData((prev) => {
      const currentMembers = prev.teamMembers || [];
      if (currentMembers.includes(memberId)) {
        return {
          ...prev,
          teamMembers: currentMembers.filter((id) => id !== memberId),
        };
      } else {
        return {
          ...prev,
          teamMembers: [...currentMembers, memberId],
        };
      }
    });
  };

  const handleAddRotation = () => {
    const teamMembersList = formData.teamMembers || [];
    const newRotation: Rotation = {
      id: Date.now().toString(),
      name: formData.name || "New Rotation",
      description: formData.description || "",
      type: formData.type || "weekly",
      teamMembers: teamMembersList,
      memberOrder: [...teamMembersList], // Initialize member order with the same order as team members
      color: formData.color || "#4f46e5",
      active: formData.active !== undefined ? formData.active : true,
    };

    addRotation(newRotation);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditRotation = () => {
    if (!currentRotation) return;

    const teamMembersList = formData.teamMembers || [];
    // Preserve existing member order if possible, or create a new one
    const existingOrder = currentRotation.memberOrder || [];
    const newOrder = [...teamMembersList];

    // Keep existing members in their current order
    const preservedOrder = existingOrder.filter((id) =>
      teamMembersList.includes(id),
    );
    // Add any new members that weren't in the original order
    const newMembers = teamMembersList.filter(
      (id) => !existingOrder.includes(id),
    );
    const memberOrder = [...preservedOrder, ...newMembers];

    updateRotation(currentRotation.id, {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      teamMembers: teamMembersList,
      memberOrder,
      color: formData.color,
      active: formData.active,
    });

    setIsEditDialogOpen(false);
    setCurrentRotation(null);
    resetForm();
  };

  const handleDeleteRotation = () => {
    if (!rotationToDelete) return;
    deleteRotation(rotationToDelete.id);
    setRotationToDelete(null);
  };

  const openEditDialog = (rotation: Rotation) => {
    setCurrentRotation(rotation);
    setFormData({
      name: rotation.name,
      description: rotation.description,
      type: rotation.type,
      teamMembers: rotation.teamMembers,
      color: rotation.color,
      active: rotation.active,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "weekly",
      teamMembers: [],
      color: "#4f46e5",
      active: true,
    });
  };

  const getTeamMemberNames = (memberIds: string[]) => {
    return memberIds
      .map((id) => teamMembers.find((member) => member.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Rotation Management</CardTitle>
          <CardDescription>Manage different types of rotations</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Rotation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Rotation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Rotation Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Maintenance"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of this rotation"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Rotation Type</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={formData.type === "daily" ? "default" : "outline"}
                    onClick={() => handleTypeChange("daily")}
                    className="flex-1"
                  >
                    Daily
                  </Button>
                  <Button
                    type="button"
                    variant={formData.type === "weekly" ? "default" : "outline"}
                    onClick={() => handleTypeChange("weekly")}
                    className="flex-1"
                  >
                    Weekly
                  </Button>
                  <Button
                    type="button"
                    variant={
                      formData.type === "monthly" ? "default" : "outline"
                    }
                    onClick={() => handleTypeChange("monthly")}
                    className="flex-1"
                  >
                    Monthly
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${formData.color === color.value ? "border-gray-900" : "border-transparent"}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => handleColorChange(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Team Members</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTeamMembersDialogOpen(true)}
                    className="flex items-center gap-1"
                  >
                    <Users className="h-4 w-4" />
                    Select Members
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formData.teamMembers && formData.teamMembers.length > 0
                    ? getTeamMemberNames(formData.teamMembers)
                    : "No team members selected"}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      active: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="active">Active</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleAddRotation}>
                  Add Rotation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={teamMembersDialogOpen}
          onOpenChange={setTeamMembersDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Team Members</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2 max-h-[300px] overflow-y-auto">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`member-${member.id}`}
                    checked={(formData.teamMembers || []).includes(member.id)}
                    onCheckedChange={() => handleTeamMemberToggle(member.id)}
                  />
                  <Label htmlFor={`member-${member.id}`}>{member.name}</Label>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setTeamMembersDialogOpen(false)}>
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {rotations.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No rotations added yet
          </div>
        ) : (
          <Tabs defaultValue="rotations" className="space-y-4">
            <TabsList>
              <TabsTrigger value="rotations">Rotations</TabsTrigger>
              <TabsTrigger value="order">Member Order</TabsTrigger>
            </TabsList>

            <TabsContent value="rotations">
              <div className="space-y-4">
                {rotations.map((rotation) => (
                  <div
                    key={rotation.id}
                    className={`flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 ${!rotation.active ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className="w-4 h-full min-h-[24px] rounded-full flex-shrink-0 mt-1"
                        style={{ backgroundColor: rotation.color || "#4f46e5" }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{rotation.name}</h3>
                          <Badge
                            variant={
                              rotation.type === "weekly"
                                ? "default"
                                : rotation.type === "daily"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {rotation.type === "weekly"
                              ? "Weekly"
                              : rotation.type === "daily"
                                ? "Daily"
                                : "Monthly"}
                          </Badge>
                          {!rotation.active && (
                            <Badge
                              variant="outline"
                              className="text-muted-foreground"
                            >
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {rotation.description}
                        </p>
                        <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {rotation.teamMembers.length} team members:{" "}
                          {getTeamMemberNames(rotation.teamMembers)}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Dialog
                        open={
                          isEditDialogOpen &&
                          currentRotation?.id === rotation.id
                        }
                        onOpenChange={setIsEditDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(rotation)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Edit Rotation</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-name">Rotation Name</Label>
                              <Input
                                id="edit-name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-description">
                                Description
                              </Label>
                              <Textarea
                                id="edit-description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Rotation Type</Label>
                              <div className="flex space-x-2">
                                <Button
                                  type="button"
                                  variant={
                                    formData.type === "daily"
                                      ? "default"
                                      : "outline"
                                  }
                                  onClick={() => handleTypeChange("daily")}
                                  className="flex-1"
                                >
                                  Daily
                                </Button>
                                <Button
                                  type="button"
                                  variant={
                                    formData.type === "weekly"
                                      ? "default"
                                      : "outline"
                                  }
                                  onClick={() => handleTypeChange("weekly")}
                                  className="flex-1"
                                >
                                  Weekly
                                </Button>
                                <Button
                                  type="button"
                                  variant={
                                    formData.type === "monthly"
                                      ? "default"
                                      : "outline"
                                  }
                                  onClick={() => handleTypeChange("monthly")}
                                  className="flex-1"
                                >
                                  Monthly
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Color</Label>
                              <div className="flex flex-wrap gap-2">
                                {colorOptions.map((color) => (
                                  <button
                                    key={color.value}
                                    type="button"
                                    className={`w-8 h-8 rounded-full border-2 ${formData.color === color.value ? "border-gray-900" : "border-transparent"}`}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() =>
                                      handleColorChange(color.value)
                                    }
                                    title={color.name}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Label>Team Members</Label>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setTeamMembersDialogOpen(true)}
                                  className="flex items-center gap-1"
                                >
                                  <Users className="h-4 w-4" />
                                  Select Members
                                </Button>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {formData.teamMembers &&
                                formData.teamMembers.length > 0
                                  ? getTeamMemberNames(formData.teamMembers)
                                  : "No team members selected"}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="edit-active"
                                checked={formData.active}
                                onCheckedChange={(checked) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    active: checked as boolean,
                                  }))
                                }
                              />
                              <Label htmlFor="edit-active">Active</Label>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsEditDialogOpen(false);
                                  setCurrentRotation(null);
                                  resetForm();
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="button"
                                onClick={handleEditRotation}
                              >
                                Save Changes
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setRotationToDelete(rotation)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Rotation</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the "
                              {rotation.name}" rotation? This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => setRotationToDelete(null)}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteRotation}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="order">
              <div className="space-y-6">
                {rotations.map((rotation) => (
                  <div key={rotation.id} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: rotation.color || "#4f46e5" }}
                      />
                      <h3 className="text-lg font-medium">{rotation.name}</h3>
                    </div>
                    <RotationOrderManager rotation={rotation} />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
