/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { subscribeSchema } from "@/schema/email";

export async function subscribeAction(prevState: any, formData: FormData) {
  const validatedFields = subscribeSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    console.dir(validatedFields.error.flatten().fieldErrors, { depth: null });

    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
    };
  }
}
