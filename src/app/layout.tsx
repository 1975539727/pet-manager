import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Cinzel } from "next/font/google";
import Navbar from "@/components/Navbar";
import { GlobalStyles } from "@/styles/GlobalStyles";
import StyledComponentsRegistry from "@/components/StyledComponentsRegistry";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  style: ["normal", "italic"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "爪爪管家 - 传承品质的宠物管理平台",
  description: "为您的爱宠提供全方位的管理服务",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${dmSans.variable} ${playfairDisplay.variable} ${cinzel.variable}`}
      >
        <StyledComponentsRegistry>
          <GlobalStyles />
          <Navbar />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
