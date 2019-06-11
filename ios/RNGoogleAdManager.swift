import Foundation
import GoogleMobileAds

@objc(RNGoogleAdManager)
class RNGoogleAdManager: NSObject{
    @objc
    func constantsToExport() -> [AnyHashable : Any]! {
        return [
            "sizes": Array(supportedAdSizesMap.keys),
            "simulatorTestId": kGADSimulatorID
        ]
    }
}
