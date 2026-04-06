import Image from "next/image";
import { Cpu } from "lucide-react";
import { homeAnchors } from "@/data/navigation";
import { Container } from "@/components/layout/Container";
import { HeroActions } from "@/components/sections/HeroActions";

/** PNG с альфой: `public/images/hero-terminal-photoroom.png` (Photoroom / вырезка фона) */
const HERO_TERMINAL = "/images/hero-terminal-photoroom.png";

export function Hero() {
  return (
    <section
      id={homeAnchors.hero}
      className="relative min-h-[min(92vh,920px)] overflow-hidden bg-[var(--brand-dark)] pb-20 pt-14 sm:pb-28 sm:pt-20"
    >
      {/* Декоративный фон без фото — чтобы не перекрывать терминал */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black via-[#1a1208] to-[#2d2100]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_85%_35%,rgba(255,102,0,0.14),transparent_55%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_15%_85%,rgba(255,140,60,0.08),transparent_50%)]"
        aria-hidden
      />

      <div className="hero-light-refract" aria-hidden />
      <div className="hero-light-refract-rim" aria-hidden />

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10 lg:gap-x-14">
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-orange-100 shadow-[0_0_24px_rgba(255,102,0,0.15)] backdrop-blur-md">
              <Cpu className="size-3.5 text-[var(--brand-accent-bright)]" aria-hidden />
              Партнёр Эвотор · Подбор касс и честные условия
            </p>
            <h1 className="mt-7 text-balance text-3xl font-bold tracking-tight text-white drop-shadow-sm sm:text-4xl lg:text-5xl">
              Онлайн-кассы Эвотор: подбор, доставка, настройка и поддержка
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/90 sm:text-lg lg:mx-0">
              Помогаем выбрать смарт-терминал или POS Power под вашу нишу, подключаем кассу к ОФД и эквайрингу,
              регистрируем ККТ и обучаем персонал — фокус на решениях Эвотор, а не «абстрактной автоматизации».
            </p>
            <HeroActions />
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none lg:justify-self-end">
            <div
              className="pointer-events-none absolute inset-0 -z-10 scale-110 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,102,0,0.2),transparent_68%)] blur-2xl"
              aria-hidden
            />
            <div className="relative aspect-[555/352] w-full max-w-lg lg:ml-auto lg:max-w-xl">
              <Image
                src={HERO_TERMINAL}
                alt="Смарт-терминал Эвотор с экраном продажи"
                fill
                className="object-contain object-center drop-shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
