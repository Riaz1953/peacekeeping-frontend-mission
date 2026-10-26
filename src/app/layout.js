import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
