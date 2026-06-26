import { useFormContext } from "react-hook-form";

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

export default function PersonalInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="First Name" error={errors.firstName?.message as string}>
          <input
            {...register("firstName")}

            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </Field>

        <Field label="Last Name" error={errors.lastName?.message as string}>
          <input
            {...register("lastName")}

            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </Field>
      </div>

      <Field label="Email" error={errors.email?.message as string}>
        <input
          {...register("email")}
          type="email"

          className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </Field>

      <Field label="Phone" error={errors.phone?.message as string}>
        <input
          {...register("phone")}

          className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </Field>
    </div>
  );
}
