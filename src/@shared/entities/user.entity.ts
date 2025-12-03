import { PlanEnum } from '@prisma/client';

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  credits: number;
  plans: PlanEnum;
  createdAt: Date;
  updatedAt: Date;
}
