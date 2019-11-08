require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-google-ad-manager"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-google-ad-manager
                   DESC
  s.homepage     = "https://gitlab.com/cmsw/react-native-google-ad-manager"
  s.license      = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "Callosum Software" => "oss@callosum-sw.de" }
  s.platforms    = { :ios => "9.0", :tvos => "10.0" }
  s.source       = { :git => "https://gitlab.com/cmsw/react-native-google-ad-manager.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency "Google-Mobile-Ads-SDK", "~> 7.51.0"
end
