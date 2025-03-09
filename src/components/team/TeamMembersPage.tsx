import DashboardLayout from "../layout/DashboardLayout";
import TeamMembersList from "./TeamMembersList";

export default function TeamMembersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">
            Manage your team members for rotation
          </p>
        </div>

        <TeamMembersList />
      </div>
    </DashboardLayout>
  );
}
