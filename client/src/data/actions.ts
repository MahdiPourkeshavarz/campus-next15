/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { subscribeSchema } from "@/schema/email";
import { subscribeService } from "./services";

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
      errorMessage: "ops! something went wrong!",
    };
  }

  const responseData = await subscribeService(validatedFields.data.email);

  if (!responseData) {
    return {
      ...prevState,
      zodErrors: responseData.error,
      strapiErrors: null,
      errorMessage: "ops! something went wrong!",
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: responseData.error,
      errorMessage: "failed to subscribe!",
    };
  }

  return {
    ...prevState,
    zodErrors: null,
    strapiErrors: null,
    errorMessage: null,
    successMessage: "Successfully Subscribed",
  };
}
