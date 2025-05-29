"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const CreateGroup = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[450px] h-fit p-10 bg-[#FDFAF6] rounded-2xl">
        <span className="text-lg font-semibold">Create a new group</span>
        <form>
          {/* add image later */}
          <div className="my-5">
            <span className="text-sm font-medium mx-1 text-gray-700">
              Name{" "}
            </span>
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

          <Button className="my-5">Create Group</Button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
