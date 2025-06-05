import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      amount,
      currency,
      category,
      splitType,
      expenseDate,
      payments,
      shares,
      groupId,
      createdById,
      recieptUrl,
    } = body;

    const expense = await prisma.expense.create({
      data: {
        title,
        description,
        amount,
        currency,
        category,
        splitType,
        expenseDate: new Date(expenseDate),
        groupId,
        createdById,
        receiptUrl: recieptUrl,

        payments: {
          create: payments.map(
            (payment: { userId: string; amount: number }) => ({
              userId: payment.userId,
              amount: payment.amount,
            })
          ),
        },
        shares: {
          create: shares.map((share: { userId: string; amount: number }) => ({
            userId: share.userId,
            amount: share.amount,
          })),
        },
        activities: {
          create: {
            userId: createdById,
            type: "EXPENSE_CREATED",
            description: `Created expense: ${title}`,
          },
        },
      },
    });

    return NextResponse.json({ success: true, expense }, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
