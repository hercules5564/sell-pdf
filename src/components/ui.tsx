import Link from "next/link";
import { cn } from "@/lib/cn";

export function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">{children}</div>;
}

export function Button({
  children,
  href,
  variant = "primary",
  className,
  type = "button",
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background";
  const classes = cn(
    base,
    variant === "primary" &&
      "bg-accent text-accent-foreground shadow-md shadow-accent/25 hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5 active:translate-y-0",
    variant === "secondary" &&
      "border-2 border-accent/30 bg-transparent text-accent hover:bg-accent/10 hover:border-accent",
    variant === "ghost" &&
      "text-muted hover:bg-muted-bg hover:text-foreground",
    className
  );

  if (href) return <Link className={classes} href={href}>{children}</Link>;
  return <button className={classes} type={type}>{children}</button>;
}

export function Card({
  children,
  className,
  hover,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-card-border bg-card p-6 shadow-sm transition-all duration-200",
        hover && "hover:shadow-lg hover:border-accent/20 hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </div>
  );
}
