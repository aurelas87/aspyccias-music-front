import type { ErrorObject } from '@vuelidate/core'
import { email, helpers, required } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'

export const customRequired = helpers.withMessage('validation.required', required)
export const customEmail = helpers.withMessage('validation.email', email)

export function reduceErrors(errors: ErrorObject[]): string {
  const i18n = useI18n()

  if (!errors || errors.length === 0) {
    return i18n.t('validation.invalid_field')
  }

  return errors[0].$message.toString()
}
