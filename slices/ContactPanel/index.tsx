"use client";

import { FC, useState } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";

/**
 * Props for `ContactPanel`.
 */
export type ContactPanelProps = SliceComponentProps<Content.ContactPanelSlice>;

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.39 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.07 6.07l1.97-1.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/**
 * Component for "ContactPanel" Slices.
 */
const ContactPanel: FC<ContactPanelProps> = ({ slice }) => {
  const [formValues, setFormValues] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="contact section"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="contact-content content fade-in">
        <div className="contact-title title">
          <h2 className="fade-in">{asText(slice.primary.title)}</h2>
        </div>
        <div className="contact-info">
            {slice.primary.contacts.map((contact, index) => (
              <div key={index} className="contact-item">
                {contact.contact_type === "phone" && <PhoneIcon />}
                {contact.contact_type === "email" && <EmailIcon />}
                {contact.contact_type === "location" && <LocationIcon />}
                <span>{contact.contact_label}</span>
              </div>
            ))}
        </div>
          <div className="contact-form">
            {submitted ? (
              <div className="form-success">
                <p>Thank you! Your message has been sent.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-title">
                  <PrismicRichText field={slice.primary.form_title} />
                </div>
                {slice.primary.form_fields.map((field, index) => (
                  <div key={index} className="form-group">
                    <label htmlFor={`field-${index}`}><span className="required">*</span>{field.field_label}</label>
                    {field.field_type === "textarea" ? (
                      <textarea
                        id={`field-${index}`}
                        required={field.is_required ?? false}
                        value={formValues[index] ?? ""}
                        onChange={(e) =>
                          setFormValues((prev) => ({ ...prev, [index]: e.target.value }))
                        }
                      />
                    ) : (
                      <input
                        id={`field-${index}`}
                        type={field.field_type ?? "text"}
                        required={field.is_required ?? false}
                        value={formValues[index] ?? ""}
                        onChange={(e) =>
                          setFormValues((prev) => ({ ...prev, [index]: e.target.value }))
                        }
                      />
                    )}
                  </div>
                ))}
                <button type="submit" className="btn btn-primary">
                  {slice.primary.button_text ?? "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
    </section>
  );
};

export default ContactPanel;
