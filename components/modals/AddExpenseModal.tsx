"use client";

import { useEffect, useState } from "react";
import Modal from "../Modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import ReactSelect from "react-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: User[];
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  members,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    description: "",
    paidBy: [] as string[],
    splitWith: [] as string[],
    shareType: "equal",
    shares: {} as Record<string, string>,
    date: "",
  });

  const [dateMode, setDateMode] = useState<"today" | "custom" | null>(null);

  useEffect(() => {
    if (dateMode === "today") {
      const today = new Date().toISOString().split("T")[0];
      handleChange("date", today);
    }
  }, [dateMode]);

  const handleChange = (key: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    console.log("Expense Data:", formData);
  };

  const isShareType = (type: string) => formData.shareType === type;

  const memberOptions = members.map((m) => ({
    label: m.user.name,
    value: m.id,
  }));

  const updateShare = (memberId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      shares: { ...prev.shares, [memberId]: value },
    }));
  };

  return (
    <Modal
      className="h-[700px] w-[500px] overflow-y-auto hide-scrollbar"
      isOpen={isOpen}
      onClose={onClose}
      title="Add Expense"
    >
      <div className="flex flex-col gap-4 text-sm">
        <div>
          <Label className="py-2">Expense Name</Label>
          <Input
            placeholder="Enter expense name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div>
          <Label className="py-2">Amount</Label>
          <Input
            type="number"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
          />
        </div>

        <div>
          <Label className="py-2">Description</Label>
          <Input
            placeholder="Enter description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div>
          <Label className="py-2">Paid By</Label>
          <ReactSelect
            isMulti
            options={memberOptions}
            className="text-sm"
            value={memberOptions.filter((opt) =>
              formData.paidBy.includes(opt.value)
            )}
            onChange={(selected) =>
              handleChange(
                "paidBy",
                selected.map((s) => s.value)
              )
            }
          />
        </div>

        <div>
          <Label className="py-2">Split With</Label>
          <ReactSelect
            isMulti
            options={memberOptions}
            className="text-sm"
            value={memberOptions.filter((opt) =>
              formData.splitWith.includes(opt.value)
            )}
            onChange={(selected) =>
              handleChange(
                "splitWith",
                selected.map((s) => s.value)
              )
            }
          />
        </div>

        <div>
          <Label className="py-2">Share Type</Label>
          <Select
            value={formData.shareType}
            onValueChange={(value) => handleChange("shareType", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="equal">Equal</SelectItem>
              <SelectItem value="unequal">Unequal</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(isShareType("unequal") || isShareType("percentage")) && (
          <div className="flex flex-col gap-2">
            <Label className="py-2">
              {isShareType("unequal") ? "Share Amounts" : "Share Percentages"}
            </Label>
            {formData.splitWith.map((memberId) => {
              const member = members.find((m) => m.id === memberId);
              return (
                <div key={memberId} className="flex items-center gap-2">
                  <span className="w-24 truncate">{member?.user.name}</span>
                  <Input
                    type="number"
                    placeholder={isShareType("unequal") ? "Amount" : "%"}
                    value={formData.shares[memberId] || ""}
                    onChange={(e) => updateShare(memberId, e.target.value)}
                  />
                </div>
              );
            })}

            {isShareType("unequal") && (
              <span className="text-red-500 flex items-center justify-center">
                {`Total Shares: ${Object.values(formData.shares).reduce(
                  (acc, val) => acc + Number(val || 0),
                  0
                )} / ${formData.amount} | ${
                  Number(formData.amount) -
                  Object.values(formData.shares).reduce(
                    (acc, val) => acc + Number(val || 0),
                    0
                  )
                } remaining`}
              </span>
            )}
            {isShareType("percentage") && (
              <span className="text-red-500 flex items-center justify-center">
                {`Total Percentage: ${Object.values(formData.shares).reduce(
                  (acc, val) => acc + Number(val || 0),
                  0
                )} % | ${
                  100 -
                  Object.values(formData.shares).reduce(
                    (acc, val) => acc + Number(val || 0),
                    0
                  )
                } % remaining`}
              </span>
            )}
          </div>
        )}

        <div>
          <Label className="py-2">Date</Label>

          <div className="flex gap-4 mb-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={dateMode === "today"}
                onCheckedChange={() => setDateMode("today")}
              />
              <span>Today</span>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={dateMode === "custom"}
                onCheckedChange={() => setDateMode("custom")}
              />
              <span>Custom</span>
            </div>
          </div>

          {dateMode === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  {formData.date
                    ? format(new Date(formData.date), "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date ? new Date(formData.date) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      handleChange("date", date.toISOString().split("T")[0]);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="destructive" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={handleSubmit}>
            Add Expense
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddExpenseModal;
