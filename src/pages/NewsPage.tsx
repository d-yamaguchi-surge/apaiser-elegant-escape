import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useNews } from "@/modules/news/hooks/useNews";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

const NewsPage = () => {
  const { news, loading } = useNews();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
              News
            </h1>
            <div className="w-24 h-px bg-gradient-gold mx-auto mb-8"></div>
            <p className="font-noto text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Apaiserの最新情報・お知らせを
              <br />
              ご確認いただけます
            </p>
          </div>

          <div className="text-center">
            <Button
              asChild
              variant="outline"
              className="border-gold hover:bg-gold hover:text-white transition-smooth"
            >
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
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="space-y-8">
              {news.length > 0 ? (
                news.map((item) => (
                  <Card
                    key={item.id}
                    className="border-gold/20 shadow-elegant bg-card hover:shadow-glow transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                        <div className="flex items-center gap-2 text-gold text-sm font-medium">
                          <Calendar className="w-4 h-4" />
                          <span className="font-noto">
                            {format(
                              new Date(item.published_date),
                              "yyyy.MM.dd",
                              { locale: ja }
                            )}
                          </span>
                        </div>
                        <div className="px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-medium">
                          お知らせ
                        </div>
                      </div>
                      <CardTitle className="font-noto text-xl font-bold text-foreground leading-tight">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-noto text-muted-foreground leading-relaxed whitespace-pre-line">
                        {item.content}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="font-noto text-muted-foreground">
                    現在お知らせはありません
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NewsPage;
