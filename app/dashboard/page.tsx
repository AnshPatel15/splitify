"use client";

import GroupCard from "@/components/GroupCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Group {
  id: string;
  name: string;
  description: string;
}

const Dashboard = () => {
  const router = useRouter();

  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch("/api/groups");

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        console.log(data);
        setGroups(data);
      } catch (error) {
        console.error("Error fethcing groups: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return isLoading ? (
    <div className="flex items-center justify-center h-screen">
      <span className="loader"></span>
    </div>
  ) : (
    <div className="flex justify-center flex-col items-center">
      <h1 className="text-amber-50 text-2xl mt-10 md:mt-20 ">Your Groups</h1>
      <div className="flex-col flex gap-10 w-[90%] md:w-[500px] mt-10">
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            onClick={() => router.push(`/groups/${group.id}`)}
            group={group}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
