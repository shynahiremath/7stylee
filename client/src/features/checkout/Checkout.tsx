import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { usePrefStore } from "../../store/preferenceStore";
import { useAuthStore } from "../../store/authStore";
import { orderService } from "../../services/orders";
import { errorMessage, formatInr, shippingFor, unitPrice, variantOf } from "../../lib/utils";
import type { ShippingAddress } from "../../types/types";
import { Field } from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import { Notice, Spinner } from "../../components/ui/States";

const STEPS = ["Contact", "Address", "Delivery", "Payment", "Confirmation"] as const;

export default function Checkout() {
  const { items, fetch, loading } = useCartStore();
  const { addresses, saveAddress } = usePrefStore();
  const user = useAuthStore((s) => s.user);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState<ShippingAddress>({
    fullName: user?.name || "",
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch();
  }, [fetch]);

  const subtotal = items.reduce((s, i) => s + unitPrice(i.product, variantOf(i.product, i.sku)) * i.quantity, 0);
  const shipping = shippingFor(subtotal);

  const next = (e: FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const place = async () => {
    setError("");
    setPlacing(true);
    try {
      saveAddress({ id: "default", label: "Primary", ...form });
      const res = await orderService.create(form);
      navigate("/order-success", { state: { order: res.data.order } });
    } catch (err) {
      setError(errorMessage(err, "Could not place order"));
    } finally {
      setPlacing(false);
    }
  };

  if (loading && items.length === 0) return <Spinner label="Preparing checkout" />;

  return (
    <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-12">
      <p className="font-sans text-[11px] tracking-wider uppercase text-champagne mb-2">Secure checkout</p>
      <h1 className="font-display text-4xl mb-8">Almost yours</h1>
      <ol className="flex flex-wrap gap-4 mb-12 font-sans text-[11px] tracking-wider uppercase">
        {STEPS.map((s, i) => (
          <li key={s} className={i === step ? "text-ink" : "text-charcoal/35"}>{String(i + 1).padStart(2, "0")} {s}</li>
        ))}
      </ol>

      {error && <div className="mb-6"><Notice tone="error">{error}</Notice></div>}

      <div className="grid lg:grid-cols-[1fr_340px] gap-12">
        <div>
          {step === 0 && (
            <form onSubmit={next} className="space-y-6 max-w-md">
              <Field label="Email" type="email" value={user?.email || ""} readOnly />
              <Field label="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
              <Button type="submit">Continue to address</Button>
            </form>
          )}
          {step === 1 && (
            <form onSubmit={next} className="space-y-6 max-w-md">
              {addresses.length > 0 && (
                <div className="space-y-2 mb-4">
                  {addresses.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      className="block w-full text-left border border-hairline p-4 text-sm hover:border-ink"
                      onClick={() => setForm({ fullName: a.fullName, line1: a.line1, city: a.city, state: a.state, postalCode: a.postalCode, phone: a.phone })}
                    >
                      {a.label} — {a.line1}, {a.city}
                    </button>
                  ))}
                </div>
              )}
              <Field label="Address" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} required />
              <Field label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
              <Field label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
              <Field label="PIN code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} required />
              <Field label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              <div className="flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setStep(0)}>Back</Button>
                <Button type="submit">Continue</Button>
              </div>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={next} className="space-y-6 max-w-md">
              <p className="font-sans text-sm text-charcoal/70 leading-relaxed">
                Standard delivery across India, typically 3–7 business days. Complimentary shipping on orders above ₹2,000 — matching the server’s current rule.
              </p>
              <div className="flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit">Continue to payment</Button>
              </div>
            </form>
          )}
          {step >= 3 && (
            <div className="space-y-6 max-w-md">
              <div className="border border-hairline p-5 bg-white">
                <p className="font-sans text-xs tracking-wider uppercase text-champagne mb-2">Payment</p>
                <p className="font-sans text-sm text-charcoal/65 leading-relaxed">
                  Orders are created with payment status PENDING. No card numbers or payment secrets are collected here — a payment gateway is not connected on the server.
                </p>
              </div>
              <ul className="text-xs text-charcoal/50 space-y-2">
                <li>✦ Secure session with your 7Style account</li>
                <li>✦ Perfect Fit Guarantee</li>
                <li>✦ Thoughtful returns after delivery</li>
              </ul>
              <div className="flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setStep(2)}>Back</Button>
                <Button type="button" disabled={placing || items.length === 0} onClick={place}>
                  {placing ? "Placing…" : "Place order"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <aside className="border border-hairline p-6 h-fit bg-white">
          <p className="font-sans text-xs tracking-wider uppercase text-champagne mb-4">Order summary</p>
          {items.length === 0 ? (
            <p className="text-sm text-charcoal/50">Your bag is empty.</p>
          ) : (
            <ul className="space-y-3 mb-6">
              {items.map((i) => (
                <li key={i.sku} className="flex justify-between text-sm gap-3">
                  <span className="truncate">{i.product.name} × {i.quantity}</span>
                  <span>{formatInr(unitPrice(i.product, variantOf(i.product, i.sku)) * i.quantity)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="text-sm flex justify-between mb-1"><span>Subtotal</span><span>{formatInr(subtotal)}</span></div>
          <div className="text-sm flex justify-between mb-4 text-charcoal/50"><span>Shipping</span><span>{shipping === 0 ? "Complimentary" : formatInr(shipping)}</span></div>
          <div className="flex justify-between font-display text-2xl border-t border-hairline pt-4">
            <span>Total</span>
            <span>{formatInr(subtotal + shipping)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
