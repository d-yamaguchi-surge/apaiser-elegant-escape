import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Reservation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "ご予約ありがとうございます",
      description: "お送りいただいた内容を確認の上、改めてご連絡いたします。",
    });

    setIsSubmitting(false);
  };

  return (
    <section
      id="reservation"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Reservation
          </h2>
          <div className="w-24 h-px bg-gradient-gold mx-auto mb-8"></div>
          <p className="font-noto text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            特別な時間をお過ごしいただくため
            <br />
            事前のご予約をおすすめしております
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Reservation Form */}
          <Card className="border-gold/20 shadow-elegant bg-card">
            <CardHeader>
              <CardTitle className="font-noto text-xl font-bold text-foreground text-center">
                ご予約フォーム
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="font-noto text-sm font-medium"
                    >
                      お名前（姓）*
                    </Label>
                    <Input
                      id="lastName"
                      required
                      className="border-gold/30 focus:border-gold transition-smooth"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="font-noto text-sm font-medium"
                    >
                      お名前（名）*
                    </Label>
                    <Input
                      id="firstName"
                      required
                      className="border-gold/30 focus:border-gold transition-smooth"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="font-noto text-sm font-medium"
                  >
                    お電話番号*
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    className="border-gold/30 focus:border-gold transition-smooth"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="font-noto text-sm font-medium"
                  >
                    メールアドレス*
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    className="border-gold/30 focus:border-gold transition-smooth"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="date"
                      className="font-noto text-sm font-medium"
                    >
                      ご希望日*
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      required
                      className="border-gold/30 focus:border-gold transition-smooth"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="time"
                      className="font-noto text-sm font-medium"
                    >
                      ご希望時間*
                    </Label>
                    <Select required>
                      <SelectTrigger className="border-gold/30 focus:border-gold transition-smooth">
                        <SelectValue placeholder="時間を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="11:30">11:30</SelectItem>
                        <SelectItem value="12:00">12:00</SelectItem>
                        <SelectItem value="12:30">12:30</SelectItem>
                        <SelectItem value="17:30">17:30</SelectItem>
                        <SelectItem value="18:00">18:00</SelectItem>
                        <SelectItem value="18:30">18:30</SelectItem>
                        <SelectItem value="19:00">19:00</SelectItem>
                        <SelectItem value="19:30">19:30</SelectItem>
                        <SelectItem value="20:00">20:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="guests"
                    className="font-noto text-sm font-medium"
                  >
                    人数*
                  </Label>
                  <Select required>
                    <SelectTrigger className="border-gold/30 focus:border-gold transition-smooth">
                      <SelectValue placeholder="人数を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1名</SelectItem>
                      <SelectItem value="2">2名</SelectItem>
                      <SelectItem value="3">3名</SelectItem>
                      <SelectItem value="4">4名</SelectItem>
                      <SelectItem value="5">5名</SelectItem>
                      <SelectItem value="6">6名以上</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="requests"
                    className="font-noto text-sm font-medium"
                  >
                    ご要望・アレルギー等
                  </Label>
                  <Textarea
                    id="requests"
                    placeholder="お誕生日のお祝い、アレルギー情報など、ご要望がございましたらお書きください"
                    className="border-gold/30 focus:border-gold transition-smooth resize-none h-24"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="gold"
                  className="w-full py-3"
                >
                  {isSubmitting ? "送信中..." : "ご予約を送信"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="border-gold/20 shadow-elegant bg-card">
              <CardHeader>
                <CardTitle className="font-noto text-xl font-bold text-foreground text-center">
                  お電話でのご予約
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <p className="font-playfair text-3xl font-bold text-gold mb-2">
                    028-666-6671
                  </p>
                  <p className="font-noto text-sm text-muted-foreground">
                    営業時間内にお電話ください
                  </p>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground font-noto">
                  <p>11:00〜22:00</p>
                  {/* <p>定休日：火曜日</p> */}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gold/20 shadow-elegant bg-card">
              <CardContent className="p-6">
                <h3 className="font-noto text-lg font-bold text-foreground mb-4 text-center">
                  ご予約について
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground font-noto">
                  <p>• 2名様以上でのご予約を承っております</p>
                  <p>• コース料理は前日までのご予約をお願いいたします</p>
                  <p>• キャンセルは当日12時まで承ります</p>
                  <p>• 特別なお日にちのご相談も承ります</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservation;
