import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, imageUrl } = await req.json();

    const createdGroup = await prisma.group.create({
      data: {
        name,
        description,
        imageUrl,
        createdBy: {
          connect: {
            clerkId: user.id,
          },
        },
        members: {
          create: {
            user: {
              connect: {
                clerkId: user.id,
              },
            },
            role: "ADMIN",
          },
        },
      },
    });

    return NextResponse.json(createdGroup);
  } catch (error: any) {
    console.error("Error creating group:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");

    if (groupId) {
      const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
          createdBy: true,
          members: {
            include: { user: true },
          },
        },
      });

      const isMember = group?.members.some((m) => m.user.clerkId === user.id);

      if (!group || !isMember) {
        return NextResponse.json(
          { error: "Not authorized or group not found" },
          { status: 403 }
        );
      }

      return NextResponse.json(group);
    } else {
      const groups = await prisma.group.findMany({
        where: {
          members: {
            some: {
              user: {
                clerkId: user.id,
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
        },
      });

      return NextResponse.json(groups);
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}
