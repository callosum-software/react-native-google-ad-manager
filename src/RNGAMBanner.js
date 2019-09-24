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
    const {
      adId,
      onAdLoaded,
      prebidAdId,
      size,
      style,
      targeting,
      testDeviceIds,
    } = this.props

    return (
      <RNGAMBannerView
        adId={adId}
        onAdClicked={this._onAdClicked}
        onAdClosed={this._onAdClosed}
        onAdLoaded={onAdLoaded}
        onAdFailedToLoad={this._onAdFailedToLoad}
        prebidAdId={prebidAdId}
        ref={this._setRef}
        size={size}
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
  size: P.arrayOf(P.arrayOf(P.number)).isRequired,
  style: ViewPropTypes.style,
  testDeviceIds: P.arrayOf(P.string),
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
