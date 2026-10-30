import { Link } from "react-router-dom";
import { usePrefStore } from "../../store/preferenceStore";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/ui/Button";
import { STYLE_PERSONALITIES } from "../../types/types";

export function AccountStyle() {
  const { style, setStyle } = usePrefStore();
  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Style profile</h1>
      <p className="text-sm text-charcoal/50 mb-8">Saved on this device. There is no style-preference API on the server.</p>
      <div className="flex flex-wrap gap-2 mb-8">
        {STYLE_PERSONALITIES.map((s) => (
          <button key={s} onClick={() => setStyle(s)} className={`px-4 py-2 text-xs tracking-wider uppercase border ${style === s ? "bg-ink text-bone border-ink" : "border-hairline"}`}>
            {s}
          </button>
        ))}
      </div>
      <Link to="/discover"><Button variant="ghost">Open discovery</Button></Link>
    </div>
  );
}

export function AccountDesigns() {
  const { designs, removeDesign } = usePrefStore();
  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Saved designs</h1>
      {designs.length === 0 ? <p className="text-charcoal/40">No saved designs yet.</p> : (
        <ul className="space-y-4">
          {designs.map((d) => (
            <li key={d.id} className="border-b border-hairline pb-4 flex justify-between gap-4">
              <span>{d.color} {d.fabric} {d.garment} · {d.silhouette}</span>
              <button className="text-xs uppercase tracking-wide text-charcoal/40" onClick={() => removeDesign(d.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <Link to="/design" className="inline-block mt-8"><Button>Design studio</Button></Link>
    </div>
  );
}

export function AccountAddresses() {
  const { addresses, removeAddress } = usePrefStore();
  return (
    <div>
      <h1 className="font-display text-3xl mb-4">Addresses</h1>
      <p className="text-sm text-charcoal/50 mb-8">Saved locally for checkout convenience. The server only stores an address on each order.</p>
      {addresses.length === 0 && <p className="text-charcoal/40">No saved addresses. They appear after checkout.</p>}
      <ul className="space-y-4">
        {addresses.map((a) => (
          <li key={a.id} className="border border-hairline p-5">
            <p className="font-display text-xl">{a.fullName}</p>
            <p className="text-sm text-charcoal/60">{a.line1}, {a.city}, {a.state} {a.postalCode}</p>
            <p className="text-sm">{a.phone}</p>
            <button className="mt-3 text-xs uppercase tracking-wide text-charcoal/40" onClick={() => removeAddress(a.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AccountSettings() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Settings</h1>
      <p className="text-sm mb-2">{user?.name}</p>
      <p className="text-sm text-charcoal/50 mb-8">{user?.email}</p>
      <p className="text-sm text-charcoal/50 mb-8">Name and email are managed by the auth API. There is no profile-update endpoint yet.</p>
      <Button variant="ghost" onClick={() => logout()}>Log out</Button>
    </div>
  );
}
