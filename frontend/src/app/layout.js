import "../styles/globals.css";

export const metadata = {
  title: "Incident Tracker",
  description: "Lab 3 - Incident Tracker"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="container">
          <header className="header">
            <h1>Incident Tracker</h1>
            <nav className="nav">
              <a href="/">Home</a>
              <a href="/incidents">Dashboard</a>
              <a href="/incidents/new">Create</a>
              <a href="/incidents/bulk-upload">Bulk Upload</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
