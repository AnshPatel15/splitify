// src/types/index.d.ts

export {}; // Ensures the file is treated as a module

declare global {
  type Group = {
    id: string;
    name: string;
    description?: string;
    members?: User[];
  };

  type User = {
    user: any;
    id: string;
    clerkId: string;
    name: string;
    email: string;
  };
}
