import { Reveal } from "@/components/reveal";

const PROBLEMS = [
  "가구를 샀는데 방이 더 좁아 보이는 문제",
  "침대와 책상 위치를 결정하기 어려운 문제",
  "작은 원룸 공간을 제대로 활용하기 어려운 문제",
];

export function ProblemSection() {
  return (
    <section id="problem" className="px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.2em] text-mute uppercase">
            Problem
          </p>
          <h2 className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
            많은 원룸이
            <br />
            같은 문제를 겪습니다
          </h2>
        </Reveal>

        <div className="mt-16 border-t border-line md:mt-24">
          {PROBLEMS.map((problem, i) => (
            <Reveal key={problem} delay={i * 80}>
              <div className="flex flex-col gap-2 border-b border-line py-8 md:flex-row md:items-baseline md:justify-between md:py-10">
                <p className="max-w-2xl text-xl leading-snug font-medium md:text-2xl">
                  {problem}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
