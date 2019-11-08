
# react-native-google-ad-manager
This library integrates Banners for Google Ad Manager. To create issues and PRs please refer to the main repository [here](https://gitlab.com/cmsw/react-native-google-ad-manager).

## Getting started

For React Native versions < 0.60 use version 0.+ of this library and checkout the corresponding README file.

`$ npm install @callosum/react-native-google-ad-manager --save`

## Integration
Learn how to set up GAM for your app.

### iOS
#### Swift

1. Under `Build Settings` section `Build Options` set `Always Embed Swift Started Libraries` to `true`
2. Make sure you have the following under `library search paths`

```
$(inherited)
$(TOOLCHAIN_DIR)/usr/lib/swift/$(PLATFORM_NAME)
```
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

### Banner

```javascript
import { RNGAMBanner } from '@callosum/react-native-google-ad-manager';

const AdBanner = () => (
  <RNGAMBanner
    adId="/6499/example/banner"
    size={RNGAMBanner.sizes.BANNER}
    testDeviceIds={[RNGAMBanner.simulatorTestId]}
    onAdLoaded={() => console.log('loaded')}
    onAdFailedToLoad={error => console.log('failed:', error)}
    style={{
      height: 50,
      width: 320,
    }}
  />
)
```

## API

### Constants

| Key | Values |
|---|---|
| simulatorTestId | *platform specific simulator id* |
| sizes | BANNER, MEDIUM_RECTANGLE |

### Components

#### Banner
```
type Banner = {
  adId: string,
  onAdFailedToLoad: function,
  onAdLoaded: function,
  size: BANNER || MEDIUM_RECTANGLE,
  style: styles,
  testDeviceIds: array
}
```
