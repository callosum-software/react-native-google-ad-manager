import { NativeModules } from 'react-native'
import { RNGAMBanner } from './src/RNGAMBanner'

const noop = () => {}

// TODO remove defaults when iOS implemented
const {
  PREBID_GENDER = {},
  setPrebidApplicationContext = noop,
  setPrebidCustomServerHost = noop,
  setPrebidServerAccountId = noop,
  setPrebidShareGeoLocation = noop,
} = NativeModules.RNGoogleAdManager

export const Prebid = {
  GENDER: PREBID_GENDER,
  setApplicationContext: setPrebidApplicationContext,
  setCustomServerHost: setPrebidCustomServerHost,
  setAccountId: setPrebidServerAccountId,
  setShareGeoLocation: setPrebidShareGeoLocation,
}

export { RNGAMBanner }

export default { Prebid, RNGAMBanner }
