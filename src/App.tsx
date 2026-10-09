import { useState, useCallback, useMemo, useRef, useEffect, useDeferredValue } from 'react';
import { FileUpload } from './components/FileUpload';
import { ParseProgress } from './components/ParseProgress';
import { SecurityNav } from './components/SecurityNav';
import { EventTable } from './components/EventTable';
import { EventDetail } from './components/EventDetail';
import { FailureChart } from './components/FailureChart';
import { HelpDialog } from './components/HelpDialog';
import { ALL_KNOWN_EVENT_IDS, UNCATEGORIZED, getCategoryEventIds, getSubcategoryEventIds } from './utils/securityCategories';
import { matchesSearch } from './utils/eventSearch';
import { buildCsv, downloadCsv } from './utils/csvExport';
import { detectLang, saveLang, messages, type Lang } from './utils/i18n';
import type { NormalizedEvent, WorkerResponse } from './types/events';
import './App.css';

type AppState = 'idle' | 'parsing' | 'done' | 'error';

function isEvtxFile(file: File): boolean {
  return file.name.toLowerCase().endsWith('.evtx');
}

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
  const [skippedChunks, setSkippedChunks] = useState(0);
  const [showChart, setShowChart] = useState(true);
  const [hideSystemUsers, setHideSystemUsers] = useState(false);
  const [search, setSearch] = useState('');
  const [utc, setUtc] = useState(false);
  const [lang, setLang] = useState<Lang>(detectLang);
  const [showHelp, setShowHelp] = useState(() => {
    try {
      return !localStorage.getItem('evtx-help-seen');
    } catch {
      return true;
    }
  });
  const workerRef = useRef<Worker | null>(null);
  const collectedRef = useRef<NormalizedEvent[]>([]);
  const t = messages(lang);

  // Searching scans every event's data, so let typing stay responsive
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const handleFile = useCallback((file: File) => {
    workerRef.current?.terminate();
    collectedRef.current = [];
    setEvents([]);
    setProgress({ processed: 0, total: file.size });
    setSelectedCategory('all');
    setSelectedSubcategory(null);
    setSelectedEventId(null);
    setSelectedEvent(null);
    setErrorMsg('');
    setSkippedChunks(0);
    setFileName(file.name);
    setShowChart(true);
    setHideSystemUsers(false);
    setSearch('');
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
          // push(...arr) can overflow the call stack for large batches
          for (const ev of msg.events) collectedRef.current.push(ev);
          setEvents(collectedRef.current.slice());
          break;
        case 'done':
          setEvents(collectedRef.current.slice());
          setSkippedChunks(msg.skippedChunks);
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
      worker.terminate();
    };

    worker.postMessage({ type: 'parse', file });
  }, []);

  const openFile = useCallback((file: File) => {
    if (!isEvtxFile(file)) {
      alert(messages(lang).notEvtx);
      return;
    }
    handleFile(file);
  }, [handleFile, lang]);

  // Accept a dropped file anywhere on the page. Without this, dropping a file
  // outside the upload area (e.g. while viewing results) makes the browser
  // navigate away to the file and the loaded log is lost.
  useEffect(() => {
    function onDragOver(e: DragEvent) {
      if (e.dataTransfer?.types.includes('Files')) e.preventDefault();
    }
    function onDrop(e: DragEvent) {
      const file = e.dataTransfer?.files[0];
      if (!file) return;
      e.preventDefault();
      openFile(file);
    }
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('drop', onDrop);
    };
  }, [openFile]);

  // Events matching the navigation selection (before user/search filters)
  const navEvents = useMemo(() => {
    if (selectedEventId !== null) return events.filter(e => e.eventId === selectedEventId);
    if (selectedCategory === UNCATEGORIZED) return events.filter(e => !ALL_KNOWN_EVENT_IDS.has(e.eventId));
    const ids = selectedSubcategory !== null
      ? getSubcategoryEventIds(selectedCategory, selectedSubcategory)
      : selectedCategory !== 'all' ? getCategoryEventIds(selectedCategory) : null;
    return ids ? events.filter(e => ids.has(e.eventId)) : events;
  }, [events, selectedCategory, selectedSubcategory, selectedEventId]);

  const systemUserCount = useMemo(
    () => navEvents.reduce((n, e) => n + (e.isSystemUser ? 1 : 0), 0),
    [navEvents],
  );

  const query = deferredSearch.trim().toLowerCase();
  const filteredEvents = useMemo(() => {
    let result = navEvents;
    if (hideSystemUsers) result = result.filter(e => !e.isSystemUser);
    if (query) result = result.filter(e => matchesSearch(e, query, lang));
    return result;
  }, [navEvents, hideSystemUsers, query, lang]);

  const showLogonCols = selectedEventId === 4624 || selectedEventId === 4625;
  const showFailureChart = selectedEventId === 4625;

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setSelectedEventId(null);
    setShowChart(true);
  }, []);

  const handleSubcategoryChange = useCallback((subcategory: string | null) => {
    setSelectedSubcategory(subcategory);
    setSelectedEventId(null);
    setShowChart(true);
  }, []);

  const handleEventIdChange = useCallback((eventId: number | null) => {
    setSelectedEventId(eventId);
    setShowChart(true);
  }, []);

  const closeDetail = useCallback(() => setSelectedEvent(null), []);
  const closeHelp = useCallback(() => setShowHelp(false), []);

  function toggleLang() {
    const next: Lang = lang === 'ja' ? 'en' : 'ja';
    setLang(next);
    saveLang(next);
  }

  function handleExportCsv() {
    const base = fileName.replace(/\.evtx$/i, '') || 'events';
    const suffix = selectedEventId !== null ? `_${selectedEventId}` : '';
    downloadCsv(buildCsv(filteredEvents, lang, utc), `${base}${suffix}.csv`);
  }

  function renderControls() {
    return (
      <>
        <div className="filter-bar">
          <div className="filter-bar__group">
            <input
              type="search"
              className="filter-search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
            />
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={hideSystemUsers}
                onChange={e => setHideSystemUsers(e.target.checked)}
              />
              {t.hideSystem}
              <span className="filter-checkbox__count">({t.count(systemUserCount)})</span>
            </label>
            <label className="filter-checkbox">
              <input type="checkbox" checked={utc} onChange={e => setUtc(e.target.checked)} />
              {t.utc}
            </label>
          </div>
          <div className="filter-bar__group">
            {showFailureChart && (
              <button className="btn-toggle-table" onClick={() => setShowChart(v => !v)}>
                {showChart ? t.hideChart : t.showChartBtn}
              </button>
            )}
            <button
              className="btn-toggle-table"
              onClick={handleExportCsv}
              disabled={filteredEvents.length === 0}
            >
              {t.exportCsv}
            </button>
          </div>
        </div>
        {showFailureChart && showChart && <FailureChart events={filteredEvents} lang={lang} />}
      </>
    );
  }

  function renderTable() {
    // Remount on filter change so the list scrolls back to the top
    const filterKey = [selectedCategory, selectedSubcategory, selectedEventId, hideSystemUsers, query].join('|');
    return (
      <EventTable
        key={filterKey}
        events={filteredEvents}
        onRowClick={setSelectedEvent}
        showLogonCols={showLogonCols}
        lang={lang}
        utc={utc}
      />
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
          <button
            className="btn-lang"
            onClick={() => setShowHelp(true)}
            aria-label={t.showHelp}
            title={t.help}
          >
            ?
          </button>
          <button className="btn-lang" onClick={toggleLang}>
            {lang === 'ja' ? 'EN' : '日本語'}
          </button>
          {appState !== 'idle' && (
            <button className="btn-reset" onClick={handleReset}>
              {t.openAnother}
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {appState === 'idle' && (
          <div className="app-upload-wrap">
            <FileUpload onFile={openFile} lang={lang} />
          </div>
        )}

        {appState === 'parsing' && (
          <>
            <ParseProgress
              processed={progress.processed}
              total={progress.total}
              eventCount={events.length}
              fileName={fileName}
              lang={lang}
            />
            {events.length > 0 && (
              <div className="app-streaming">
                <SecurityNav {...navProps} />
                {renderControls()}
                {renderTable()}
              </div>
            )}
          </>
        )}

        {appState === 'done' && (
          <>
            <div className="app-done-banner">
              {t.loaded(fileName, events.length)}
              {skippedChunks > 0 && (
                <span className="app-done-banner__warn">{t.skippedChunks(skippedChunks)}</span>
              )}
            </div>
            <SecurityNav {...navProps} />
            {renderControls()}
            {renderTable()}
          </>
        )}

        {appState === 'error' && (
          <div className="app-error">
            <div className="app-error__title">{t.parseError}</div>
            <div className="app-error__msg">{errorMsg || t.workerError}</div>
            <button className="btn-reset" onClick={handleReset}>{t.retry}</button>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <a
          className="app-footer__link"
          href="https://frees.jp/contact/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.contact}
        </a>
        <span className="app-footer__sep" aria-hidden="true">·</span>
        <a
          className="app-footer__link"
          href="https://frees.booth.pm/items/8191447"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.book}
        </a>
        <span className="app-footer__copy">© frees.jp</span>
      </footer>

      {selectedEvent && (
        <EventDetail event={selectedEvent} onClose={closeDetail} lang={lang} utc={utc} />
      )}

      {showHelp && <HelpDialog lang={lang} onClose={closeHelp} />}
    </div>
  );
}
