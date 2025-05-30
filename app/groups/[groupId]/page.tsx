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

  const [Loading, setLoading] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (groupId && typeof window !== "undefined") {
      setInviteLink(`${window.location.origin}/invite?groupId=${groupId}`);
    }
  }, [groupId]);

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

  const handleAddMember = async () => {
    setError(null);
    if (!memberEmail || !groupId || memberEmail.trim() === "") {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/groups/add-member", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          groupId,
          memberEmail,
        }),
      });
      const data = await res.json();
      console.log("Response data:", data);
      if (res.ok) {
        setMemberEmail("");
        setShowAddMemberModal(false);
      } else {
        setError(data.error || "Error adding member.");
        console.error("Error response:", data);
      }
    } catch (error) {
      console.error("Error adding member:", error);
    } finally {
      setLoading(false);
      setShowAddMemberModal(false);
      setMemberEmail("");
    }
  };

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
        onClose={() => {
          setShowAddMemberModal(false);
          setMemberEmail("");
          setError(null);
        }}
        title="Add Member"
      >
        <div className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Enter email address"
            className="border border-gray-300"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
          />
          <Button
            className="cursor-pointer"
            onClick={handleAddMember}
            variant="default"
          >
            {Loading ? "Sending..." : "Send Invite"}
          </Button>
          {error && <span className="text-red-500 text-sm">{error}</span>}

          <hr className="my-2" />
          <div className="text-sm">
            <p className="mb-1">Or copy invite link</p>
            <div className="flex gap-2">
              <Input
                readOnly
                className="w-full p-2 text-sm"
                value={inviteLink}
              />
              <Button
                className="text-xs px-2 cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(inviteLink);
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
