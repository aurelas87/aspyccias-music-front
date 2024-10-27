import { useRequest } from '@/composables/request'

export function useContactService() {
  const contactBasePath = '/contact'
  const request = useRequest()

  async function sendEmail(postEmailData: PostEmailData): Promise<boolean|null> {
    return (await request.postRequest(
      {
        uri: contactBasePath + '/email',
        content: postEmailData,
        successMessage: 'contact.email.send.success',
        errorMessage: 'contact.email.send.error'
      }
    ))
  }

  return {
    sendEmail
  }
}
