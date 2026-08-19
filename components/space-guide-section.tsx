import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site-config";

export const GUIDE_ITEMS = [
  {
    question: "원룸에서 침대는 어디에 두어야 하나요?",
    answer:
      "창문과 출입 동선을 피해, 문에서 먼 안쪽 벽면에 붙이는 배치가 가장 무난해요.",
    reason:
      "침대를 공간 중앙이나 동선 위에 두면 방이 더 좁아 보이고 생활 동선도 불편해져요. 벽에 붙이면 남는 공간을 한쪽으로 모을 수 있어 다른 가구를 놓을 여유가 생겨요.",
    apply:
      "침대 옆에는 최소 50~60cm 정도의 통행 공간을 남겨두면 답답해 보이지 않아요.",
    related: "컨설팅 진행 과정의 '공간 진단·레이아웃' 단계에서 직접 확인할 수 있어요.",
  },
  {
    question: "좁은 원룸을 어떻게 분리할 수 있나요?",
    answer:
      "벽을 세우지 않아도 가구 배치와 러그, 조명만으로 영역을 나눌 수 있어요.",
    reason:
      "완전히 막힌 파티션은 좁은 공간을 더 답답하게 만들 수 있어요. 시야는 트이되 영역만 구분하는 방식이 원룸에 더 잘 맞아요.",
    apply:
      "생활 공간과 침실 경계에 낮은 수납 가구나 러그로 경계를 표시하고, 구역별로 조명을 다르게 주면 구분이 더 명확해져요.",
    related: "이번달 추천 아이템에서 러그·조명류를 함께 확인할 수 있어요.",
  },
  {
    question: "작은 방에서 수납공간을 늘리는 방법은 무엇인가요?",
    answer:
      "바닥 면적을 차지하는 가구보다, 벽면과 높이를 활용하는 수납이 좁은 방에 유리해요.",
    reason:
      "원룸은 바닥 면적이 한정적이라, 같은 수납량이라도 세로로 쌓는 구조가 체감 공간을 덜 차지해요.",
    apply:
      "침대 밑 수납, 벽 선반, 문 뒤 공간을 먼저 활용하고 자주 안 쓰는 물건은 눈높이보다 높은 곳에 두세요.",
    related: "이번달 추천 아이템의 수납장·선반 카테고리를 참고해보세요.",
  },
  {
    question: "가구를 구매하기 전에 무엇을 먼저 정해야 하나요?",
    answer:
      "가구를 먼저 고르기보다, 공간 치수와 예산, 우선순위를 먼저 정하는 게 순서예요.",
    reason:
      "치수를 모르고 가구부터 사면 배치가 안 맞아 재구매하거나 방이 더 좁아 보이는 경우가 많아요.",
    apply:
      "방 치수 실측 → 예산 설정 → 꼭 필요한 가구 우선순위 정하기 → 배치 계획 순으로 진행하면 시행착오를 줄일 수 있어요.",
    related: "상담 신청 시 평수·가구 예산·불편한 점을 먼저 확인해요.",
  },
] as const;

export function SpaceGuideSection() {
  return (
    <section id="guide" className="bg-mist px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.2em] text-mute uppercase">
            Guide
          </p>
          <h2 className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
            공간 배치 가이드
          </h2>
          <p className="mt-4 max-w-xl text-base text-mute">
            자주 물어보시는 공간 고민에 먼저 답해드려요.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-2">
          {GUIDE_ITEMS.map((item, i) => (
            <Reveal key={item.question} delay={i * 80}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-paper p-8">
                <p className="text-lg font-semibold tracking-tight md:text-xl">
                  {item.question}
                </p>
                <p className="mt-3 text-base leading-relaxed">{item.answer}</p>
                <p className="mt-3 text-sm leading-relaxed text-mute">
                  {item.reason}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-mute">
                  <span className="font-medium text-ink">적용 방법 · </span>
                  {item.apply}
                </p>
                <p className="mt-4 text-xs text-mute">{item.related}</p>
                <a
                  href={SITE.reservationHref}
                  className="mt-6 inline-flex w-fit items-center rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-mist"
                >
                  내 공간 컨설팅 신청하기
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
