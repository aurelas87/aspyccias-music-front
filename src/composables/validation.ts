import type { ErrorObject } from '@vuelidate/core'
import { email, helpers, required, url } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'
import { ReleaseType } from '@/types/Release.ts'

export const customRequired = helpers.withMessage('validation.required', required)
export const customEmail = helpers.withMessage('validation.email', email)
export const customUrl = helpers.withMessage('validation.url', url)

export const customRegexSlug = helpers.regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
export const customSlug = helpers.withMessage('validation.slug', customRegexSlug)

export const customRegexKey = helpers.regex(/^[a-z]+(_[a-z]+)*$/)
export const customKey = helpers.withMessage('validation.key', customRegexKey)

export const customRegexDuration = helpers.regex(/^[0-9]{2}:[0-9]{2}$/)
export const customDuration = helpers.withMessage('validation.duration', customRegexDuration)

export const customDate = helpers.withMessage('validation.date', {
  $validator: (value: string) => {
    if (!value.match(/^(20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)) {
      return false
    }

    const valueArray = value.split('-')

    const date = new Date()

    date.setUTCMonth(parseInt(valueArray[0], 10))
    date.setUTCDate(parseInt(valueArray[1], 10))
    date.setUTCFullYear(parseInt(valueArray[2], 10))
    date.setUTCHours(0)
    date.setUTCMinutes(0)
    date.setUTCSeconds(0)

    return !isNaN(date.getTime())
  }
})

export const customReleaseTypeValidator = (value: string) => {
  return Object.values(ReleaseType).map((releaseType: ReleaseType) => {
    return releaseType.toString()
  }).includes(value)
}

export const customReleaseType = helpers.withMessage('validation.release_type', {
  $validator: customReleaseTypeValidator
})

export function reduceErrors(errors: ErrorObject[]): string {
  const i18n = useI18n()

  if (!errors || errors.length === 0) {
    return i18n.t('validation.invalid_field')
  }

  return errors[0].$message.toString()
}
