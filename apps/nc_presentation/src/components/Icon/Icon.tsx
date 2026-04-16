type Props = {
  path: string;
  className?: string;
};

export default function Icon({ path, className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d={path} />
    </svg>
  );
}
