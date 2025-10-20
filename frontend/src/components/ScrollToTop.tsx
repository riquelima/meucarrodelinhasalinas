import { ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full shadow-lg bg-gradient-to-br from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all"
    >
      <ArrowUp className="w-5 h-5 text-white" />
    </Button>
  );
}
