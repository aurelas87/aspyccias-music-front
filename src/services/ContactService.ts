import { useRequest } from '@/composables/request'

export function useContactService() {
  const contactBasePath = '/contact'
  const request = useRequest()

  async function sendEmail(postEmailData: PostEmailData): Promise<boolean|null> {
    return (await request.postRequest(
      contactBasePath + '/email',
      postEmailData,
      'contact.email.send.success',
      'contact.email.send.error'
    ))
  }

  return {
    sendEmail
  }
}
