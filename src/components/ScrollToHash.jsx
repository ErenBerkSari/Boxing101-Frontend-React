import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // hash başındaki # işaretini kaldır
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        // Smooth scroll yap
        el.scrollIntoView({ behavior: "smooth" });
        
        // Scroll animasyonu tamamlandıktan sonra custom event tetikle
        const handleScrollEnd = () => {
          // Scroll animasyonu tamamlandığında custom event tetikle
          window.dispatchEvent(new CustomEvent('hashScrollComplete', {
            detail: { targetId: id }
          }));
        };

        // Smooth scroll için timeout kullan (yaklaşık animasyon süresi)
        const scrollTimeout = setTimeout(handleScrollEnd, 800);
        
        return () => clearTimeout(scrollTimeout);
      }
    }
  }, [hash]);

  return null;
}
