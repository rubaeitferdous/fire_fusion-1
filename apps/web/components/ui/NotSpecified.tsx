type NotSpecifiedProps = {
  children?: string;
};

export function NotSpecified({ children }: NotSpecifiedProps) {
  return <span className="not-specified">{children ?? "NOT SPECIFIED — DO NOT INVENT."}</span>;
}
