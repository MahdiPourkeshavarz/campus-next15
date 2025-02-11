## Building the Events Page in Next.js

We will start by creating a new folder called `events` with a `page.tsx` file inside it with the following starter code:

```tsx
import { ContentList } from "@/components/ContentList";
import { Card, type CardProps } from "@/components/Card";

import { getContentBySlug } from "@/data/loaders";
import { EventProps } from "@/types";
import { notFound } from "next/navigation";

async function loader(slug: string) {
  const { data } = await getContentBySlug(slug, "/api/events");
  const event = data[0];
  if (!event) throw notFound();
  return { event: event as EventProps, blocks: event?.blocks };
}

interface ParamsProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; query?: string }>;
}

const EventCard = (props: Readonly<CardProps>) => (
  <Card {...props} basePath="events" />
);

export default async function AllEventsRoute({
  params,
  searchParams,
}: ParamsProps) {
  const slug = (await params).slug;
  const { query, page } = await searchParams;
  const { event, blocks } = await loader(slug);

  return (
    <div className="container">
      <div className="event-page">Sign up for will go here</div>
      <ContentList
        headline="All Events"
        path="/api/events"
        query={query}
        page={page}
        showSearch
        showPagination
        component={EventCard}
      />
    </div>
  );
}
```

Let's create the following interface in the `types.ts` file for the `EventProps` type:

```tsx
export interface EventProps {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  image: ImageProps;
  author: string;
  featured: boolean;
  price: string;
  startDate: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
```

All the above code is reusing all the previously created components and what we have learned so far.

## Building the Events Signup Form

Let's create a new component called `EventSignupForm` in the `components` folder with the following starter code:

```tsx
"use client";
import { BlockRenderer } from "@/components/BlockRenderer";
import { Block } from "@/types";
import { formatDate } from "@/utils/format-date";
import { StrapiImage } from "./StrapiImage";

export function EventSignupForm({
  blocks,
  eventId,
  startDate,
  price,
  image,
}: {
  blocks: Block[];
  eventId: string;
  startDate?: string;
  price?: string;
  image?: {
    url: string;
    alt: string;
  };
}) {
  return (
    <section className="signup-form">
      <div className="signup-form__info">
        <BlockRenderer blocks={blocks} />
        {startDate && (
          <p className="signup-form__date">
            <span>StartDate:</span> {formatDate(startDate)}
          </p>
        )}
        {price && (
          <p className="signup-form__price">
            <span>Price:</span> {price}
          </p>
        )}
      </div>
      <form className="signup-form__form">form will go here</form>
    </section>
  );
}
```

Now let's import the `EventSignupForm` component into the `page.tsx` file and use it.

```tsx
<EventSignupForm blocks={blocks} eventId={event.documentId} />
```

The completed code for `events/page.tsx` file should look like the following:

```tsx
import { ContentList } from "@/components/ContentList";
import { Card, type CardProps } from "@/components/Card";
import { EventSignupForm } from "@/components/EventSignupForm";

import { getContentBySlug } from "@/data/loaders";
import { EventProps } from "@/types";
import { notFound } from "next/navigation";

async function loader(slug: string) {
  const { data } = await getContentBySlug(slug, "/api/events");
  const event = data[0];
  if (!event) throw notFound();
  return { event: event as EventProps, blocks: event?.blocks };
}

interface ParamsProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; query?: string }>;
}

const EventCard = (props: Readonly<CardProps>) => (
  <Card {...props} basePath="events" />
);

export default async function AllEventsRoute({
  params,
  searchParams,
}: ParamsProps) {
  const slug = (await params).slug;
  const { query, page } = await searchParams;
  const { event, blocks } = await loader(slug);

  return (
    <div className="container">
      <div className="event-page">
        <EventSignupForm blocks={blocks} eventId={event.documentId} />
      </div>
      <ContentList
        headline="All Events"
        path="/api/events"
        query={query}
        page={page}
        showSearch
        showPagination
        component={EventCard}
      />
    </div>
  );
}
```

