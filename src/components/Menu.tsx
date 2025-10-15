import dish1 from "@/assets/dish1.png";
import dish2 from "@/assets/dish2.png";
import dish3 from "@/assets/dish3.png";
import { Card, CardContent } from "@/components/ui/card";

const Menu = () => {
  const menuItems = [
    {
      id: 1,
      name: "シェフ特製コース",
      nameEn: "Chef's Special Course",
      description:
        "季節の食材を活かした、シェフ渾身の特別コース。前菜からデザートまで、心を込めてお作りします。",
      price: "¥5,000~¥10,000",
      image: dish1,
      category: "コース",
    },
    {
      id: 2,
      name: "ボロネーゼ",
      nameEn: "Bolognese",
      description: (
        <>
          国産和牛100％を2日かけて煮込んだ、贅沢なボロネーゼ。
          <br />
          コクのあるソースが生フェットチーネに絡み、豊かな香りと旨みが広がります。
        </>
      ),
      price: "¥1,400",
      image: dish2,
      category: "パスタ",
    },
    {
      id: 3,
      name: "季節のデザート",
      nameEn: "Seasonal Dessert",
      description:
        "その時期の最高の素材で作る、芸術的なデザート。見た目にも美しい一品です。",
      price: "¥800",
      image: dish3,
      category: "デザート",
    },
  ];

  return (
    <section id="menu" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Menu
          </h2>
          <div className="w-24 h-px bg-gradient-gold mx-auto mb-8"></div>
          <p className="font-noto text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            厳選された食材と、熟練の技術で作り上げる
            <br />
            特別な料理の数々をご紹介いたします
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <Card
              key={item.id}
              className="group overflow-hidden shadow-elegant hover:shadow-gold transition-smooth border-0 bg-card"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-smooth"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-gold text-primary px-3 py-1 text-sm font-noto font-medium">
                    {item.category}
                  </span>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-noto text-xl font-bold text-foreground mb-1">
                    {item.name}
                  </h3>
                  <p className="font-playfair text-sm text-gold italic">
                    {item.nameEn}
                  </p>
                </div>

                <p className="font-noto text-sm text-muted-foreground leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="flex justify-between items-center">
                  <span className="font-playfair text-2xl font-bold text-gold">
                    {item.price}
                  </span>
                  <div className="w-8 h-px bg-gold"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full Menu Link */}
        <div className="text-center mt-12">
          <p className="font-noto text-muted-foreground mb-4">
            より詳細なメニューは店舗にてご確認ください
          </p>
          <div className="inline-block border-b border-gold pb-1">
            <a
              href="#reservation"
              className="font-playfair text-gold hover:text-gold-muted transition-smooth"
            >
              ご予約・お問い合わせ
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menu;
