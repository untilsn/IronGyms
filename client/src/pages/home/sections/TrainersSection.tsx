// src/pages/home/sections/TrainersSection.tsx

// Tạm thời hardcode, về sau thay bằng useTrainers() hook
const trainers = [
  { name: 'Marcus Thorne', role: 'Head of Strength & Conditioning', img: '/trainers/marcus.jpg' },
  { name: 'Elena Vance', role: 'Metabolic Specialization', img: '/trainers/elena.jpg' },
  { name: 'David Chen', role: 'Human Performance Director', img: '/trainers/david.jpg' },
];

export default function TrainersSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-20 space-y-3">
          <span className="section-label">Master Coaches</span>
          <h2 className="section-title text-4xl md:text-5xl">THE ARCHITECTS</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {trainers.map((trainer, i) => (
            <div key={trainer.name} className={`space-y-5 ${i === 1 ? 'lg:mt-12' : ''}`}>
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-bg-elevated">
                <img
                  src={trainer.img}
                  alt={trainer.name}
                  className="img-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div>
                <h4 className="text-xl font-bold">{trainer.name}</h4>
                <p className="text-primary text-xs font-bold uppercase tracking-wider mt-1">
                  {trainer.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
