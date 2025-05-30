"use client";

import { Button } from "@/components/ui/button";
import { IoPeopleSharp } from "react-icons/io5";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Modal from "@/components/Modal";
import { Input } from "@/components/ui/input";

const GroupPage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState<Group | null>(null);

  const [showSettings, setShowSettings] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const generateInviteLink = (groupId: string) => {
    return `${window.location.origin}/invite?groupId=${groupId}`;
  };

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const res = await fetch(`/api/groups?groupId=${groupId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setGroup(data);
        console.log("data: ", data);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);

  const handleAddMember = () => {};

  return (
    <div className="h-screen bg-white">
      <div className="bg-gray-700 text-amber-50 flex items-center justify-center h-36 relative rounded-b-xl shadow-2xl">
        <div className="flex items-center flex-col gap-2">
          <h1 className=" text-xl capitalize">
            {group?.name || "Loading group..."}
          </h1>
          <p className=" text-md">{group?.description || ""}</p>
          <div className="flex gap-2 mt-4">
            <Button className="h-7 cursor-pointer" variant="secondary">
              <RiMoneyRupeeCircleFill />
              Add expense +
            </Button>
            <Button
              onClick={() => {
                setShowAddMemberModal(true);
              }}
              className="h-7 hover:bg-gray-200 hover:text-black cursor-pointer"
              variant="default"
            >
              <IoPeopleSharp className=" hover:text-black" />
              Add member +
            </Button>
          </div>
        </div>
        <span>
          <Image
            onClick={() => setShowSettings(!showSettings)}
            className={`cursor-pointer top-4 left-4 absolute ${
              showSettings ? "rotate-180" : ""
            } transition-all duration-300 ease-in-out`}
            src="/settings.png"
            alt="group-settings"
            width={22}
            height={22}
          />
        </span>
      </div>
      {showSettings && (
        <div className="bg-gray-200 p-4 rounded-lg shadow-lg w-[90%] md:w-[500px] mx-auto mt-4">
          <h2 className="text-lg font-semibold mb-2">Group Settings</h2>
          <p className="text-sm text-gray-700">
            Here you can manage your group settings.
          </p>
          {/* Add more settings options here */}
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
      )}
      {/* Modal */}
      <Modal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        title="Add Member"
      >
        <div className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Enter email address"
            className="border border-gray-300"
          />
          <Button variant="default">Send Invite</Button>

          <hr className="my-2" />
          <div className="text-sm">
            <p className="mb-1">Or copy invite link</p>
            <div className="flex gap-2">
              <Input
                readOnly
                className="w-full p-2 text-sm"
                value={groupId ? generateInviteLink(groupId as string) : ""}
              />
              <Button
                className="text-xs px-2"
                onClick={() => {
                  navigator.clipboard.writeText(
                    generateInviteLink(groupId as string)
                  );
                }}
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GroupPage;
