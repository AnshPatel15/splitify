"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
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
import { CalendarIcon, AlertCircle } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: User[];
  onAddExpense: (expenseData: ExpenseFormData) => void;
  currentUserId: string;
  groupId?: string;
}

export interface ExpenseFormData {
  title: string;
  description: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  splitType: SplitType;
  expenseDate: string;
  payments: { userId: string; amount: number }[];
  shares: { userId: string; amount: number }[];
  groupId?: string;
  createdById: string;
  receiptUrl?: string;
}

enum ExpenseCategory {
  FOOD = "FOOD",
  TRANSPORTATION = "TRANSPORTATION",
  SHOPPING = "SHOPPING",
  ENTERTAINMENT = "ENTERTAINMENT",
  UTILITIES = "UTILITIES",
  RENT = "RENT",
  GROCERIES = "GROCERIES",
  TRAVEL = "TRAVEL",
  HEALTHCARE = "HEALTHCARE",
  OTHER = "OTHER",
}

enum SplitType {
  EQUAL = "EQUAL",
  UNEQUAL = "UNEQUAL",
  PERCENTAGE = "PERCENTAGE",
  SHARES = "SHARES",
}

const EXPENSE_CATEGORIES = [
  { value: ExpenseCategory.OTHER, label: "General" },
  { value: ExpenseCategory.FOOD, label: "Food and drink" },
  { value: ExpenseCategory.ENTERTAINMENT, label: "Entertainment" },
  { value: ExpenseCategory.TRANSPORTATION, label: "Transportation" },
  { value: ExpenseCategory.UTILITIES, label: "Utilities" },
  { value: ExpenseCategory.GROCERIES, label: "Groceries" },
  { value: ExpenseCategory.SHOPPING, label: "Shopping" },
  { value: ExpenseCategory.HEALTHCARE, label: "Healthcare" },
  { value: ExpenseCategory.TRAVEL, label: "Travel" },
  { value: ExpenseCategory.RENT, label: "Rent" },
];

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  members,
  onAddExpense,
  currentUserId,
  groupId,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    description: "",
    paidBy: [] as string[],
    splitWith: [] as string[],
    splitType: SplitType.EQUAL,
    shares: {} as Record<string, string>,
    expenseDate: new Date().toISOString().split("T")[0], // Default to today
    category: ExpenseCategory.OTHER,
    currency: "RS",
    receiptUrl: "",
  });

  const [dateMode, setDateMode] = useState<"today" | "custom">("today");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (key: string, value: string | string[]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      // Clear error when user starts typing
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: "" }));
      }
    },
    [errors]
  );

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        amount: "",
        description: "",
        paidBy: [currentUserId], // Default to current user paying
        splitWith: members.map((m) => m.id), // Default to split with all members
        splitType: SplitType.EQUAL,
        shares: {},
        expenseDate: new Date().toISOString().split("T")[0],
        category: ExpenseCategory.OTHER,
        currency: "RS",
        receiptUrl: "",
      });
      setDateMode("today");
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, members, currentUserId]);

  // Update date when mode changes
  useEffect(() => {
    if (dateMode === "today") {
      const today = new Date().toISOString().split("T")[0];
      handleChange("expenseDate", today);
    }
  }, [dateMode, handleChange]);

  // Clear shares when split type changes
  useEffect(() => {
    if (formData.splitType === SplitType.EQUAL) {
      setFormData((prev) => ({ ...prev, shares: {} }));
    }
  }, [formData.splitType]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Expense title is required";
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (formData.paidBy.length === 0) {
      newErrors.paidBy = "Please select who paid for this expense";
    }

    if (formData.splitWith.length === 0) {
      newErrors.splitWith = "Please select who to split this expense with";
    }

    if (!formData.expenseDate) {
      newErrors.expenseDate = "Date is required";
    }

    // Validate shares for unequal and percentage splits
    if (formData.splitType === SplitType.UNEQUAL) {
      const totalShares = Object.values(formData.shares).reduce(
        (acc, val) => acc + Number(val || 0),
        0
      );
      const totalAmount = Number(formData.amount);

      if (Math.abs(totalShares - totalAmount) > 0.01) {
        newErrors.shares = "Total shares must equal the expense amount";
      }
    }

    if (formData.splitType === SplitType.PERCENTAGE) {
      const totalPercentage = Object.values(formData.shares).reduce(
        (acc, val) => acc + Number(val || 0),
        0
      );

      if (Math.abs(totalPercentage - 100) > 0.01) {
        newErrors.shares = "Total percentage must equal 100%";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Calculate final shares based on split type
      const finalShares: { userId: string; amount: number }[] = [];

      if (formData.splitType === SplitType.EQUAL) {
        const shareAmount = Number(formData.amount) / formData.splitWith.length;
        formData.splitWith.forEach((userId) => {
          finalShares.push({ userId, amount: shareAmount });
        });
      } else if (formData.splitType === SplitType.UNEQUAL) {
        formData.splitWith.forEach((userId) => {
          finalShares.push({
            userId,
            amount: Number(formData.shares[userId] || 0),
          });
        });
      } else if (formData.splitType === SplitType.PERCENTAGE) {
        const totalAmount = Number(formData.amount);
        formData.splitWith.forEach((userId) => {
          const percentage = Number(formData.shares[userId] || 0);
          finalShares.push({
            userId,
            amount: (totalAmount * percentage) / 100,
          });
        });
      }

      // Calculate payments (who paid how much)
      const totalPayers = formData.paidBy.length;
      const amountPerPayer = Number(formData.amount) / totalPayers;
      const payments = formData.paidBy.map((userId) => ({
        userId,
        amount: amountPerPayer,
      }));

      const expenseData: ExpenseFormData = {
        title: formData.title,
        description: formData.description,
        amount: Number(formData.amount),
        currency: formData.currency,
        category: formData.category,
        splitType: formData.splitType,
        expenseDate: formData.expenseDate,
        payments,
        shares: finalShares,
        groupId,
        createdById: currentUserId,
        receiptUrl: formData.receiptUrl,
      };

      // await onAddExpense(expenseData);
      console.log(expenseData);
      onClose();
    } catch (error) {
      console.error("Error adding expense:", error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateModeToggle = (mode: "today" | "custom") => {
    setDateMode(mode);
  };

  const memberOptions = members.map((m) => ({
    label: m.name,
    value: m.id,
  }));

  const updateShare = (memberId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      shares: { ...prev.shares, [memberId]: value },
    }));
  };

  const getTotalShares = () => {
    return Object.values(formData.shares).reduce(
      (acc, val) => acc + Number(val || 0),
      0
    );
  };

  const getRemainingAmount = () => {
    const total = getTotalShares();
    return formData.splitType === SplitType.PERCENTAGE
      ? 100 - total
      : Number(formData.amount) - total;
  };

  return (
    <Modal
      className="h-fit w-[500px] overflow-y-auto hide-scrollbar"
      isOpen={isOpen}
      onClose={onClose}
      title="Add an expense"
    >
      <div className="flex flex-col gap-4 text-sm">
        {/* Expense Title */}
        <div>
          <Label className="text-gray-700 font-medium">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="Enter a title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.title}
            </span>
          )}
        </div>

        {/* Notes/Description */}
        <div>
          <Label className="text-gray-700 font-medium">Notes</Label>
          <Input
            placeholder="Add notes (optional)"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        {/* Amount */}
        <div>
          <Label className="text-gray-700 font-medium">
            Amount <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              ₹
            </span>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              className={`pl-8 ${errors.amount ? "border-red-500" : ""}`}
            />
          </div>
          {errors.amount && (
            <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.amount}
            </span>
          )}
        </div>

        {/* Category */}
        <div>
          <Label className="text-gray-700 font-medium">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleChange("category", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXPENSE_CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Paid By */}
        <div>
          <Label className="text-gray-700 font-medium">
            Paid by <span className="text-red-500">*</span>
          </Label>
          <ReactSelect
            isMulti
            options={memberOptions}
            className="text-sm"
            placeholder="Select who paid"
            value={memberOptions.filter((opt) =>
              formData.paidBy.includes(opt.value)
            )}
            onChange={(selected) =>
              handleChange(
                "paidBy",
                selected.map((s) => s.value)
              )
            }
            styles={{
              control: (base) => ({
                ...base,
                borderColor: errors.paidBy ? "#ef4444" : base.borderColor,
              }),
            }}
          />
          {errors.paidBy && (
            <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.paidBy}
            </span>
          )}
        </div>

        {/* Split With */}
        <div>
          <Label className="text-gray-700 font-medium">
            Split between <span className="text-red-500">*</span>
          </Label>
          <ReactSelect
            isMulti
            options={memberOptions}
            className="text-sm"
            placeholder="Select who to split with"
            value={memberOptions.filter((opt) =>
              formData.splitWith.includes(opt.value)
            )}
            onChange={(selected) =>
              handleChange(
                "splitWith",
                selected.map((s) => s.value)
              )
            }
            styles={{
              control: (base) => ({
                ...base,
                borderColor: errors.splitWith ? "#ef4444" : base.borderColor,
              }),
            }}
          />
          {errors.splitWith && (
            <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.splitWith}
            </span>
          )}
        </div>

        {/* Split Type */}
        <div>
          <Label className="text-gray-700 font-medium">Split type</Label>
          <Select
            value={formData.splitType}
            onValueChange={(value) => handleChange("splitType", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SplitType.EQUAL}>Split equally</SelectItem>
              <SelectItem value={SplitType.UNEQUAL}>Unequal amounts</SelectItem>
              <SelectItem value={SplitType.PERCENTAGE}>
                By percentage
              </SelectItem>
              <SelectItem value={SplitType.SHARES}>By shares/units</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Shares */}
        {(formData.splitType === SplitType.UNEQUAL ||
          formData.splitType === SplitType.PERCENTAGE ||
          formData.splitType === SplitType.SHARES) && (
          <div className="flex flex-col gap-3">
            <Label className="text-gray-700 font-medium">
              {formData.splitType === SplitType.UNEQUAL
                ? "Individual amounts"
                : formData.splitType === SplitType.PERCENTAGE
                ? "Individual percentages"
                : "Number of shares"}
            </Label>

            {formData.splitWith.map((memberId) => {
              const member = members.find((m) => m.id === memberId);
              return (
                <div key={memberId} className="flex items-center gap-3">
                  <span className="w-24 truncate text-sm">{member?.name}</span>
                  <div className="flex-1 relative">
                    {formData.splitType === SplitType.UNEQUAL && (
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ₹
                      </span>
                    )}
                    <Input
                      type="number"
                      step="0.01"
                      placeholder={
                        formData.splitType === SplitType.UNEQUAL ? "0.00" : "0"
                      }
                      value={formData.shares[memberId] || ""}
                      onChange={(e) => updateShare(memberId, e.target.value)}
                      className={
                        formData.splitType === SplitType.UNEQUAL ? "pl-8" : ""
                      }
                    />
                    {formData.splitType === SplitType.PERCENTAGE && (
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        %
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Total Display */}
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between text-sm">
                <span>
                  Total{" "}
                  {formData.splitType === SplitType.PERCENTAGE
                    ? "percentage"
                    : "amount"}
                  :
                </span>
                <span className="font-medium">
                  {getTotalShares()}
                  {formData.splitType === SplitType.PERCENTAGE ? "%" : ""}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Remaining:</span>
                <span
                  className={`font-medium ${
                    getRemainingAmount() !== 0
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {getRemainingAmount()}
                  {formData.splitType === SplitType.PERCENTAGE ? "%" : ""}
                </span>
              </div>
            </div>

            {errors.shares && (
              <span className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.shares}
              </span>
            )}
          </div>
        )}

        {/* Date */}
        <div>
          <Label className="text-gray-700 font-medium">
            Date <span className="text-red-500">*</span>
          </Label>

          <div className="flex gap-4 mb-3">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={dateMode === "today"}
                onCheckedChange={() => handleDateModeToggle("today")}
              />
              <span className="text-sm">Today</span>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={dateMode === "custom"}
                onCheckedChange={() => handleDateModeToggle("custom")}
              />
              <span className="text-sm">Custom date</span>
            </div>
          </div>

          {dateMode === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.expenseDate && "text-muted-foreground",
                    errors.expenseDate && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.expenseDate
                    ? format(new Date(formData.expenseDate), "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    formData.expenseDate
                      ? new Date(formData.expenseDate)
                      : undefined
                  }
                  onSelect={(date) => {
                    if (date) {
                      handleChange(
                        "expenseDate",
                        date.toISOString().split("T")[0]
                      );
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}

          {errors.expenseDate && (
            <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.expenseDate}
            </span>
          )}
        </div>

        {/* Receipt Upload */}
        <div>
          <Label className="text-gray-700 font-medium">
            Receipt (optional)
          </Label>
          <Input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // Here you would typically upload the file to your storage service
                // and get back a URL. For now, we'll just store the file name
                handleChange("receiptUrl", file.name);
              }
            }}
          />
          {formData.receiptUrl && (
            <span className="text-sm text-gray-500 mt-1">
              Receipt attached: {formData.receiptUrl}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {isSubmitting ? "Adding..." : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddExpenseModal;
