import { useAxios } from '@/plugins/axios'

export function useImage() {
  const axios = useAxios()

  async function onImageError(event: Event) {
    const target = event.currentTarget || event.target

    if (target instanceof Element) {
      if (target.clientWidth < target.clientHeight) {
        target.setAttribute('src', (await import('@/assets/img/not-found-portrait.jpg')).default)
      }

      if (target.clientWidth > target.clientHeight) {
        target.setAttribute('src', (await import('@/assets/img/not-found-landscape.jpg')).default)
      }

      if (target.clientWidth === target.clientHeight) {
        target.setAttribute('src', (await import('@/assets/img/not-found-square.jpg')).default)
      }
    }
  }

  function getImageUri(url: string): string {
    return axios.getUri({ url: url, params: { t: (new Date()).getTime() } })
  }

  return { onImageError, getImageUri }
}
