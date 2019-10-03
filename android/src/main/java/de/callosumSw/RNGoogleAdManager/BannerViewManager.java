package de.callosumSw.RNGoogleAdManager;

import android.app.Activity;
import android.content.Context;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;
import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.doubleclick.AppEventListener;
import com.google.android.gms.ads.doubleclick.PublisherAdRequest;
import com.google.android.gms.ads.doubleclick.PublisherAdView;

import org.prebid.mobile.BannerAdUnit;
import org.prebid.mobile.ResultCode;
import org.prebid.mobile.OnCompleteListener;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

class BannerView extends ReactViewGroup {
    public static final String LOG_TAG = "RNGoogleAdManager";

    public static final String AD_CLICKED = "AD_CLICKED";
    public static final String AD_CLOSED = "AD_CLOSED";
    public static final String AD_FAILED = "AD_FAILED";
    public static final String AD_LOADED = "AD_LOADED";

    protected PublisherAdView adView;
    protected String adId = null;
    protected ArrayList<AdSize> adSizes = null;
    protected String prebidAdId = null;
    protected ArrayList<String> testDeviceIds = null;
    protected Map<String, Object> targeting = null;

    public BannerView (final Context context) {
        super(context);
    }

    protected void destroyAdView(){
        if (this.adView != null) {
            this.adView.destroy();
            this.removeView(this.adView);
        }
    }

    private void createAdView(){
        this.destroyAdView();

        final Context context = getContext();
        this.adView = new PublisherAdView(context);

        this.adView.setAdUnitId(adId);

        AdSize []arr = adSizes.toArray(new AdSize[0]);
        this.adView.setAdSizes(arr);

        this.addView(this.adView);
    }

    private String getFailedToLoadReason(int code){
        switch (code){
            case PublisherAdRequest.ERROR_CODE_INTERNAL_ERROR:
                return "Internal Error";
            case PublisherAdRequest.ERROR_CODE_INVALID_REQUEST:
                return "Invalid Request";
            case PublisherAdRequest.ERROR_CODE_NETWORK_ERROR:
                return "Network error";
            case PublisherAdRequest.ERROR_CODE_NO_FILL:
                return "No Fill";
            default:
                return "Could not get message. Unknown code: " + code;
        }
    }

    public class BannerAppEventListener extends Activity implements AppEventListener {
        @Override
        public void onAppEvent(String name, String info) {
            switch (name) {
                case AD_CLICKED: {
                    Log.d(LOG_TAG, "Ad clicked");

                    WritableMap event = Arguments.createMap();
                    event.putString("url", info);

                    ReactContext reactContext = (ReactContext)getContext();
                    reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                            getId(),
                            AD_CLICKED,
                            event);

                    break;
                }

                case AD_CLOSED: {
                    Log.d(LOG_TAG, "Ad closed");

                    destroyAdView();

                    ReactContext reactContext = (ReactContext)getContext();
                    reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                            getId(),
                            AD_CLOSED,
                            null);

                    break;
                }
            }
        }
    }

    protected void setListeners(){
        this.adView.setAppEventListener(new BannerAppEventListener());
        this.adView.setAdListener(new AdListener() {
            @Override
            public void onAdLoaded() {
                super.onAdLoaded();
                Log.d(LOG_TAG, "Ad loaded");

                final Context context = getContext();

                AdSize size = adView.getAdSize();

                int widthInPixel = size.getWidthInPixels(context);
                int width = size.getWidth();
                int heightInPixel = size.getHeightInPixels(context);
                int height = size.getHeight();
                int left = adView.getLeft();
                int top = adView.getTop();
                adView.measure(width, height);
                adView.layout(left, top, left + widthInPixel, top + heightInPixel);

                WritableMap event = Arguments.createMap();
                event.putInt("width", width);
                event.putInt("height", height);

                ReactContext reactContext = (ReactContext)getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                        getId(),
                        AD_LOADED,
                        event);
            }

            @Override
            public void onAdFailedToLoad(int errorCode) {
                String errorMessage = getFailedToLoadReason(errorCode);
                // Code to be executed when an ad request fails.
                Log.d(LOG_TAG, "Ad failed to load. Reason: " + errorMessage);

                destroyAdView();

                WritableMap event = Arguments.createMap();
                event.putString("errorMessage", errorMessage);
                ReactContext reactContext = (ReactContext)getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                        getId(),
                        AD_FAILED,
                        event);
            }
        });
    }

    private void loadAd(){
        PublisherAdRequest.Builder adRequestBuilder = new PublisherAdRequest.Builder();

        for(String testId : testDeviceIds){
            adRequestBuilder.addTestDevice(testId);
        }

        for (Map.Entry<String, Object> entry : targeting.entrySet()) {
            String key = entry.getKey();
            ArrayList value =  (ArrayList) entry.getValue();

            adRequestBuilder.addCustomTargeting(key, value);
        }

        final PublisherAdRequest adRequest = adRequestBuilder.build();
        final String adUnitId = this.adView.getAdUnitId();
        final AdSize adSize = this.adView.getAdSize();

        if(!"".equals(prebidAdId)){
            // prebidAdId is set
            final String prebidAdUnitId = this.prebidAdId;

            BannerAdUnit bannerAdUnit = new BannerAdUnit(prebidAdUnitId, 300, 250);

            Log.d(LOG_TAG, "Prebid request with adunit id " + prebidAdUnitId);

            bannerAdUnit.fetchDemand(adRequest, new OnCompleteListener() {
                @Override
                public void onComplete(ResultCode resultCode) {
                    Log.d(LOG_TAG, "Prebid response code: " + resultCode);
                    Log.d(LOG_TAG, "GAM Banner request with adunit id " + adUnitId + " with size " + adSize);
                    BannerView.this.adView.loadAd(adRequest);
                }
            });
        } else {
            Log.d(LOG_TAG, "GAM Banner request with adunit id " + adUnitId + " with size " + adSize);
            this.adView.loadAd(adRequest);
        }
    }

    protected void loadAdIfPropsSet(){
        if(adId != null && prebidAdId != null && adSizes != null && testDeviceIds != null && targeting != null){
            this.createAdView();
            this.setListeners();
            this.loadAd();
        }
    }
}

