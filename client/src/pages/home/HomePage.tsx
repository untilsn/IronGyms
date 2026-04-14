import React from 'react';
import HeroSection from './sections/HeroSection';
import DisciplinesSection from './sections/DisciplinesSection';
import TrainersSection from './sections/TrainersSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DisciplinesSection />
      <TrainersSection />
    </>
  );
}
