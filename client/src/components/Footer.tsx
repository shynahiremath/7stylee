import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-ink text-bone">
      {/* Top strip */}
      <div className="border-t border-bone/10">
        <div className="max-w-[1200px] mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <p className="font-display text-3xl tracking-tight mb-4">7STYLE</p>
            <p className="font-sans text-sm text-bone/55 leading-relaxed max-w-xs">
              Clothes designed around you — considered, personal, and made to last beyond the season.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="font-sans text-xs tracking-wider uppercase text-champagne mb-5">Shop</p>
            <ul className="space-y-3 font-sans text-sm text-bone/60">
              <li><Link to="/" className="hover:text-champagne transition-colors">New Arrivals</Link></li>
              <li><Link to="/" className="hover:text-champagne transition-colors">Dresses</Link></li>
              <li><Link to="/" className="hover:text-champagne transition-colors">Tops &amp; Blouses</Link></li>
              <li><Link to="/" className="hover:text-champagne transition-colors">Co-ords &amp; Sets</Link></li>
              <li><Link to="/" className="hover:text-champagne transition-colors">Occasion Wear</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <p className="font-sans text-xs tracking-wider uppercase text-champagne mb-5">Help</p>
            <ul className="space-y-3 font-sans text-sm text-bone/60">
              <li><Link to="/my-orders" className="hover:text-champagne transition-colors">Track My Order</Link></li>
              <li><a href="#" className="hover:text-champagne transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-champagne transition-colors">Returns &amp; Exchanges</a></li>
              <li><a href="#" className="hover:text-champagne transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-bone/10">
        <div className="max-w-[1200px] mx-auto px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-sans text-xs text-bone/35">
            © {new Date().getFullYear()} 7Style. All rights reserved.
          </p>
          <p className="font-sans text-xs text-bone/35 tracking-wide">
            Designed for the modern Indian woman
          </p>
        </div>
      </div>
    </footer>
  );
}
