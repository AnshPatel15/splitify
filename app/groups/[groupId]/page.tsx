"use client";

import { Button } from "@/components/ui/button";
import { IoPeopleSharp } from "react-icons/io5";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AddMemberModal from "@/components/modals/AddMemberModal";
import AddExpenseModal, {
  ExpenseFormData,
} from "@/components/modals/AddExpenseModal";
import { useUser } from "@clerk/nextjs";

// Types
interface GroupMember {
  id: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    clerkId: string;
  };
}

interface Group {
  id: string;
  name: string;
  description: string | null;
  members: GroupMember[];
}

// Components
const GroupHeader = ({
  group,
  onAddExpense,
  onAddMember,
  onToggleSettings,
  showSettings,
}: {
  group: Group | null;
  onAddExpense: () => void;
  onAddMember: () => void;
  onToggleSettings: () => void;
  showSettings: boolean;
}) => (
  <div className="bg-gray-700 text-amber-50 flex items-center justify-center h-36 relative rounded-b-xl shadow-2xl">
    <div className="flex items-center flex-col gap-2">
      <h1 className="text-xl capitalize">
        {group?.name || "Loading group..."}
      </h1>
      <p className="text-md">{group?.description || ""}</p>
      <div className="flex gap-2 mt-4">
        <Button
          onClick={onAddExpense}
          className="h-7 cursor-pointer"
          variant="secondary"
        >
          <RiMoneyRupeeCircleFill />
          Add expense +
        </Button>
        <Button
          onClick={onAddMember}
          className="h-7 hover:bg-gray-200 hover:text-black cursor-pointer"
          variant="default"
        >
          <IoPeopleSharp className="hover:text-black" />
          Add member +
        </Button>
      </div>
    </div>
    <Image
      onClick={onToggleSettings}
      className={`cursor-pointer absolute top-4 left-4 ${
        showSettings ? "rotate-180" : ""
      } transition-all duration-300 ease-in-out`}
      src="/settings.png"
      alt="group-settings"
      width={22}
      height={22}
    />
  </div>
);

const GroupSettings = ({ group }: { group: Group | null }) => (
  <div className="bg-gray-200 p-4 rounded-lg shadow-lg w-[90%] md:w-[500px] mx-auto mt-4">
    <h2 className="text-lg font-semibold mb-2">Group Settings</h2>
    <p className="text-sm text-gray-700">
      Here you can manage your group settings.
    </p>
    <div className="mt-4">
      <h2>Members: </h2>
      <ul className="list-disc pl-5">
        {group?.members?.map((member) => (
          <li key={member.id} className="text-sm text-gray-700">
            {member.user.name}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// Services
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
    <div className="h-screen bg-white">
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
    </div>
  );
};

export default GroupPage;
