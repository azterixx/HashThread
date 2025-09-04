import "./globals.css";
import { NavBar } from "../components/NavBar";
import { Inter } from "next/font/google";
import { TanstackProvider } from "./providers/tanstack-provider";
import { Bounce, ToastContainer } from "react-toastify";
import { Metadata } from "next";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    template: "HashThread · %s",
    absolute: "HashThread",
  },
  icons: {
    icon: "/LogoIcon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Instantiate QueryClient on the client-side

  return (
    <html lang="en" className={inter.variable}>
      <body className={"antialiased"}>
        <TanstackProvider>
          <NavBar />
          {children}
        </TanstackProvider>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          theme="dark"
          transition={Bounce}
        />
      </body>
    </html>
  );
}
