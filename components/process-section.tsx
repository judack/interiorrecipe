import { Reveal } from "@/components/reveal";

const PLANS = [
  {
    id: "A",
    name: "Edit Consulting",
    title: "공간 방향 상담",
    description:
      "현재 공간의 문제를 진단하고 가구 배치와 공간 개선 방향을 제안합니다.",
    listLabel: "추천 대상",
    items: [
      "가구 구매 전 방향이 필요한 고객",
      "기존 가구를 활용하고 싶은 고객",
      "큰 공사 없이 공간을 바꾸고 싶은 고객",
    ],
  },
  {
    id: "B",
    name: "Edit Curation",
    title: "공간·가구 큐레이션",
    description:
      "평면 구성과 가구, 소재, 조명 및 스타일링 요소를 하나의 방향으로 제안합니다.",
    listLabel: "포함 항목",
    items: [
      "공간 진단",
      "레이아웃",
      "3D 제안",
      "가구 리스트",
      "소재 및 색상 방향",
      "설치·세팅 (추가금액 발생)",
    ],
  },
  {
    id: "C",
    name: "Edit Interior",
    title: "인테리어 디자인·시공",
    description:
      "구조 변경이나 마감 공사가 필요한 공간을 인테리어레시피와 함께 설계하고 구현합니다.",
    listLabel: "포함 항목",
    items: [
      "현장 실측",
      "디자인 설계",
      "시공 견적",
      "공사 및 현장 관리",
      "가구 배송·설치",
      "최종 스타일링",
    ],
  },
];

const PRICES = [
  { size: "12평 이하", price: "50만원" },
  { size: "12평 투룸 ~ 15평 이하", price: "100만원" },
  { size: "15평 이상 아파트 및 빌라", price: "가격 협의" },
];

export function ProcessSection() {
  return (
    <section id="process" className="px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.2em] text-mute uppercase">
            Process
          </p>
          <h2 className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
            우리의 레시피
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 100}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-paper p-8">
                <p className="text-sm font-medium text-mute">
                  {plan.id}. {plan.name}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
                  {plan.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-mute">
                  {plan.description}
                </p>

                <div className="mt-6 border-t border-line pt-6">
                  <p className="text-sm text-mute">{plan.listLabel}</p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {plan.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-baseline gap-2 text-base"
                      >
                        <span className="text-mute">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          <div className="mt-6 rounded-2xl bg-mist p-8">
            <p className="text-sm font-medium text-mute">B. Edit Curation</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">
              공간 규모에 따른 기준
            </h3>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {PRICES.map((p) => (
                <div
                  key={p.size}
                  className="border-t border-line pt-4 md:border-t-0 md:border-l md:pl-6 md:pt-0 md:first:border-l-0 md:first:pl-0"
                >
                  <p className="text-sm text-mute">{p.size}</p>
                  <p className="mt-1 text-lg font-semibold">{p.price}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-xs leading-relaxed text-mute">
              가구 구매비는 별도이며, A-C 플랜은 공간과 범위에 따라 상담 후
              안내해드립니다.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
