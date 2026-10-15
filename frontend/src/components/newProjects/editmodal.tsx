"use client";

import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { Button } from "../ui/button";

type EditModalProps = {
  isOpen: boolean;
  title: string;
  items: string[];
  onClose: () => void;
  onSave: (updatedItems: string[]) => void;
};

export default function EditModal({
  isOpen,
  title,
  items,
  onClose,
  onSave,
}: EditModalProps) {
  const [list, setList] = useState<string[]>(items);
  const [newItem, setNewItem] = useState("");

  if (!isOpen) return null;

  const handleAdd = () => {
    if (newItem.trim()) {
      setList([...list, newItem.trim().toUpperCase()]);
      setNewItem("");
    }
  };

  const handleRemove = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h3 className="text-base font-bold text-main">Edit {title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-muted hover:text-main rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Existing tags */}
        <div className="flex flex-wrap gap-2 my-5">
          {list.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-background border border-border rounded-lg text-xs font-semibold text-main"
            >
              {item}
              <button
                onClick={() => handleRemove(idx)}
                className="text-muted hover:text-red-500 transition-colors"
              >
                &times;
              </button>
            </span>
          ))}
        </div>

        {/* Add new tag */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="ADD NEW..."
            className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium text-main focus:outline-none focus:border-brand"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 bg-background border border-border hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-xs font-semibold text-main transition-colors"
          >
            Add
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-muted hover:text-main transition-colors"
          >
            Cancel
          </button>
          <Button
            onClick={() => onSave(list)}
            className="bg-brand hover:bg-brand/90 text-white font-medium text-xs rounded-xl px-5 py-2 transition-colors"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}