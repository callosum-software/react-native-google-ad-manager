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

    const adSizes = Array.isArray(size) ? size : [size]
    const areSizesValid = adSizes.every(size => sizes.includes(size))

    if (areSizesValid) {
      return { ...state, adSizes, testDeviceIds }
    }

    return { ...state, testDeviceIds }
  }

  state = { adSizes: undefined, testDeviceIds: undefined }

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

  _onAdClicked = e => {
    this.props.onAdClicked(e)
  }

  _onAdClosed = e => {
    this.props.onAdClosed(e)
  }

  _onAdFailedToLoad = ({ nativeEvent }) => {
    this.props.onAdFailedToLoad(nativeEvent.errorMessage)
  }

  _setRef = ref => {
    this._ref = ref
  }

  render() {
    const { adId, onAdLoaded, prebidAdId, style, targeting } = this.props
    const { adSizes, testDeviceIds } = this.state

    return (
      <RNGAMBannerView
        adId={adId}
        onAdClicked={this._onAdClicked}
        onAdClosed={this._onAdClosed}
        onAdLoaded={onAdLoaded}
        onAdFailedToLoad={this._onAdFailedToLoad}
        prebidAdId={prebidAdId}
        ref={this._setRef}
        size={adSizes}
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
  onAdClicked: P.func,
  onAdClosed: P.func,
  prebidAdId: P.string,
  size: P.oneOf(sizes).isRequired, // eslint-disable-line react/no-unused-prop-types
  style: ViewPropTypes.style,
  testDeviceIds: P.arrayOf(P.string), // eslint-disable-line react/no-unused-prop-types
  targeting: P.object,
}

RNGAMBanner.defaultProps = {
  onAdClicked: noop,
  onAdClosed: noop,
  onAdFailedToLoad: noop,
  onAdLoaded: noop,
  prebidAdId: '',
  style: {},
  testDeviceIds: [],
  targeting: {},
}

const RNGAMBannerView = requireNativeComponent('RNGAMBannerView', RNGAMBanner)

export { RNGAMBanner }
