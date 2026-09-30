import HeroSection from '@/components/home/HeroSection';
import FeatureCards from '@/components/home/FeatureCards';
import ActionCards from '@/components/home/ActionCards';

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <HeroSection />

      {/* Decorative wave divider */}
      <div className="w-full overflow-hidden leading-none" aria-hidden="true">
        <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10">
          <path d="M0 20 Q360 40 720 20 Q1080 0 1440 20 L1440 40 L0 40 Z" fill="rgb(238 242 255)" />
        </svg>
      </div>

      {/* Feature cards on a light indigo tint */}
      <div className="bg-indigo-50/40">
        <FeatureCards />
      </div>

      <ActionCards />

      {/* Footer */}
      <footer
        className="border-t border-gray-100 bg-gradient-to-b from-white to-indigo-50/30 py-12 px-6 text-center"
        role="contentinfo"
      >
        <div className="max-w-md mx-auto">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm shadow-indigo-200 mx-auto mb-4">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-500 mb-3">
            Built for students, teachers, and anyone who needs accessible
            information in classrooms, meetings, and lectures.
          </p>
          <a
            href="/sessions"
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
          >
            View saved sessions →
          </a>
        </div>
      </footer>
    </div>
  );
}
