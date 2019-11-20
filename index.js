import { NativeModules } from 'react-native'
import { RNGAMBanner } from './src/RNGAMBanner'
import { GAMAutomaticBanner } from './src/GAMAutomaticBanner'

const noop = () => {}

// TODO remove defaults when iOS implemented
const {
  PREBID_GENDER = {},
  setPrebidApplicationContext = noop,
  setPrebidCustomServerHost = noop,
  setPrebidServerAccountId = noop,
  setPrebidShareGeoLocation = noop,
  setPrebidUserAaid = noop,
  setPrebidUserAgent = noop,
} = NativeModules.RNGoogleAdManager

export const Prebid = {
  GENDER: PREBID_GENDER,
  setApplicationContext: setPrebidApplicationContext,
  setCustomServerHost: setPrebidCustomServerHost,
  setAccountId: setPrebidServerAccountId,
  setShareGeoLocation: setPrebidShareGeoLocation,
  setUserAaid: setPrebidUserAaid,
  setUserAgent: setPrebidUserAgent,
}

export { GAMAutomaticBanner }
export { RNGAMBanner }

export default { GAMAutomaticBanner, Prebid, RNGAMBanner }
