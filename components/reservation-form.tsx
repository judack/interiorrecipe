"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { SITE } from "@/lib/site-config";

type PhotoUpload = {
  name: string;
  state: "uploading" | "done" | "error";
};

const SERVICE_TYPES = ["유료", "무료"];
const SPACE_TYPES = ["원룸", "투룸", "아파트", "기타"];
const SIZES = ["6평 이하", "6~10평", "10~20평", "20평 이상"];
const PAID_TIERS = [
  { size: "12평 이하", price: "50만원" },
  { size: "12~15평(복층포함)", price: "100만원" },
  { size: "15평 이상", price: "추후협의" },
];
const FURNITURE_BUDGETS = [
  "100만원 이하",
  "300만원 이하",
  "500~1000만원 이하",
  "1000만원 이상",
];
const REGIONS = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];
const STYLES = ["미니멀", "모던", "북유럽", "빈티지", "기타"];
const PAINS = ["수납 부족", "가구 배치", "좁아 보임", "기타"];
const GENDERS = ["여성", "남성"];
const CURRENT_YEAR = new Date().getFullYear();
const BIRTH_YEARS = Array.from(
  { length: 80 },
  (_, i) => CURRENT_YEAR - 14 - i
);
const BIRTH_MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

type MbtiOption = { letter: "A" | "B" | "C" | "D"; label: string };
type MbtiQuestion = { question: string; options: MbtiOption[] };

const MBTI_QUESTIONS: MbtiQuestion[] = [
  {
    question: "주말에 가장 하고 싶은 일은?",
    options: [
      { letter: "A", label: "친구들이랑 수다 떨기" },
      { letter: "B", label: "혼자 책 읽으며 힐링" },
      { letter: "C", label: "작업실에서 뭔가 만들기" },
      { letter: "D", label: "유튜브 영상 편하게 보기" },
    ],
  },
  {
    question: "집에서 가장 중요한 공간은?",
    options: [
      { letter: "A", label: "거실 – 모두가 모이는 공간" },
      { letter: "B", label: "침실 – 나만의 안식처" },
      { letter: "C", label: "서재나 책상 – 집중하는 공간" },
      { letter: "D", label: "주방 – 요리하고 먹는 즐거움" },
    ],
  },
  {
    question: "집을 꾸밀 때 가장 먼저 떠오르는 키워드는?",
    options: [
      { letter: "A", label: "따뜻함" },
      { letter: "B", label: "트렌디" },
      { letter: "C", label: "실용성" },
      { letter: "D", label: "개성" },
    ],
  },
  {
    question: "친구가 놀러온다고 할 때 당신은?",
    options: [
      { letter: "A", label: "사람 오는 게 너무 좋아!" },
      { letter: "B", label: "약간 귀찮지만 정리는 한다" },
      { letter: "C", label: "최대한 조용히 혼자 있고 싶다" },
      { letter: "D", label: "뭐 어때~ 대충 치운다" },
    ],
  },
  {
    question: "정리 스타일은?",
    options: [
      { letter: "A", label: "항상 깔끔해야 마음이 편함" },
      { letter: "B", label: "필요한 것만 챙겨두는 미니멀" },
      { letter: "C", label: "내가 아는 나만의 정리 방식" },
      { letter: "D", label: "일단 눈에 안 보이면 됨!" },
    ],
  },
  {
    question: "가장 선호하는 색감은?",
    options: [
      { letter: "A", label: "우드톤, 베이지, 크림" },
      { letter: "B", label: "블랙&화이트" },
      { letter: "C", label: "파스텔이나 감성 컬러" },
      { letter: "D", label: "비비드 컬러나 네온 계열" },
    ],
  },
  {
    question: "인테리어 가구를 고를 때 중요하게 생각하는 건?",
    options: [
      { letter: "A", label: "실용성과 수납력" },
      { letter: "B", label: "디자인과 분위기" },
      { letter: "C", label: "가격과 내구성" },
      { letter: "D", label: "감성! 무조건 감성!" },
    ],
  },
  {
    question: "집에서 가장 자주 하는 행동은?",
    options: [
      { letter: "A", label: "요리" },
      { letter: "B", label: "콘텐츠 감상" },
      { letter: "C", label: "독서나 작업" },
      { letter: "D", label: "친구들과 파티" },
    ],
  },
  {
    question: "쇼핑 스타일은?",
    options: [
      { letter: "A", label: "꼼꼼하게 비교 후 구매" },
      { letter: "B", label: "디자인 보고 직감적으로" },
      { letter: "C", label: "추천 제품 우선" },
      { letter: "D", label: "할인하면 산다" },
    ],
  },
  {
    question: "내 공간에서 가장 싫은 상황은?",
    options: [
      { letter: "A", label: "정리가 안 된 모습" },
      { letter: "B", label: "남들과 똑같은 느낌" },
      { letter: "C", label: "불편한 가구" },
      { letter: "D", label: "감성 없는 공간" },
    ],
  },
];

