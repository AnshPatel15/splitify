"use client";

import { useState } from "react";
import Modal from "../Modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    description: "",
    paidBy: "",
    splitWith: "",
    shareType: "equal",
    shares: "",
    date: "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {};

  const isShareType = (type: string) => formData.shareType === type;

  return (
    <Modal
      className="h-[700px] w-[500px] overflow-y-auto hide-scrollbar"
      isOpen={isOpen}
      onClose={onClose}
      title="Add Expense"
    >
      <div className="flex flex-col gap-4 text-sm">
        <div>
          <Label>Expense Name</Label>
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
          <Input
            placeholder="Enter name of payer"
            value={formData.paidBy}
            onChange={(e) => handleChange("paidBy", e.target.value)}
          />
        </div>

        <div>
          <Label className="py-2">Split With</Label>
        </div>

        <div>
          <Label className="py-2">Share Type</Label>
          <Select
            value={formData.shareType}
            onValueChange={(value) => handleChange("shareType", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="equal">Equal</SelectItem>
              <SelectItem value="unequal">Unequal</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isShareType("unequal") && (
          <div>
            <Label>Share Amounts</Label>
            <Input
              placeholder="e.g. 200, 300, 100"
              value={formData.shares}
              onChange={(e) => handleChange("shares", e.target.value)}
            />
          </div>
        )}

        {isShareType("percentage") && (
          <div>
            <Label>Share Percentages</Label>
            <Input
              placeholder="e.g. 50, 30, 20"
              value={formData.shares}
              onChange={(e) => handleChange("shares", e.target.value)}
            />
          </div>
        )}

        <div>
          <Label className="py-2">Date</Label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
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
