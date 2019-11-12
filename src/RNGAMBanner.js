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

const { simulatorTestId } = NativeModules.RNGoogleAdManager

class RNGAMBanner extends React.PureComponent {
  static simulatorTestId = simulatorTestId

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

  _onAdClicked = ({ nativeEvent }) => {
    this.props.onAdClicked(nativeEvent)
  }

  _onAdClosed = ({ nativeEvent }) => {
    this.props.onAdClosed(nativeEvent)
  }

  _onAdFailedToLoad = ({ nativeEvent }) => {
    this.props.onAdFailedToLoad(nativeEvent)
  }

  _onAdLoaded = ({ nativeEvent }) => {
    this.props.onAdLoaded(nativeEvent)
  }

  _setRef = ref => {
    this._ref = ref
  }

  render() {
    const {
      adId,
      adSizes,
      prebidAdId,
      style,
      targeting,
      testDeviceIds,
    } = this.props

    return (
      <RNGAMBannerView
        adId={adId}
        adSizes={adSizes}
        onAdClicked={this._onAdClicked}
        onAdClosed={this._onAdClosed}
        onAdFailedToLoad={this._onAdFailedToLoad}
        onAdLoaded={this._onAdLoaded}
        prebidAdId={prebidAdId}
        ref={this._setRef}
        style={style}
        targeting={targeting}
        testDeviceIds={testDeviceIds}
      />
    )
  }
}

RNGAMBanner.propTypes = {
  adId: P.string.isRequired,
  adSizes: P.arrayOf(P.arrayOf(P.number)).isRequired,
  onAdClicked: P.func,
  onAdClosed: P.func,
  onAdFailedToLoad: P.func,
  onAdLoaded: P.func,
  prebidAdId: P.string,
  style: ViewPropTypes.style,
  targeting: P.object,
  testDeviceIds: P.arrayOf(P.string),
}

RNGAMBanner.defaultProps = {
  onAdClicked: noop,
  onAdClosed: noop,
  onAdFailedToLoad: noop,
  onAdLoaded: noop,
  prebidAdId: '',
  style: {},
  targeting: {},
  testDeviceIds: [],
}

const RNGAMBannerView = requireNativeComponent('RNGAMBannerView', RNGAMBanner)

export { RNGAMBanner }
