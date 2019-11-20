import React from 'react'
import { GAMAutomaticBanner } from '../GAMAutomaticBanner'

const adSizes = [[250, 300]]
const adId = 'test'
const testDeviceIds = ['test_id']

describe('GAMAutomaticBanner', () => {
  const createInstance = props => {
    const wrapper = shallow(
      <GAMAutomaticBanner
        adId={adId}
        adSizes={adSizes}
        testDeviceIds={testDeviceIds}
        {...props}
      />
    )

    return wrapper.instance()
  }

  it('cleans up the component on unmount', () => {
    const instance = createInstance()
    const destroyBanner = jest.fn()
    const removeBannerView = jest.fn()
    instance._ref = { current: { destroyBanner, removeBannerView } }

    instance.componentWillUnmount()

    expect(removeBannerView).toBeCalled()
    expect(destroyBanner).toBeCalled()
  })

  it('it loads the banner when props are set', () => {
    const instance = createInstance()
    const loadBanner = jest.fn()

    instance._ref = { current: { loadBanner } }

    instance._onPropsSet()

    expect(loadBanner).toBeCalled()
  })

  it('adds the banner view on load', () => {
    const instance = createInstance()
    const addBannerView = jest.fn()
    instance._ref = { current: { addBannerView } }

    instance._onAdLoaded()

    expect(addBannerView).toBeCalled()
  })

  it('calls onAdLoaded from props', () => {
    const onAdLoaded = jest.fn()
    const instance = createInstance({ onAdLoaded })
    instance._ref = { current: { addBannerView: jest.fn() } }

    instance._onAdLoaded()

    expect(onAdLoaded).toBeCalled()
  })
})
