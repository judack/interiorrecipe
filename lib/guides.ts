export type GuideSection = {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  directAnswer: string;
  corePrinciples: string[];
  recommended: string[];
  avoid: string[];
  checklist: string[];
  productTypes: string[];
  relatedSlugs: string[];
  publishedDate: string;
  updatedDate: string;
};

export const GUIDES: GuideSection[] = [
  {
    slug: "6-pyeong-studio-layout",
    title: "6평 원룸 가구배치 가이드 | 인테리어레시피",
    metaDescription:
      "6평(약 19.8㎡) 원룸에서 가구를 배치하는 핵심 원칙, 추천 배치와 피해야 할 배치, 체크리스트를 정리했어요.",
    h1: "6평 원룸, 가구는 어떻게 배치해야 할까요?",
    directAnswer:
      "6평(약 19.8㎡)은 원룸 중에서도 좁은 편이라, 가구를 고르기 전에 동선부터 확보하는 게 우선이에요. 침대·수납·책상을 벽면별로 하나씩 나눠 배치하고, 부피가 큰 가구는 최소화하는 게 기본 원칙이에요.",
    corePrinciples: [
      "벽면 하나에 가구 하나씩 배치해 중앙 동선을 비워두기",
      "바닥에 놓는 가구 수를 최소화하고 벽·수직 공간을 활용하기",
      "문이 열리는 방향과 창문 위치를 먼저 확인하고 배치 계획 세우기",
    ],
    recommended: [
      "침대는 창문 반대편이나 옆 벽에 붙이고, 머리맡이 출입문과 바로 마주치지 않게 배치",
      "수납은 행거와 선반을 상하로 나눠 바닥 면적을 절약",
      "책상이 꼭 필요하다면 접이식이나 폭 60cm 이하의 슬림형을 고려",
    ],
    avoid: [
      "침대를 방 중앙에 두는 배치 — 동선을 두 배로 차지해요",
      "큰 옷장과 서랍장을 같은 벽에 나란히 두는 배치 — 통로가 사라져요",
      "현관 바로 앞에 가구를 두는 배치 — 문이 열리는 반경을 막아요",
    ],
    checklist: [
      "침대 옆 통행폭을 50cm 이상 확보했나요?",
      "문이 완전히 열리는 반경에 가구가 없나요?",
      "콘센트 위치와 가구 배치가 겹치지 않나요?",
      "창문을 가리는 큰 가구는 없나요?",
    ],
    productTypes: ["침대", "수납장", "옷장", "선반"],
    relatedSlugs: ["studio-bed-position", "7-pyeong-studio-layout"],
    publishedDate: "2026-08-19",
    updatedDate: "2026-08-19",
  },
  {
    slug: "7-pyeong-studio-layout",
    title: "7평 원룸 가구배치 가이드 | 인테리어레시피",
    metaDescription:
      "7평(약 23.1㎡) 원룸에서 침실과 생활 공간을 나누는 가구배치 원칙, 추천 배치와 피해야 할 배치, 체크리스트를 정리했어요.",
    h1: "7평 원룸, 가구는 어떻게 배치해야 할까요?",
    directAnswer:
      "7평(약 23.1㎡)은 6평보다 여유가 있어서 동선뿐 아니라 기능 구분까지 고려할 수 있는 최소 규모예요. 침대·책상·수납을 동시에 배치하면서, 생활 공간과 취침 공간을 시각적으로 나누는 것부터 시작하는 게 좋아요.",
    corePrinciples: [
      "침실 영역과 생활 영역을 가구로 구획하기 (벽 파티션 없이도 가능)",
      "동선을 ㄱ자나 ㄴ자로 잡아 공간이 두 구역으로 인식되게 하기",
      "책상·소파 같은 기능 가구는 1개씩만 더하고 크기를 제한하기",
    ],
    recommended: [
      "침대는 안쪽 벽에, 책상은 창가 쪽에 두어 자연광을 활용",
      "낮은 수납장이나 책장을 침실과 생활공간의 경계처럼 활용",
      "2인용 미니 소파나 좌식 테이블은 창과 가까운 쪽에 배치",
    ],
    avoid: [
      "모든 가구를 벽에만 붙이고 중앙을 완전히 비우는 배치 — 동선은 넓어지지만 공간이 밋밋해 보여요",
      "침대와 책상을 마주보게 배치 — 휴식과 집중 모드 전환이 어려워요",
      "소파와 침대를 같은 방향으로 나란히 배치 — 구역 구분이 사라져요",
    ],
    checklist: [
      "침실 구역과 생활 구역이 시각적으로 구분되나요?",
      "책상 앞에 자연광이 들어오나요?",
      "소파나 좌식 테이블 앞에 최소한의 여유 공간이 있나요?",
      "수납 가구가 동선을 가로막지 않나요?",
    ],
    productTypes: ["침대", "책상", "소파", "수납장"],
    relatedSlugs: ["6-pyeong-studio-layout", "studio-bed-position"],
    publishedDate: "2026-08-19",
    updatedDate: "2026-08-19",
  },
  {
    slug: "studio-bed-position",
    title: "원룸 침대 위치 가이드 | 인테리어레시피",
    metaDescription:
      "원룸에서 침대를 어디에 두어야 하는지, 평수와 무관하게 적용되는 배치 원칙과 피해야 할 위치를 정리했어요.",
    h1: "원룸에서 침대는 어디에 두는 게 좋을까요?",
    directAnswer:
      "평수와 무관하게, 침대는 창문·출입 동선을 피해 벽면에 붙이는 게 기본이에요. 다만 정확한 위치는 창문 방향, 콘센트 위치, 냉난방기 위치에 따라 달라질 수 있어요.",
    corePrinciples: [
      "벽에 붙여 동선을 한쪽으로 모으기",
      "문에서 침대까지 시야가 완전히 열리지 않도록 살짝 비스듬하게 배치하기",
      "냉난방기 바람이 직접 닿지 않는 위치 고르기",
    ],
    recommended: [
      "창문과 평행하게 붙이면 채광과 동선을 동시에 확보할 수 있어요",
      "헤드보드를 창문 반대쪽 벽에 두면 겨울철 냉기 영향을 줄일 수 있어요",
    ],
    avoid: [
      "창문 바로 아래 — 환기할 때 온도 변화가 크고 방범에도 불리해요",
      "출입문과 일직선 — 동선을 방해하고 사생활이 노출돼요",
      "에어컨·난방기 토출구 정면 — 수면 중 직접 바람을 맞게 돼요",
    ],
    checklist: [
      "침대가 창문에 바로 붙어있지 않나요?",
      "문을 열었을 때 침대가 시야에 바로 들어오지 않나요?",
      "냉난방기 바람이 침대로 직접 향하지 않나요?",
      "콘센트가 침대 헤드 쪽에서 손 닿는 거리에 있나요?",
    ],
    productTypes: ["침대"],
    relatedSlugs: ["6-pyeong-studio-layout", "7-pyeong-studio-layout"],
    publishedDate: "2026-08-19",
    updatedDate: "2026-08-19",
  },
];

export function getGuideBySlug(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}
