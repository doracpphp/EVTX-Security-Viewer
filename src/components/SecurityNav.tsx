import { useMemo } from 'react';
import { SECURITY_CATEGORIES, getCategoryEventIds, getSubcategoryEventIds, getUniqueSubcategoryEvents } from '../utils/securityCategories';
import type { NormalizedEvent } from '../types/events';

interface Props {
  events: NormalizedEvent[];
  selectedCategory: string;
  selectedSubcategory: string | null;
  selectedEventId: number | null;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string | null) => void;
  onEventIdChange: (eventId: number | null) => void;
  lang: 'ja' | 'en';
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
  // Precompute event ID → count map
  const countByEventId = useMemo(() => {
    const map = new Map<number, number>();
    for (const e of events) {
      map.set(e.eventId, (map.get(e.eventId) ?? 0) + 1);
    }
    return map;
  }, [events]);

  function countForIds(ids: Set<number>): number {
    let total = 0;
    for (const id of ids) total += countByEventId.get(id) ?? 0;
    return total;
  }

  const currentCategory = SECURITY_CATEGORIES.find(c => c.name === selectedCategory);
  const currentSubcategoryEvents = selectedSubcategory
    ? getUniqueSubcategoryEvents(selectedCategory, selectedSubcategory)
    : [];

  return (
    <div className="security-nav">
      {/* Level 1: Categories */}
      <div className="security-nav__row security-nav__row--cat">
        <button
          className={`snav-tab${selectedCategory === 'all' ? ' snav-tab--active' : ''}`}
          onClick={() => { onCategoryChange('all'); onSubcategoryChange(null); onEventIdChange(null); }}
        >
          <span className="snav-tab__label">すべて</span>
          <span className="snav-tab__count">{events.length.toLocaleString()}</span>
        </button>
        {SECURITY_CATEGORIES.map(cat => {
          const ids = getCategoryEventIds(cat.name);
          const count = countForIds(ids);
          return (
            <button
              key={cat.name}
              className={`snav-tab${selectedCategory === cat.name ? ' snav-tab--active' : ''}${count === 0 ? ' snav-tab--empty' : ''}`}
              onClick={() => { onCategoryChange(cat.name); onSubcategoryChange(null); onEventIdChange(null); }}
            >
              <span className="snav-tab__label">{lang === 'en' ? cat.nameEn : cat.name}</span>
              <span className="snav-tab__count">{count.toLocaleString()}</span>
            </button>
          );
        })}
      </div>

      {/* Level 2: Subcategories */}
      {currentCategory && (
        <div className="security-nav__row security-nav__row--sub">
          <button
            className={`snav-tab snav-tab--sub${selectedSubcategory === null ? ' snav-tab--active' : ''}`}
            onClick={() => { onSubcategoryChange(null); onEventIdChange(null); }}
          >
            <span className="snav-tab__label">すべて</span>
            <span className="snav-tab__count">{countForIds(getCategoryEventIds(currentCategory.name)).toLocaleString()}</span>
          </button>
          {currentCategory.subcategories.map(sub => {
            const ids = getSubcategoryEventIds(currentCategory.name, sub.name);
            const count = countForIds(ids);
            return (
              <button
                key={sub.name}
                className={`snav-tab snav-tab--sub${selectedSubcategory === sub.name ? ' snav-tab--active' : ''}${count === 0 ? ' snav-tab--empty' : ''}`}
                onClick={() => { onSubcategoryChange(sub.name); onEventIdChange(null); }}
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
          <button
            className={`snav-tab snav-tab--evt${selectedEventId === null ? ' snav-tab--active' : ''}`}
            onClick={() => onEventIdChange(null)}
          >
            <span className="snav-tab__label">すべて</span>
            <span className="snav-tab__count">{countForIds(getSubcategoryEventIds(selectedCategory, selectedSubcategory)).toLocaleString()}</span>
          </button>
          {currentSubcategoryEvents.map(evtDef => {
            const count = countByEventId.get(evtDef.id) ?? 0;
            return (
              <button
                key={evtDef.id}
                className={`snav-tab snav-tab--evt${selectedEventId === evtDef.id ? ' snav-tab--active' : ''}${count === 0 ? ' snav-tab--empty' : ''}`}
                title={evtDef.desc}
                onClick={() => onEventIdChange(evtDef.id)}
              >
                <span className="snav-tab__label">{evtDef.id}</span>
                <span className="snav-tab__count">{count.toLocaleString()}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
