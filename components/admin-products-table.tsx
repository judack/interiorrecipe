"use client";

import { useState } from "react";
import { SEASONS, type Product, type Season } from "@/lib/product";

type Draft = {
  name: string;
  price: string;
  imageUrl: string;
  category: string;
  season: Season;
  coupangUrl: string;
  sortOrder: string;
};

const EMPTY_DRAFT: Draft = {
  name: "",
  price: "",
  imageUrl: "",
  category: "",
  season: "전체",
  coupangUrl: "",
  sortOrder: "0",
};

function toDraft(p: Product): Draft {
  return {
    name: p.name,
    price: p.price,
    imageUrl: p.image_url,
    category: p.category,
    season: p.season,
    coupangUrl: p.coupang_url,
    sortOrder: String(p.sort_order),
  };
}

export function AdminProductsTable({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);

  function startAdd() {
    setDraft(EMPTY_DRAFT);
    setEditingId("new");
  }

  function startEdit(p: Product) {
    setDraft(toDraft(p));
    setEditingId(p.id);
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
  }

  async function saveDraft() {
    if (!draft.name || !draft.price || !draft.imageUrl || !draft.coupangUrl) {
      alert("이름, 가격, 이미지 주소, 쿠팡 링크는 꼭 입력해주세요.");
      return;
    }
    setSaving(true);
    try {
      if (editingId === "new") {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        });
        if (!res.ok) throw new Error("create failed");
        const listRes = await fetch("/api/admin/products");
        setProducts(await listRes.json());
      } else if (typeof editingId === "number") {
        const existing = products.find((p) => p.id === editingId);
        const res = await fetch(`/api/admin/products/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...draft, active: existing?.active ?? true }),
        });
        if (!res.ok) throw new Error("update failed");
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingId
              ? {
                  ...p,
                  name: draft.name,
                  price: draft.price,
                  image_url: draft.imageUrl,
                  category: draft.category,
                  season: draft.season,
                  coupang_url: draft.coupangUrl,
                  sort_order: Number(draft.sortOrder) || 0,
                }
              : p
          )
        );
      }
      cancelEdit();
    } catch {
      alert("저장에 실패했어요. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(p: Product) {
    const nextActive = !p.active;
    setProducts((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, active: nextActive } : x))
    );
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: p.name,
          price: p.price,
          imageUrl: p.image_url,
          category: p.category,
          season: p.season,
          coupangUrl: p.coupang_url,
          sortOrder: p.sort_order,
          active: nextActive,
        }),
      });
      if (!res.ok) throw new Error("toggle failed");
    } catch {
      setProducts((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, active: p.active } : x))
      );
      alert("변경에 실패했어요.");
    }
  }

  async function deleteProduct(id: number) {
    if (!confirm("이 상품을 삭제할까요?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("delete failed");
    } catch {
      alert("삭제에 실패했어요. 새로고침 후 다시 시도해주세요.");
    }
  }

  return (
    <div>
      {editingId === null && (
        <button
          type="button"
          onClick={startAdd}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper hover:opacity-80"
        >
          + 상품 추가
        </button>
      )}

      {editingId !== null && (
        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-line p-6">
          <p className="text-sm font-medium">
            {editingId === "new" ? "새 상품 추가" : "상품 수정"}
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-mute">상품명</label>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-ink"
                placeholder="예: 라탄 스탠드 조명"
              />
            </div>
            <div>
              <label className="text-sm text-mute">가격</label>
              <input
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-ink"
                placeholder="예: 39,900원"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-mute">이미지 주소 (URL)</label>
              <input
                value={draft.imageUrl}
                onChange={(e) =>
                  setDraft({ ...draft, imageUrl: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-ink"
                placeholder="쿠팡 상품 이미지 주소를 붙여넣으세요"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-mute">쿠팡파트너스 링크</label>
              <input
                value={draft.coupangUrl}
                onChange={(e) =>
                  setDraft({ ...draft, coupangUrl: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-ink"
                placeholder="https://link.coupang.com/..."
              />
            </div>
            <div>
              <label className="text-sm text-mute">카테고리 (선택)</label>
              <input
                value={draft.category}
                onChange={(e) =>
                  setDraft({ ...draft, category: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-ink"
                placeholder="예: 조명"
              />
            </div>
            <div>
              <label className="text-sm text-mute">계절</label>
              <select
                value={draft.season}
                onChange={(e) =>
                  setDraft({ ...draft, season: e.target.value as Season })
                }
                className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-ink"
              >
                {SEASONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-mute">노출 순서 (숫자가 작을수록 먼저)</label>
              <input
                type="number"
                value={draft.sortOrder}
                onChange={(e) =>
                  setDraft({ ...draft, sortOrder: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-ink"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-full border border-line px-6 py-2.5 text-sm font-medium"
            >
              취소
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={saveDraft}
              className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper disabled:opacity-40"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-line p-4"
          >
            <img
              src={p.image_url}
              alt=""
              className="h-16 w-16 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-mute">
                {p.price} · {p.category || "카테고리 없음"} · {p.season}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleActive(p)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium ${
                p.active
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-mute"
              }`}
            >
              {p.active ? "노출 중" : "숨김"}
            </button>
            <button
              type="button"
              onClick={() => startEdit(p)}
              className="rounded-full border border-line px-4 py-1.5 text-xs font-medium"
            >
              수정
            </button>
            <button
              type="button"
              onClick={() => deleteProduct(p.id)}
              className="rounded-full border border-line px-4 py-1.5 text-xs font-medium text-mute"
            >
              삭제
            </button>
          </div>
        ))}

        {products.length === 0 && (
          <p className="text-sm text-mute">
            아직 등록된 상품이 없습니다. "+ 상품 추가"로 시작해보세요.
          </p>
        )}
      </div>
    </div>
  );
}
