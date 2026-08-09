import { Reveal } from "@/components/reveal";
import { ProductTag, type ProductTagData } from "@/components/product-tag";

// 사례 사진과 쇼핑 태그가 준비되면 아래 배열을 채우세요.
// - AFTER 사진에서 태그를 달고 싶은 가구의 위치를 x, y(%)로 지정하면 됩니다.
//   (x: 왼쪽에서부터 %, y: 위에서부터 %. 예: 사진 정중앙이면 x:50, y:50)
// - href에는 쿠팡파트너스에서 발급한 실제 상품 링크를 넣어주세요.
const CASES: { label: string; tags: ProductTagData[] }[] = [
  {
    label: "Case 01",
    tags: [
      // { x: 30, y: 70, name: "스탠드 조명", price: "39,900원", href: "https://link.coupang.com/a/여기에실제링크" },
    ],
  },
  {
    label: "Case 02",
    tags: [],
  },
];

function Panel({
  tag,
  tags,
}: {
  tag: "BEFORE" | "AFTER";
  tags?: ProductTagData[];
}) {
  return (
    <div className="relative aspect-[4/5]">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl bg-[#efeeea]">
        <span className="text-sm font-medium tracking-[0.2em] text-mute">
          {tag}
        </span>
      </div>
      {tags?.map((productTag) => (
        <ProductTag key={productTag.name} {...productTag} />
      ))}
    </div>
  );
}

export function BeforeAfterSection() {
  return (
    <section id="before-after" className="px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.2em] text-mute uppercase">
            Before &amp; After
          </p>
          <h2 className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
            달라진 공간
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-16 md:mt-24 md:grid-cols-2 md:gap-12">
          {CASES.map((c, i) => (
            <Reveal key={c.label} delay={i * 100}>
              <div>
                <div className="grid grid-cols-2 gap-3">
                  <Panel tag="BEFORE" />
                  <Panel tag="AFTER" tags={c.tags} />
                </div>
                <p className="mt-4 text-sm text-mute">{c.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-16 max-w-xl text-xs leading-relaxed text-mute">
          이 페이지의 상품 링크(＋ 태그)는 쿠팡 파트너스 활동의 일환으로
          제공되며, 이에 따른 일정액의 수수료를 제공받을 수 있습니다.
        </p>
      </div>
    </section>
  );
}
