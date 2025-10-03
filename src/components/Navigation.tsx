import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/apaiser_logo.svg";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

type NavItem = { name: string; to: string };

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // NOTE:
  // ホーム先頭へ確実にスクロールさせるため、トップの先頭に <div id="home" /> などのアンカーを用意しておくと安定します。
  // 例：pages/Index.tsx の最上部に <div id="home" /> を置く。
  const navItems: NavItem[] = [
    { name: "ホーム", to: "/#home" }, // ← 先頭アンカーに移動
    { name: "メニュー", to: "/#menu" }, // ← トップ内セクション
    { name: "店舗情報", to: "/#info" }, // ← トップ内セクション
    { name: "予約", to: "/#reservation" }, // ← 別ページ（フォーム）
    { name: "ギャラリー", to: "/#gallery" }, // ← トップ内セクション
  ];

  const renderNavItem = (item: NavItem) => {
    const isHash = item.to.includes("#");

    // トップ内セクション → HashLink（スムーズスクロール & ハッシュ遷移）
    if (isHash) {
      return (
        <HashLink
          key={item.name}
          smooth
          to={item.to}
          className="font-playfair text-sm text-foreground hover:text-gold transition-smooth px-3 py-2 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
          onClick={() => setIsMenuOpen(false)}
        >
          {item.name}
        </HashLink>
      );
    }

    // 通常ルート（予約フォームなど） → Link
    return (
      <Link
        key={item.name}
        to={item.to}
        className="font-playfair text-sm text-foreground hover:text-gold transition-smooth px-3 py-2 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
        onClick={() => setIsMenuOpen(false)}
      >
        {item.name}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background border-b border-gold shadow-elegant">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            {/* ロゴクリックでトップ先頭へ（/ へ移動後、/#home の HashLinkで確実に動くのでここは / でOK） */}
            <Link to="/">
              <img
                src={logo}
                alt="apaiser logo"
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map(renderNavItem)}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground hover:text-gold transition-smooth"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-b border-gold">
            {navItems.map(renderNavItem)}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
