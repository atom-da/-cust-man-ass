import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const inputCls =
  "rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function AddressSection({
  prefix,
  title,
  errors,
  register,
}: {
  prefix: "billing" | "shipping";
  title: string;
  errors: Record<string, { message?: string }>;
  register: ReturnType<typeof useFormContext>["register"];
}) {
  return (
    <section>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </h2>
      <div className="grid gap-3">
        <Field label="Address" error={errors.address1?.message}>
          <input
            {...register(`${prefix}.address1`)}
className={inputCls}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="City" error={errors.city?.message}>
            <input
              {...register(`${prefix}.city`)}
className={inputCls}
            />
          </Field>

          <Field label="State" error={errors.state?.message}>
            <input
              {...register(`${prefix}.state`)}
className={inputCls}
            />
          </Field>
        </div>

        <Field label="Pincode" error={errors.pincode?.message}>
          <input
            {...register(`${prefix}.pincode`)}
className={inputCls}
          />
        </Field>
      </div>
    </section>
  );
}

export default function AddressInfo() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();

  const billing = watch("billing");
  const sameAsBilling = watch("sameAsBilling");

  useEffect(() => {
    if (sameAsBilling) setValue("shipping", billing);
  }, [billing, sameAsBilling, setValue]);

  const billingErrors = (errors.billing ?? {}) as Record<string, { message?: string }>;
  const shippingErrors = (errors.shipping ?? {}) as Record<string, { message?: string }>;

  return (
    <div className="space-y-6">
      <AddressSection prefix="billing" title="Billing Address" errors={billingErrors} register={register} />

      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          {...register("sameAsBilling")}
          className="h-4 w-4 rounded border-gray-300 accent-blue-600"
        />
        Same as billing address
      </label>

      {!sameAsBilling && (
        <>
          <div className="border-t border-gray-100" />
          <AddressSection prefix="shipping" title="Shipping Address" errors={shippingErrors} register={register} />
        </>
      )}
    </div>
  );
}
