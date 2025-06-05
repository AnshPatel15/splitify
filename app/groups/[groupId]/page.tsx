"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AddMemberModal from "@/components/modals/AddMemberModal";
import AddExpenseModal, {
  ExpenseFormData,
} from "@/components/modals/AddExpenseModal";
import { useUser } from "@clerk/nextjs";
import GroupHeader from "./GroupHeader";
import GroupSettings from "./GroupSettings";
import ExpenseSheet from "./ExpenseSheet";

const groupService = {
  async fetchGroup(groupId: string): Promise<Group> {
    const res = await fetch(`/api/groups?groupId=${groupId}`);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  },

  async createExpense(expenseData: ExpenseFormData): Promise<void> {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenseData),
    });

    if (!res.ok) {
      throw new Error("Failed to add expense");
    }
  },
};

// Main Component
const GroupPage = () => {
  const { groupId } = useParams();
  const { user } = useUser();
  const [group, setGroup] = useState<Group | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupId) return;

      try {
        const data = await groupService.fetchGroup(String(groupId));
        setGroup(data);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };

    fetchGroupData();
  }, [groupId]);

  const handleAddExpense = async (expenseData: ExpenseFormData) => {
    try {
      await groupService.createExpense(expenseData);
      const updatedGroup = await groupService.fetchGroup(String(groupId));
      setGroup(updatedGroup);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const currentUserId =
    group?.members?.find((m) => m.user.clerkId === user?.id)?.user.id || "";

  const transformedMembers =
    group?.members?.map((member) => ({
      id: member.user.id,
      name: member.user.name || "",
      email: member.user.email,
    })) || [];

  return (
    <div className="h-full bg-white">
      <GroupHeader
        group={group}
        onAddExpense={() => setShowExpenseModal(true)}
        onAddMember={() => setShowAddMemberModal(true)}
        onToggleSettings={() => setShowSettings(!showSettings)}
        showSettings={showSettings}
      />

      {showSettings && <GroupSettings group={group} />}

      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        groupId={String(groupId)}
      />

      <AddExpenseModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        members={transformedMembers}
        currentUserId={currentUserId}
        groupId={String(groupId)}
        onAddExpense={handleAddExpense}
      />

      <ExpenseSheet groupId={String(groupId)} />
    </div>
  );
};

export default GroupPage;
