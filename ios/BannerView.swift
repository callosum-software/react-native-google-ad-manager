import GoogleMobileAds
import UIKit

let supportedAdSizesMap: Dictionary = [
    "BANNER": kGADAdSizeBanner,
    "MEDIUM_RECTANGLE": kGADAdSizeMediumRectangle,
]

class BannerView: UIView, GADBannerViewDelegate {
    let LOG_TAG = "RNGoogleAdManager"
    var bannerView: DFPBannerView = DFPBannerView.init()

    @objc var onAdLoaded: RCTDirectEventBlock?
    @objc var onAdFailedToLoad: RCTDirectEventBlock?
    
    func getGADAdSizeFromString(size: String) -> GADAdSize {
        return supportedAdSizesMap[size]!
    }
    
    @objc var adId: String? = nil {
        didSet {
            bannerView.adUnitID = adId
            loadAdIfPropsSet()
        }
    }
    
    @objc var size: String? = nil {
        didSet {
            if(size != nil){
                let adSize: GADAdSize = getGADAdSizeFromString(size: size!)
                bannerView.adSize = adSize
                loadAdIfPropsSet()
            }
        }
    }
    
    @objc var testDeviceIds: Array<String>? = nil {
        didSet {
            loadAdIfPropsSet()
        }
    }
    
    func createBannerView(){
        let rootViewController = UIApplication.shared.delegate?.window??.rootViewController
        
        bannerView.rootViewController = rootViewController
        bannerView.delegate = self
        bannerView.translatesAutoresizingMaskIntoConstraints = false
        self.addSubview(bannerView)
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
        createBannerView()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func loadAdIfPropsSet(){
        if(size != nil && adId != nil && testDeviceIds != nil){
            let adRequest = DFPRequest()
            adRequest.testDevices = testDeviceIds

            bannerView.load(adRequest)
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
