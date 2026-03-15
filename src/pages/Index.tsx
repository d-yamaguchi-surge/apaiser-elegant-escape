import heroImage from "@/assets/S__7856181_0.jpg";

const Index = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="apaiser"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <p className="text-white text-xl md:text-2xl lg:text-3xl font-noto leading-relaxed mb-8">
          当サイトは終了しました
        </p>
        <p className="text-white text-base md:text-lg font-noto mb-2">
          切り替わらない方はこちら
        </p>
        <a
          href="https://sites.google.com/view/cafe-restaurant-apaiser/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white underline text-sm md:text-base break-all hover:text-white/80 transition-colors"
        >
          https://sites.google.com/view/cafe-restaurant-apaiser/
        </a>
      </div>
    </div>
  );
};

export default Index;
