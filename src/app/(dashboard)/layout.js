

import Header from '@/app/layout/header';
import Sidebar from '@/app/layout/sidebar';
import Footer from '@/app/layout/footer';
import '../globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
    <body>
    <div>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1 }}>{children}</main>
      </div>
      <Footer />
    </div>
    </body>
    </html>
  );
}
