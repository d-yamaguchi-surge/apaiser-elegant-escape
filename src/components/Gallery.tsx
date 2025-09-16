import { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import dish1 from '@/assets/dish-1.jpg';
import dish2 from '@/assets/dish-2.jpg';
import dish3 from '@/assets/dish-3.jpg';
import heroImage from '@/assets/hero-image.jpg';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryImages = [
    {
      id: 1,
      src: heroImage,
      alt: '店内の様子',
      category: '店内'
    },
    {
      id: 2,
      src: dish1,
      alt: 'シェフ特製コース',
      category: '料理'
    },
    {
      id: 3,
      src: dish2,
      alt: 'トリュフパスタ',
      category: '料理'
    },
    {
      id: 4,
      src: dish3,
      alt: '季節のデザート',
      category: '料理'
    }
  ];

  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Gallery
          </h2>
          <div className="w-24 h-px bg-gradient-gold mx-auto mb-8"></div>
          <p className="font-noto text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            美しい料理と落ち着いた空間<br />
            apaiserlの魅力をご覧ください
          </p>
        </div>

        {/* Gallery Carousel */}
        <div className="relative max-w-5xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {galleryImages.map((image) => (
                <CarouselItem key={image.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div
                    className="group relative overflow-hidden cursor-pointer shadow-elegant hover:shadow-gold transition-smooth rounded-lg"
                    onClick={() => setSelectedImage(image.src)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-smooth"
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-smooth"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary/80 to-transparent rounded-b-lg">
                      <span className="bg-gold text-primary px-2 py-1 text-xs font-noto font-medium rounded">
                        {image.category}
                      </span>
                      <p className="text-background text-sm font-noto mt-2">
                        {image.alt}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-background/80 border-gold/20 hover:bg-gold hover:text-background" />
            <CarouselNext className="right-4 bg-background/80 border-gold/20 hover:bg-gold hover:text-background" />
          </Carousel>

          {/* Thumbnail Navigation for Desktop */}
          <div className="hidden md:flex justify-center mt-8 space-x-4">
            {galleryImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image.src)}
                className="group relative w-20 h-16 rounded-lg overflow-hidden border-2 border-gold/20 hover:border-gold transition-smooth"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-smooth"></div>
              </button>
            ))}
          </div>
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-primary/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <img
                src={selectedImage}
                alt="Gallery image"
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-background text-2xl hover:text-gold transition-smooth"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Instagram Link */}
        <div className="text-center mt-12">
          <p className="font-noto text-muted-foreground mb-4">
            より多くの写真は公式SNSでご覧いただけます
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="https://instagram.com/apaiser_kyoto"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-gold hover:text-gold-muted transition-smooth"
            >
              <span className="font-playfair">Instagram</span>
              <div className="w-4 h-px bg-gold"></div>
            </a>
            <a
              href="https://twitter.com/apaiser_kyoto"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-gold hover:text-gold-muted transition-smooth"
            >
              <span className="font-playfair">X (Twitter)</span>
              <div className="w-4 h-px bg-gold"></div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;