import { MapPin, Phone, Mail, Clock, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="font-playfair text-3xl font-bold text-gradient-gold mb-4">
              apaiser
            </h3>
            <p className="font-noto text-background/80 leading-relaxed mb-6 max-w-md">
              一皿ごとに、誇りを込めて。<br />
              心を込めた料理と静寂な空間で、特別なひとときをお過ごしください。
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/apaiser_kyoto"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/60 hover:text-gold transition-smooth"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://twitter.com/apaiser_kyoto"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/60 hover:text-gold transition-smooth"
              >
                <Twitter size={24} />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-noto text-lg font-bold mb-4 text-gold">
              お問い合わせ
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 mt-1 text-gold flex-shrink-0" />
                <div>
                  <p className="font-noto text-sm text-background/80">
                    075-123-4567
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 mt-1 text-gold flex-shrink-0" />
                <div>
                  <p className="font-noto text-sm text-background/80">
                    info@apaiser.jp
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-1 text-gold flex-shrink-0" />
                <div>
                  <p className="font-noto text-sm text-background/80">
                    〒602-8566<br />
                    栃木県宇都宮市花房<br />
                    烏丸通今出川上ル
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-noto text-lg font-bold mb-4 text-gold">
              営業時間
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 mt-1 text-gold flex-shrink-0" />
                <div>
                  <p className="font-noto text-sm text-background/80">
                    ランチ<br />
                    11:30〜15:00 (L.O. 14:30)
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 mt-1 text-gold flex-shrink-0" />
                <div>
                  <p className="font-noto text-sm text-background/80">
                    ディナー<br />
                    17:30〜22:00 (L.O. 21:30)
                  </p>
                </div>
              </div>
              <p className="font-noto text-sm text-background/60">
                定休日：火曜日
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="border-t border-background/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="font-noto text-sm text-background/60">
              © 2024 apaiser. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#home" className="font-noto text-sm text-background/60 hover:text-gold transition-smooth">
                ホーム
              </a>
              <a href="#menu" className="font-noto text-sm text-background/60 hover:text-gold transition-smooth">
                メニュー
              </a>
              <a href="#reservation" className="font-noto text-sm text-background/60 hover:text-gold transition-smooth">
                予約
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;