import { formatINR, Notice, TextField, useAuth } from '@uptime/shared';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SPARE_PARTS_CATALOG, useOwnerStore } from '../store/ownerStore';

export default function CartCheckoutPage() {
  const { status } = useAuth();
  const navigate = useNavigate();
  const { cart, activePlant, walletBalance, proPassActive, updateCartQty, removeFromCart, placeOrder } = useOwnerStore();

  const [poNumber, setPoNumber] = useState(`PO-${new Date().getFullYear()}-048`);
  const [gate, setGate] = useState(`${activePlant.name.split('•')[0].trim()} — Gate 2, Bay 2`);
  const [speed, setSpeed] = useState<'EXPRESS_60M' | 'SCHEDULED'>('EXPRESS_60M');
  const [payMethod, setPayMethod] = useState<'WALLET' | 'ESCROW_UPI'>('ESCROW_UPI');
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const signedIn = status === 'authenticated';

  const items = cart
    .map((c) => {
      const part = SPARE_PARTS_CATALOG.find((p) => p.id === c.partId);
      return part ? { part, qty: c.qty } : null;
    })
    .filter((x): x is { part: (typeof SPARE_PARTS_CATALOG)[number]; qty: number } => x !== null);

  const subtotal = items.reduce((s, i) => s + i.part.price * i.qty, 0);
  const deliveryFee = speed === 'EXPRESS_60M' && !proPassActive ? 250 : 0;
  const gst = Math.round((subtotal + deliveryFee) * 0.18);
  const grandTotal = subtotal + deliveryFee + gst;

  function handleCheckout(e: FormEvent) {
    e.preventDefault();
    if (!signedIn) {
      navigate('/login', {
        state: {
          from: '/cart',
          reason: 'Sign in with your mobile number to complete your OEM spare parts checkout and generate your 18% GST ITC invoice.',
        },
      });
      return;
    }
    const ord = placeOrder({ poNumber, gate, deliverySpeed: speed, paymentMethod: payMethod });
    if (ord) setConfirmedId(ord.id);
  }

  const content = (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900">Procurement Cart &amp; Plant Checkout</h1>
          <p className="text-xs text-slate-500">100% escrow hold • 18% GST Input Tax Credit invoice issued automatically.</p>
        </div>
        <Link to="/marketplace" className="text-xs font-bold text-blue-600 hover:underline">
          ← Continue Shopping Spare Parts
        </Link>
      </div>

      {confirmedId && (
        <Notice tone="success">
          Order <strong>{confirmedId}</strong> confirmed and dispatched to {gate}! View your receipt inside the Spare Parts Store.
        </Notice>
      )}

      {items.length === 0 ? (
        <div className="rounded-3xl bg-white border border-slate-200 p-10 text-center space-y-3 shadow-sm">
          <i className="fa-solid fa-cart-shopping text-3xl text-slate-300" aria-hidden="true"></i>
          <h2 className="text-base font-display font-extrabold text-slate-900">Your procurement cart is empty</h2>
          <p className="text-xs text-slate-500">Browse QR-verified SKF bearings, Siemens 415V contactors, Bosch DEF modules, and ABB drives.</p>
          <Link to="/marketplace" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">
            Explore OEM Spare Parts →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Line Items */}
          <div className="lg:col-span-7 space-y-3">
            {items.map(({ part, qty }) => (
              <div key={part.id} className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[10px] text-slate-400">{part.sku} • {part.brand}</div>
                  <div className="text-sm font-display font-extrabold text-slate-900">{part.name}</div>
                  <div className="text-xs font-mono text-blue-700 font-bold mt-1">{formatINR(part.price)} each</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Decrease quantity for ${part.name}`}
                    onClick={() => updateCartQty(part.id, qty - 1)}
                    className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-mono text-sm font-bold">{qty}</span>
                  <button
                    type="button"
                    aria-label={`Increase quantity for ${part.name}`}
                    onClick={() => updateCartQty(part.id, qty + 1)}
                    className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold cursor-pointer"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${part.name}`}
                    onClick={() => removeFromCart(part.id)}
                    className="ml-2 text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Box */}
          <aside className="lg:col-span-5 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-display font-black text-slate-900">Delivery &amp; Escrow Payment</h2>

            <TextField label="Plant Delivery Gate / Bay" value={gate} onChange={(e) => setGate(e.target.value)} />
            <TextField label="Purchase Order (PO) Number" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSpeed('EXPRESS_60M')}
                className={`p-3 rounded-xl border-2 text-left cursor-pointer ${speed === 'EXPRESS_60M' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}
              >
                <div className="font-bold text-slate-900">60-Min SOS Runner</div>
                <div className="text-[11px] text-emerald-700 font-mono">{proPassActive ? 'FREE (Pro Pass)' : '₹250'}</div>
              </button>
              <button
                type="button"
                onClick={() => setSpeed('SCHEDULED')}
                className={`p-3 rounded-xl border-2 text-left cursor-pointer ${speed === 'SCHEDULED' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}
              >
                <div className="font-bold text-slate-900">Scheduled Slot</div>
                <div className="text-[11px] text-emerald-700 font-mono">FREE</div>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPayMethod('ESCROW_UPI')}
                className={`p-3 rounded-xl border-2 text-left cursor-pointer ${payMethod === 'ESCROW_UPI' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}
              >
                <div className="font-bold text-slate-900">Razorpay Escrow</div>
                <div className="text-[10px] text-slate-500">UPI / NetBanking</div>
              </button>
              <button
                type="button"
                disabled={walletBalance < grandTotal}
                onClick={() => setPayMethod('WALLET')}
                className={`p-3 rounded-xl border-2 text-left cursor-pointer disabled:opacity-50 ${payMethod === 'WALLET' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}
              >
                <div className="font-bold text-slate-900">Corporate Wallet</div>
                <div className="text-[10px] font-mono text-emerald-700">{formatINR(walletBalance)}</div>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Parts Subtotal</span>
                <span className="font-mono font-bold text-slate-900">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span className="font-mono font-bold text-emerald-700">{deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (18% ITC Eligible)</span>
                <span className="font-mono font-bold text-slate-900">{formatINR(gst)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-base font-display font-black text-slate-900">
                <span>Total</span>
                <span className="font-mono text-blue-700">{formatINR(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-tap py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer"
            >
              {signedIn ? `Place Order & Pay ${formatINR(grandTotal)}` : 'Sign In to Complete Checkout →'}
            </button>
          </aside>
        </form>
      )}
    </div>
  );

  return content;
}
