#import "React/RCTViewManager.h"

@interface RCT_EXTERN_MODULE(RNGoogleAdManager, NSObject)

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

@end

@interface RCT_EXTERN_REMAP_MODULE(RNGAMBannerView, BannerViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(adId, NSString)
RCT_EXPORT_VIEW_PROPERTY(size, NSString)
RCT_EXPORT_VIEW_PROPERTY(testDeviceIds, NSArray<NSString>)

RCT_EXPORT_VIEW_PROPERTY(onAdLoaded, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAdFailedToLoad, RCTDirectEventBlock)

@end
