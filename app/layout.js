import "./globals.css";

export const metadata = {
  title: "Todo List",
  description: "Add your daily routine tasks.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        cz-shortcut-listen="true"
      >
        {children}
      </body>
    </html>
  );
}
