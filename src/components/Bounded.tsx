import clsx from "clsx";

type BoundedProps = {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
};

export default function Bounded({
  as: Comp = "section",
  className,
  children,
  ...props
}: BoundedProps) {
  return (
    <Comp
      className={clsx("px-4 py-10 md:py-14 md:px-6 lg:py-16", className)}
      {...props}
    >
      <div className="mx-auto w-full sm-max:!max-w-none max-w-6xl">
        {children}
      </div>
    </Comp>
  );
}
