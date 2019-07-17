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
    
    @objc func loadBanner(_ node: NSNumber) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! BannerView
            component.loadBanner()
        }
    }
    
    @objc func destroyBanner(_ node: NSNumber) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! BannerView
            component.destroyBanner()
        }
    }
}
