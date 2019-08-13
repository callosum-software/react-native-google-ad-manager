import GoogleMobileAds
import UIKit

let supportedAdSizesMap: Dictionary = [
    "BANNER": kGADAdSizeBanner,
    "MEDIUM_RECTANGLE": kGADAdSizeMediumRectangle,
]

class BannerView: UIView, GADBannerViewDelegate {
    let LOG_TAG = "RNGoogleAdManager"
    var bannerView: DFPBannerView? = nil

    @objc var onAdLoaded: RCTDirectEventBlock?
    @objc var onAdFailedToLoad: RCTDirectEventBlock?
    
    @objc var adId: String? = nil {
        didSet {
            loadAdIfPropsSet()
        }
    }
    
    @objc var size: String? = nil {
        didSet {
            if(size != nil){
                loadAdIfPropsSet()
            }
        }
    }
    
    @objc var targeting: NSDictionary? = nil {
        didSet {
            loadAdIfPropsSet()
        }
    }
    
    @objc var testDeviceIds: Array<String>? = nil {
        didSet {
            loadAdIfPropsSet()
        }
    }
    
    @objc func loadBanner(){
        loadAdIfPropsSet()
    }
    
    @objc func destroyBanner(){
        destroyAdView()
    }
    
    func destroyAdView(){
        bannerView?.removeFromSuperview()
        self.removeReactSubview(bannerView)
    }

    func getGADAdSizeFromString(size: String) -> GADAdSize {
        return supportedAdSizesMap[size]!
    }
    
    func createAdView(){
        if(bannerView != nil){
            destroyAdView()
        }
        
        bannerView = DFPBannerView.init()
        
        let rootViewController = UIApplication.shared.delegate?.window??.rootViewController
        let adSize: GADAdSize = getGADAdSizeFromString(size: size!)
        
        bannerView?.rootViewController = rootViewController
        bannerView?.delegate = self
        bannerView?.translatesAutoresizingMaskIntoConstraints = false
        
        bannerView?.adUnitID = adId
        bannerView?.adSize = adSize

        self.addSubview(bannerView!)
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func loadAd(){
        let adRequest = DFPRequest()
        var dict: [AnyHashable: Any] = [:]
        
        for key in targeting!.allKeys {
            if key is String {
                dict[key as! String] = RCTConvert.nsString(targeting?[key])
            }
        }
        
        adRequest.customTargeting = dict
        adRequest.testDevices = testDeviceIds
        
        bannerView?.load(adRequest)
    }
    
    func loadAdIfPropsSet(){
        if(size != nil && adId != nil && targeting != nil && testDeviceIds != nil){
            createAdView()
            loadAd()
        }
    }
    
    func adViewDidReceiveAd(_ bannerView: GADBannerView) {
        onAdLoaded!([:])
        print("\(LOG_TAG): Ad loaded")
    }
    
    func adView(_ bannerView: GADBannerView, didFailToReceiveAdWithError error: GADRequestError) {
        onAdFailedToLoad!(["errorMessage": error.localizedDescription])
        print("\(LOG_TAG): Ad failed to load. Reason: \(error.localizedDescription)")
    }
}
