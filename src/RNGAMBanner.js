import P from 'prop-types'
import React from 'react'
import {
  NativeModules,
  findNodeHandle,
  requireNativeComponent,
  UIManager,
  ViewPropTypes,
} from 'react-native'

const noop = () => {}

const { simulatorTestId, sizes } = NativeModules.RNGoogleAdManager

const mappedSizes = sizes.reduce((acc, curr) => ({ ...acc, [curr]: curr }), {})

class RNGAMBanner extends React.PureComponent {
  static sizes = mappedSizes
  static simulatorTestId = simulatorTestId
  static getDerivedStateFromProps(props, state) {
    const { testDeviceIds, size } = props
    const isSizeValid = sizes.includes(size)

    if (isSizeValid) {
      return { ...state, testDeviceIds, validAdSize: size }
    }

    return { ...state, testDeviceIds }
  }

  state = { testDeviceIds: undefined, validAdSize: undefined }

  destroyBanner = () => {
    if (this._ref) {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._ref),
        UIManager.getViewManagerConfig('RNGAMBannerView').Commands
          .destroyBanner,
        []
      )
    }
  }

  loadBanner = () => {
    if (this._ref) {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._ref),
        UIManager.getViewManagerConfig('RNGAMBannerView').Commands.loadBanner,
        []
      )
    }
  }

  _onAdFailedToLoad = ({ nativeEvent }) => {
    this.props.onAdFailedToLoad(nativeEvent.errorMessage)
  }

  _setRef = ref => {
    this._ref = ref
  }

  render() {
    const { adId, onAdLoaded, prebidAdId, style, targeting } = this.props
    const { testDeviceIds, validAdSize } = this.state

    return (
      <RNGAMBannerView
        adId={adId}
        onAdLoaded={onAdLoaded}
        onAdFailedToLoad={this._onAdFailedToLoad}
        prebidAdId={prebidAdId}
        ref={this._setRef}
        size={validAdSize}
        style={style}
        testDeviceIds={testDeviceIds}
        targeting={targeting}
      />
    )
  }
}

RNGAMBanner.propTypes = {
  adId: P.string.isRequired,
  onAdFailedToLoad: P.func,
  onAdLoaded: P.func,
  prebidAdId: P.string,
  size: P.oneOf(sizes).isRequired, // eslint-disable-line react/no-unused-prop-types
  style: ViewPropTypes.style,
  testDeviceIds: P.arrayOf(P.string), // eslint-disable-line react/no-unused-prop-types
  targeting: P.object,
}

RNGAMBanner.defaultProps = {
  onAdFailedToLoad: noop,
  onAdLoaded: noop,
  prebidAdId: '',
  style: {},
  testDeviceIds: [],
  targeting: {},
}

const RNGAMBannerView = requireNativeComponent('RNGAMBannerView', RNGAMBanner)

export { RNGAMBanner }
