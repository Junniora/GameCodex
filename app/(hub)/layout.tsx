// app/(hub)/layout.tsx
import Navbar from '@/components/layout/Navbar';

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      {/* pt-14 para navbar fija, extra en mobile por doble barra */}
      <main className="pt-24 md:pt-16 pb-8">
        {children}
      </main>
    </div>
  );
}
