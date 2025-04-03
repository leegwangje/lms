import Header from './layout/header';
import Sidebar from './layout/sidebar';
import Footer from './layout/footer';
import './globals.css';

export default function RootLayout({ children }) {
    console.log(">> RootLayout ");

  return (
      <html lang="ko">
      <body>
        {children}
      </body>
      </html>
  );
}