import Foundation
import GoogleMobileAds

@objc(RNGoogleAdManager)
class RNGoogleAdManager: NSObject{
    @objc
    func constantsToExport() -> [AnyHashable : Any]! {
        return [
            "simulatorTestId": kGADSimulatorID
        ]
    }
}
