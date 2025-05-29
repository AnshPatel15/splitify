"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateGroup = () => {
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  const isFormValid =
    formValues.name.trim() !== "" && formValues.description.trim() !== "";

  const handleCreateGroup = async () => {
    if (!isFormValid) return;

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        body: JSON.stringify({ ...formValues }),
        headers: { "content-type": "application/json" },
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Group created: ", data);
        router.push(`/groups/${data.id}`);
      } else {
        console.error("group creation failed: ", data.error);
      }
    } catch (err: any) {
      throw new Error("Group creation failed!: ", err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[450px] h-fit p-10 bg-[#FDFAF6] rounded-2xl">
        <span className="text-lg font-semibold">Create a new group</span>

        {/* add image later */}
        <div className="my-5">
          <span className="text-sm font-medium mx-1 text-gray-700">Name </span>
          <Input
            className="border-black"
            value={formValues.name}
            placeholder="Group Name"
            onChange={(e) =>
              setFormValues({ ...formValues, name: e.target.value })
            }
          />
        </div>

        <div className="my-5">
          <span className="text-sm font-medium mx-1 text-gray-700">
            Description{" "}
          </span>
          <Textarea
            className="border-black"
            value={formValues.description}
            onChange={(e) =>
              setFormValues({ ...formValues, description: e.target.value })
            }
          />
        </div>

        <Button
          onClick={handleCreateGroup}
          className="my-5 cursor-pointer"
          disabled={!isFormValid}
        >
          Create Group
        </Button>
      </div>
    </div>
  );
};

export default CreateGroup;
