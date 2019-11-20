import React from 'react'
import { RNGAMBanner } from './RNGAMBanner'

class GAMAutomaticBanner extends React.PureComponent {
  static simulatorTestId = RNGAMBanner.simulatorTestId

  _ref = React.createRef()

  componentWillUnmount() {
    this._ref.current.removeBannerView()
    this._ref.current.destroyBanner()
  }

  _onPropsSet = () => {
    const { onPropsSet } = this.props
    this._ref.current.loadBanner()

    if (typeof onAdLoaded === 'function') {
      onPropsSet()
    }
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

GAMAutomaticBanner.propTypes = RNGAMBanner.propTypes

export { GAMAutomaticBanner }
