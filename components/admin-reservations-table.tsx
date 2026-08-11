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
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function handleStatusChange(id: number, status: ReservationStatus) {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  }

  async function handleDelete(id: number) {
    if (!confirm("이 신청을 삭제할까요? 되돌릴 수 없어요.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("delete failed");
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("삭제에 실패했어요. 다시 시도해주세요.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1660px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line text-mute">
            <th className="py-3 pr-6 font-medium whitespace-nowrap">
              신청일시
            </th>
            <th className="min-w-[90px] py-3 pr-6 font-medium whitespace-nowrap">
              서비스
            </th>
            <th className="min-w-[120px] py-3 pr-6 font-medium whitespace-nowrap">
              이름
            </th>
            <th className="py-3 pr-6 font-medium whitespace-nowrap">
              연락처
            </th>
            <th className="min-w-[70px] py-3 pr-6 font-medium whitespace-nowrap">
              성별
            </th>
            <th className="min-w-[110px] py-3 pr-6 font-medium whitespace-nowrap">
              출생연월
            </th>
            <th className="min-w-[260px] py-3 pr-6 font-medium whitespace-nowrap">
              주소
            </th>
            <th className="min-w-[90px] py-3 pr-6 font-medium whitespace-nowrap">
              공간 유형
            </th>
            <th className="min-w-[110px] py-3 pr-6 font-medium whitespace-nowrap">
              평수
            </th>
            <th className="min-w-[90px] py-3 pr-6 font-medium whitespace-nowrap">
              요금
            </th>
            <th className="min-w-[120px] py-3 pr-6 font-medium whitespace-nowrap">
              가구 예산
            </th>
            <th className="min-w-[110px] py-3 pr-6 font-medium whitespace-nowrap">
              방문 희망일
            </th>
            <th className="min-w-[110px] py-3 pr-6 font-medium whitespace-nowrap">
              스타일
            </th>
            <th className="min-w-[130px] py-3 pr-6 font-medium whitespace-nowrap">
              불편한 점
            </th>
            <th className="min-w-[180px] py-3 pr-6 font-medium whitespace-nowrap">
              MBTI 성향
            </th>
            <th className="min-w-[260px] py-3 pr-6 font-medium">
              요청사항
            </th>
            <th className="py-3 pr-6 font-medium whitespace-nowrap">
              사진
            </th>
            <th className="min-w-[240px] py-3 pr-6 font-medium whitespace-nowrap">
              진행상태
            </th>
            <th className="py-3 pr-6 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id} className="border-b border-line align-top">
              <td className="py-4 pr-6 whitespace-nowrap">
                {formatDate(r.created_at)}
              </td>
              <td className="py-4 pr-6 whitespace-nowrap">
                {r.service_type || "-"}
              </td>
              <td className="py-4 pr-6 font-medium whitespace-nowrap">
                {r.name}
              </td>
              <td className="py-4 pr-6 whitespace-nowrap">{r.contact}</td>
              <td className="py-4 pr-6 whitespace-nowrap">
                {r.gender || "-"}
              </td>
              <td className="py-4 pr-6 whitespace-nowrap">
                {r.birth_year
                  ? `${r.birth_year}년${r.birth_month ? ` ${r.birth_month}월` : ""}`
                  : "-"}
              </td>
              <td className="py-4 pr-6">
                {r.region}
                {r.address_detail ? ` ${r.address_detail}` : ""}
              </td>
              <td className="py-4 pr-6 whitespace-nowrap">{r.space_type}</td>
              <td className="py-4 pr-6 whitespace-nowrap">{r.size}</td>
              <td className="py-4 pr-6 whitespace-nowrap">{r.budget}</td>
              <td className="py-4 pr-6 whitespace-nowrap">
                {r.furniture_budget || "-"}
              </td>
              <td className="py-4 pr-6 whitespace-nowrap">
                {r.visit_date || "-"}
              </td>
              <td className="py-4 pr-6 whitespace-nowrap">
                {r.styles || "-"}
              </td>
              <td className="py-4 pr-6 whitespace-nowrap">
                {r.pains || "-"}
              </td>
              <td className="py-4 pr-6 whitespace-nowrap">
                {r.mbti_result || "-"}
              </td>
              <td className="py-4 pr-6">{r.message || "-"}</td>
              <td className="py-4 pr-6">
                {r.photo_urls ? (
                  <div className="flex flex-col gap-1">
                    {r.photo_urls.split(",").map((url, i) => (
                      <a
                        key={url}
                        href={`/api/admin/photos?url=${encodeURIComponent(url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-ink underline underline-offset-2 hover:no-underline"
                      >
                        사진 {i + 1}
                      </a>
                    ))}
                  </div>
                ) : (
                  "-"
                )}
              </td>
              <td className="py-4 pr-6">
                <StatusButtons
                  id={r.id}
                  status={r.status}
                  onChange={handleStatusChange}
                />
              </td>
              <td className="py-4 pr-6">
                <button
                  type="button"
                  disabled={deletingId === r.id}
                  onClick={() => handleDelete(r.id)}
                  className="rounded-full border border-line px-3 py-1 text-xs font-medium text-mute hover:border-red-400 hover:text-red-500 disabled:opacity-50"
                >
                  {deletingId === r.id ? "삭제 중..." : "삭제"}
                </button>
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