Now let's finish building out our form.

Let's add the following in the `EventSignupForm` component:

```tsx
const INITIAL_STATE = {
  zodErrors: null,
  strapiErrors: null,
  errorMessage: null,
  successMessage: null,
  formData: null,
};

interface TextInputProps {
  id: string;
  label: string;
  name: string;
  type?: string;
  error?: string;
  defaultValue?: string;
}

function TextInput({
  id,
  label,
  name,
  type = "text",
  error,
  defaultValue,
}: TextInputProps) {
  return (
    <div className="input__container">
      <label htmlFor={id} className="copy">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        className="input input__text input--beige"
        defaultValue={defaultValue}
      />
      {error && <p className="input__error">{error}</p>}
    </div>
  );
}
```

This is a simple text input component that we will use to build out our form.

We also added the initial state for our form and the `TextInput` component to the `EventSignupForm` component.

Now let's update the code between the `<form>` tags in the `EventSignupForm` component with the following:

```tsx
<form className="signup-form__form">
  {image && (
    <StrapiImage
      src={image.url}
      alt={image.alt}
      height={200}
      width={200}
      className="signup-form__image"
    />
  )}
  <div className="signup-form__name-container">
    <TextInput id="firstName" label="First Name" name="firstName" />
    <TextInput id="lastName" label="Last Name" name="lastName" />
  </div>
  <TextInput id="email" label="Email" name="email" type="email" />
  <TextInput id="phone" label="Phone" name="telephone" type="text" />
  <input hidden type="text" name="eventId" defaultValue={eventId} />
  <SubmitButton text="Sign Up" className="btn btn--medium btn--turquoise" />
</form>
```

This is a simple form that we will use to build out our form.

Now create   a new component called `SubmitButton` in the `components` folder and add the following code to it:

```tsx
"use client";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  text: string;
  className?: string;
}

export function SubmitButton({
  text,
  className,
}: Readonly<SubmitButtonProps>) {
  const status = useFormStatus();
  return (
    <button
      type="submit"
      aria-disabled={status.pending}
      disabled={status.pending}
      className={className}
    >
      {status.pending ? "Loading..." : text}
    </button>
  );
}
```

## Adding the Form Action

Let's add the following code to the `actions.ts` file:

```tsx
const eventsSubscribeSchema = z.object({
  firstName: z.string().min(1, {
    message: "Please enter your first name",
  }),
  lastName: z.string().min(1, {
    message: "Please enter your last name",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  telephone: z.string()
    .min(1, { message: "Please enter your phone number" })
    .regex(/^(\+\d{1,3}[-.]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, {
      message: "Please enter a valid phone number",
    }),
});


export async function eventsSubscribeAction(prevState: any, formData: FormData) {
  const formDataObject = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    telephone: formData.get("telephone"),
    eventId: formData.get("eventId"),
  }

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
```


Create a new service called `eventsSubscribeService` in the `services.ts` file and add the following code to it:

```tsx
export interface EventsSubscribeProps {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  event: {
    connect: [string];
  };
}

export async function eventsSubscribeService(data: EventsSubscribeProps) {
  const url = new URL("/api/event-signups", BASE_URL);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { ...data } }),
    });

    return await response.json();
  } catch (error) {
    console.error("Events Subscribe Service Error:", error);
  }
}

```

Completed code for `EventsSignupForm.tsx`:

