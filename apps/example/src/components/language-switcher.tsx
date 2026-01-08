"use client";

import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === "ko" ? "en" : "ko";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      title={locale === "ko" ? "Switch to English" : "한국어로 전환"}
    >
      <Globe className="h-5 w-5" />
      <span className="sr-only">{locale === "ko" ? "Switch to English" : "한국어로 전환"}</span>
    </Button>
  );
}
