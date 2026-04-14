"use client";

import { FC, useState, useRef } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import ContactInfo from "@/components/ContactInfo";

/**
 * Props for `ContactPanel`.
 */
export type ContactPanelProps = SliceComponentProps<Content.ContactPanelSlice>;

/**
 * Component for "ContactPanel" Slices.
 */
const ContactPanel: FC<ContactPanelProps> = ({ slice, context }) => {
  const ctx = context as { isPage?: boolean } | undefined;
  const Title = ctx?.isPage ? "h1" : "h2";
  const [formValues, setFormValues] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [fading, setFading] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touched, setTouched] = useState<Record<number, boolean>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const validate = (value: string, required: boolean, type: string | null): boolean => {
    if (required && !value) return false;
    if (!value) return true;
    if (type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (type === "tel" || type === "phone") return /^[\d\s+\-.()]{7,}$/.test(value);
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const hasErrors = slice.primary.form_fields.some(
      (field, index) => !validate(formValues[index] ?? "", field.is_required ?? false, field.field_type ?? null)
    );
    if (hasErrors) {
      setSubmitAttempted(true);
      const firstInvalidIndex = slice.primary.form_fields.findIndex(
        (field, index) => !validate(formValues[index] ?? "", field.is_required ?? false, field.field_type ?? null)
      );
      if (firstInvalidIndex !== -1) {
        const el = formRef.current?.querySelector<HTMLElement>(`#field-${firstInvalidIndex}`);
        el?.focus();
      }
      return;
    }
    setFading(true);
    const fields = slice.primary.form_fields.map((field, index) => ({
      label: field.field_label ?? `Field ${index + 1}`,
      value: formValues[index] ?? "",
    }));
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    });
    setTimeout(() => {
      setSubmitted(true);
      setTimeout(() => successRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
    }, 500);
  };

  const shouldValidate = (index: number) => touched[index] || submitAttempted;

  const fieldClass = (index: number, required: boolean, type: string | null) => {
    if (!shouldValidate(index)) return "";
    return validate(formValues[index] ?? "", required, type) ? "field-valid" : "field-invalid";
  };

  const displayLabel = (label: string | null) =>
    label?.toLowerCase().includes("how can i help") ? "message" : (label?.toLowerCase() ?? "this field");

  const errorPlaceholder = (index: number, required: boolean, label: string | null) => {
    if (!shouldValidate(index)) return undefined;
    const value = formValues[index] ?? "";
    if (!value && required) return `Please include your ${displayLabel(label)}`;
    if (value && !validate(value, required, slice.primary.form_fields[index].field_type ?? null))
      return `${displayLabel(label)} is invalid`;
    return undefined;
  };

  const errorMessage = (index: number, required: boolean, type: string | null, label: string | null) => {
    if (!shouldValidate(index)) return null;
    const value = formValues[index] ?? "";
    if (value && !validate(value, required, type)) return `${displayLabel(label)} is invalid`;
    return null;
  };

  return (
    <section
      id="contact"
      className="contact section"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="contact-content content fade-in">
        <ContactInfo title={asText(slice.primary.title)} contacts={slice.primary.contacts} className="contact-info" />
          <div className="contact-form">
            {submitted ? (
              <div className="form-success" ref={successRef}>
                <p>Thank you! Your message has been sent and I will be in touch soon.</p>
              </div>
            ) : (
              <div className="form-title">
                  <PrismicRichText field={slice.primary.form_title} />
  
              <form ref={formRef} onSubmit={handleSubmit} noValidate className={fading ? "form-exit" : ""}>
                {slice.primary.form_fields.map((field, index) => {
                  const required = field.is_required ?? false;
                  const type = field.field_type ?? null;
                  const htmlType = type === `phone` ? `tel` : (type ?? `text`);
                  const sharedProps = {
                    id: `field-${index}`,
                    required,
                    value: formValues[index] ?? "",
                    placeholder: errorPlaceholder(index, required, field.field_label),
                    className: fieldClass(index, required, htmlType),
                    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                      setFormValues((prev) => ({ ...prev, [index]: e.target.value })),
                    onBlur: () => setTouched((prev) => ({ ...prev, [index]: true })),
                  };

                  return (
                    <div key={index} className="form-group">
                      <label htmlFor={`field-${index}`}>
                        <span className="required">*</span>{field.field_label}
                      </label>
                      <div className={`input-wrapper${field.field_type === "textarea" ? " is-textarea" : ""}`}>
                        {field.field_type === "textarea"
                          ? <textarea {...sharedProps} />
                          : <input type={field.field_type ?? "text"} {...sharedProps} />
                        }
                      </div>
                      {errorMessage(index, required, type, field.field_label) && (
                        <span className="field-error">{errorMessage(index, required, type, field.field_label)}</span>
                      )}
                    </div>
                  );
                })}
                <button type="submit" className="btn btn-primary">
                  {slice.primary.button_text ?? "Send Message"}
                </button>
              </form>
              </div>
            )}
          </div>
        </div>
    </section>
  );
};

export default ContactPanel;
