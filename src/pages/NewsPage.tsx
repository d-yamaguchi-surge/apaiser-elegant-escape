import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NewsPage = () => {
  const allNews = [
    {
      id: 1,
      date: '2024.01.15',
      title: '春の特別コースメニューのご案内',
      content: '旬の食材を使用した春限定のコースメニューを3月1日よりご提供いたします。桜の季節にふさわしい、華やかで繊細な味わいをお楽しみください。',
      category: 'メニュー'
    },
    {
      id: 2,
      date: '2024.01.10',
      title: 'ランチタイム営業時間変更のお知らせ',
      content: '2月より、ランチタイムの営業時間を11:30-15:30に変更いたします。より多くのお客様にごゆっくりとお食事をお楽しみいただくための変更です。',
      category: '営業時間'
    },
    {
      id: 3,
      date: '2024.01.05',
      title: '年始営業のご案内',
      content: '1月4日(木)より通常営業を開始いたします。本年もより一層、心を込めたお料理とサービスでお客様をお迎えいたします。',
      category: 'お知らせ'
    },
    {
      id: 4,
      date: '2023.12.25',
      title: 'クリスマス限定メニュー販売終了',
      content: 'ご好評いただいておりましたクリスマス限定メニューは12月25日をもって販売終了いたします。たくさんのご注文をいただき、ありがとうございました。',
      category: 'メニュー'
    },
    {
      id: 5,
      date: '2023.12.20',
      title: '年末年始休業のお知らせ',
      content: '12月30日(土)から1月3日(水)まで年末年始休業とさせていただきます。1月4日(木)より通常営業いたします。',
      category: 'お知らせ'
    },
    {
      id: 6,
      date: '2023.12.15',
      title: 'ワインペアリングコースのご案内',
      content: 'ソムリエが厳選したワインとお料理のマリアージュをお楽しみいただける特別コースをご用意いたします。事前予約制となります。',
      category: 'メニュー'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
              News & Information
            </h1>
            <div className="w-24 h-px bg-gradient-gold mx-auto mb-8"></div>
            <p className="font-noto text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              apaiserの最新情報・お知らせを<br />
              ご確認いただけます
            </p>
          </div>
          
          <div className="text-center">
            <Button asChild variant="outline" className="border-gold hover:bg-gold hover:text-white transition-smooth">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="font-noto">トップページに戻る</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* News List */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {allNews.map((item) => (
              <Card key={item.id} className="border-gold/20 shadow-elegant bg-card hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                    <div className="flex items-center gap-2 text-gold text-sm font-medium">
                      <Calendar className="w-4 h-4" />
                      <span className="font-noto">{item.date}</span>
                    </div>
                    <div className="px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-medium">
                      {item.category}
                    </div>
                  </div>
                  <CardTitle className="font-noto text-xl font-bold text-foreground leading-tight">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-noto text-muted-foreground leading-relaxed">
                    {item.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NewsPage;