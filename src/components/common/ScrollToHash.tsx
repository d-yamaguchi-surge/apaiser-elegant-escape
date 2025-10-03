import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    // 描画が安定するタイミングまで少し待つ
    const t = setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) {
        // scroll-padding-top が効くので offset 計算は不要
        (el as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 120);

    return () => clearTimeout(t);
  }, [pathname, hash]);

  return null;
}
