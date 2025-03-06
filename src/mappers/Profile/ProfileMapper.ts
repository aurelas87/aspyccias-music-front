import type { UnwrapNestedRefs } from 'vue'
import Profile from '@/models/Profile/Profile'
import type { ProfileResponse } from '@/types/Profile.ts'

export function useProfileMapper() {
  function mapResponseToProfile(profileResponse: ProfileResponse | null, profile: UnwrapNestedRefs<Profile>) {
    if (!profileResponse) {
      return
    }

    profile.welcome = profileResponse.welcome
    profile.description = profileResponse.description
  }

  return {
    mapResponseToProfile
  }
}