``` tsx
"use client";
import { useActionState } from "react";
import { BlockRenderer } from "@/components/BlockRenderer";
import { Block } from "@/types";
import { formatDate } from "@/utils/format-date";
import { StrapiImage } from "./StrapiImage";
import { SubmitButton } from "./SubmitButton";
import { eventsSubscribeAction } from "@/data/actions";

const INITIAL_STATE = {
  zodErrors: null,
  strapiErrors: null,
  errorMessage: null,
  successMessage: null,
  formData: null,
};

interface TextInputProps {
  id: string;
  label: string;
  name: string;
  type?: string;
  error?: string;
  defaultValue?: string;
}

function TextInput({
  id,
  label,
  name,
  type = "text",
  error,
  defaultValue,
}: TextInputProps) {
  return (
    <div className="input__container">
      <label htmlFor={id} className="copy">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        className="input input__text input--beige"
        defaultValue={defaultValue}
      />
      {error && <p className="input__error">{error}</p>}
    </div>
  );
}

export function EventSignupForm({
  blocks,
  eventId,
  startDate,
  price,
  image,
}: {
  blocks: Block[];
  eventId: string;
  startDate?: string;
  price?: string;
  image?: {
    url: string;
    alt: string;
  };
}) {
  const [formState, formAction] = useActionState(
    eventsSubscribeAction,
    INITIAL_STATE
  );

  const zodErrors = formState?.zodErrors;
  const strapiErrors = formState?.strapiErrors?.message;
  const successMessage = formState?.successMessage;

  return (
    <section className="signup-form">
      <div className="signup-form__info">
        <BlockRenderer blocks={blocks} />
        {startDate && (
          <p className="signup-form__date">
            <span>StartDate:</span> {formatDate(startDate)}
          </p>
        )}
        {price && (
          <p className="signup-form__price">
            <span>Price:</span> {price}
          </p>
        )}
      </div>
      <form className="signup-form__form" action={formAction}>
        {image && (
          <StrapiImage
            src={image.url}
            alt={image.alt}
            height={200}
            width={200}
            className="signup-form__image"
          />
        )}
        <div className="signup-form__name-container">
          <TextInput
            id="firstName"
            label="First Name"
            name="firstName"
            error={zodErrors?.firstName}
            defaultValue={formState?.formData?.firstName ?? ""}
          />
          <TextInput
            id="lastName"
            label="Last Name"
            name="lastName"
            error={zodErrors?.lastName}
            defaultValue={formState?.formData?.lastName ?? ""}
          />
        </div>
        <TextInput
          id="email"
          label="Email"
          name="email"
          type="email"
          error={zodErrors?.email}
          defaultValue={formState?.formData?.email ?? ""}
        />
        <TextInput
          id="phone"
          label="Phone"
          name="telephone"
          type="text"
          error={zodErrors?.telephone}
          defaultValue={formState?.formData?.telephone ?? ""}
        />
        <input hidden type="text" name="eventId" defaultValue={eventId} />
        <SubmitButton
          text="Sign Up"
          className="btn btn--medium btn--turquoise"
        />
        {strapiErrors && <p className="signup-form__error">{strapiErrors}</p>}
        {successMessage && (
          <p className="signup-form__success">{successMessage}</p>
        )}
      </form>
    </section>
  );
}
```

## Building Out Single Event Detail Page

Finally, let's create a new folder called `[slug]`  with `page.tsx` file in the `events` folder and add the following code to it:

```tsx
import type { EventProps } from "@/types";
import { ContentList } from "@/components/ContentList";
import { Card, type CardProps } from "@/components/Card";
import { getContentBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";
import { EventSignupForm } from "@/components/EventSignupForm";

async function loader(slug: string) {
  const { data } = await getContentBySlug(slug, "/api/events");
  const event = data[0];
  if (!event) throw notFound();
  return { event: event as EventProps, blocks: event?.blocks };
}

interface ParamsProps {
  params: Promise<{ slug: string }>
}

const EventCard = (props: Readonly<CardProps>) => (
  <Card {...props} basePath="events" />
);

export default async function SingleEventRoute({ params }: ParamsProps) {
  const slug = (await params).slug;
  const { event, blocks } = await loader(slug);

  return (
    <div className="container">
      <div className="event-page">
        <EventSignupForm
          blocks={blocks}
          eventId={event.documentId}
          startDate={event.startDate}
          price={event.price}
          image={{ url: event?.image?.url, alt: event?.image?.alternativeText || "Event image" }}
        />
      </div>
      <ContentList
        headline="Featured Events"
        path="/api/events"
        component={EventCard}
        featured={true}
      />
    </div>
  );
}

```