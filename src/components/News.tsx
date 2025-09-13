import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const News = () => {
  const newsItems = [
    {
      id: 1,
      date: '2024.01.15',
      title: '春の特別コースメニューのご案内',
      content: '旬の食材を使用した春限定のコースメニューを3月1日よりご提供いたします。'
    },
    {
      id: 2,
      date: '2024.01.10',
      title: 'ランチタイム営業時間変更のお知らせ',
      content: '2月より、ランチタイムの営業時間を11:30-15:30に変更いたします。'
    },
    {
      id: 3,
      date: '2024.01.05',
      title: '年始営業のご案内',
      content: '1月4日(木)より通常営業を開始いたします。本年もよろしくお願いいたします。'
    }
  ];

  return (
    <section id="news" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            News
          </h2>
          <div className="w-24 h-px bg-gradient-gold mx-auto mb-8"></div>
          <p className="font-noto text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            最新のお知らせ・イベント情報を<br />
            お届けいたします
          </p>
        </div>

        {/* News Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {newsItems.map((item) => (
            <Card key={item.id} className="border-gold/20 shadow-elegant bg-card hover:shadow-glow transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-gold text-sm font-medium mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-noto">{item.date}</span>
                </div>
                <CardTitle className="font-noto text-lg font-bold text-foreground leading-tight">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-noto text-muted-foreground text-sm leading-relaxed">
                  {item.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* More Button */}
        <div className="text-center">
          <Button asChild variant="outline" className="border-gold hover:bg-gold hover:text-white transition-smooth">
            <Link to="/news" className="flex items-center gap-2">
              <span className="font-noto">More</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default News;