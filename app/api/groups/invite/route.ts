import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groupId } = await req.json();

    if (!groupId) {
      return NextResponse.json({ error: "Group ID required" }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in DB" },
        { status: 404 }
      );
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const isAlreadyMember = group.members.some((m) => m.id === dbUser.id);

    if (!isAlreadyMember) {
      await prisma.groupMember.create({
        data: {
          userId: dbUser.id,
          groupId,
          role: "MEMBER",
        },
      });
    }

    return NextResponse.json({ message: "User joined the group" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
