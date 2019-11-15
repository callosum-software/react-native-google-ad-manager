import GoogleMobileAds
import UIKit

let LOG_TAG = "RNGoogleAdManager"

let AD_CLICKED = "AD_CLICKED"
let AD_CLOSED = "AD_CLOSED"
let AD_FAILED = "AD_FAILED"
let AD_LOADED = "AD_LOADED"

class BannerView: UIView, GADAppEventDelegate, GADBannerViewDelegate, GADAdSizeDelegate {
    var bannerView: DFPBannerView? = nil
    
    var width: Int?, height: Int? = nil
    
    @objc var onAdClicked: RCTDirectEventBlock?
    @objc var onAdClosed: RCTDirectEventBlock?
    @objc var onAdLoaded: RCTDirectEventBlock?
    @objc var onAdFailedToLoad: RCTDirectEventBlock?
    @objc var onAdRequest: RCTDirectEventBlock?
    
    @objc var adId: String? = nil
    @objc var adSizes: Array<Array<Int>>? = nil
    @objc var targeting: NSDictionary? = nil
    @objc var testDeviceIds: Array<String>? = nil
    
    override init(frame: CGRect) {
        super.init(frame: frame)
    }
       
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func addAdView(){
        self.addSubview(bannerView!)
    }
    
    func destroyAdView(){
        if(bannerView != nil){
            bannerView?.removeFromSuperview()
        }
    }
    
    func createAdView(){
        bannerView = DFPBannerView.init()
        
        let rootViewController = UIApplication.shared.delegate?.window??.rootViewController
        
        var validAdSizes = [NSValue]()
        
        for sizes in adSizes! {
            let width = sizes[0]
            let height = sizes[1]
            let customGADAdSize = GADAdSizeFromCGSize(CGSize(width: width, height: height))
            validAdSizes.append(NSValueFromGADAdSize(customGADAdSize))
        }
        
        bannerView?.rootViewController = rootViewController
        bannerView?.delegate = self
        bannerView?.adSizeDelegate = self
        bannerView?.translatesAutoresizingMaskIntoConstraints = false
        bannerView?.appEventDelegate = self
        bannerView?.adUnitID = adId
        bannerView?.validAdSizes = validAdSizes
    }
    
    func removeAdView() {
        self.removeReactSubview(bannerView)
    }
    
    func loadAd(){
        let adRequest = DFPRequest()
        var dict: [AnyHashable: Any] = [:]
        
        for key in targeting!.allKeys {
            dict[key as! String] = targeting![key]
        }
        
        adRequest.customTargeting = dict
        adRequest.testDevices = testDeviceIds

        onAdRequest!()
        bannerView?.load(adRequest)
    }
    
    func adViewDidReceiveAd(_ bannerView: GADBannerView) {
        print("\(LOG_TAG): Ad loaded")
        onAdLoaded!(["width": width,"height": height])
    }
    
    func adView(_ banner: GADBannerView, didReceiveAppEvent name: String, withInfo info: String?) {
        switch name {
        case AD_CLICKED:
            print("\(LOG_TAG): Ad clicked")
            onAdClicked!(["url": info])
            break
        case AD_CLOSED:
            print("\(LOG_TAG): Ad closed")
            destroyAdView()
            onAdClosed!([:])
            break
        default:
            break
        }
    }
    
    func adView(_ bannerView: GADBannerView, willChangeAdSizeTo size: GADAdSize) {
        print("\(LOG_TAG): Ad size changed")
        if let adSize = adSizes?.first(where: {
            let customGADAdSize = GADAdSizeFromCGSize(CGSize(width: $0[0], height: $0[1]))
            return GADAdSizeEqualToSize(customGADAdSize, size)
        }) {
            width = adSize[0]
            height = adSize[1]
        }
    }
    
    func adView(_ bannerView: GADBannerView, didFailToReceiveAdWithError error: GADRequestError) {
        print("\(LOG_TAG): Ad failed to load. Reason: \(error.localizedDescription)")
        onAdFailedToLoad!(["errorMessage": error.localizedDescription])
    }
    
    @objc func addBannerView() {
        if(bannerView == nil) {
            createAdView()
        }
        addAdView()
    }
    
    @objc func destroyBanner() {
        if(bannerView != nil) {
            destroyAdView()
        }
    }
    
    @objc func loadBanner() {
        if(bannerView == nil) {
            createAdView()
        }
        loadAd()
    }

    @objc func removeBannerView() {
        if(bannerView != nil) {
            removeAdView()
        }
    }
}
