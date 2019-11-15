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
            "simulatorTestId": kGADSimulatorID
        ]
    }
    
    @objc func addBannerView(_ node: NSNumber) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! BannerView
            component.addBannerView()
        }
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
    
    @objc func removeBannerView(_ node: NSNumber) {
        DispatchQueue.main.async {
            let component = self.bridge.uiManager.view(forReactTag: node) as! BannerView
            component.removeBannerView()
        }
    }
}
