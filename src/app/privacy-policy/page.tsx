import { siteConfig } from "@/data/site";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/Container";

export const metadata = buildMetadata({
  title: "Политика конфиденциальности",
  description: `Политика конфиденциальности сайта ${siteConfig.domain.replace(/^https?:\/\//, "")}.`,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <article className="py-14 sm:py-20">
      <Container className="max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900">Политика конфиденциальности</h1>
        <p className="text-sm text-slate-500">Редакция от 03.04.2026. Текст является шаблоном и подлежит юридической проверке.</p>

        <h2 className="mt-10 text-xl font-semibold text-slate-900">1. Общие положения</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Настоящая политика определяет порядок обработки и защиты информации о пользователях сайта{" "}
          <strong>{siteConfig.domain}</strong> (далее — «Сайт»), принадлежащего компании{" "}
          <strong>{siteConfig.siteName}</strong> (далее — «Оператор»). Используя Сайт и отправляя заявки через формы,
          вы подтверждаете согласие с условиями настоящей политики.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-slate-900">2. Какие данные мы обрабатываем</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          При заполнении форм на Сайте вы можете указать имя, номер телефона, адрес электронной почты и произвольный
          комментарий. Также автоматически могут обрабатываться технические данные (например, IP-адрес, дата и время
          запроса) в объёме, необходимом для работы Сайта и защиты от злоупотреблений.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-slate-900">3. Цели обработки</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
          <li>обработка заявок и обратная связь;</li>
          <li>заключение и исполнение договоров с клиентами;</li>
          <li>информирование об услугах при наличии отдельного согласия;</li>
          <li>обеспечение безопасности и работоспособности Сайта.</li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold text-slate-900">4. Правовые основания</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Обработка персональных данных осуществляется в соответствии с Федеральным законом № 152-ФЗ «О персональных
          данных» на основании согласия субъекта данных и/или иных оснований, предусмотренных законодательством РФ.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-slate-900">5. Передача третьим лицам</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Оператор не передаёт персональные данные третьим лицам, за исключением случаев, предусмотренных законом, либо
          когда передача необходима для обработки заявки (например, хостинг-провайдер, сервис email-рассылки, будущая CRM
          при наличии договора поручения/обработки данных).
        </p>

        <h2 className="mt-8 text-xl font-semibold text-slate-900">6. Срок хранения</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Данные хранятся не дольше, чем это необходимо для достижения целей обработки, если иной срок не установлен
          законом или договором.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-slate-900">7. Меры защиты</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Оператор принимает организационные и технические меры для защиты персональных данных от неправомерного доступа,
          уничтожения, изменения, блокирования, копирования, распространения.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-slate-900">8. Права субъекта персональных данных</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Вы вправе запросить уточнение, блокирование или удаление ваших персональных данных, отозвать согласие,
          обратившись к Оператору по контактам, указанным в разделе «Контакты» на Сайте: {siteConfig.email},{" "}
          {siteConfig.phone}.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-slate-900">9. Изменения</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Оператор вправе обновлять настоящую политику. Актуальная версия постоянно доступна по адресу /privacy-policy.
        </p>
      </Container>
    </article>
  );
}
