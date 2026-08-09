"use client";

import { useState } from "react";
import { SITE } from "@/lib/site-config";

const SERVICE_TYPES = ["유료", "무료"];
const SPACE_TYPES = ["원룸", "투룸", "아파트", "기타"];
const SIZES = ["6평 이하", "6~10평", "10~20평", "20평 이상"];
const BUDGETS = ["100만원 이하", "300만원 이하", "500만원 이하", "1000만원 이상"];
const STYLES = ["미니멀", "모던", "북유럽", "빈티지", "기타"];
const PAINS = ["수납 부족", "가구 배치", "좁아 보임", "기타"];

type FormState = {
  serviceType: string;
  spaceType: string;
  size: string;
  budget: string;
  styles: string[];
  pains: string[];
  name: string;
  contact: string;
  message: string;
};

const INITIAL_STATE: FormState = {
  serviceType: "",
  spaceType: "",
  size: "",
  budget: "",
  styles: [],
  pains: [],
  name: "",
  contact: "",
  message: "",
};

function Choice({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-line text-ink hover:bg-mist"
      }`}
    >
      {label}
    </button>
  );
}

function toggleInList(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export function ReservationForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const step1Done =
    form.serviceType && form.spaceType && form.size && form.budget;
  const step3Done = form.name.trim() && form.contact.trim();

  async function handleSubmit() {
    setStatus("submitting");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const summaryLines = [
    `서비스 종류: ${form.serviceType}`,
    `공간 유형: ${form.spaceType}`,
    `평수: ${form.size}`,
    `예산: ${form.budget}`,
    `선호 스타일: ${form.styles.length ? form.styles.join(", ") : "선택 안 함"}`,
    `불편한 점: ${form.pains.length ? form.pains.join(", ") : "선택 안 함"}`,
    `이름: ${form.name}`,
    `연락처: ${form.contact}`,
    `요청사항: ${form.message || "없음"}`,
  ];

  const mailtoHref = `${SITE.contactHref}?subject=${encodeURIComponent(
    `[상담 신청] ${form.name || "고객"}님`
  )}&body=${encodeURIComponent(
    `${summaryLines.join("\n")}\n\n(사진이 있으시면 이 메일에 직접 첨부해서 보내주세요.)`
  )}`;

  return (
    <div className="mt-12">
      <p className="text-sm text-mute">{step} / 4</p>

      {step === 1 && (
        <div className="mt-4 flex flex-col gap-8">
          <div>
            <p className="text-base font-medium">
              Q) 어떤 서비스를 원하시나요?
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SERVICE_TYPES.map((v) => (
                <Choice
                  key={v}
                  label={v}
                  active={form.serviceType === v}
                  onClick={() =>
                    setForm((prev) => ({ ...prev, serviceType: v }))
                  }
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-base font-medium">Q) 공간 유형이 어떻게 되나요?</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SPACE_TYPES.map((v) => (
                <Choice
                  key={v}
                  label={v}
                  active={form.spaceType === v}
                  onClick={() => setForm((prev) => ({ ...prev, spaceType: v }))}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-base font-medium">Q) 평수는 어느 정도인가요?</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SIZES.map((v) => (
                <Choice
                  key={v}
                  label={v}
                  active={form.size === v}
                  onClick={() => setForm((prev) => ({ ...prev, size: v }))}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-base font-medium">Q) 예산은 어느 정도로 생각하세요?</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {BUDGETS.map((v) => (
                <Choice
                  key={v}
                  label={v}
                  active={form.budget === v}
                  onClick={() => setForm((prev) => ({ ...prev, budget: v }))}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={!step1Done}
            onClick={() => setStep(2)}
            className="self-start rounded-full bg-ink px-8 py-3 text-sm font-medium text-paper transition-opacity disabled:opacity-30"
          >
            다음
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-4 flex flex-col gap-8">
          <div>
            <p className="text-base font-medium">
              Q) 선호하는 스타일이 있나요? (선택, 여러 개 가능)
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {STYLES.map((v) => (
                <Choice
                  key={v}
                  label={v}
                  active={form.styles.includes(v)}
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      styles: toggleInList(prev.styles, v),
                    }))
                  }
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-base font-medium">
              Q) 지금 불편한 점이 있나요? (선택, 여러 개 가능)
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {PAINS.map((v) => (
                <Choice
                  key={v}
                  label={v}
                  active={form.pains.includes(v)}
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      pains: toggleInList(prev.pains, v),
                    }))
                  }
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-full border border-line px-8 py-3 text-sm font-medium text-ink"
            >
              이전
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="rounded-full bg-ink px-8 py-3 text-sm font-medium text-paper"
            >
              다음
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-4 flex flex-col gap-6">
          <div>
            <label className="text-base font-medium" htmlFor="name">
              Q) 이름이 무엇인가요?
            </label>
            <input
              id="name"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="mt-3 w-full rounded-xl border border-line bg-paper px-4 py-3 text-base outline-none focus:border-ink"
              placeholder="홍길동"
            />
          </div>

          <div>
            <label className="text-base font-medium" htmlFor="contact">
              Q) 연락처가 어떻게 되나요? (전화번호 또는 이메일)
            </label>
            <input
              id="contact"
              value={form.contact}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, contact: e.target.value }))
              }
              className="mt-3 w-full rounded-xl border border-line bg-paper px-4 py-3 text-base outline-none focus:border-ink"
              placeholder="010-0000-0000"
            />
          </div>

          <div>
            <label className="text-base font-medium" htmlFor="message">
              Q) 추가로 전달하고 싶은 내용이 있나요? (선택)
            </label>
            <textarea
              id="message"
              value={form.message}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, message: e.target.value }))
              }
              rows={4}
              className="mt-3 w-full rounded-xl border border-line bg-paper px-4 py-3 text-base outline-none focus:border-ink"
              placeholder="추가로 전달하고 싶은 내용을 적어주세요."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-full border border-line px-8 py-3 text-sm font-medium text-ink"
            >
              이전
            </button>
            <button
              type="button"
              disabled={!step3Done}
              onClick={() => setStep(4)}
              className="rounded-full bg-ink px-8 py-3 text-sm font-medium text-paper disabled:opacity-30"
            >
              다음
            </button>
          </div>
        </div>
      )}

      {step === 4 && status === "success" && (
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-xl font-semibold tracking-tight">
            신청이 접수됐어요.
          </p>
          <p className="text-base text-mute">
            빠르게 확인하고 연락드릴게요. 사진이 있으시면 아래 주소로
            보내주세요.
          </p>
          <a
            href={mailtoHref}
            className="self-start rounded-full border border-line px-6 py-3 text-sm font-medium text-ink hover:bg-mist"
          >
            사진 보내기 (이메일 열기)
          </a>
        </div>
      )}

      {step === 4 && status !== "success" && (
        <div className="mt-4 flex flex-col gap-6">
          <p className="text-base font-medium">입력하신 내용을 확인해주세요</p>

          <div className="rounded-2xl border border-line p-6">
            <dl className="flex flex-col gap-3">
              {summaryLines.map((line) => {
                const [label, ...rest] = line.split(": ");
                return (
                  <div
                    key={label}
                    className="flex flex-col gap-1 border-b border-line pb-3 last:border-b-0 last:pb-0 md:flex-row md:justify-between"
                  >
                    <dt className="text-sm text-mute">{label}</dt>
                    <dd className="text-sm font-medium">{rest.join(": ")}</dd>
                  </div>
                );
              })}
            </dl>
          </div>

          <p className="text-sm text-mute">
            사진이 있으시면, 신청 완료 후 안내되는 주소로 보내주세요.
          </p>

          {status === "error" && (
            <p className="text-sm text-red-600">
              전송에 문제가 생겼어요. 다시 시도해주시거나, 아래로 바로
              이메일을 보내주세요.
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="rounded-full border border-line px-8 py-3 text-sm font-medium text-ink"
            >
              이전
            </button>
            <button
              type="button"
              disabled={status === "submitting"}
              onClick={handleSubmit}
              className="rounded-full bg-ink px-8 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-80 disabled:opacity-40"
            >
              {status === "submitting" ? "보내는 중..." : "상담 신청 보내기"}
            </button>
            {status === "error" && (
              <a
                href={mailtoHref}
                className="rounded-full border border-line px-8 py-3 text-sm font-medium text-ink hover:bg-mist"
              >
                이메일로 바로 보내기
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
