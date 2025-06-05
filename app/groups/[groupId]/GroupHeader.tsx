import { Button } from "@/components/ui/button";
import Image from "next/image";
import { IoPeopleSharp } from "react-icons/io5";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";

const GroupHeader = ({
  group,
  onAddExpense,
  onAddMember,
  onToggleSettings,
  showSettings,
}: {
  group: Group | null;
  onAddExpense: () => void;
  onAddMember: () => void;
  onToggleSettings: () => void;
  showSettings: boolean;
}) => (
  <div className="bg-gray-700 text-amber-50 flex items-center justify-center h-36 relative rounded-b-xl shadow-2xl">
    <div className="flex items-center flex-col gap-2">
      <h1 className="text-xl capitalize">
        {group?.name || "Loading group..."}
      </h1>
      <p className="text-md">{group?.description || ""}</p>
      <div className="flex gap-2 mt-4">
        <Button
          onClick={onAddExpense}
          className="h-7 cursor-pointer"
          variant="secondary"
        >
          <RiMoneyRupeeCircleFill />
          Add expense +
        </Button>
        <Button
          onClick={onAddMember}
          className="h-7 hover:bg-gray-200 hover:text-black cursor-pointer"
          variant="default"
        >
          <IoPeopleSharp className="hover:text-black" />
          Add member +
        </Button>
      </div>
    </div>
    <Image
      onClick={onToggleSettings}
      className={`cursor-pointer absolute top-4 left-4 ${
        showSettings ? "rotate-180" : ""
      } transition-all duration-300 ease-in-out`}
      src="/settings.png"
      alt="group-settings"
      width={22}
      height={22}
    />
  </div>
);

export default GroupHeader;
