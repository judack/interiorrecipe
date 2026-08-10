"use client";

import { useMemo, useState } from "react";

type CalendarReservation = {
  id: number;
  name: string;
  visit_date: string | null;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function dateKey(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export function AdminCalendar({
  reservations,
}: {
  reservations: CalendarReservation[];
}) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const byDate = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const r of reservations) {
      if (!r.visit_date) continue;
      const list = map.get(r.visit_date) ?? [];
      list.push(r.name);
      map.set(r.visit_date, list);
    }
    return map;
  }, [reservations]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: { day: number | null; key: string | null }[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push({ day: null, key: null });
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, key: dateKey(year, month, day) });
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, key: null });

  const todayKey = dateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line hover:bg-mist"
            aria-label="이전 달"
          >
            ‹
          </button>
          <p className="w-32 text-center text-lg font-semibold tracking-tight">
            {year}년 {month + 1}월
          </p>
          <button
            type="button"
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line hover:bg-mist"
            aria-label="다음 달"
          >
            ›
          </button>
        </div>
        <button
          type="button"
          onClick={() =>
            setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))
          }
          className="rounded-full border border-line px-4 py-1.5 text-sm text-mute hover:bg-mist"
        >
          오늘
        </button>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-2">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-center text-xs text-mute">
            {w}
          </div>
        ))}

        {cells.map((cell, i) => {
          if (cell.day === null) {
            return <div key={i} className="aspect-square" />;
          }
          const names = byDate.get(cell.key!) ?? [];
          const isToday = cell.key === todayKey;

          return (
            <div
              key={i}
              className={`group relative aspect-square rounded-xl border p-2 ${
                isToday ? "border-ink" : "border-line"
              } ${names.length > 0 ? "bg-mist" : ""}`}
            >
              <span className="text-sm">{cell.day}</span>

              {names.length > 0 && (
                <>
                  <span className="absolute right-1.5 bottom-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] font-medium text-paper">
                    {names.length}
                  </span>

                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-56 -translate-x-1/2 rounded-xl border border-line bg-paper p-3 text-left opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    <p className="text-xs font-medium">
                      {names.length}명 신청
                    </p>
                    <p className="mt-1 text-xs text-mute">
                      {names.join(", ")}
                    </p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
