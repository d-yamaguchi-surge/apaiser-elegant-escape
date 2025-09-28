import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNews } from '@/modules/news/hooks/useNews';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

const News = () => {
  const { news, loading } = useNews();
  
  // Get latest 3 news items
  const latestNews = news.slice(0, 3);

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
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {latestNews.length > 0 ? (
              latestNews.map((item) => (
                <Card key={item.id} className="border-gold/20 shadow-elegant bg-card hover:shadow-glow transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 text-gold text-sm font-medium mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="font-noto">
                        {format(new Date(item.published_date), 'yyyy.MM.dd', { locale: ja })}
                      </span>
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
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="font-noto text-muted-foreground">
                  現在お知らせはありません
                </p>
              </div>
            )}
          </div>
        )}

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