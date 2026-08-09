import { Reveal } from "@/components/reveal";

const INPUTS = ["사진", "평면도", "예산"];

export function SolutionSection() {
  return (
    <section
      id="solution"
      className="bg-mist px-6 py-28 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.2em] text-mute uppercase">
            Solution
          </p>
          <h2 className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight leading-[1.44] md:text-5xl md:leading-[1.2]">
            정보를 알려주시면,
            <br />
            공간이 답이 됩니다
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-mute">
            사진, 평면도, 예산을 알려주시면 공간에 맞는 가구배치와
            인테리어 솔루션을 제안합니다.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-20 flex flex-col items-center gap-6 md:mt-28 md:flex-row md:justify-center md:gap-8">
            {INPUTS.map((input, i) => (
              <div key={input} className="flex items-center gap-6 md:gap-8">
                <div className="flex h-24 w-full min-w-40 items-center justify-center rounded-2xl border border-line bg-paper px-6 text-lg font-medium md:h-28 md:w-40">
                  {input}
                </div>
                {i < INPUTS.length - 1 && (
                  <span className="text-2xl text-mute">+</span>
                )}
              </div>
            ))}

            <span className="my-4 text-2xl text-mute md:my-0 md:mx-4">
              →
            </span>

            <div className="flex h-24 w-full min-w-40 items-center justify-center rounded-2xl bg-ink px-8 text-center text-lg font-medium text-paper md:h-28 md:w-64">
              맞춤 공간 솔루션
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
