import type { ReactNode } from 'react';

type Props = {
  active: boolean;
  className: string;
  children: ReactNode;
};

export default function Slide({ active, className, children }: Props) {
  return <div className={`slide ${className}${active ? ' active' : ''}`}>{children}</div>;
}
