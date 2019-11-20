
# react-native-google-ad-manager
This library integrates Banners for Google Ad Manager. To create issues and PRs please refer to the main repository [here](https://gitlab.com/cmsw/react-native-google-ad-manager).

## Getting started

For React Native versions < 0.60 use version 0.+ of this library and checkout the corresponding README file.

`$ npm install @callosum/react-native-google-ad-manager --save`

## Integration
Learn how to set up GAM for your app.

### iOS
#### Swift

- Under `Build Settings` section `Build Options` set `Always Embed Swift Started Libraries` to `true`

#### GAM
- Activate as Ad Manager app by editing your Info.plist
```diff
...
+ <key>GADIsAdManagerApp</key>
+ <true/>
...
```

- Add transport security rules in Info.plist
```
...
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
    <key>NSAllowsArbitraryLoadsForMedia</key>
    <true/>
    <key>NSAllowsArbitraryLoadsInWebContent</key>
    <true/>
</dict>
...
```

### Android
- Activate as Ad Manager app
```diff
<manifest>
  <application>
    ...
+   <meta-data android:name="com.google.android.gms.ads.AD_MANAGER_APP" android:value="true"/>
    ...
  </application>
</manifest>
```

## Usage

### Automatic Banner
This banner component automatically fetches an ad and adds the view when the ad is sucessfully loaded. It also takes care of the cleanup on unmount.

#### Props

```
type GAMAutomaticBanner = {
  adId: String,
  onAdFailedToLoad: function<error>,
  onAdLoaded: function<object: { height, width }>,
  onAdRequest: function<>,
  adSizes: Array<Array<width, height>>,
  testDeviceIds: Array<string>,
  style: styles,
}
```

#### Example

```javascript
import { GAMAutomaticBanner } from '@callosum/react-native-google-ad-manager';

const AdBanner = () => (
  <GAMAutomaticBanner
    adId="/6499/example/banner"
    adSizes={[[320, 50]]}
    testDeviceIds={[RNGAMBanner.simulatorTestId]}
    style={{ height: 50, width: 320 }}
  />
)
```

### Banner
This is a banner component that gives your more access to pure functionality in order to implement dynamic solutions like lazy loading and more performant integrations for repeating units in lists. It implements the same props as the automatic banner.

Additionally, you have the following methos available:

#### `loadBanner()`
This loads an ad but does not add it to the view hierarchy.

#### `destroyBanner()`
This destroys the created / loaded ad.

#### `addBannerView()`
This adds the native view to the view hierarchy.

#### `removeBannerView()`
This removes the native view from the view hierarchy.

#### Example

```javascript
import { useRef } from "react";
import { RNGAMBanner } from "@callosum/react-native-google-ad-manager";

const AdBanner = () => {
  const _ref = useRef(null);

  useEffect(() => {
    _ref.current.loadBanner()

    return () => {
      _ref.current.removeBannerView()
      _ref.current.destroyBanner()
    }
  }, [])

  return (
    <RNGAMBanner
      adId="/6499/example/banner"
      adSizes={[[300, 250]]}
      testDeviceIds={[RNGAMBanner.simulatorTestId]}
      onAdLoaded={({ height, width }) => {
        _ref.current.addBannerView()
      }}
      onAdFailedToLoad={error => {
        console.log(error)
      }}
      ref={_ref}
      style={{ height: 300, width: 250 }}
    />
  );
};

```

## API

### Constants

| Key | Values |
|---|---|
| simulatorTestId | *platform specific simulator id* |
| sizes | BANNER, MEDIUM_RECTANGLE |
