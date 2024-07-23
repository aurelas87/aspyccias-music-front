export function useImage() {
  async function onImageError(event: Event) {
    const target = event.currentTarget || event.target

    if (target instanceof Element) {
      if (target.clientWidth < target.clientHeight) {
        target.setAttribute('src', (await import('@/assets/img/not-found-portrait.jpg')).default)
      }
    }
  }

  return { onImageError }
}
