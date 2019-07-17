
# react-native-google-ad-manager
This library integrates Banners for Google Ad Manager. To create issues and PRs please refer to the main repository [here](https://gitlab.com/cmsw/react-native-google-ad-manager).

## Getting started

`$ npm install @callosum/react-native-google-ad-manager --save`

### Mostly automatic installation

`$ react-native link @callosum/react-native-google-ad-manager`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `@callosum/react-native-google-ad-manager` and add `RNGoogleAdManager.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNGoogleAdManager.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import de.callosumSw.RNGoogleAdManager.RNGoogleAdManagerPackage;` to the imports at the top of the file
  - Add `new RNGoogleAdManagerPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':@callosum_react-native-google-ad-manager'
  	project(':@callosum_react-native-google-ad-manager').projectDir = new File(rootProject.projectDir, 	'../node_modules/@callosum/react-native-google-ad-manager/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':@callosum_react-native-google-ad-manager')
  	```

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
- Add the GAM SDK to your Podfile
```diff
target 'MyApp' do
    ...
+   pod 'Google-Mobile-Ads-SDK', '~> 7.43.0'
end
```
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
