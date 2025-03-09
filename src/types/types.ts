export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  active: boolean;
  createdAt: Date;
}

export interface RotationSettings {
  frequency: "weekly" | "biweekly" | "monthly";
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 6 = Saturday
  emailNotifications: boolean;
}

export interface RotationAssignment {
  id: string;
  memberId: string;
  startDate: Date;
  endDate: Date;
  completed: boolean;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  githubId: string;
}
