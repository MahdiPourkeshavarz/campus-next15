"use client";
import { subscribeAction } from "@/data/actions";
import type { SubscribeProps } from "@/types";
import { useActionState } from "react";

const InitialState = {
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
  const [formState, formAction] = useActionState(subscribeAction, InitialState);
  const zodErrors = formState?.zodErrors?.email;
  const strapiErrors = formState?.strapiErrors?.[0]?.message;
  const errorMessage = zodErrors || strapiErrors || formState?.errorMessage;

  return (
    <section className="newsletter container">
      <div className="newsletter__info">
        <h4>{headline}</h4>
        <p className="copy">{content}</p>
      </div>
      <form className="newsletter__form" action={formAction}>
        <input
          name="email"
          type="email"
          placeholder={errorMessage || formState?.successMessage || placeholder}
          className={`newsletter__email ${
            formState?.zodErrors?.email ? "newsletter__email--error" : ""
          }`}
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
