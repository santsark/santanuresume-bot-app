import { Sidebar } from '@/components/Sidebar';
import { ChatInterface } from '@/components/ChatInterface';

export default function Home() {
  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans">
      <div className="hidden md:block h-full">
        <Sidebar />
      </div>
      <main className="flex-1 h-full relative">
        <ChatInterface />
      </main>
    </div>
  );
}
