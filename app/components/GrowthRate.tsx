const GrowthRate = ({ rate }: { rate: number }) => {
  return (
    <>
      <p className="hidden lg:block mb-2 text-base font-semibold text-muted">
        Growth rate since 2012
      </p>
      <div>
        <span
          className="ml-2 font-mono font-semibold shrink-0 text-xl lg:text-3xl"
          style={{ color: rate >= 0 ? "#2eaa50" : "#e04040" }}
        >
          {rate >= 0 ? "+" : ""}
          {rate}%
          <span className="lg:hidden ml-2 text-base font-semibold text-muted">
            (Growth rate since 2012)
          </span>
        </span>
      </div>
    </>
  );
};

export default GrowthRate;
