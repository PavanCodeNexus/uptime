import { UptimeEmblem, useAuth } from '@uptime/shared';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOwnerStore } from '../store/ownerStore';

export function PublicHeader() {
  const { status, user } = useAuth();
  const { cartCount } = useOwnerStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const signedIn = status === 'authenticated';

  function handleBookClick() {
    if (signedIn) {
      navigate('/report');
    } else {
      navigate('/login', {
        state: {
          from: '/report',
          reason: 'Sign in with your mobile number to book a verified technician and receive your arrival OTP.',
        },
      });
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl">
          <UptimeEmblem size="md" accent="teal" />
          <div>
            <span className="block text-base font-display font-black tracking-tight text-slate-900 leading-none">UPTIME</span>
            <span className="block text-[10px] font-mono font-semibold text-slate-500 tracking-wider uppercase mt-0.5">Predict • Repair • Perform</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600" aria-label="Primary">
          <a href="/#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="/#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
          <a href="/#industries" className="hover:text-slate-900 transition-colors">Industries</a>
          <Link to="/marketplace" className="hover:text-slate-900 transition-colors">Spare Parts</Link>
          <Link to="/wiki" className="hover:text-slate-900 transition-colors">Repair Wiki</Link>
          <a href="/#pricing" className="hover:text-slate-900 transition-colors">Plans &amp; AMC</a>
        </nav>

        <div className="hidden sm:flex items-center gap-2.5">
          {cartCount > 0 && (
            <Link
              to="/cart"
              aria-label={`View cart with ${cartCount} items`}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5"
            >
              <i className="fa-solid fa-cart-shopping text-blue-600" aria-hidden="true"></i>
              <span>{cartCount}</span>
            </Link>
          )}

          {signedIn ? (
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-900 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{user?.fullName ?? 'My Dashboard'}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition-colors"
            >
              Sign In
            </Link>
          )}

          <button
            type="button"
            onClick={handleBookClick}
            className="px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <i className="fa-solid fa-bolt" aria-hidden="true"></i>
            <span>Book Emergency Repair</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
        >
          <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`} aria-hidden="true"></i>
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <div className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
            <a href="/#features" onClick={() => setMenuOpen(false)} className="py-1.5">Features</a>
            <a href="/#how-it-works" onClick={() => setMenuOpen(false)} className="py-1.5">How It Works</a>
            <a href="/#industries" onClick={() => setMenuOpen(false)} className="py-1.5">Industries</a>
            <Link to="/marketplace" onClick={() => setMenuOpen(false)} className="py-1.5">Spare Parts Store</Link>
            <Link to="/wiki" onClick={() => setMenuOpen(false)} className="py-1.5">Repair Wiki</Link>
            <a href="/#pricing" onClick={() => setMenuOpen(false)} className="py-1.5">Plans &amp; AMC</a>
          </div>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {signedIn ? (
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-center text-xs font-bold">
                Open Dashboard
              </Link>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="w-full py-2.5 rounded-xl border border-slate-200 text-center text-xs font-bold text-slate-800">
                Sign In
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                handleBookClick();
              }}
              className="w-full py-2.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold cursor-pointer"
            >
              Book Emergency Repair
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export function PublicFooter() {
  const { setCookieModalOpen } = useOwnerStore();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <UptimeEmblem size="md" accent="teal" />
            <div>
              <div className="text-base font-display font-black text-white">UPTIME</div>
              <div className="text-[10px] font-mono text-[#00D4AA] tracking-widest">PREDICT. REPAIR. PERFORM.</div>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            India&apos;s on-demand industrial maintenance, fleet repair, and power electronics dispatch network backed by 100% escrow protection.
          </p>
          <div className="text-xs font-mono text-emerald-400 font-bold">
            <i className="fa-solid fa-phone mr-1.5" aria-hidden="true"></i>24/7 SOS Helpline: 1800-415-UPTIME
          </div>
        </div>

        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Platform</h3>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li><Link to="/ai-triage" className="hover:text-white transition-colors">Gemini AI Fault Triage</Link></li>
            <li><Link to="/report" className="hover:text-white transition-colors">15-Min Emergency Dispatch</Link></li>
            <li><Link to="/digital-twin" className="hover:text-white transition-colors">Digital Twin &amp; FFT Diagnostics</Link></li>
            <li><Link to="/marketplace" className="hover:text-white transition-colors">OEM Spare Parts Store</Link></li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Enterprise &amp; Support</h3>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li><Link to="/protection" className="hover:text-white transition-colors">30-Day Warranty &amp; AMC</Link></li>
            <li><Link to="/wiki" className="hover:text-white transition-colors">415V Repair Wiki &amp; Schematics</Link></li>
            <li><Link to="/signup" className="hover:text-white transition-colors">Register Factory / Fleet (GST ITC)</Link></li>
            <li><Link to="/status" className="hover:text-white transition-colors">System Status</Link></li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Trust &amp; Legal</h3>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service &amp; Escrow Charter</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy (DPDP Act 2023)</Link></li>
            <li>
              <button type="button" onClick={() => setCookieModalOpen(true)} className="hover:text-white transition-colors cursor-pointer text-left">
                Cookie Preferences
              </button>
            </li>
            <li className="text-[11px] text-slate-500 pt-1">Serving Peenya • Whitefield • E-City • Bommasandra</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800/80 py-4 px-4 sm:px-6 text-center text-[11px] text-slate-500">
        © {new Date().getFullYear()} UPTIME Industrial Technologies Pvt. Ltd. • ISO 9001:2015 &amp; ISO 45001 Safety Compliant • All Rights Reserved.
      </div>
    </footer>
  );
}
