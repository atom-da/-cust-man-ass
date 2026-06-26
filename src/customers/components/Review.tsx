import { useFormContext } from "react-hook-form";

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="w-24 shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {title}
      </h3>
      <div className="flex flex-col gap-1.5 rounded-lg bg-gray-50 px-4 py-3">
        {children}
      </div>
    </div>
  );
}

export default function Review() {
  const { getValues } = useFormContext();
  const data = getValues();

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Review your details before submitting.</p>

      <Section title="Personal Information">
        <Row label="Name" value={`${data.firstName} ${data.lastName}`} />
        <Row label="Email" value={data.email} />
        <Row label="Phone" value={data.phone} />
      </Section>

      <Section title="Billing Address">
        <Row label="Address" value={data.billing?.address1} />
        <Row label="City" value={data.billing?.city} />
        <Row label="State" value={data.billing?.state} />
        <Row label="Pincode" value={data.billing?.pincode} />
      </Section>

      <Section title="Shipping Address">
        <Row label="Address" value={data.shipping?.address1} />
        <Row label="City" value={data.shipping?.city} />
        <Row label="State" value={data.shipping?.state} />
        <Row label="Pincode" value={data.shipping?.pincode} />
      </Section>
    </div>
  );
}
