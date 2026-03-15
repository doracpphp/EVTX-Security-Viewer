import { useState, useCallback, useMemo, useRef } from 'react';
import { FileUpload } from './components/FileUpload';
import { ParseProgress } from './components/ParseProgress';
import { SecurityNav } from './components/SecurityNav';
import { EventTable } from './components/EventTable';
import { EventDetail } from './components/EventDetail';
import { FailureChart } from './components/FailureChart';
import { getCategoryEventIds, getSubcategoryEventIds } from './utils/securityCategories';
import type { NormalizedEvent, WorkerResponse } from './types/events';
import './App.css';

type AppState = 'idle' | 'parsing' | 'done' | 'error';

export default function App() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [events, setEvents] = useState<NormalizedEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<NormalizedEvent | null>(null);
  const [progress, setProgress] = useState({ processed: 0, total: 0 });
  const [fileName, setFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showChart, setShowChart] = useState(true);
  const [hideSystemUsers, setHideSystemUsers] = useState(false);
  const [lang, setLang] = useState<'ja' | 'en'>('ja');
  const workerRef = useRef<Worker | null>(null);
  const collectedRef = useRef<NormalizedEvent[]>([]);

  const handleFile = useCallback((file: File) => {
    workerRef.current?.terminate();
    collectedRef.current = [];
    setEvents([]);
    setProgress({ processed: 0, total: 0 });
    setSelectedCategory('all');
    setSelectedSubcategory(null);
    setSelectedEventId(null);
    setSelectedEvent(null);
    setErrorMsg('');
    setFileName(file.name);
    setShowChart(true);
    setHideSystemUsers(false);
    setAppState('parsing');

    const worker = new Worker(
      new URL('./workers/evtxParser.worker.ts', import.meta.url),
      { type: 'module' }
    );
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const msg = e.data;
      switch (msg.type) {
        case 'progress':
          setProgress({ processed: msg.processed, total: msg.total });
          break;
        case 'events':
          collectedRef.current.push(...msg.events);
          setEvents([...collectedRef.current]);
          break;
        case 'done':
          setEvents([...collectedRef.current]);
          setAppState('done');
          worker.terminate();
          break;
        case 'error':
          setErrorMsg(msg.message);
          setAppState('error');
          worker.terminate();
          break;
      }
    };

    worker.onerror = (err) => {
      setErrorMsg(err.message);
      setAppState('error');
    };

    worker.postMessage({ type: 'parse', file });
  }, []);

  const filteredEvents = useMemo(() => {
    let result = events;
    if (selectedEventId !== null) {
      result = result.filter(e => e.eventId === selectedEventId);
    } else if (selectedSubcategory !== null) {
      const ids = getSubcategoryEventIds(selectedCategory, selectedSubcategory);
      result = result.filter(e => ids.has(e.eventId));
    } else if (selectedCategory !== 'all') {
      const ids = getCategoryEventIds(selectedCategory);
      result = result.filter(e => ids.has(e.eventId));
    }
    if (hideSystemUsers) result = result.filter(e => !e.isSystemUser);
    return result;
  }, [events, selectedCategory, selectedSubcategory, selectedEventId, hideSystemUsers]);

  const systemUserCount = useMemo(
    () => events.filter(e => e.isSystemUser).length,
    [events],
  );

  const showLogonCols = selectedEventId === 4624 || selectedEventId === 4625;
  const showFailureChart = selectedEventId === 4625;

  function handleCategoryChange(category: string) {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setSelectedEventId(null);
    setShowChart(true);
  }

  function handleSubcategoryChange(subcategory: string | null) {
    setSelectedSubcategory(subcategory);
    setSelectedEventId(null);
    setShowChart(true);
  }

  function handleEventIdChange(eventId: number | null) {
    setSelectedEventId(eventId);
    setShowChart(true);
  }

  function renderControls() {
    return (
      <>
        <div className="filter-bar">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={hideSystemUsers}
              onChange={e => setHideSystemUsers(e.target.checked)}
            />
            システムユーザーを非表示
            <span className="filter-checkbox__count">({systemUserCount.toLocaleString()} 件)</span>
          </label>
          {showFailureChart && (
            <button className="btn-toggle-table" onClick={() => setShowChart(v => !v)}>
              {showChart ? '▲ グラフを隠す' : '▼ グラフを表示'}
            </button>
          )}
        </div>
        {showFailureChart && showChart && <FailureChart events={filteredEvents} />}
      </>
    );
  }

  function handleReset() {
    workerRef.current?.terminate();
    collectedRef.current = [];
    setAppState('idle');
    setEvents([]);
    setProgress({ processed: 0, total: 0 });
    setFileName('');
    setErrorMsg('');
    setSelectedEvent(null);
  }

  const navProps = {
    events,
    selectedCategory,
    selectedSubcategory,
    selectedEventId,
    onCategoryChange: handleCategoryChange,
    onSubcategoryChange: handleSubcategoryChange,
    onEventIdChange: handleEventIdChange,
    lang,
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">EVTX Security Viewer</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn-lang" onClick={() => setLang(l => l === 'ja' ? 'en' : 'ja')}>
            {lang === 'ja' ? 'EN' : '日本語'}
          </button>
          {appState !== 'idle' && (
            <button className="btn-reset" onClick={handleReset}>
              別のファイルを開く
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {appState === 'idle' && (
          <div className="app-upload-wrap">
            <FileUpload onFile={handleFile} />
          </div>
        )}

        {appState === 'parsing' && (
          <>
            <ParseProgress
              processed={progress.processed}
              total={progress.total}
              eventCount={events.length}
              fileName={fileName}
            />
            {events.length > 0 && (
              <div className="app-streaming">
                <SecurityNav {...navProps} />
                {renderControls()}
                <EventTable events={filteredEvents} onRowClick={setSelectedEvent} showLogonCols={showLogonCols} />
              </div>
            )}
          </>
        )}

        {appState === 'done' && (
          <>
            <div className="app-done-banner">
              ✓ {fileName} — {events.length.toLocaleString()} 件読み込み完了
            </div>
            <SecurityNav {...navProps} />
            {renderControls()}
            <EventTable events={filteredEvents} onRowClick={setSelectedEvent} showLogonCols={showLogonCols} />
          </>
        )}

        {appState === 'error' && (
          <div className="app-error">
            <div className="app-error__title">パースエラー</div>
            <div className="app-error__msg">{errorMsg}</div>
            <button className="btn-reset" onClick={handleReset}>やり直す</button>
          </div>
        )}
      </main>

      {selectedEvent && (
        <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} lang={lang} />
      )}
    </div>
  );
}
