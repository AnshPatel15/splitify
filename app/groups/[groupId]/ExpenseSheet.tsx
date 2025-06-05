"use client";

import { useEffect, useState } from "react";

interface ExpenseSheetProps {
  groupId: string;
}

const ExpenseSheet: React.FC<ExpenseSheetProps> = ({ groupId }) => {
  const [expenses, setExpenses] = useState([]);
  const [grouped, setGrouped] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch(`/api/expenses?groupId=${groupId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        console.log("first", data);
        setExpenses(data.expenses || []);
        setGrouped(groupByDate(data.expenses || []));
      } catch (error) {
        console.error("Error fetching expenses:", error);
        return {
          error: "An error occurred while fetching expenses.",
          status: 500,
        };
      }
    };
    fetchExpenses();
  }, [groupId]);

  const groupByDate = (expenses: Expense[]) => {
    const groups: Record<string, any[]> = {};

    expenses.forEach((expense: Expense) => {
      const date = new Date(expense.expenseDate).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(expense);
    });

    return groups;
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <div className="bg-white w-full md:w-3/4 rounded-xl">
        {Object.keys(grouped).length > 0 ? (
          Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <div className="sticky top-0 bg-white z-10 py-2 text-sm font-semibold text-gray-600 border-b rounded-sm px-2">
                {date}
              </div>
              <ul className="space-y-2 mt-2">
                {items.map((exp) => (
                  <li
                    key={exp.id}
                    className="p-3 rounded-lg bg-gray-100 shadow-sm flex justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{exp.createdBy.name}</span>
                      <span className="text-gray-500 text-sm">{exp.title}</span>
                    </div>
                    <span className="text-gray-700 font-semibold">
                      ₹{Number(exp.amount).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No expenses found.</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseSheet;
