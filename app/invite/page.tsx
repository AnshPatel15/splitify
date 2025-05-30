"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const InvitePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isSignedIn } = useUser();

  useEffect(() => {
    const groupId = searchParams.get("groupId");

    if (!groupId) {
      router.push("/");
      return;
    }

    if (!isSignedIn) {
      const redirectUrl = encodeURIComponent(`/invite?groupId=${groupId}`);
      router.push(`/sign-in?redirect_url=${redirectUrl}`);
    } else {
      fetch("/api/groups/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            router.push(`/groups/${groupId}`);
          }
        });
    }
  }, [isSignedIn, router, searchParams]);

  return <div className="p-4 text-center">Processing your invite...</div>;
};

export default InvitePage;
