"use client";

import { useState } from "react";
import {
  STATUSES,
  type Reservation,
  type ReservationStatus,
} from "@/lib/reservation";

function formatDate(value: string) {
  return new Date(value).toLocaleString("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function StatusButtons({
  id,
  status,
  onChange,
}: {
  id: number;
  status: ReservationStatus;
  onChange: (id: number, status: ReservationStatus) => void;
}) {
  const [pending, setPending] = useState(false);

  async function handleClick(next: ReservationStatus) {
    if (next === status || pending) return;
    setPending(true);
    onChange(id, next);
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("update failed");
    } catch {
      onChange(id, status);
      alert("상태 변경에 실패했어요. 다시 시도해주세요.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {STATUSES.map((s) => (
        <button
          key={s}
          type="button"
          disabled={pending}
          onClick={() => handleClick(s)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
            s === status
              ? "border-ink bg-ink text-paper"
              : "border-line text-ink hover:bg-mist"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

export function AdminReservationsTable({
  initialReservations,
}: {
  initialReservations: Reservation[];
}) {
  const [reservations, setReservations] = useState(initialReservations);

  function handleStatusChange(id: number, status: ReservationStatus) {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line text-mute">
            <th className="py-3 pr-4 font-medium">신청일시</th>
            <th className="py-3 pr-4 font-medium">서비스</th>
            <th className="py-3 pr-4 font-medium">이름</th>
            <th className="py-3 pr-4 font-medium">연락처</th>
            <th className="py-3 pr-4 font-medium">공간 유형</th>
            <th className="py-3 pr-4 font-medium">평수</th>
            <th className="py-3 pr-4 font-medium">요금</th>
            <th className="py-3 pr-4 font-medium">방문 희망일</th>
            <th className="py-3 pr-4 font-medium">스타일</th>
            <th className="py-3 pr-4 font-medium">불편한 점</th>
            <th className="py-3 pr-4 font-medium">요청사항</th>
            <th className="py-3 pr-4 font-medium">진행상태</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id} className="border-b border-line align-top">
              <td className="py-3 pr-4 whitespace-nowrap">
                {formatDate(r.created_at)}
              </td>
              <td className="py-3 pr-4">{r.service_type || "-"}</td>
              <td className="py-3 pr-4 font-medium">{r.name}</td>
              <td className="py-3 pr-4">{r.contact}</td>
              <td className="py-3 pr-4">{r.space_type}</td>
              <td className="py-3 pr-4">{r.size}</td>
              <td className="py-3 pr-4">{r.budget}</td>
              <td className="py-3 pr-4 whitespace-nowrap">
                {r.visit_date || "-"}
              </td>
              <td className="py-3 pr-4">{r.styles || "-"}</td>
              <td className="py-3 pr-4">{r.pains || "-"}</td>
              <td className="py-3 pr-4">{r.message || "-"}</td>
              <td className="py-3 pr-4">
                <StatusButtons
                  id={r.id}
                  status={r.status}
                  onChange={handleStatusChange}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {reservations.length === 0 && (
        <p className="mt-10 text-sm text-mute">
          아직 접수된 상담 신청이 없습니다.
        </p>
      )}
    </div>
  );
}
