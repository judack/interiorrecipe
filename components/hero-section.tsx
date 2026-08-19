import { SITE } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";
import { ConsultingCtaLink } from "@/components/consulting-cta-link";

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col items-start justify-center overflow-hidden bg-ink px-6 pt-24 md:px-10"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={SITE.heroPosterSrc}
      >
        <source src={SITE.heroVideoSrc} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/70" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.2em] text-white/70 uppercase">
            Interior Recipe
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-6 max-w-4xl text-[2rem] leading-[1.2] font-semibold tracking-tight text-white md:text-6xl lg:text-7xl">
            좁은 집도 배치가 바뀌면
            <br />
            삶이 달라집니다
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-white/80 md:text-xl">
            인테리어레시피는 원룸과 소형 주거공간의 구조, 생활 습관, 예산을
            분석해 나에게 맞는 가구배치와 제품을 제안합니다.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-12 flex flex-wrap items-center gap-3">
            <ConsultingCtaLink
              location="hero"
              className="inline-flex items-center rounded-full bg-paper px-8 py-4 text-base font-medium text-ink transition-opacity hover:opacity-80"
            >
              내 공간 컨설팅 신청하기
            </ConsultingCtaLink>
            <a
              href="#guide"
              className="inline-flex items-center rounded-full border border-white/40 px-8 py-4 text-base font-medium text-white transition-colors hover:bg-white/10"
            >
              공간 배치 가이드 보기
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
