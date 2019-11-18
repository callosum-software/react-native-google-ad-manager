import React from 'react'
import { RNGAMBanner } from './RNGAMBanner'

class GAMAutomaticBanner extends React.PureComponent {
  static simulatorTestId = RNGAMBanner.simulatorTestId

  _ref = this.props.forwardedRef || React.createRef()

  componentWillUnmount() {
    this._ref.current.removeBannerView()
    this._ref.current.destroyBanner()
  }

  _onPropsSet = () => {
    this._ref.current.loadBanner()
  }

  _onAdLoaded = () => {
    const { onAdLoaded } = this.props

    this._ref.current.addBannerView()
    if (typeof onAdLoaded === 'function') {
      onAdLoaded()
    }
  }

  render() {
    return (
      <RNGAMBanner
        {...this.props}
        ref={this._ref}
        onAdLoaded={this._onAdLoaded}
        onPropsSet={this._onPropsSet}
      />
    )
  }
}

export { GAMAutomaticBanner }
