import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        {
          status: 401,
        }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? "",
          name: user.firstName || "",
        },
      });
    }

    return NextResponse.json({ message: "User synced" });
  } catch (error: any) {
    console.error("❌ Error in POST /api/your-route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
