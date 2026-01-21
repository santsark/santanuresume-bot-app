import Link from 'next/link';
import { User, Mail, Linkedin, FileText, Github } from 'lucide-react';

export function Sidebar() {
    return (
        <aside className="w-full md:w-80 bg-neutral-900 border-r border-neutral-800 flex flex-col h-full shrink-0">
            <div className="p-6 border-b border-neutral-800">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mb-4 mx-auto flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-500/20">
                    SS
                </div>
                <h1 className="text-xl font-bold text-white text-center">Santanu Sarkar</h1>
                <p className="text-xs text-neutral-400 text-center mt-1 px-4">Business Technology Strategy & Risk Management</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="space-y-4">
                    <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">About</h2>
                    <p className="text-sm text-neutral-300 leading-relaxed">
                        Operational Excellence leader with expertise in strategy development, business process assessment, program management, and technology implementation. Outstanding track record of guiding multidisciplinary teams to achieve business goals.
                    </p>
                </div>

                <div className="space-y-2">
                    <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Contact & Links</h2>
                    <nav className="space-y-1">
                        <Link
                            href="https://www.linkedin.com/in/santanu-sarkar-20306921"
                            target="_blank"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                        >
                            <Linkedin size={18} />
                            <span>LinkedIn</span>
                        </Link>
                        <Link
                            href="#"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                        >
                            <Github size={18} />
                            <span>GitHub</span>
                        </Link>
                        <Link
                            href="mailto:sarkar.santanu@outlook.com"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                        >
                            <Mail size={18} />
                            <span>Email Me</span>
                        </Link>
                        <Link
                            href="#"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                        >
                            <FileText size={18} />
                            <span>Resume</span>
                        </Link>
                    </nav>
                </div>
            </div>

            <div className="p-4 border-t border-neutral-800">
                <div className="text-xs text-neutral-500 text-center">
                    &copy; {new Date().getFullYear()} Santanu Sarkar
                </div>
            </div>
        </aside>
    );
}
