import { Reveal } from "@/components/reveal";

const STEPS = [
  {
    number: "01",
    title: "공간 사진 업로드",
    description: "지금 살고 계신 공간을 사진으로 보내주세요.",
  },
  {
    number: "02",
    title: "평형·예산·라이프스타일 입력",
    description: "공간 크기와 예산, 생활 방식을 알려주세요.",
  },
  {
    number: "03",
    title: "공간 분석",
    description: "받은 사진과 정보를 바탕으로 공간을 분석합니다.",
  },
  {
    number: "04",
    title: "가구배치 및 인테리어 제안",
    description: "가장 효율적인 가구배치와 인테리어를 제안합니다.",
  },
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

        <div className="mt-16 grid grid-cols-1 gap-0 border-t border-line md:mt-24 md:grid-cols-4 md:border-t-0">
          {STEPS.map((step, i) => (
            <Reveal key={step.number} delay={i * 100}>
              <div className="flex flex-col gap-4 border-b border-line py-8 md:h-full md:border-b-0 md:border-l md:border-b-0 md:px-6 md:py-0 md:first:border-l-0 md:first:pl-0">
                <span className="text-sm font-medium text-mute">
                  {step.number}
                </span>
                <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
                  {step.title}
                </h3>
                <p className="text-base leading-relaxed text-mute">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
