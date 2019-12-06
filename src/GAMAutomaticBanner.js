import React from 'react'
import { RNGAMBanner } from './RNGAMBanner'

class GAMAutomaticBanner extends React.PureComponent {
  static simulatorTestId = RNGAMBanner.simulatorTestId

  _ref = React.createRef()

  addBannerView = () => this._ref.current.addBannerView()
  destroyBanner = () => this._ref.current.destroyBanner()
  loadBanner = () => this._ref.current.loadBanner()
  removeBannerView = () => this._ref.current.removeBannerView()

  componentDidUpdate(prevProps) {
    const { adId } = this.props
    const { adId: prevId } = prevProps

    if (prevId !== adId) {
      this._ref.current.loadBanner()
    }
  }

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

  _onAdLoaded = nativeEvent => {
    const { onAdLoaded } = this.props

    this._ref.current.addBannerView()

    if (typeof onAdLoaded === 'function') {
      onAdLoaded(nativeEvent)
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
