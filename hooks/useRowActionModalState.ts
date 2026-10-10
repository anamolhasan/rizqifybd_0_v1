"use client";

import { useState } from "react";

export interface RowActionModalState<TEntity> {
  selectedRow: TEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setSelectedRow: (row: TEntity) => void;
  reset: () => void;
}

export function useRowActionModalState<TEntity>(
  initialRow: TEntity | null = null,
): RowActionModalState<TEntity> {
  const [selectedRow, setSelectedRow] = useState<TEntity | null>(initialRow);
  const [open, setOpen] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedRow(null);
    }
    setOpen(nextOpen);
  };

  const handleSetSelectedRow = (row: TEntity) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const reset = () => {
    setSelectedRow(null);
    setOpen(false);
  };

  return {
    selectedRow,
    open,
    onOpenChange: handleOpenChange,
    setSelectedRow: handleSetSelectedRow,
    reset,
  };
}