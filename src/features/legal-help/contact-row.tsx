export function ContactRow({
  href,
  icon,
  iconClassName,
  title,
  body,
}: {
  href: string;
  icon: React.ReactNode;
  iconClassName: string;
  title: string;
  body: string;
}) {
  return (
    <a
      href={href}
      className="flex min-w-0 items-center gap-4 rounded-2xl border border-gray-200 px-5 py-4 transition-colors hover:bg-gray-50"
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
      >
        {icon}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="type-body-m-semibold wrap-anywhere text-gray-900">{title}</span>
        <span className="type-body-s text-gray-600">{body}</span>
      </span>
    </a>
  );
}
