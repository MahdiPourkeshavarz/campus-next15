# Building Our First Server Action in Next.js

Let's create a basic server action:

``` ts
export async function subscribeAction(formData: FormData) {
  console.log("Our first server action");
  const email = formData.get("email");
  console.log(email, "Our email input from form")
}

```

## Zod Validation

Define your schema:
``` ts 
const subscribeSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});
```


Validate your schema:
``` ts
 const validatedFields = subscribeSchema.safeParse({
    email: formData.get("email"),
  });

    if (!validatedFields.success) {

    console.dir(validatedFields.error.flatten().fieldErrors, { depth: null})

    return {
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
    };
  }
```

## Implementing useFormAction

``` tsx
"use client";
import type { SubscribeProps } from "@/types";
import { useActionState } from "react";
import { subscribeAction } from "@/data/actions";

const INITIAL_STATE = {
  zodErrors: null,
  strapiErrors: null,
  errorMessage: null,
  successMessage: null,
};

export function Subscribe({
  headline,
  content,
  placeholder,
  buttonText,
}: Readonly<SubscribeProps>) {
  const [formState, formAction] = useActionState(
    subscribeAction,
    INITIAL_STATE
  );

  console.log(formState, "this is our form state coming from useActionState");

  return (
    <section className="newsletter container">
      <div className="newsletter__info">
        <h4>{headline}</h4>
        <p className="copy">{content}</p>
      </div>
      <form className="newsletter__form" action={formAction}>
        <input
          name="email"
          type="text"
          placeholder={placeholder}
          className={`newsletter__email`}
        />
        <button
          type="submit"
          className="newsletter__subscribe btn btn--turquoise btn--medium"
        >
          {buttonText}
        </button>
      </form>
    </section>
  );
}

```

## Subscribe Service

``` ts
const BASE_URL = process.env.PUBLIC_API_URL ?? "http://localhost:1337";

export async function subscribeService(email: string) {
  const url = new URL("/api/newsletter-signups", BASE_URL);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          email,
        },
      }),
    });

    return response.json();
  } catch (error) {
    console.error("Subscribe Service Error:", error);
  }
}

export interface EventsSubscribeProps {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  event: {
    connect: [string];
  };
}

```

## Final Code:

``` tsx
"use client";
import type { SubscribeProps } from "@/types";
import { useActionState } from "react";
import { subscribeAction } from "@/data/actions";

const INITIAL_STATE = {
  zodErrors: null,
  strapiErrors: null,
  errorMessage: null,
  successMessage: null,
};

export function Subscribe({
  headline,
  content,
  placeholder,
  buttonText,
}: Readonly<SubscribeProps>) {
  const [formState, formAction] = useActionState(
    subscribeAction,
    INITIAL_STATE
  );

  const zodErrors = formState?.zodErrors?.email;
  const strapiErrors = formState?.strapiErrors?.message;
  const errorMessage = strapiErrors || zodErrors || formState?.errorMessage;
  const successMessage = formState?.successMessage;


  return (
    <section className="newsletter container">
      <div className="newsletter__info">
        <h4>{headline}</h4>
        <p className="copy">{content}</p>
      </div>
      <form className="newsletter__form" action={formAction}>
        <input
          name="email"
          type="text"
          placeholder={errorMessage || successMessage || placeholder}
          className={`newsletter__email ${errorMessage ? "newsletter__email--error" : ""}`}
        />
        <button
          type="submit"
          className="newsletter__subscribe btn btn--turquoise btn--medium"
        >
          {buttonText}
        </button>
      </form>
    </section>
  );
}

```







