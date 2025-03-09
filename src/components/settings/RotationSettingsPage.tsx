import DashboardLayout from "../layout/DashboardLayout";
import RotationList, { RotationProvider } from "../rotation/RotationList";

export default function RotationSettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure your rotation settings
          </p>
        </div>

        <RotationProvider>
          <RotationList />
        </RotationProvider>
      </div>
    </DashboardLayout>
  );
}
