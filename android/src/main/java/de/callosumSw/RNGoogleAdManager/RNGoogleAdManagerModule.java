
package de.callosumSw.RNGoogleAdManager;

import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.ads.doubleclick.PublisherAdRequest;

import org.prebid.mobile.Host;
import org.prebid.mobile.PrebidMobile;
import org.prebid.mobile.TargetingParams;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RNGoogleAdManagerModule extends ReactContextBaseJavaModule {
  private final String LOG_TAG = "RNGoogleAdManager";

  private final String FEMALE = "FEMALE";
  private final String MALE = "MALE";

  private final ReactApplicationContext reactContext;

  public RNGoogleAdManagerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNGoogleAdManager";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put("simulatorTestId", PublisherAdRequest.DEVICE_ID_EMULATOR);

    final List<String> sizes = new ArrayList<String>(BannerView.supportedAdSizesMap.keySet());
    constants.put("sizes", sizes);

    final Map<String, String> prebidGender = new HashMap<String, String>();
    prebidGender.put("FEMAlE", FEMALE);
    prebidGender.put("MALE", MALE);

    constants.put("PREBID_GENDER", prebidGender);

    return constants;
  }

  @ReactMethod
  public void setPrebidApplicationContext(){
    Log.d(LOG_TAG, "setting Prebid application context");

    final Context context = this.reactContext;

    PrebidMobile.setApplicationContext(context);
  }

  @ReactMethod
  public void setPrebidCustomServerHost(String url){
    Log.d(LOG_TAG, "setting Prebid custom server host to " + url);

    Host.CUSTOM.setHostUrl(url);
    PrebidMobile.setPrebidServerHost(Host.CUSTOM);
  }

  @ReactMethod
  public void setPrebidServerAccountId(String accountId){
    Log.d(LOG_TAG, "setting Prebid server account id to " + accountId);

    PrebidMobile.setPrebidServerAccountId(accountId);
  }

  @ReactMethod
  public void setPrebidShareGeoLocation(Boolean shouldEnable){
    PrebidMobile.setShareGeoLocation(shouldEnable);
  }

  @ReactMethod
  public void setPrebidYearOfBirth(Integer yearOfBirth){
    TargetingParams.setYearOfBirth(yearOfBirth);
  }

  @ReactMethod
  public void setPrebidGender(String gender){
    if(FEMALE.equals(gender) || MALE.equals(gender)){
      TargetingParams.GENDER genderEnum = TargetingParams.GENDER.valueOf(gender);
      TargetingParams.setGender(genderEnum);
    }
  }
}
