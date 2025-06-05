// src/types/index.d.ts

export {}; // Ensures the file is treated as a module

declare global {
  type User = {
    user: any;
    id: string;
    clerkId: string;
    name: string;
    email: string;
  };

  type GroupMember = {
    id: string;
    user: {
      id: string;
      name: string | null;
      email: string;
      clerkId: string;
    };
  };

  type Group = {
    id: string;
    name: string;
    description: string | null;
    members: GroupMember[];
  };

  type Expense = {
    title: string;
    description: string;
    amount: number;
    currency: string;
    category: ExpenseCategory;
    splitType: SplitType;
    expenseDate: string;
    payments: { userId: string; amount: number }[];
    shares: { userId: string; amount: number }[];
    groupId?: string;
    createdById: string;
    receiptUrl?: string;
  };
}
