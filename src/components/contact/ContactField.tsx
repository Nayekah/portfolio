import type { ChangeEventHandler, FocusEventHandler } from 'react'

type ContactFieldProps = {
  as?: 'input' | 'textarea'
  autoComplete?: string
  description?: string
  error?: string
  label: string
  name: string
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  placeholder?: string
  required?: boolean
  rows?: number
  type?: 'email' | 'text' | 'url'
}

function ContactField({
  as = 'input',
  autoComplete,
  description,
  error,
  label,
  name,
  onBlur,
  onChange,
  placeholder,
  required = false,
  rows = 5,
  type = 'text',
}: ContactFieldProps) {
  const describedBy = [description ? `${name}-description` : null, error ? `${name}-error` : null]
    .filter(Boolean)
    .join(' ')

  return (
    <label className={`contact-field${error ? ' is-invalid' : ''}`}>
      <span className="contact-field-label">
        {label}
        {required ? (
          <span className="contact-required-mark" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </span>

      {as === 'textarea' ? (
        <textarea
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? 'true' : 'false'}
          autoComplete={autoComplete}
          className="contact-field-control"
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
        ></textarea>
      ) : (
        <input
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? 'true' : 'false'}
          autoComplete={autoComplete}
          className="contact-field-control"
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          type={type}
        />
      )}

      {description ? (
        <span className="contact-field-description" id={`${name}-description`}>
          {description}
        </span>
      ) : null}
      {error ? (
        <span className="contact-field-error" id={`${name}-error`} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  )
}

export default ContactField
