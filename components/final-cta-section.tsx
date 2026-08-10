import { SITE } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";

export function FinalCtaSection() {
  return (
    <section className="bg-ink px-6 py-32 text-paper md:px-10 md:py-48">
      <div className="mx-auto flex max-w-6xl flex-col items-start">
        <Reveal>
          <h2 className="max-w-3xl font-display text-3xl leading-[1.2] font-bold md:text-6xl">
            작은 방도 배치에 따라
            <br />
            완전히 달라질 수 있습니다.
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <a
            href={SITE.reservationHref}
            className="mt-12 inline-flex items-center rounded-full bg-paper px-8 py-4 text-base font-medium text-ink transition-opacity hover:opacity-80"
          >
            컨설팅 시작하기
          </a>
        </Reveal>
      </div>
    </section>
  );
}
