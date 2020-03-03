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

const AD_STATE = {
  DESTROYED: 'destroyed',
  REQUESTED: 'requested',
}

const VIEW_STATE = {
  ADDED: 'added',
  REMOVED: 'removed',
}

class RNGAMBanner extends React.PureComponent {
  static AD_SIZE = {
    BANNER: [320, 50],
    FULL_BANNER: [468, 60],
    LARGE_BANNER: [320, 100],
    LEADERBOARD: [728, 90],
    MEDIUM_RECTANGLE: [300, 250],
  }
  static AD_TYPE = {
    BANNER: 'BANNER',
    FULL_BANNER: 'FULL_BANNER',
    LARGE_BANNER: 'LARGE_BANNER',
    LEADERBOARD: 'LEADERBOARD',
    MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
  }
  static simulatorTestId = simulatorTestId

  _adState = AD_STATE.DESTROYED
  _arePropsSet = false // prop change doesn't require rerender; sync checking in loadBanner and onPropsSet
  _isRequestedToAdd = false
  _isRequestedToLoad = false
  _ref = React.createRef()
  _viewState = VIEW_STATE.REMOVED

  _commandBuilder = commandName => () => {
    if (this._ref.current) {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._ref.current),
        UIManager.getViewManagerConfig('RNGAMBannerView').Commands[commandName],
        []
      )
    }
  }

  _addBannerView = this._commandBuilder('addBannerView')
  _destroyBanner = this._commandBuilder('destroyBanner')
  _loadBanner = this._commandBuilder('loadBanner')
  _removeBannerView = this._commandBuilder('removeBannerView')
  openDebugMenu = this._commandBuilder('openDebugMenu')

  _throwWarn = functionName => {
    console.warn(
      `You called ${functionName} even though it was already called. This probably means you have some kind of logic in place that is not working as expected.`
    )
  }

  addBannerView = () => {
    this._isRequestedToAdd = !this._arePropsSet

    if (this._arePropsSet && this._viewState !== VIEW_STATE.ADDED) {
      this._viewState = VIEW_STATE.ADDED
      this._addBannerView()
    } else if (__DEV__ && this._viewState === VIEW_STATE.ADDED) {
      this._throwWarn('addBannerView')
    }
  }

  destroyBanner = () => {
    if (this._adState !== AD_STATE.DESTROYED) {
      this._adState = AD_STATE.DESTROYED
      this._destroyBanner()
    } else if (__DEV__ && this._adState === AD_STATE.DESTROYED) {
      this._throwWarn('destroyBanner')
    }
  }

  loadBanner = () => {
    this._isRequestedToLoad = !this._arePropsSet

    if (this._arePropsSet) {
      this._adState = AD_STATE.REQUESTED
      this._loadBanner()
    }
  }

  removeBannerView = () => {
    if (this._viewState !== VIEW_STATE.REMOVED) {
      this._viewState = VIEW_STATE.REMOVED
      this._removeBannerView()
    } else if (__DEV__ && this._viewState === VIEW_STATE.REMOVED) {
      this._throwWarn('removeBannerView')
    }
  }

  _onAdClicked = ({ nativeEvent }) => {
    this.props.onAdClicked(nativeEvent)
  }

  _onAdClosed = ({ nativeEvent }) => {
    this.props.onAdClosed(nativeEvent)
  }

  _onAdFailedToLoad = ({ nativeEvent }) => {
    this._adState = AD_STATE.DESTROYED
    this.props.onAdFailedToLoad(nativeEvent)
  }

  _onAdLoaded = ({ nativeEvent }) => {
    this.props.onAdLoaded(nativeEvent)
  }

  _onAdRequest = ({ nativeEvent }) => {
    this._adState = AD_STATE.REQUESTED
    this.props.onAdRequest(nativeEvent)
  }

  _onNativeError = ({ nativeEvent }) => {
    this.props.onNativeError(nativeEvent)
  }

  _onPropsSet = ({ nativeEvent }) => {
    this._arePropsSet = true

    if (this._isRequestedToLoad) {
      this._loadBanner()
    }

    if (this._isRequestedToAdd) {
      this._addBannerView()
    }

    this.props.onPropsSet(nativeEvent)
  }

  render() {
    return (
      <RNGAMBannerView
        adId={this.props.adId}
        adSizes={this.props.adSizes}
        adType={this.props.adType}
        onAdClicked={this._onAdClicked}
        onAdClosed={this._onAdClosed}
        onAdFailedToLoad={this._onAdFailedToLoad}
        onAdLoaded={this._onAdLoaded}
        onAdRequest={this._onAdRequest}
        onNativeError={this._onNativeError}
        onPropsSet={this._onPropsSet}
        prebidAdId={this.props.prebidAdId}
        ref={this._ref}
        style={this.props.style}
        targeting={this.props.targeting}
        testDeviceIds={this.props.testDeviceIds}
      />
    )
  }
}

RNGAMBanner.propTypes = {
  adId: P.string.isRequired,
  adSizes: P.arrayOf(P.arrayOf(P.number)),
  adType: P.string,
  onAdClicked: P.func,
  onAdClosed: P.func,
  onAdFailedToLoad: P.func,
  onAdLoaded: P.func,
  onAdRequest: P.func,
  onNativeError: P.func,
  onPropsSet: P.func,
  prebidAdId: P.string,
  style: ViewPropTypes.style,
  targeting: P.object,
  testDeviceIds: P.arrayOf(P.string),
}

RNGAMBanner.defaultProps = {
  adSizes: undefined,
  adType: undefined,
  onAdClicked: noop,
  onAdClosed: noop,
  onAdFailedToLoad: noop,
  onAdLoaded: noop,
  onAdRequest: noop,
  onNativeError: noop,
  onPropsSet: noop,
  prebidAdId: '',
  style: {},
  targeting: {},
  testDeviceIds: [],
}

const RNGAMBannerView = requireNativeComponent('RNGAMBannerView', RNGAMBanner)

export { RNGAMBanner }
