type SummaryCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  comingSoon?: boolean;
};

export default function SummaryCard({
  title,
  value,
  subtitle,
  comingSoon = false,
}: SummaryCardProps) {
  return (
    <div className="rounded border border-card-border bg-card-bg p-5">
      <p className="text-base lg:text-lg text-muted ">{title}</p>
      {comingSoon ? (
        <p className="mt-2 text-lg text-muted italic">Coming Soon</p>
      ) : (
        <>
          <p className="mt-1 text-3xl font-bold wrap-break-word">{value}</p>
          {subtitle && <p className="mt-1 text-base lg:text-lg text-muted">{subtitle}</p>}
        </>
      )}
    </div>
  );
}
