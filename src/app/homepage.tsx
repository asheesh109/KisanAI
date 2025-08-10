import HeroBanner from "@/components/HeroBanner";
import FeatureCards from "@/components/FeatureCards";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner with Government Schemes */}
      <HeroBanner />
      
      {/* Feature Cards */}
      <FeatureCards />
      
      {/* About Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              KisanAI के बारे में
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              KisanAI भारतीय किसानों के लिए एक व्यापक डिजिटल प्लेटफॉर्म है जो AI और ML 
              तकनीक का उपयोग करके खेती में सुधार, मौसम की जानकारी, बाजार भाव, 
              और सरकारी योजनाओं की जानकारी प्रदान करता है।
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-farming-100 dark:bg-farming-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌾</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">AI-आधारित सलाह</h3>
              <p className="text-muted-foreground">
                आर्टिफिशियल इंटेलिजेंस की मदद से आपको सबसे अच्छी खेती की सलाह मिलती है
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-sky-100 dark:bg-sky-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌦️</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">मौसम पूर्वानुमान</h3>
              <p className="text-muted-foreground">
                15 दिन तक का सटीक मौसम पूर्वानुमान और कृषि संबंधी चेतावनी
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">सरकारी योजनाएं</h3>
              <p className="text-muted-foreground">
                सभी केंद्रीय और राज्य सरकार की योजनाओं की जानकारी और आवेदन
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
