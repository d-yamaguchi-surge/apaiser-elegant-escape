import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useCourses } from "@/modules/courses/hooks/useCourses";
import { useReservationAvailability } from "@/hooks/useReservationAvailability";
import { cn } from "@/lib/utils";
import { toLocalDateString } from "@/lib/dateUtils";

const ReservationPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedDateParam = searchParams.get("date");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    time: "",
    guests: "",
    requests: "",
  });
  const { toast } = useToast();
  const { courses } = useCourses();
  const { isAvailableForReservation, loading: availabilityLoading } =
    useReservationAvailability();

  useEffect(() => {
    if (!selectedDate && selectedDateParam && !availabilityLoading) {
      // Check if the date from URL is available for reservation (only initialize once)
      const dateObj = new Date(selectedDateParam);
      if (isAvailableForReservation(dateObj)) {
        setSelectedDate(selectedDateParam);
      } else {
        // If date is not available, clear it
        setSelectedDate("");
      }
    }
  }, [
    selectedDate,
    selectedDateParam,
    availabilityLoading,
    isAvailableForReservation,
  ]);

  useEffect(() => {
    // Set default course (table-only) when courses are loaded
    if (courses.length > 0 && !selectedCourse) {
      const tableOnlyCourse = courses.find((c) => c.name === "席のみ");
      if (tableOnlyCourse) {
        setSelectedCourse(tableOnlyCourse.id);
      }
    }
  }, [courses, selectedCourse]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("reservations").insert([
        {
          customer_name: `${formData.lastName} ${formData.firstName}`,
          customer_email: formData.email,
          customer_phone: formData.phone,
          reservation_date: selectedDate,
          reservation_time: formData.time,
          party_size: parseInt(formData.guests),
          special_requests: formData.requests || null,
          status: "pending",
          course_id: selectedCourse || null,
        },
      ]);

      if (error) throw error;

      toast({
        title: "ご予約ありがとうございます",
        description: "お送りいただいた内容を確認の上、改めてご連絡いたします。",
      });

      // Reset form and navigate to home
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        time: "",
        guests: "",
        requests: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast({
        title: "エラー",
        description: "予約の送信に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return format(date, "yyyy年M月d日 (EEEE)", { locale: ja });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
              Reservation Form
            </h1>
            <div className="w-24 h-px bg-gradient-gold mx-auto mb-8"></div>
            <p className="font-noto text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              ご予約内容を入力してください
            </p>
          </div>

          <div className="text-center">
            <Button
              asChild
              variant="outline"
              className="border-gold hover:bg-gold hover:text-white transition-smooth"
            >
              <Link to="/#reservation" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="font-noto">カレンダーに戻る</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Reservation Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-gold/20 shadow-elegant bg-card">
            <CardHeader>
              <CardTitle className="font-noto text-2xl font-bold text-foreground text-center">
                ご予約フォーム
              </CardTitle>
              {selectedDate && (
                <div className="text-center mt-4 p-4 bg-gold/10 rounded-lg">
                  <p className="font-noto text-sm text-muted-foreground mb-1">
                    ご予約希望日
                  </p>
                  <p className="font-playfair text-xl font-bold text-gold">
                    {formatDisplayDate(selectedDate)}
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="font-noto text-sm font-medium">
                    コース選択*
                  </Label>
                  <div className="space-y-2">
                    {courses.map((course) => (
                      <button
                        key={course.id}
                        type="button"
                        onClick={() => setSelectedCourse(course.id)}
                        className={`w-full flex items-start gap-4 p-3 rounded-lg border-2 transition-smooth text-left ${
                          selectedCourse === course.id
                            ? "bg-[#f5e6c8] border-gold"
                            : "bg-background border-border hover:border-gold/50"
                        }`}
                      >
                        <div className="flex-shrink-0 w-20 h-20 rounded overflow-hidden bg-muted">
                          {course.image_path ? (
                            <img
                              src={course.image_path}
                              alt={course.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-noto font-medium text-foreground mb-1">
                            {course.name}
                            {course.price > 0 && (
                              <span className="ml-2 text-gold">
                                ¥{course.price.toLocaleString()}
                              </span>
                            )}
                          </div>
                          {course.description && (
                            <p className="font-noto text-sm text-muted-foreground line-clamp-2">
                              {course.description}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

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
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
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
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
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
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
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
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-gold/30 hover:border-gold transition-smooth",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate
                            ? formatDisplayDate(selectedDate)
                            : "日付を選択"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            selectedDate ? new Date(selectedDate) : undefined
                          }
                          onSelect={(date) => {
                            if (date && isAvailableForReservation(date)) {
                              setSelectedDate(toLocalDateString(date));
                            }
                          }}
                          locale={ja}
                          disabled={(date) => !isAvailableForReservation(date)}
                          fromDate={new Date()}
                          toDate={
                            new Date(
                              new Date().setMonth(new Date().getMonth() + 3)
                            )
                          }
                          className="pointer-events-auto"
                          initialFocus
                          modifiers={{
                            selected: (date) =>
                              selectedDate
                                ? toLocalDateString(date) === selectedDate
                                : false,
                            today: () => false,
                          }}
                          modifiersStyles={{
                            selected: {
                              backgroundColor: "hsl(var(--gold))",
                              color: "white",
                              fontWeight: "bold",
                            },
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="time"
                      className="font-noto text-sm font-medium"
                    >
                      ご希望時間*
                    </Label>
                    <Select
                      value={formData.time}
                      onValueChange={(value) =>
                        handleInputChange("time", value)
                      }
                      required
                    >
                      <SelectTrigger className="border-gold/30 focus:border-gold transition-smooth">
                        <SelectValue placeholder="時間を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="11:30">11:30</SelectItem>
                        <SelectItem value="12:00">12:00</SelectItem>
                        <SelectItem value="12:30">12:30</SelectItem>
                        <SelectItem value="13:00">13:00</SelectItem>
                        <SelectItem value="13:30">13:30</SelectItem>
                        <SelectItem value="14:00">14:00</SelectItem>
                        <SelectItem value="17:00">17:00</SelectItem>
                        <SelectItem value="17:30">17:30</SelectItem>
                        <SelectItem value="18:00">18:00</SelectItem>
                        <SelectItem value="18:30">18:30</SelectItem>
                        <SelectItem value="19:00">19:00</SelectItem>
                        <SelectItem value="19:30">19:30</SelectItem>
                        <SelectItem value="20:00">20:00</SelectItem>
                        <SelectItem value="20:30">20:30</SelectItem>
                        <SelectItem value="21:00">21:00</SelectItem>
                        <SelectItem value="21:30">21:30</SelectItem>
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
                  <Select
                    value={formData.guests}
                    onValueChange={(value) =>
                      handleInputChange("guests", value)
                    }
                    required
                  >
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
                    value={formData.requests}
                    onChange={(e) =>
                      handleInputChange("requests", e.target.value)
                    }
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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReservationPage;
