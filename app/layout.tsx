import type { Metadata, Viewport } from "next";
import { Anuphan, Fraunces } from "next/font/google";
import "./globals.css";

const anuphan = Anuphan({ subsets: ["thai", "latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-anuphan" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "Paw Diary — บันทึกใจกับน้อง",
  description: "บันทึกอารมณ์ประจำวันกับสัตว์เลี้ยง แล้วสังเกตรูปแบบของคุณเอง",
};
export const viewport: Viewport = { themeColor: "#F2EADB" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${anuphan.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
