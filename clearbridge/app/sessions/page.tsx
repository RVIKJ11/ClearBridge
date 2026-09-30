'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/app-store';
import { getModeLabel } from '@/lib/mode-adapter';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import type { SessionData } from '@/types';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDuration(ms?: number): string {
  if (!ms) return '';
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}m ${secs}s`;
}

export default function SavedSessionsPage() {
  const router = useRouter();
  const { savedSessions, loadSession, deleteSavedSession, largeText } = useAppStore();

  function handleOpen(session: SessionData) {
    loadSession(session);
    router.push('/results');
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className={`font-semibold text-gray-900 mb-1 ${
              largeText ? 'text-3xl' : 'text-2xl'
            }`}
          >
            Saved Sessions
          </h1>
          <p className={`text-gray-500 ${largeText ? 'text-lg' : 'text-base'}`}>
            {savedSessions.length === 0
              ? 'No sessions saved yet'
              : `${savedSessions.length} session${savedSessions.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push('/')}>
          Home
        </Button>
      </div>

      {savedSessions.length === 0 ? (
        <Card variant="default" className="text-center py-16">
          <p className={`text-gray-500 mb-6 ${largeText ? 'text-lg' : 'text-base'}`}>
            Sessions you save will appear here.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="primary" onClick={() => router.push('/session')}>
              Start Live Session
            </Button>
          </div>
        </Card>
      ) : (
        <ul className="space-y-3" role="list" aria-label="Saved sessions">
          {savedSessions.map((session) => (
            <li key={session.id}>
              <Card variant="elevated" className="hover:border-gray-200 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-gray-900 truncate ${largeText ? 'text-lg' : 'text-base'}`}>
                      {session.title}
                    </p>
                    <p className={`text-gray-400 ${largeText ? 'text-base' : 'text-sm'}`}>
                      {formatDate(session.timestamp)}
                      {session.duration && (
                        <span className="ml-2">{formatDuration(session.duration)}</span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <Badge variant={session.accessibilityMode as 'hearing' | 'vision' | 'dual'}>
                        {getModeLabel(session.accessibilityMode)}
                      </Badge>
                      <Badge variant="default">
                        {session.inputType === 'live' ? 'Live' : 'Upload'}
                      </Badge>
                      {session.results.keyPoints.length > 0 && (
                        <Badge variant="info">{session.results.keyPoints.length} points</Badge>
                      )}
                      {session.results.actionItems.length > 0 && (
                        <Badge variant="success">{session.results.actionItems.length} actions</Badge>
                      )}
                      {session.results.glossary && session.results.glossary.length > 0 && (
                        <Badge variant="default">{session.results.glossary.length} terms</Badge>
                      )}
                      {session.bookmarks && session.bookmarks.length > 0 && (
                        <Badge variant="default">{session.bookmarks.length} bookmarks</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpen(session)}
                      aria-label={`Open: ${session.title}`}
                    >
                      Open
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSavedSession(session.id)}
                      aria-label={`Delete: ${session.title}`}
                      className="text-gray-400 hover:text-red-500"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                {session.results.summary && (
                  <p className={`mt-3 pt-3 border-t border-gray-50 text-gray-500 line-clamp-2 ${largeText ? 'text-base' : 'text-sm'}`}>
                    {session.results.summary}
                  </p>
                )}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
