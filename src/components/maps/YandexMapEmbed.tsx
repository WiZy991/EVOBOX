import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils/cn";

type YandexMapEmbedProps = {
  className?: string;
  title?: string;
};

/** Встраиваемая карта (виджет Яндекса). Координаты — в `siteConfig.map`. */
export function YandexMapEmbed({ className, title = "Карта проезда к офису" }: YandexMapEmbedProps) {
  const { lng, lat, zoom } = siteConfig.map;
  const ll = `${lng},${lat}`;
  const pt = `${lng},${lat},pm2rdm`;
  const src = `https://yandex.ru/map-widget/v1/?ll=${encodeURIComponent(ll)}&z=${zoom}&pt=${encodeURIComponent(pt)}`;

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm", className)}>
      <iframe
        title={title}
        src={src}
        width="100%"
        height="100%"
        className="min-h-[280px] w-full border-0 sm:min-h-[360px] lg:min-h-[400px]"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
