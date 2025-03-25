import { z } from "zod";

export const eventsSubscribeSchema = z.object({
  firstName: z.string().min(1, {
    message: "Please enter your first name",
  }),
  lastName: z.string().min(1, {
    message: "Please enter your last name",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  telephone: z
    .string()
    .min(1, { message: "Please enter your phone number" })
    .regex(
      /^(\+\d{1,3}[-.]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
      {
        message: "Please enter a valid phone number",
      }
    ),
});
