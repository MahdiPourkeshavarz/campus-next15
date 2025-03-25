/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { subscribeSchema } from "@/schema/email";
import { eventsSubscribeService, subscribeService } from "./services";
import { eventsSubscribeSchema } from "@/schema/form";
import { EventsSubscribeProps } from "@/types";

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

export async function eventsSubscribeAction(
  prevState: any,
  formData: FormData
) {
  const formDataObject = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    telephone: formData.get("telephone"),
    eventId: formData.get("eventId"),
  };

  const validatedFields = eventsSubscribeSchema.safeParse(formDataObject);

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      formData: {
        ...formDataObject,
      },
    };
  }

  const dataToSend: EventsSubscribeProps = {
    ...validatedFields.data,
    event: {
      connect: [formDataObject.eventId as string],
    },
  };

  const responseData = await eventsSubscribeService(dataToSend);

  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: null,
      zodErrors: null,
      errorMessage: "Ops! Something went wrong. Please try again.",
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      formData: {
        ...formDataObject,
      },
      errorMessage: "Failed to Subscribe.",
    };
  }

  return {
    ...prevState,
    zodErrors: null,
    strapiErrors: null,
    errorMessage: null,
    formData: null,
    successMessage: "Successfully Subscribed!",
  };
}
