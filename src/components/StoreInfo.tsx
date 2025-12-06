import { Clock, MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const StoreInfo = () => {
  const storeDetails = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "アクセス",
      content: [
        "〒320-0827",
        "栃木県宇都宮市花房3-3-44",
        "東武宇都宮駅徒歩20分",
      ],
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "営業時間",
      content: [
        "ランチ 11:30〜15:00",
        "ディナー 17:00〜22:00",
      ],
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "お電話",
      content: ["028-666-6671", "※ご予約承ります"],
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "メール",
      content: ["info@restaurant-apaiser.com", "※お問い合わせはこちらから"],
    },
  ];

  return (
    <section id="info" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Store Information
          </h2>
          <div className="w-24 h-px bg-gradient-gold mx-auto mb-8"></div>
          <p className="font-noto text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            宇都宮の静寂な空間で、心安らぐひとときを
            <br />
            皆さまのお越しをお待ちしております
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Store Details */}
          <div className="space-y-6">
            {storeDetails.map((detail, index) => (
              <Card
                key={index}
                className="border-gold/20 shadow-elegant bg-card"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 text-gold">{detail.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-noto text-lg font-bold text-foreground mb-3">
                        {detail.title}
                      </h3>
                      <div className="space-y-1">
                        {detail.content.map((line, lineIndex) => (
                          <p
                            key={lineIndex}
                            className="font-noto text-sm text-muted-foreground"
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map Placeholder */}
          <div className="lg:pl-8">
            <Card className="border-gold/20 shadow-elegant bg-card h-full">
              <CardContent className="p-6 h-full">
                <h3 className="font-noto text-lg font-bold text-foreground mb-4">
                  アクセスマップ
                </h3>
                <div className="rounded-lg h-64 lg:h-80 overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d510.1506588181201!2d139.8772322399647!3d36.54794132440553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sja!2sjp!4v1759071488274!5m2!1sja!2sjp"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  />
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 rounded-full bg-gold mr-3"></div>
                    <span className="font-noto text-muted-foreground">
                      東武宇都宮駅
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 rounded-full bg-secondary mr-3"></div>
                    <span className="font-noto text-muted-foreground">
                      東武宇都宮駅から徒歩20分
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreInfo;
