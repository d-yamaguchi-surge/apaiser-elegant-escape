import heroImage from "@/assets/hero-image.jpg";
import heroImage2 from "@/assets/S__7856181_0.jpg";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage2}
          alt="apaiser restaurant interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="animate-fade-in-up">
          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold text-background mb-8 leading-tight">
            Apaiser
          </h1>

          {/* Main Catchphrase */}
          <p className="font-noto text-2xl md:text-4xl lg:text-5xl text-background/90 mb-12 leading-relaxed">
            一皿ごとに、誇りを込めて。
          </p>

          <div className="w-24 h-px bg-gradient-gold mx-auto mb-12 animate-gold-shimmer"></div>

          <p className="font-noto text-lg md:text-xl text-background/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            心を込めた料理と、静寂な空間で
            <br />
            特別なひとときをお過ごしください
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              variant="elegant"
              size="lg"
              onClick={() =>
                document
                  .getElementById("menu")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              メニューを見る
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-px h-16 bg-gradient-to-b from-gold to-transparent animate-gold-shimmer"></div>
      </div>
    </section>
  );
};

export default Hero;
