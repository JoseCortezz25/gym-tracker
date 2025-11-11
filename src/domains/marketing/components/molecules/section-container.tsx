import { cn } from '@/lib/utils';

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const SectionContainer = ({
  children,
  className,
  id
}: SectionContainerProps) => {
  return (
    <section
      id={id}
      className={cn('px-4 py-16 md:px-6 md:py-24 lg:px-8', className)}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
};
