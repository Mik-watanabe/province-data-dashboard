import clsx from "clsx";

type CardTitleProps = {
  children: React.ReactNode;
  className?: string;
};

const CardTitle = ({
  children,
  className,
}: CardTitleProps) => {
  return (
    <>
      <h2 className={clsx("mb-1 text-xl lg:text-2xl font-semibold", className)}>
        {children}
      </h2>
    </>
  );
};

export default CardTitle;
