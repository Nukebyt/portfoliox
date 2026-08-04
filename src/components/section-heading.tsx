export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-lg font-semibold text-[color:var(--color-accent)]">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight sm:text-[2.5rem]">
        {title}
      </h2>
      <p className="text-sm leading-7 text-[color:var(--color-muted)] sm:text-[1rem]">
        {description}
      </p>
    </div>
  );
}
