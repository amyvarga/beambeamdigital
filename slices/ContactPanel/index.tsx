"use client";

import { FC, useState } from "react";
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
        <ContactInfo contacts={slice.primary.contacts} className="contact-info" />
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
