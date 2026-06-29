import { useFormContext } from "react-hook-form";
import { emailExists } from "../storage";
import type { CustomerSchemaType } from "../schema";

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

const inputCls =
  "rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

export default function PersonalInfo() {
  const {
    register,
    formState: { errors, isValidating },
  } = useFormContext<CustomerSchemaType>();

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="First Name" error={errors.firstName?.message}>
          <input {...register("firstName")} className={inputCls} />
        </Field>

        <Field label="Last Name" error={errors.lastName?.message}>
          <input {...register("lastName")} className={inputCls} />
        </Field>
      </div>

      <Field label="Email" error={errors.email?.message}>
        <div className="relative">
          <input
            {...register("email", {
              validate: async (val) => {
                if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
                  return true;
                const exists = await emailExists(val);
                return !exists || "This email is already registered";
              },
            })}
            type="email"
            className={inputCls + " w-full pr-8"}
          />
          {isValidating && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              ···
            </span>
          )}
        </div>
      </Field>

      <Field label="Phone" error={errors.phone?.message}>
        <input {...register("phone")} className={inputCls} placeholder="10-digit number" />
      </Field>
    </div>
  );
}
