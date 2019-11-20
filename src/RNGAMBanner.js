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
  static simulatorTestId = simulatorTestId

  state = {
    adState: AD_STATE.DESTROYED,
    arePropsSet: false,
    isRequestedToLoad: false,
    viewState: VIEW_STATE.REMOVED,
  }

  _commandBuilder = commandName => () => {
    if (this._ref) {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._ref),
        UIManager.getViewManagerConfig('RNGAMBannerView').Commands[commandName],
        []
      )
    }
  }

  _addBannerView = this._commandBuilder('addBannerView')
  _destroyBanner = this._commandBuilder('destroyBanner')
  _loadBanner = this._commandBuilder('loadBanner')
  _removeBannerView = this._commandBuilder('removeBannerView')

  _throwWarn = functionName => {
    console.warn(
      `You called ${functionName} even though it was already called. This probably means you have some kind of logic in place that is not working as expected.`
    )
  }

  addBannerView = () => {
    const { viewState } = this.state

    if (viewState !== VIEW_STATE.ADDED) {
      this.setState({ viewState: VIEW_STATE.ADDED })
      this._addBannerView()
    } else if (__DEV__ && viewState === VIEW_STATE.ADDED) {
      this._throwWarn('addBannerView')
    }
  }

  destroyBanner = () => {
    const { adState } = this.state

    if (adState !== AD_STATE.DESTROYED) {
      this.setState({ adState: AD_STATE.DESTROYED })
      this._destroyBanner()
    } else if (__DEV__ && adState === AD_STATE.DESTROYED) {
      this._throwWarn('destroyBanner')
    }
  }

  loadBanner = () => {
    const { arePropsSet } = this.state

    if (arePropsSet) {
      this.setState({ adState: AD_STATE.LOADED })
      this._loadBanner()
    } else {
      this.setState({ isRequestedToLoad: true })
    }
  }

  removeBannerView = () => {
    const { viewState } = this.state

    if (viewState !== VIEW_STATE.REMOVED) {
      this.setState({ viewState: VIEW_STATE.REMOVED })
      this._removeBannerView()
    } else if (__DEV__ && viewState === VIEW_STATE.REMOVED) {
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
    this.props.onAdFailedToLoad(nativeEvent)
  }

  _onAdLoaded = ({ nativeEvent }) => {
    this.props.onAdLoaded(nativeEvent)
  }

  _onAdRequest = ({ nativeEvent }) => {
    this.setState({ adState: AD_STATE.REQUESTED })
    this.props.onAdRequest(nativeEvent)
  }

  _onPropsSet = ({ nativeEvent }) => {
    if (this.state.isRequestedToLoad) {
      this.setState({ arePropsSet: true, isRequestedToLoad: false })
      this._loadBanner()
    } else {
      this.setState({ arePropsSet: true })
    }

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
