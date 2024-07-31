import { useAxios } from '@/plugins/axios'

export function useImage() {
  const axios = useAxios()

  async function onImageError(event: Event, ratio: string|null = null) {
    const target = event.currentTarget || event.target

    if (target instanceof Element) {
      if (ratio === 'portrait' || target.clientWidth < target.clientHeight) {
        target.setAttribute('src', (await import('@/assets/img/not-found-portrait.jpg')).default)
      }

      if (ratio === 'landscape' || target.clientWidth > target.clientHeight) {
        target.setAttribute('src', (await import('@/assets/img/not-found-landscape.jpg')).default)
      }
    }
  }

  function getImageUri(url: string): string {
    return axios.getUri({ url: url, params: { t: (new Date()).getTime() } })
  }

  return { onImageError, getImageUri }
}
