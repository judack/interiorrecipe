import { Reveal } from "@/components/reveal";

const STATEMENTS = [
  "작은 공간일수록 배치 하나의 차이가 큽니다.",
  "가구를 새로 사지 않아도 공간은 달라질 수 있습니다.",
  "우리는 실제로 거주 가능한 대안을 제안합니다.",
];

const SERVICES = ["가구배치", "공간분리", "수납", "가구 추천", "인테리어 컨설팅"];

export function BrandSection() {
  return (
    <section id="brand" className="bg-mist px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 md:grid-cols-2 md:gap-12">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.2em] text-mute uppercase">
            Brand
          </p>
          <h2 className="mt-6 max-w-md text-3xl font-semibold tracking-tight leading-[1.44] md:text-5xl md:leading-[1.2]">
            1인 가구를 위한,
            <br />
            현실적인 공간 솔루션
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-mute">
            인테리어레시피는 혼자 사는 사람들, 2030세대의 방을 위한
            서비스입니다. 넓은 평수나 값비싼 가구가 아니라, 지금 있는
            공간을 가장 잘 쓰는 방법을 제안합니다.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {SERVICES.map((service) => (
              <li
                key={service}
                className="rounded-full border border-line px-4 py-1.5 text-sm text-mute"
              >
                {service}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <ul className="flex flex-col gap-8 md:pt-2">
            {STATEMENTS.map((statement) => (
              <li
                key={statement}
                className="border-t border-line pt-8 text-xl leading-snug font-medium md:text-2xl"
              >
                {statement}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
