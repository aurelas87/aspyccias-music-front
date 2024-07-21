import { useProfileLinksStore } from '../../src/stores/ProfileLinksStore'

export function addProfileLinks() {
  const profileLinksStore = useProfileLinksStore()

  profileLinksStore.$state.profileLinks.push({name: 'facebook', link: 'https://www.facebook.com', position: 1})
  profileLinksStore.$state.profileLinks.push({name: 'instagram', link: 'https://www.instagram.com', position: 2})
  profileLinksStore.$state.profileLinks.push({name: 'youtube', link: 'https://www.youtube.com', position: 3})
  profileLinksStore.$state.profileLinks.push({name: 'spotify', link: 'https://www.spotify.com', position: 4})
  profileLinksStore.$state.profileLinks.push({name: 'deezer', link: 'https://www.deezer.com', position: 5})
}
