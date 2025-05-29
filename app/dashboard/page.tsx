"use client";

import { useEffect, useState } from "react";

interface Group {
  id: string;
  name: string;
  description: string;
}

const Dashboard = () => {
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

  return (
    <div>
      <div>
        {groups.map((group, i) => (
          <div key={i}>{group.name}</div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