public class BannerViewManager extends ViewGroupManager<BannerView> {
    private static final String REACT_CLASS = "RNGAMBannerView";

    public static final int COMMAND_LOAD_BANNER = 1;
    public static final int COMMAND_DESTROY_BANNER = 2;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected BannerView createViewInstance(ThemedReactContext context) {
        return new BannerView(context);
    }

    @Override
    public void addView(BannerView parent, View child, int index) {
        throw new RuntimeException("RNGAMBannerView cannot have subviews");
    }

    @Override
    public Map getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.builder()
                .put(BannerView.AD_LOADED,
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of("bubbled", "onAdLoaded")))
                .put(BannerView.AD_FAILED,
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of("bubbled", "onAdFailedToLoad")))
                .put(BannerView.AD_CLICKED,
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of("bubbled", "onAdClicked")))
                .put(BannerView.AD_CLOSED,
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of("bubbled", "onAdClosed")))
                .build();
    }

    @ReactProp(name = "adId")
    public void setAdId(BannerView view, @Nullable String adId) {
        view.adId = adId;
        view.loadAdIfPropsSet();
    }

    @ReactProp(name = "adSizes")
    public void setSize(BannerView view, @Nullable ReadableArray adSizes) {
        ArrayList<AdSize> list = new ArrayList<>();

        for(int i = 0; i < adSizes.size(); i++){
            ReadableArray sizes = adSizes.getArray(i);
            Integer width = sizes.getInt(0);
            Integer height = sizes.getInt(1);
            AdSize adSize = new AdSize(width, height);
            list.add(adSize);
        }

        view.adSizes = list;
        view.loadAdIfPropsSet();
    }

    @ReactProp(name = "prebidAdId")
    public void setPrebidAdId(BannerView view, @Nullable String prebidAdId) {
        view.prebidAdId = prebidAdId;
        view.loadAdIfPropsSet();
    }

    @ReactProp(name = "testDeviceIds")
    public void setTestDeviceIds(BannerView view, ReadableArray testDeviceIds) {
        ArrayList<String> list = new ArrayList<>();

        for(int i = 0; i < testDeviceIds.size(); i++){
            String item = testDeviceIds.getString(i);
            list.add(item);
        }

        view.testDeviceIds = list;
        view.loadAdIfPropsSet();
    }

    @ReactProp(name = "targeting")
    public void setTargeting(BannerView view, ReadableMap targeting) {
        view.targeting = targeting.toHashMap();
        view.loadAdIfPropsSet();
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of("loadBanner", COMMAND_LOAD_BANNER, "destroyBanner", COMMAND_DESTROY_BANNER);
    }

    @Override
    public void receiveCommand(BannerView view, int commandId, @Nullable ReadableArray args) {
        switch (commandId) {
            case COMMAND_LOAD_BANNER:
                view.loadAdIfPropsSet();
                break;

            case COMMAND_DESTROY_BANNER:
                view.destroyAdView();
                break;
        }
    }
}
