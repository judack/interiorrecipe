import { SITE } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";

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
          <h1 className="mt-6 max-w-4xl font-display text-[2.5rem] leading-[1.15] font-bold text-white md:text-6xl lg:text-7xl">
            내 방, 어떻게 꾸며야 할지
            <br />
            모르겠다면?
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-white/80 md:text-xl">
            사진만 보내주세요.
            <br />
            공간에 맞는 가구배치 레시피를 알려드립니다.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <a
            href={SITE.reservationHref}
            className="mt-12 inline-flex items-center rounded-full bg-paper px-8 py-4 text-base font-medium text-ink transition-opacity hover:opacity-80"
          >
            내 방 컨설팅 신청하기
          </a>
        </Reveal>
      </div>
    </section>
  );
}
