import './globals.css';
import ThemeSwitcher from './components/ThemeSwitcher';

export const metadata = {
  title: 'App Reportar Ai',
  description: 'Data Analysis Platform with AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeSwitcher />
        {children}
      </body>
    </html>
  );
}
