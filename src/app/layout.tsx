import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import { GlobalStyles } from "@/styles/GlobalStyles";
import StyledComponentsRegistry from "@/components/StyledComponentsRegistry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "爪爪管家 - 专业的宠物管理平台",
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
        className={`${geistSans.variable} ${geistMono.variable}`}
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
