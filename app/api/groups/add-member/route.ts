import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groupId, memberEmail, memberPhone } = await req.json();

    if (!groupId || (!memberEmail && !memberPhone)) {
      return NextResponse.json(
        { error: "Group ID and either member email or phone are required" },
        { status: 400 }
      );
    }

    const newMember = memberEmail
      ? await prisma.user.findUnique({ where: { email: memberEmail } })
      : await prisma.user.findUnique({ where: { phone: memberPhone } });

    if (!newMember) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      include: { members: true },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // check if user is admin in group

    const currentDbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!currentDbUser) {
      return NextResponse.json(
        { error: "User not found in DB" },
        { status: 404 }
      );
    }

    const isAdmin = group.members.some(
      (m) => m.userId === currentDbUser?.id && m.role === "ADMIN"
    );

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Only group admins can add members" },
        { status: 403 }
      );
    }

    const alreadyMember = group.members.some((m) => m.userId === newMember.id);

    if (alreadyMember) {
      return NextResponse.json(
        { error: "User is already a member" },
        { status: 400 }
      );
    }

    await prisma.groupMember.create({
      data: {
        userId: newMember.id,
        groupId: group.id,
        role: "MEMBER",
      },
    });

    return NextResponse.json({ message: "Member added successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
