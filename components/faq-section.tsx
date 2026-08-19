import { Reveal } from "@/components/reveal";

export const FAQ_ITEMS = [
  {
    question: "상담은 유료인가요, 무료인가요?",
    answer:
      "무료 상담(공간 방향 제안)과 유료 상담(가구·스타일링 큐레이션) 두 가지로 나뉘어요. 유료 상담은 평수에 따라 50만원부터 시작하며, 상담 신청 시 원하시는 방식을 선택할 수 있어요.",
  },
  {
    question: "방문 상담도 가능한가요?",
    answer:
      "네, 전국 어디든 신청 가능해요. 상담 신청 시 지역과 방문 희망일을 선택하실 수 있어요.",
  },
  {
    question: "가구는 어디서, 어떻게 구매하나요?",
    answer:
      "상담을 통해 제안받은 가구는 쿠팡에서 직접 구매하실 수 있어요. 홈페이지의 '이번달 추천 아이템'에서도 스타일·용도별로 큐레이션된 상품을 바로 확인할 수 있어요.",
  },
  {
    question: "시공(인테리어 공사)까지 가능한가요?",
    answer:
      "네, 구조 변경이나 마감 공사가 필요한 공간은 Edit Interior 플랜을 통해 설계부터 시공, 가구 배송·설치까지 함께 진행해요.",
  },
  {
    question: "상담 신청 후 얼마나 빨리 연락받을 수 있나요?",
    answer: "신청 내용을 빠르게 확인하고 연락드려요.",
  },
] as const;

export function FaqSection() {
  return (
    <section id="faq" className="px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.2em] text-mute uppercase">
            FAQ
          </p>
          <h2 className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
            자주 묻는 질문
          </h2>
        </Reveal>

        <div className="mt-16 border-t border-line md:mt-20">
          {FAQ_ITEMS.map((item, i) => (
            <Reveal key={item.question} delay={i * 60}>
              <div className="border-b border-line py-8">
                <p className="text-lg font-medium md:text-xl">
                  {item.question}
                </p>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-mute">
                  {item.answer}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
