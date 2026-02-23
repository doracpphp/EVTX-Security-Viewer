import { useState, useCallback, useMemo, useRef } from 'react';
import { FileUpload } from './components/FileUpload';
import { ParseProgress } from './components/ParseProgress';
import { EventTabs } from './components/EventTabs';
import { EventTable } from './components/EventTable';
import { EventDetail } from './components/EventDetail';
import { FailureChart } from './components/FailureChart';
import { TABS } from './utils/eventDefinitions';
import type { NormalizedEvent, TabId, WorkerResponse } from './types/events';
import './App.css';

type AppState = 'idle' | 'parsing' | 'done' | 'error';

export default function App() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [events, setEvents] = useState<NormalizedEvent[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [selectedEvent, setSelectedEvent] = useState<NormalizedEvent | null>(null);
  const [progress, setProgress] = useState({ processed: 0, total: 0 });
  const [fileName, setFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showChart, setShowChart] = useState(true);
  const workerRef = useRef<Worker | null>(null);
  const collectedRef = useRef<NormalizedEvent[]>([]);

  const handleFile = useCallback((file: File) => {
    workerRef.current?.terminate();
    collectedRef.current = [];
    setEvents([]);
    setProgress({ processed: 0, total: 0 });
    setActiveTab('all');
    setSelectedEvent(null);
    setErrorMsg('');
    setFileName(file.name);
    setShowChart(true);
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

  function handleTabChange(id: TabId) {
    setActiveTab(id);
    setShowChart(true);
  }

  const filteredEvents = useMemo(() => {
    if (activeTab === 'all') return events;
    if (activeTab === 'other') {
      const knownIds = TABS.filter(t => t.eventId !== undefined).map(t => t.eventId!);
      return events.filter(e => !knownIds.includes(e.eventId));
    }
    const tab = TABS.find(t => t.id === activeTab);
    if (!tab?.eventId) return events;
    return events.filter(e => e.eventId === tab.eventId);
  }, [events, activeTab]);

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

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">EVTX Security Viewer</h1>
        {appState !== 'idle' && (
          <button className="btn-reset" onClick={handleReset}>
            別のファイルを開く
          </button>
        )}
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
                <EventTabs activeTab={activeTab} events={events} onTabChange={handleTabChange} />
                {activeTab === '4625' && (
                  <div className="table-toolbar">
                    <button className="btn-toggle-table" onClick={() => setShowChart(v => !v)}>
                      {showChart ? '▲ グラフを隠す' : '▼ グラフを表示'}
                    </button>
                  </div>
                )}
                {activeTab === '4625' && showChart && <FailureChart events={filteredEvents} />}
                <EventTable events={filteredEvents} onRowClick={setSelectedEvent} showLogonCols={activeTab === '4624' || activeTab === '4625'} />
              </div>
            )}
          </>
        )}

        {appState === 'done' && (
          <>
            <div className="app-done-banner">
              ✓ {fileName} — {events.length.toLocaleString()} 件読み込み完了
            </div>
            <EventTabs activeTab={activeTab} events={events} onTabChange={handleTabChange} />
            {activeTab === '4625' && (
              <div className="table-toolbar">
                <button className="btn-toggle-table" onClick={() => setShowChart(v => !v)}>
                  {showChart ? '▲ グラフを隠す' : '▼ グラフを表示'}
                </button>
              </div>
            )}
            {activeTab === '4625' && showChart && <FailureChart events={filteredEvents} />}
            <EventTable events={filteredEvents} onRowClick={setSelectedEvent} showLogonCols={activeTab === '4624' || activeTab === '4625'} />
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
        <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
