"use client";

import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

type ClientUser = {
  firstName: string | null;
};

const Navbar = () => {
  const router = useRouter();

  return (
    <div>
      <nav className="sticky to-0 z-50 bg-gray-800 h-14 text-white flex items-center justify-between">
        <div
          className=" flex lg:justify-center cursor-pointer"
          onClick={() => router.push("/")}
        >
          {/* <Image
            className="w-24 flex items-center "
            src="/2.png"
            alt="logo"
            width={1400}
            height={0}
          /> */}
          <span className="text-3xl ml-5 text-amber-50">SPLITIFY</span>
        </div>
        <div className="flex items-center mr-5 gap-5 justify-end">
          <div className="flex">
            <Button variant="secondary" className="cursor-pointer h-8">
              Create Group
            </Button>
          </div>
          <UserButton />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
