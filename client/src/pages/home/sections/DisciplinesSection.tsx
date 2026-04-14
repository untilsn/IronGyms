// src/pages/home/sections/DisciplinesSection.tsx
const disciplines = [
  {
    icon: '🏋️',
    title: 'Strength',
    desc: 'Absolute power through compound focus and progressive loading.',
  },
  {
    icon: '⚡',
    title: 'Metabolic',
    desc: 'Unrelenting conditioning sessions designed to optimize gas tank.',
  },
  {
    icon: '🧘',
    title: 'Mobility',
    desc: 'Functional range of motion for fluidity and joint longevity.',
  },
  {
    icon: '🔋',
    title: 'Regeneration',
    desc: 'Protocol-driven rest to ensure peak performance availability.',
  },
];

export default function DisciplinesSection() {
  return (
    <section className="section bg-bg-surface">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-3">
            <span className="section-label">Core Pillars</span>
            <h2 className="section-title text-4xl md:text-5xl">THE DISCIPLINES</h2>
          </div>
          <p className="section-subtitle max-w-sm md:text-right">
            4 hướng phát triển không thể thiếu của một vận động viên toàn diện.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {disciplines.map(item => (
            <div key={item.title} className="card p-8 h-[340px] flex flex-col justify-end">
              <span className="text-4xl mb-5">{item.icon}</span>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-text-secondary text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
