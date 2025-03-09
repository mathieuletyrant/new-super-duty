import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RotationAssignment from "./RotationAssignment";
import { RotationProvider, useRotations } from "./RotationList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RotationsPageContent() {
  const { rotations } = useRotations();
  const navigate = useNavigate();
  const [activeRotations] = useState(
    rotations.filter((r) => r.active !== false),
  );

  const handleAddRotation = () => {
    navigate("/settings");
  };

  if (activeRotations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <h2 className="text-xl font-medium">No active rotations found</h2>
        <p className="text-muted-foreground text-center max-w-md">
          You don't have any active rotations set up yet. Create a rotation in
          the settings to get started.
        </p>
        <Button onClick={handleAddRotation} className="mt-4">
          <Plus className="mr-2 h-4 w-4" />
          Create Rotation
        </Button>
      </div>
    );
  }

  return (
    <Tabs defaultValue={activeRotations[0]?.id} className="space-y-4">
      <div className="flex justify-between items-center">
        <TabsList className="flex-1">
          {activeRotations.map((rotation) => (
            <TabsTrigger
              key={rotation.id}
              value={rotation.id}
              className="flex-1"
              style={{
                borderBottom: `3px solid ${rotation.color || "#4f46e5"}`,
                opacity: 1,
              }}
            >
              {rotation.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddRotation}
          className="ml-2"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {activeRotations.map((rotation) => (
        <TabsContent key={rotation.id} value={rotation.id}>
          <RotationAssignment
            rotationId={rotation.id}
            rotationName={rotation.name}
            rotationType={rotation.type as "weekly" | "daily"}
            color={rotation.color}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default function RotationsPage() {
  return (
    <RotationProvider>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rotations</h1>
            <p className="text-muted-foreground">
              Manage different rotation schedules
            </p>
          </div>

          <RotationsPageContent />
        </div>
      </DashboardLayout>
    </RotationProvider>
  );
}
