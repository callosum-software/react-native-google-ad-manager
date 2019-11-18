import P from 'prop-types'
import React from 'react'
import {
  findNodeHandle,
  NativeModules,
  requireNativeComponent,
  UIManager,
  ViewPropTypes,
} from 'react-native'

const noop = () => {}

const { simulatorTestId } = NativeModules.RNGoogleAdManager

class RNGAMBanner extends React.PureComponent {
  static simulatorTestId = simulatorTestId

  _commandBuilder = commandName => () => {
    if (this._ref) {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._ref),
        UIManager.getViewManagerConfig('RNGAMBannerView').Commands[commandName],
        []
      )
    }
  }

  addBannerView = this._commandBuilder('addBannerView')
  destroyBanner = this._commandBuilder('destroyBanner')
  loadBanner = this._commandBuilder('loadBanner')
  removeBannerView = this._commandBuilder('removeBannerView')

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

  _onAdRequest = ({ nativeEvent }) => {
    this.props.onAdRequest(nativeEvent)
  }

  _onPropsSet = ({ nativeEvent }) => {
    this.props.onPropsSet(nativeEvent)
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
        onAdRequest={this._onAdRequest}
        onPropsSet={this._onPropsSet}
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
  onAdRequest: P.func,
  onPropsSet: P.func,
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
  onAdRequest: noop,
  onPropsSet: noop,
  prebidAdId: '',
  style: {},
  targeting: {},
  testDeviceIds: [],
}

const RNGAMBannerView = requireNativeComponent('RNGAMBannerView', RNGAMBanner)

export { RNGAMBanner }
