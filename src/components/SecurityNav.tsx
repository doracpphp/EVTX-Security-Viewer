import { useMemo } from 'react';
import {
  SECURITY_CATEGORIES, ALL_KNOWN_EVENT_IDS, UNCATEGORIZED,
  getCategoryEventIds, getSubcategoryEventIds, getUniqueSubcategoryEvents, getEventLabel, getEventDesc,
} from '../utils/securityCategories';
import { messages, type Lang } from '../utils/i18n';
import type { NormalizedEvent } from '../types/events';

interface Props {
  events: NormalizedEvent[];
  selectedCategory: string;
  selectedSubcategory: string | null;
  selectedEventId: number | null;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string | null) => void;
  onEventIdChange: (eventId: number | null) => void;
  lang: Lang;
}

export function SecurityNav({
  events,
  selectedCategory,
  selectedSubcategory,
  selectedEventId,
  onCategoryChange,
  onSubcategoryChange,
  onEventIdChange,
  lang,
}: Props) {
  const t = messages(lang);

  // Precompute event ID → count map
  const countByEventId = useMemo(() => {
    const map = new Map<number, number>();
    for (const e of events) {
      map.set(e.eventId, (map.get(e.eventId) ?? 0) + 1);
    }
    return map;
  }, [events]);

  // Event IDs present in the file that no category covers
  const uncategorizedIds = useMemo(
    () => [...countByEventId.keys()].filter(id => !ALL_KNOWN_EVENT_IDS.has(id)).sort((a, b) => a - b),
    [countByEventId],
  );
  const uncategorizedCount = uncategorizedIds.reduce((sum, id) => sum + (countByEventId.get(id) ?? 0), 0);

  function countForIds(ids: Iterable<number>): number {
    let total = 0;
    for (const id of ids) total += countByEventId.get(id) ?? 0;
    return total;
  }

  function eventIdTab(id: number) {
    const count = countByEventId.get(id) ?? 0;
    const label = lang === 'ja' ? getEventLabel(id) : null;
    return (
      <button
        key={id}
        className={`snav-tab snav-tab--evt${selectedEventId === id ? ' snav-tab--active' : ''}${count === 0 ? ' snav-tab--empty' : ''}`}
        title={getEventDesc(id, lang) ?? undefined}
        onClick={() => onEventIdChange(id)}
      >
        <span className="snav-tab__label">
          {id}
          {label && <span className="snav-tab__evt-label">{label}</span>}
        </span>
        <span className="snav-tab__count">{count.toLocaleString()}</span>
      </button>
    );
  }

  function allTab(className: string, active: boolean, count: number, onClick: () => void) {
    return (
      <button className={`snav-tab ${className}${active ? ' snav-tab--active' : ''}`} onClick={onClick}>
        <span className="snav-tab__label">{t.all}</span>
        <span className="snav-tab__count">{count.toLocaleString()}</span>
      </button>
    );
  }

  const currentCategory = SECURITY_CATEGORIES.find(c => c.name === selectedCategory);
  const currentSubcategoryEvents = selectedSubcategory
    ? getUniqueSubcategoryEvents(selectedCategory, selectedSubcategory)
    : [];

  return (
    <div className="security-nav">
      {/* Level 1: Categories */}
      <div className="security-nav__row security-nav__row--cat">
        {allTab('', selectedCategory === 'all', events.length, () => onCategoryChange('all'))}
        {SECURITY_CATEGORIES.map(cat => {
          const count = countForIds(getCategoryEventIds(cat.name));
          return (
            <button
              key={cat.name}
              className={`snav-tab${selectedCategory === cat.name ? ' snav-tab--active' : ''}${count === 0 ? ' snav-tab--empty' : ''}`}
              onClick={() => onCategoryChange(cat.name)}
            >
              <span className="snav-tab__label">{lang === 'en' ? cat.nameEn : cat.name}</span>
              <span className="snav-tab__count">{count.toLocaleString()}</span>
            </button>
          );
        })}
        {uncategorizedCount > 0 && (
          <button
            className={`snav-tab${selectedCategory === UNCATEGORIZED ? ' snav-tab--active' : ''}`}
            onClick={() => onCategoryChange(UNCATEGORIZED)}
          >
            <span className="snav-tab__label">{t.uncategorized}</span>
            <span className="snav-tab__count">{uncategorizedCount.toLocaleString()}</span>
          </button>
        )}
      </div>

      {/* Uncategorized: event IDs directly under the category */}
      {selectedCategory === UNCATEGORIZED && (
        <div className="security-nav__row security-nav__row--sub">
          {allTab('snav-tab--sub', selectedEventId === null, uncategorizedCount, () => onEventIdChange(null))}
          {uncategorizedIds.map(eventIdTab)}
        </div>
      )}

      {/* Level 2: Subcategories */}
      {currentCategory && (
        <div className="security-nav__row security-nav__row--sub">
          {allTab('snav-tab--sub', selectedSubcategory === null, countForIds(getCategoryEventIds(currentCategory.name)),
            () => onSubcategoryChange(null))}
          {currentCategory.subcategories.map(sub => {
            const count = countForIds(getSubcategoryEventIds(currentCategory.name, sub.name));
            return (
              <button
                key={sub.name}
                className={`snav-tab snav-tab--sub${selectedSubcategory === sub.name ? ' snav-tab--active' : ''}${count === 0 ? ' snav-tab--empty' : ''}`}
                onClick={() => onSubcategoryChange(sub.name)}
              >
                <span className="snav-tab__label">{lang === 'en' ? sub.nameEn : sub.name}</span>
                <span className="snav-tab__count">{count.toLocaleString()}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Level 3: Event IDs */}
      {selectedSubcategory && currentSubcategoryEvents.length > 0 && (
        <div className="security-nav__row security-nav__row--evt">
          {allTab('snav-tab--evt', selectedEventId === null,
            countForIds(getSubcategoryEventIds(selectedCategory, selectedSubcategory)), () => onEventIdChange(null))}
          {currentSubcategoryEvents.map(evtDef => eventIdTab(evtDef.id))}
        </div>
      )}
    </div>
  );
}
