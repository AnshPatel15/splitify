"use client";

import { currentUser } from "@clerk/nextjs/server";
import Hero from "@/components/Hero";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    fetch("/api/users/sync", { method: "POST" })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err.message));
  }, []);

  return (
    <div>
      {/* <Navbar user={safeUser} /> */}
      <Hero />
    </div>
  );
}