const MBTI_RESULTS: Record<
  MbtiOption["letter"],
  { label: string; types: string }
> = {
  A: { label: "정갈한 미니멀 & 실용주의 스타일", types: "ISTJ · ISFJ · ESTJ" },
  B: { label: "따뜻한 감성 & 코지 스타일", types: "INFJ · INFP · ENFJ" },
  C: { label: "스마트 & 구조적 인테리어", types: "INTJ · INTP · ISTP" },
  D: { label: "개성 넘치고 컬러풀한 공간", types: "ENFP · ESFP · ENTP" },
};

function computeMbtiResult(answers: string[]) {
  const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const a of answers) counts[a] = (counts[a] || 0) + 1;
  const winner = (["A", "B", "C", "D"] as const).reduce((best, letter) =>
    counts[letter] > counts[best] ? letter : best
  );
  return { letter: winner, ...MBTI_RESULTS[winner] };
}

function tomorrowDateString() {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10);
}

type FormState = {
  serviceType: string;
  spaceType: string;
  size: string;
  budget: string;
  furnitureBudget: string;
  styles: string[];
  pains: string[];
  name: string;
  contact: string;
  gender: string;
  birthYear: string;
  birthMonth: string;
  region: string;
  addressDetail: string;
  message: string;
  visitDate: string;
  privacyAgreed: boolean;
  mbtiResult: string;
};

