import { IMAGES } from '@/assets/images';
import { MdDarkMode } from 'react-icons/md';
const links = ['Programs', 'Trainers', 'Pricing', 'Contact'];

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="container flex justify-between items-center py-5 ">
        {/* logo */}
        <a href="/" className="max-w-30">
          <img src={IMAGES.logo} className="w-full h-full object-contain" alt="LOGO" />
        </a>

        {/* navlink */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="nav-link active">
            Home
          </a>
          {links.map(link => (
            <a href="#" key={link} className="nav-link">
              {link}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="btn-ghost text-sm">Log in</button>
          <a href="#" className="btn-primary text-sm py-2 px-5">
            Join Now
          </a>
        </div>

        {/* mode dark / light */}
        <button className="text-xl ">
          <MdDarkMode className="text-primary" />
        </button>
      </div>
    </nav>
  );
}
