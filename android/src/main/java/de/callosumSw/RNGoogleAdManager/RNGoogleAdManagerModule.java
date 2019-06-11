
package de.callosumSw.RNGoogleAdManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.google.android.gms.ads.doubleclick.PublisherAdRequest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RNGoogleAdManagerModule extends ReactContextBaseJavaModule {

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

    return constants;
  }
}