const INITIAL_STATE: FormState = {
  serviceType: "",
  spaceType: "",
  size: "",
  budget: "",
  furnitureBudget: "",
  styles: [],
  pains: [],
  name: "",
  contact: "",
  gender: "",
  birthYear: "",
  birthMonth: "",
  region: "",
  addressDetail: "",
  message: "",
  visitDate: "",
  privacyAgreed: false,
  mbtiResult: "",
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
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [photos, setPhotos] = useState<PhotoUpload[]>([]);
  const [finalized, setFinalized] = useState(false);
  const [mbtiPhase, setMbtiPhase] = useState<"intro" | "quiz" | "result">(
    "intro"
  );
  const [mbtiIndex, setMbtiIndex] = useState(0);
  const [mbtiAnswers, setMbtiAnswers] = useState<string[]>([]);

  const step1Done =
    form.serviceType &&
    form.spaceType &&
    form.size &&
    form.budget &&
    form.furnitureBudget;
  const step4Done =
    form.name.trim() &&
    form.contact.trim() &&
    form.gender &&
    form.birthYear &&
    form.region;

  function selectMbtiAnswer(letter: string) {
    const nextAnswers = [...mbtiAnswers, letter];
    if (mbtiIndex === MBTI_QUESTIONS.length - 1) {
      const result = computeMbtiResult(nextAnswers);
      setForm((prev) => ({ ...prev, mbtiResult: result.label }));
      setMbtiAnswers(nextAnswers);
      setMbtiPhase("result");
    } else {
      setMbtiAnswers(nextAnswers);
      setMbtiIndex((i) => i + 1);
    }
  }

  function mbtiPrevQuestion() {
    setMbtiAnswers((prev) => prev.slice(0, -1));
    setMbtiIndex((i) => Math.max(0, i - 1));
  }

  function selectServiceType(value: string) {
    setForm((prev) => ({
      ...prev,
      serviceType: value,
      size: "",
      budget: value === "무료" ? "무료 상담" : "",
    }));
  }

  function selectPaidTier(tier: { size: string; price: string }) {
    setForm((prev) => ({ ...prev, size: tier.size, budget: tier.price }));
  }

  async function handleSubmit() {
    setStatus("submitting");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("submit failed");
      const data = await res.json();
      setReservationId(data.id);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  async function handlePhotoSelect(files: FileList | null) {
    if (!files || !reservationId) return;

    const fileList = Array.from(files);
    setPhotos((prev) => [
      ...prev,
      ...fileList.map((f) => ({ name: f.name, state: "uploading" as const })),
    ]);

    for (const file of fileList) {
      try {
        const blob = await upload(file.name, file, {
          access: "private",
          handleUploadUrl: "/api/reservations/photos/upload",
        });
        await fetch(`/api/reservations/${reservationId}/photos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: blob.url }),
        });
        setPhotos((prev) =>
          prev.map((p) =>
            p.name === file.name ? { ...p, state: "done" } : p
          )
        );
      } catch {
        setPhotos((prev) =>
          prev.map((p) =>
            p.name === file.name ? { ...p, state: "error" } : p
          )
        );
      }
    }
  }

  const summaryLines = [
    `서비스 종류: ${form.serviceType}`,
    `공간 유형: ${form.spaceType}`,
    `평수: ${form.size}`,
    `요금: ${form.budget}`,
    `가구 예산: ${form.furnitureBudget}`,
    `선호 스타일: ${form.styles.length ? form.styles.join(", ") : "선택 안 함"}`,
    `불편한 점: ${form.pains.length ? form.pains.join(", ") : "선택 안 함"}`,
    `MBTI 인테리어 성향: ${form.mbtiResult || "미응답"}`,
    `이름: ${form.name}`,
    `연락처: ${form.contact}`,
    `성별: ${form.gender || "선택 안 함"}`,
    `출생연월: ${
      form.birthYear
        ? `${form.birthYear}년${form.birthMonth ? ` ${form.birthMonth}월` : ""}`
        : "선택 안 함"
    }`,
    `지역: ${form.region}`,
    `상세 주소: ${form.addressDetail || "없음"}`,
    `방문 희망일: ${form.visitDate || "미정"}`,
    `요청사항: ${form.message || "없음"}`,
  ];

  const mailtoHref = `${SITE.contactHref}?subject=${encodeURIComponent(
    `[상담 신청] ${form.name || "고객"}님`
  )}&body=${encodeURIComponent(
    `${summaryLines.join("\n")}\n\n(사진이 있으시면 이 메일에 직접 첨부해서 보내주세요.)`
  )}`;

  return (
    <div className="mt-12">
      <p className="text-sm text-mute">{step} / 5</p>

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
                  onClick={() => selectServiceType(v)}
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

          {form.serviceType === "유료" ? (
            <div>
              <p className="text-base font-medium">
                Q) 공간 규모별 요금을 선택해주세요
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {PAID_TIERS.map((tier) => (
                  <Choice
                    key={tier.size}
                    label={`${tier.size} · ${tier.price}`}
                    active={form.size === tier.size}
                    onClick={() => selectPaidTier(tier)}
                  />
                ))}
              </div>
            </div>
          ) : (
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
          )}

          <div>
            <p className="text-base font-medium">
              Q) 가구 예산은 어느 정도로 생각하세요?
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {FURNITURE_BUDGETS.map((v) => (
                <Choice
                  key={v}
                  label={v}
                  active={form.furnitureBudget === v}
                  onClick={() =>
                    setForm((prev) => ({ ...prev, furnitureBudget: v }))
                  }
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
        <div className="mt-4 flex flex-col gap-8">
          {mbtiPhase === "intro" && (
            <div className="flex flex-col gap-5">
              <p className="text-xl font-semibold tracking-tight">
                😀 MBTI 인테리어 성향 테스트
              </p>
              <p className="text-base text-mute">
                테스트를 통해 컨설팅 할 때 고려하여 디자인 합니다.
              </p>

              <div className="rounded-2xl border border-line p-6">
                <ul className="flex flex-col gap-2 text-sm">
                  <li>
                    <span className="font-medium">A</span>가 많은 사람 →
                    정갈한 미니멀 & 실용주의 스타일 (ISTJ/ISFJ/ESTJ)
                  </li>
                  <li>
                    <span className="font-medium">B</span>가 많은 사람 →
                    따뜻한 감성 & 코지 스타일 (INFJ/INFP/ENFJ)
                  </li>
                  <li>
                    <span className="font-medium">C</span>가 많은 사람 →
                    스마트 & 구조적 인테리어 (INTJ/INTP/ISTP)
                  </li>
                  <li>
                    <span className="font-medium">D</span>가 많은 사람 →
                    개성 넘치고 컬러풀한 공간 (ENFP/ESFP/ENTP)
                  </li>
                </ul>
              </div>

              <p className="text-sm text-mute">
                재미로 하는 것이니 너무 목숨 걸지 말아주세요😅
                <br />
                🎨 이 자료는 컨설팅 할 때 참고용으로 사용합니다~
              </p>

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
                  onClick={() => setMbtiPhase("quiz")}
                  className="rounded-full bg-ink px-8 py-3 text-sm font-medium text-paper"
                >
                  테스트 시작하기
                </button>
              </div>
            </div>
          )}

          {mbtiPhase === "quiz" && (
            <div className="flex flex-col gap-6">
              <p className="text-sm text-mute">
                질문 {mbtiIndex + 1} / {MBTI_QUESTIONS.length}
              </p>
              <p className="text-base font-medium">
                Q{mbtiIndex + 1}. {MBTI_QUESTIONS[mbtiIndex].question}
              </p>
              <div className="flex flex-col gap-2">
                {MBTI_QUESTIONS[mbtiIndex].options.map((opt) => (
                  <button
                    key={opt.letter}
                    type="button"
                    onClick={() => selectMbtiAnswer(opt.letter)}
                    className="rounded-xl border border-line px-5 py-3 text-left text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-mist"
                  >
                    <span className="mr-2 text-mute">{opt.letter}.</span>
                    {opt.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  mbtiIndex === 0 ? setMbtiPhase("intro") : mbtiPrevQuestion()
                }
                className="self-start rounded-full border border-line px-8 py-3 text-sm font-medium text-ink"
              >
                이전
              </button>
            </div>
          )}

          {mbtiPhase === "result" && (
            <div className="flex flex-col gap-5">
              <p className="text-sm text-mute">테스트 결과</p>
              <p className="text-xl font-semibold tracking-tight">
                {computeMbtiResult(mbtiAnswers).label}
              </p>
              <p className="text-base text-mute">
                {computeMbtiResult(mbtiAnswers).types}
              </p>
              <p className="text-sm text-mute">
                이 결과는 컨설팅 시 참고 자료로만 사용돼요. 다음 단계에서
                이름과 연락처를 입력해주세요.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMbtiIndex(MBTI_QUESTIONS.length - 1);
                    setMbtiAnswers((prev) => prev.slice(0, -1));
                    setMbtiPhase("quiz");
                  }}
                  className="rounded-full border border-line px-8 py-3 text-sm font-medium text-ink"
                >
                  다시 답하기
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="rounded-full bg-ink px-8 py-3 text-sm font-medium text-paper"
                >
                  다음
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 4 && (
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
            <label className="text-base font-medium" htmlFor="gender">
              Q) 성별이 어떻게 되시나요?
            </label>
            <select
              id="gender"
              value={form.gender}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, gender: e.target.value }))
              }
              className="mt-3 w-full rounded-xl border border-line bg-paper px-4 py-3 text-base outline-none focus:border-ink"
            >
              <option value="" disabled>
                성별을 선택해주세요
              </option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-base font-medium">
              Q) 태어난 연도와 월이 어떻게 되시나요? (연도 필수, 월 선택)
            </p>
            <div className="mt-3 flex gap-3">
              <select
                id="birthYear"
                value={form.birthYear}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, birthYear: e.target.value }))
                }
                className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-base outline-none focus:border-ink"
              >
                <option value="" disabled>
                  연도
                </option>
                {BIRTH_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}년
                  </option>
                ))}
              </select>
              <select
                id="birthMonth"
                value={form.birthMonth}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, birthMonth: e.target.value }))
                }
                className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-base outline-none focus:border-ink"
              >
                <option value="">월 (선택)</option>
                {BIRTH_MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}월
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-base font-medium" htmlFor="region">
              Q) 방문하실 지역을 선택해주세요
            </label>
            <select
              id="region"
              value={form.region}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, region: e.target.value }))
              }
              className="mt-3 w-full rounded-xl border border-line bg-paper px-4 py-3 text-base outline-none focus:border-ink"
            >
              <option value="" disabled>
                지역을 선택해주세요
              </option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <input
              value={form.addressDetail}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  addressDetail: e.target.value,
                }))
              }
              className="mt-3 w-full rounded-xl border border-line bg-paper px-4 py-3 text-base outline-none focus:border-ink"
              placeholder="나머지 주소를 입력해주세요 (예: 강남구 역삼동 123-45)"
            />
          </div>

          <div>
            <label className="text-base font-medium" htmlFor="visitDate">
              Q) 방문 상담 날짜를 선택해주세요 (선택)
            </label>
            <input
              id="visitDate"
              type="date"
              min={tomorrowDateString()}
              value={form.visitDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, visitDate: e.target.value }))
              }
              className="mt-3 w-full rounded-xl border border-line bg-paper px-4 py-3 text-base outline-none focus:border-ink"
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
              onClick={() => setStep(3)}
              className="rounded-full border border-line px-8 py-3 text-sm font-medium text-ink"
            >
              이전
            </button>
            <button
              type="button"
              disabled={!step4Done}
              onClick={() => setStep(5)}
              className="rounded-full bg-ink px-8 py-3 text-sm font-medium text-paper disabled:opacity-30"
            >
              다음
            </button>
          </div>
        </div>
      )}

      {step === 5 && status === "success" && !finalized && (
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-xl font-semibold tracking-tight">
            공간 사진을 올려주세요.
          </p>
          <p className="text-base text-mute">
            사진이 있으시면 올려주세요 — 저희가 관리자 페이지에서 바로
            확인할 수 있어요. 없으시면 그냥 완료를 눌러주셔도 괜찮아요.
          </p>

          <label className="self-start rounded-full border border-line px-6 py-3 text-sm font-medium text-ink hover:bg-mist">
            사진 올리기
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handlePhotoSelect(e.target.files)}
              className="hidden"
            />
          </label>

          {photos.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {photos.map((p) => (
                <li
                  key={p.name}
                  className="flex items-center gap-2 text-sm text-mute"
                >
                  <span>
                    {p.state === "uploading"
                      ? "⏳"
                      : p.state === "done"
                        ? "✓"
                        : "✕"}
                  </span>
                  {p.name}
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={() => setFinalized(true)}
            className="mt-4 self-start rounded-full bg-ink px-8 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-80"
          >
            완료
          </button>
        </div>
      )}

      {step === 5 && status === "success" && finalized && (
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-xl font-semibold tracking-tight">
            접수가 완료됐어요.
          </p>
          <p className="text-base text-mute">
            빠르게 확인하고 연락드릴게요.
          </p>
        </div>
      )}

      {step === 5 && status !== "success" && (
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

          <div className="rounded-2xl border border-line bg-mist p-6">
            <p className="text-sm font-medium">개인정보 수집·이용 동의</p>
            <ul className="mt-3 flex flex-col gap-1.5 text-xs leading-relaxed text-mute">
              <li>· 수집 항목: 이름, 연락처, 방문 희망일, 상담 신청 내용</li>
              <li>
                · 수집 목적: 상담 신청 접수 및 회신, 맞춤 공간 솔루션 제공
              </li>
              <li>· 보유 및 이용 기간: 수집일로부터 1년, 이후 파기</li>
              <li>
                · 개인정보보호법에 따라 위 정보를 처리하며, 동의를 거부할
                권리가 있습니다. 다만 동의하지 않으실 경우 상담 신청이
                어려울 수 있습니다.
              </li>
            </ul>

            <label className="mt-4 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.privacyAgreed}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    privacyAgreed: e.target.checked,
                  }))
                }
                className="h-4 w-4 accent-ink"
              />
              [필수] 개인정보 수집 및 이용에 동의합니다.
            </label>
          </div>

          {status === "error" && (
            <p className="text-sm text-red-600">
              전송에 문제가 생겼어요. 다시 시도해주시거나, 아래로 바로
              이메일을 보내주세요.
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="rounded-full border border-line px-8 py-3 text-sm font-medium text-ink"
            >
              이전
            </button>
            <button
              type="button"
              disabled={status === "submitting" || !form.privacyAgreed}
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
