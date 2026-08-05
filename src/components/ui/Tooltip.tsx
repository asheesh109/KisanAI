'use client';

import { useState } from 'react';

interface TooltipProps {
  text: string;
}

export default function Tooltip({ text }: TooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="relative inline-block ml-2"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className="cursor-pointer text-green-600 font-bold">
        ⓘ
      </span>

      {open && (
        <div className="absolute left-6 top-0 z-50 w-64 rounded-md bg-black text-white text-xs p-3 shadow-lg">
          {text}
        </div>
      )}
    </span>
  );
}