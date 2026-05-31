import type { ChangeEventHandler } from 'react'

type ContactCheckboxOption = {
  label: string
  value: string
}

type ContactCheckboxGroupProps = {
  error?: string
  legend: string
  name: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  options: ContactCheckboxOption[]
  required?: boolean
}

function ContactCheckboxGroup({
  error,
  legend,
  name,
  onChange,
  options,
  required = false,
}: ContactCheckboxGroupProps) {
  return (
    <fieldset
      aria-describedby={error ? `${name}-error` : undefined}
      className={`contact-checkbox-group${error ? ' is-invalid' : ''}`}
    >
      <legend className="contact-field-label">
        {legend}
        {required ? <span className="sr-only"> (required)</span> : null}
        {required ? (
          <span className="contact-required-mark" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </legend>

      <div className="contact-checkbox-list">
        {options.map((option) => (
          <label className="contact-checkbox-item" key={option.value}>
            <input
              aria-invalid={error ? 'true' : 'false'}
              name={name}
              onChange={onChange}
              type="checkbox"
              value={option.value}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error ? (
        <span className="contact-field-error" id={`${name}-error`} role="alert">
          {error}
        </span>
      ) : null}
    </fieldset>
  )
}

export default ContactCheckboxGroup
