"use client";
import { Block } from "@/types";
import { BlockRenderer } from "./blocks/BlockRenderer";
import { formatDate } from "@/utils";
import { StrapiImage } from "./blocks/StrapiImage";
import { TextInput } from "./TextInput";
import { SubmitButton } from "./SubmitButton";
import { useActionState } from "react";
import { eventsSubscribeAction } from "@/data/actions";

const INITIAL_STATE = {
  zodErrors: null,
  strapiErrors: null,
  errorMessage: null,
  successMessage: null,
  formData: null,
};

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
