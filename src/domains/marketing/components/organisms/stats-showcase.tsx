import { SectionContainer } from '../molecules/section-container';
import { StatNumber } from '../atoms/stat-number';
import { marketingTextMap } from '../../marketing.text-map';

export const StatsShowcase = () => {
  const { stats } = marketingTextMap;

  return (
    <SectionContainer className="bg-primary/5">
      <div className="grid grid-cols-3 gap-8 md:gap-12">
        <StatNumber value={stats.exercises} label={stats.exercisesLabel} />
        <StatNumber value={stats.categories} label={stats.categoriesLabel} />
        <StatNumber value={stats.tracking} label={stats.trackingLabel} />
      </div>
    </SectionContainer>
  );
};
