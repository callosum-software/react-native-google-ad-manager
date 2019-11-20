import React from 'react'
import { RNGAMBanner } from '../RNGAMBanner'

const adSizes = [[250, 300]]
const adId = 'test'
const testDeviceIds = ['test_id']

const orgConsole = global.console

beforeEach(() => {
  const mockedConsole = {
    warn: jest.fn(),
  }

  global.console = {
    ...orgConsole,
    ...mockedConsole,
  }
})

afterAll(() => {
  global.console = orgConsole
})

describe('RNGAMBanner', () => {
  it('has instance functions & props', () => {
    const wrapper = shallow(
      <RNGAMBanner
        adId={adId}
        adSizes={adSizes}
        onAdLoaded={jest.fn()}
        onAdReady={jest.fn()}
        onAdFailedToLoad={jest.fn()}
        testDeviceIds={testDeviceIds}
      />
    )
    const instance = wrapper.instance()

    expect(instance.props.adId).toEqual(adId)
    expect(instance.props.adSizes).toEqual(adSizes)
    expect(instance.props.testDeviceIds).toEqual(testDeviceIds)

    expect(instance.addBannerView).toBeInstanceOf(Function)
    expect(instance.destroyBanner).toBeInstanceOf(Function)
    expect(instance.loadBanner).toBeInstanceOf(Function)
    expect(instance.removeBannerView).toBeInstanceOf(Function)
  })

  describe('calls event handlers', () => {
    const event = { nativeEvent: {} }

    const onAdLoaded = jest.fn()
    const onAdRequest = jest.fn()
    const onAdFailedToLoad = jest.fn()
    const onPropsSet = jest.fn()

    const wrapper = shallow(
      <RNGAMBanner
        adId={adId}
        adSizes={adSizes}
        onAdLoaded={onAdLoaded}
        onAdRequest={onAdRequest}
        onAdFailedToLoad={onAdFailedToLoad}
        onPropsSet={onPropsSet}
      />
    )
    const instance = wrapper.instance()

    it('calls onAdLoaded prop', () => {
      instance._onAdLoaded(event)

      expect(onAdLoaded).toBeCalled()
    })

    it('calls onAdRequest prop', () => {
      instance._onAdRequest(event)

      expect(onAdRequest).toBeCalled()
    })

    it('calls onAdFailedToLoad prop', () => {
      instance._onAdFailedToLoad(event)

      expect(onAdFailedToLoad).toBeCalled()
    })

    it('calls onPropsSet prop', () => {
      instance._onPropsSet(event)

      expect(onPropsSet).toBeCalled()
    })
  })

  describe('calls instance functions', () => {
    const event = { nativeEvent: {} }

    const createInstance = props => {
      const wrapper = shallow(
        <RNGAMBanner
          adId={adId}
          adSizes={adSizes}
          testDeviceIds={testDeviceIds}
          {...props}
        />
      )

      return wrapper.instance()
    }

    it('loads the banner if props are set', () => {
      const instance = createInstance()
      jest.spyOn(instance, '_loadBanner')

      instance._onPropsSet(event)
      instance.loadBanner()

      expect(instance._loadBanner).toBeCalled()
    })

    it('loads the banner after props are set', () => {
      const instance = createInstance()
      jest.spyOn(instance, 'loadBanner')
      jest.spyOn(instance, '_loadBanner')

      instance.loadBanner()

      expect(instance.loadBanner).toBeCalled()

      instance._onPropsSet(event)

      expect(instance._loadBanner).toBeCalledTimes(1)
    })

    it('adds the banner view only if it is requested', () => {
      const instance = createInstance()
      jest.spyOn(instance, '_addBannerView')

      instance.addBannerView()

      instance._onPropsSet(event)
      instance.loadBanner()
      instance._onAdRequest(event)

      expect(instance._addBannerView).toBeCalledTimes(1)
    })

    it('does not add the banner if it is already added', () => {
      const instance = createInstance()
      jest.spyOn(instance, '_addBannerView')

      instance._onPropsSet(event)
      instance.loadBanner()
      instance._onAdRequest(event)
      instance.addBannerView()
      instance.addBannerView()

      expect(instance._addBannerView).toBeCalledTimes(1)
      expect(global.console.warn).toBeCalledTimes(1)
    })

    it('does not destory the banner if it is not requested', () => {
      const instance = createInstance()
      jest.spyOn(instance, '_destroyBanner')

      instance.destroyBanner()

      expect(instance._destroyBanner).not.toBeCalled()
    })

    it('does not destroy the banner if it is already destroyed', () => {
      const instance = createInstance()
      jest.spyOn(instance, '_destroyBanner')

      instance._onPropsSet(event)
      instance.loadBanner()
      instance._onAdRequest(event)
      instance.destroyBanner()
      instance.destroyBanner()

      expect(instance._destroyBanner).toBeCalledTimes(1)
      expect(global.console.warn).toBeCalledTimes(1)
    })

    it('destroys the banner view if it is requested', () => {
      const instance = createInstance()
      jest.spyOn(instance, '_destroyBanner')

      instance._onPropsSet(event)
      instance.loadBanner()
      instance._onAdRequest(event)
      instance.destroyBanner()

      expect(instance._destroyBanner).toBeCalled()
    })

    it('destroys the banner view if it is added', () => {
      const instance = createInstance()
      jest.spyOn(instance, '_destroyBanner')

      instance._onPropsSet(event)
      instance.loadBanner()
      instance._onAdRequest(event)
      instance.addBannerView()
      instance.destroyBanner()

      expect(instance._destroyBanner).toBeCalled()
    })

    it('does not remove the banner if it is not added', () => {
      const instance = createInstance()
      jest.spyOn(instance, '_removeBannerView')

      instance.removeBannerView()

      expect(instance._removeBannerView).not.toBeCalled()
    })

    it('removes the banner view if it is created', () => {
      const instance = createInstance()
      jest.spyOn(instance, '_removeBannerView')

      instance._onPropsSet(event)
      instance.loadBanner()
      instance._onAdRequest(event)
      instance.addBannerView()
      instance.removeBannerView()

      expect(instance._removeBannerView).toBeCalled()
    })

    it('does not remove the banner if it is already removed', () => {
      const instance = createInstance()
      jest.spyOn(instance, '_removeBannerView')

      instance._onPropsSet(event)
      instance.loadBanner()
      instance._onAdRequest(event)
      instance.addBannerView()
      instance.removeBannerView()
      instance.removeBannerView()

      expect(instance._removeBannerView).toBeCalledTimes(1)
      expect(global.console.warn).toBeCalledTimes(1)
    })
  })
})
