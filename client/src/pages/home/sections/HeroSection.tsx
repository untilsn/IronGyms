export default function HeroSection() {
  return (
    <section className="hero-bg min-h-[90vh] flex items-center">
      <div className="container relative z-10">
        <div className="max-w-3xl space-y-8">
          {/* Label */}
          <span className="section-label">Performance Reimagined</span>

          {/* Heading — dùng class text-gradient từ index.css */}
          <h1 className="text-[clamp(3rem,9vw,5.5rem)]">
            TRAIN HARDER.
            <br />
            <span className="text-gradient">PUSH FURTHER.</span>
          </h1>

          {/* Sub */}
          <p className="section-subtitle text-xl max-w-lg">
            Hệ thống quản lý phòng gym hiện đại — dành cho những người không bỏ cuộc.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 pt-2">
            <a href="#" className="btn-primary ">
              Đăng ký ngay
            </a>
            <a href="#" className="btn-secondary">
              Xem gói tập
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
