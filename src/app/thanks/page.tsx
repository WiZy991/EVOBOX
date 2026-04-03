import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

export const metadata = {
  ...buildMetadata({
    title: "Заявка отправлена",
    description: "Спасибо за обращение в EVOBOX. Мы свяжемся с вами в ближайшее время.",
    path: "/thanks",
  }),
  robots: { index: false, follow: true },
};

export default function ThanksPage() {
  return (
    <section className="py-24 sm:py-32">
      <Container className="max-w-lg text-center">
        <h1 className="text-3xl font-bold text-slate-900">Спасибо!</h1>
        <p className="mt-4 text-slate-600">
          Заявка принята. Мы свяжемся с вами по указанным контактам в рабочее время.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">На главную</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/catalog">Каталог</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
