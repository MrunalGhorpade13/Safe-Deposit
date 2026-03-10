"use client";

import dynamic from "next/dynamic";
const Navbar = dynamic(() => import("@/components/Navbar").then(mod => mod.Navbar), { ssr: false });
const Dashboard = dynamic(() => import("@/components/Dashboard").then(mod => mod.Dashboard), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard />
      </main>
    </div>
  );
}
