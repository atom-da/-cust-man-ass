import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CustomerSchema, type CustomerSchemaType } from "./schema";
import { createCustomer } from "../store/customerSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

import PersonalInfo from "./components/PersonalInfo";
import AddressInfo from "./components/AddressInfo";
import Review from "./components/Review";
import Stepper from "./components/Stepper";

export default function CustomerForm() {
  const dispatch = useAppDispatch();
  const saving = useAppSelector((s) => s.customers.status === "saving");

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const methods = useForm<CustomerSchemaType>({
    resolver: zodResolver(CustomerSchema),
    mode: "onBlur",
    defaultValues: { sameAsBilling: false },
  });

  const { handleSubmit, trigger, reset } = methods;

  const stepFields: (keyof CustomerSchemaType | string)[][] = [
    ["firstName", "lastName", "email", "phone"],
    [
      "billing.address1", "billing.city", "billing.state", "billing.pincode",
      "shipping.address1", "shipping.city", "shipping.state", "shipping.pincode",
    ],
    [],
  ];

  const next = async () => {
    const valid = await trigger(stepFields[step] as Parameters<typeof trigger>[0]);
    if (valid) setStep((s) => s + 1);
  };

  const previous = () => setStep((s) => s - 1);

  const onSubmit = async (data: CustomerSchemaType) => {
    await dispatch(createCustomer(data)).unwrap();
    setSubmitted(true);
    reset();
    setStep(0);
  };

  if (submitted) {
    return (
      <div className="rounded border border-green-400 bg-green-50 p-6 text-center">
        <p className="text-lg font-semibold text-green-700">Customer created successfully!</p>
        <button className="mt-4 rounded bg-blue-600 px-4 py-2 text-white" onClick={() => setSubmitted(false)}>Add Another</button>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <Stepper step={step} />

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 0 && <PersonalInfo />}
        {step === 1 && <AddressInfo />}
        {step === 2 && <Review />}

        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <button type="button" className="rounded border px-4 py-2" onClick={previous}>Previous</button>
          )}

          {step < 2 ? (
            <button type="button" className="rounded bg-blue-600 px-4 py-2 text-white" onClick={next}>Next</button>
          ) : (
            <button type="submit" disabled={saving} className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-60">{saving ? "Saving..." : "Create Customer"}</button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
