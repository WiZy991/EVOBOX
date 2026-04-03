import { siteConfig } from "@/data/site";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/Container";

export const metadata = buildMetadata({
  title: "Согласие на обработку персональных данных",
  description: `Условия обработки персональных данных при использовании сайта ${siteConfig.siteName}.`,
  path: "/personal-data",
});

export default function PersonalDataPage() {
  return (
    <article className="py-14 sm:py-20">
      <Container className="max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900">Обработка персональных данных</h1>
        <p className="text-sm text-slate-500">Редакция от 03.04.2026. Шаблон для согласования с юристом.</p>

        <h2 className="mt-10 text-xl font-semibold text-slate-900">1. Субъект данных</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Заполняя формы на сайте <strong>{siteConfig.domain}</strong>, вы (субъект персональных данных) предоставляете
          сведения, указанные в полях формы.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-slate-900">2. Оператор</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Оператором персональных данных является <strong>{siteConfig.siteName}</strong>. Контакты:{" "}
          <strong>{siteConfig.email}</strong>, тел. <strong>{siteConfig.phone}</strong>, адрес:{" "}
          <strong>{siteConfig.address}</strong>.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-slate-900">3. Состав данных</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Могут обрабатываться: фамилия, имя, отчество (при указании), номер телефона, адрес электронной почты, иные
          сведения, добровольно указанные в поле комментария, а также данные, необходимые для технической работы форм.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-slate-900">4. Цели и действия</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
          <li>обработка входящих заявок и обратный звонок;</li>
          <li>подготовка коммерческих предложений и заключение договоров;</li>
          <li>ведение клиентской переписки;</li>
          <li>исполнение требований законодательства РФ.</li>
        </ul>
        <p className="mt-3 text-slate-700 leading-relaxed">
          С персональными данными могут совершаться следующие действия: сбор, запись, систематизация, накопление,
          хранение, уточнение, использование, передача (предоставление доступа), блокирование, удаление, уничтожение.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-slate-900">5. Срок действия согласия</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Согласие действует до достижения целей обработки или до его отзыва субъектом данных путём направления
          обращения на адрес {siteConfig.email} либо иным способом, позволяющим идентифицировать субъекта.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-slate-900">6. Отзыв согласия</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Вы вправе отозвать согласие, направив соответствующее уведомление Оператору. Обработка после отзыва прекращается,
          за исключением случаев, когда она может продолжаться без согласия в силу закона.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-slate-900">7. Передача и трансграничная передача</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Передача третьим лицам осуществляется в случаях, указанных в политике конфиденциальности и законе. Трансграничная
          передача не осуществляется, если иное не будет отдельно согласовано с субъектом данных в порядке, установленном
          152-ФЗ.
        </p>
      </Container>
    </article>
  );
}
