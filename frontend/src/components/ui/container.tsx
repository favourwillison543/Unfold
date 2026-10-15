import * as React from "react";

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function Container({
  children,
  className = "",
  ...props
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-7xl px-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}