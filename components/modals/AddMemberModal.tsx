"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/Modal";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  groupId,
}) => {
  const [memberEmail, setMemberEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState("");

  useState(() => {
    if (typeof window !== "undefined") {
      setInviteLink(`${window.location.origin}/invite?groupId=${groupId}`);
    }
  });

  const handleAddMember = async () => {
    setError(null);
    if (!memberEmail || memberEmail.trim() === "") {
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

      if (!res.ok) {
        setError(data.error || "Error adding member.");
        return;
      }

      onClose();
      setMemberEmail("");
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Member">
      <div className="flex flex-col gap-4">
        <Input
          type="email"
          placeholder="Enter email address"
          value={memberEmail}
          onChange={(e) => setMemberEmail(e.target.value)}
        />
        <Button onClick={handleAddMember}>
          {loading ? "Sending..." : "Send Invite"}
        </Button>
        {error && <span className="text-red-500 text-sm">{error}</span>}

        <hr className="my-2" />
        <div className="text-sm">
          <p className="mb-1">Or copy invite link</p>
          <div className="flex gap-2">
            <Input readOnly value={inviteLink} />
            <Button
              onClick={() => navigator.clipboard.writeText(inviteLink)}
              className="text-xs px-2"
            >
              Copy
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddMemberModal;
