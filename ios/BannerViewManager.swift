import Foundation
import GoogleMobileAds

@objc(BannerViewManager)
class BannerViewManager: RCTViewManager {
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func view() -> UIView! {
        return BannerView()
    }
    
    override func constantsToExport() -> [AnyHashable : Any]! {
        return [
            "sizes": Array(supportedAdSizesMap.keys),
            "simulatorTestId": kGADSimulatorID
        ]
    }
}
