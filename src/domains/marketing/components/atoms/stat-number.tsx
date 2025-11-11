import { cn } from '@/lib/utils';

interface StatNumberProps {
  value: string;
  label: string;
  className?: string;
}

export const StatNumber = ({ value, label, className }: StatNumberProps) => {
  return (
    <div className={cn('text-center', className)}>
      <div className="text-primary mb-2 text-4xl font-bold md:text-5xl">
        {value}
      </div>
      <div className="text-muted-foreground text-sm md:text-base">{label}</div>
    </div>
  );
};
