export function SectionHeading({
  eyebrow,
  title,
  description,
  index,
}: {
  eyebrow: string;
  title: string;
  description: string;
  index?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-6">
      <div className="max-w-2xl space-y-3">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.28em] text-[color:var(--color-accent)]">
          {eyebrow}
        </p>
        <h2 className="font-serif text-4xl font-medium tracking-tight sm:text-[2.75rem]">
          {title}
        </h2>
        {description ? (
          <p className="text-sm leading-7 text-[color:var(--color-muted)] sm:text-[1rem]">
            {description}
          </p>
        ) : null}
      </div>
      {index ? (
        <span className="font-mono text-sm text-[color:var(--color-muted)]">
          {index}
        </span>
      ) : null}
    </div>
  );
}
