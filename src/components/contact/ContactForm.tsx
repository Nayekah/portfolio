import { useState } from 'react'
import type { ChangeEvent, FocusEvent, FormEvent } from 'react'
import ContactCheckboxGroup from './ContactCheckboxGroup'
import ContactField from './ContactField'

const serviceOptions = [
  {
    label: 'Software engineering and product development.',
    value: 'software-engineering',
  },
  {
    label: 'Portfolio or personal website design and development.',
    value: 'portfolio-build',
  },
  {
    label: 'Security-oriented engineering or application hardening.',
    value: 'security-engineering',
  },
  {
    label: 'Research collaboration, technical writing, or review.',
    value: 'research-and-writing',
  },
  {
    label: 'Other.',
    value: 'other',
  },
]

type ContactFormErrors = Partial<
  Record<'email' | 'name' | 'references' | 'referrer' | 'scope' | 'services' | 'timeline', string>
>

function getFieldError(fieldName: keyof ContactFormErrors, form: HTMLFormElement) {
  if (fieldName === 'services') {
    const selectedServices = form.querySelectorAll<HTMLInputElement>('input[name="services"]:checked')

    if (selectedServices.length === 0) {
      return 'Select at least one collaboration type.'
    }

    return ''
  }

  const field = form.elements.namedItem(fieldName)

  if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) {
    return ''
  }

  const trimmedValue = field.value.trim()

  if (field.validity.valueMissing) {
    switch (fieldName) {
      case 'name':
        return 'Name is required.'
      case 'email':
        return 'Email is required.'
      case 'scope':
        return 'Project scope is required.'
      case 'timeline':
        return 'Ideal timeline is required.'
      case 'referrer':
        return 'Please tell me where you heard about me.'
      default:
        return 'This field is required.'
    }
  }

  if (fieldName === 'email' && trimmedValue && field.validity.typeMismatch) {
    return 'Enter a valid email address.'
  }

  if (fieldName === 'references' && trimmedValue && field.validity.typeMismatch) {
    return 'Enter a valid URL, including https:// if needed.'
  }

  return ''
}

function focusNamedField(form: HTMLFormElement, fieldName: string) {
  const field = form.elements.namedItem(fieldName)

  if (field instanceof HTMLElement) {
    field.focus()
  }
}

function ContactForm() {
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const updateFieldError = (fieldName: keyof ContactFormErrors, form: HTMLFormElement) => {
    const nextError = getFieldError(fieldName, form)

    setErrors((current) => {
      if (!nextError) {
        const { [fieldName]: _removed, ...rest } = current
        return rest
      }

      return {
        ...current,
        [fieldName]: nextError,
      }
    })

    return nextError
  }

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!submitAttempted && !errors[event.currentTarget.name as keyof ContactFormErrors]) {
      return
    }

    const form = event.currentTarget.form

    if (!form) {
      return
    }

    updateFieldError(event.currentTarget.name as keyof ContactFormErrors, form)
  }

  const handleFieldBlur = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const form = event.currentTarget.form

    if (!form) {
      return
    }

    updateFieldError(event.currentTarget.name as keyof ContactFormErrors, form)
  }

  const handleServicesChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!submitAttempted && !errors.services) {
      return
    }

    const form = event.currentTarget.form

    if (!form) {
      return
    }

    updateFieldError('services', form)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget
    const fieldNames: Array<keyof ContactFormErrors> = [
      'name',
      'email',
      'services',
      'scope',
      'references',
      'timeline',
      'referrer',
    ]
    const nextErrors: ContactFormErrors = {}

    setSubmitAttempted(true)

    fieldNames.forEach((fieldName) => {
      const error = getFieldError(fieldName, form)

      if (error) {
        nextErrors[fieldName] = error
      }
    })

    if (Object.keys(nextErrors).length > 0) {
      event.preventDefault()
      setErrors(nextErrors)

      const firstInvalidField =
        form.querySelector<HTMLInputElement | HTMLTextAreaElement>(
          'input[name="name"], input[name="email"], textarea[name="scope"], input[name="references"], input[name="timeline"], input[name="referrer"]'
        )

      if (nextErrors.name) {
        focusNamedField(form, 'name')
      } else if (nextErrors.email) {
        focusNamedField(form, 'email')
      } else if (nextErrors.services) {
        form.querySelector<HTMLInputElement>('input[name="services"]')?.focus()
      } else if (nextErrors.scope) {
        focusNamedField(form, 'scope')
      } else if (nextErrors.references) {
        focusNamedField(form, 'references')
      } else if (nextErrors.timeline) {
        focusNamedField(form, 'timeline')
      } else if (nextErrors.referrer) {
        focusNamedField(form, 'referrer')
      } else {
        firstInvalidField?.focus()
      }

      return
    }

    setErrors({})
  }

  return (
    <div className="contact-form-shell">
      <form
        action="mailto:nayakaghana39@gmail.com"
        className="contact-form"
        encType="text/plain"
        method="post"
        noValidate
        onSubmit={handleSubmit}
      >
        <ContactField
          autoComplete="name"
          error={errors.name}
          label="Name"
          name="name"
          onBlur={handleFieldBlur}
          onChange={handleFieldChange}
          required
        />
        <ContactField autoComplete="organization" label="Company / organization" name="company" />
        <ContactField
          autoComplete="email"
          error={errors.email}
          label="Email"
          name="email"
          onBlur={handleFieldBlur}
          onChange={handleFieldChange}
          required
          type="email"
        />
        <ContactField
          label="Preferred contact method"
          name="handle"
          placeholder="Telegram, X/Twitter, email, or another contact handle"
        />

        <ContactCheckboxGroup
          error={errors.services}
          legend="What kind of collaboration are you looking for?"
          name="services"
          onChange={handleServicesChange}
          options={serviceOptions}
          required
        />

        <ContactField
          as="textarea"
          error={errors.scope}
          label="Project scope"
          name="scope"
          onBlur={handleFieldBlur}
          onChange={handleFieldChange}
          placeholder="Tell me what you're building, the current stage, and the kind of help you need."
          required
          rows={6}
        />

        <ContactField
          description="GitHub repository, Figma file, write-up, or supporting material."
          error={errors.references}
          label="Reference links"
          name="references"
          onBlur={handleFieldBlur}
          onChange={handleFieldChange}
          placeholder="https://github.com/..."
          type="url"
        />
        <ContactField
          error={errors.timeline}
          label="Ideal timeline"
          name="timeline"
          onBlur={handleFieldBlur}
          onChange={handleFieldChange}
          placeholder="e.g. June 2026"
          required
        />
        <ContactField
          error={errors.referrer}
          label="Where did you hear about me?"
          name="referrer"
          onBlur={handleFieldBlur}
          onChange={handleFieldChange}
          placeholder="Friend, GitHub, LinkedIn, event, etc."
          required
        />

        {submitAttempted && Object.keys(errors).length > 0 ? (
          <div className="contact-form-alert" role="alert">
            Please fix the highlighted fields before submitting the form.
          </div>
        ) : null}

        <div className="contact-form-footer">
          <button className="button-solid" type="submit">
            Submit inquiry
          </button>
        </div>
      </form>
    </div>
  )
}

export default ContactForm
