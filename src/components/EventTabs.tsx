import { TABS } from '../utils/eventDefinitions';
import type { TabId, NormalizedEvent } from '../types/events';

interface Props {
  activeTab: TabId;
  events: NormalizedEvent[];
  onTabChange: (id: TabId) => void;
}

export function EventTabs({ activeTab, events, onTabChange }: Props) {
  function countForTab(tab: typeof TABS[0]): number {
    if (tab.id === 'all') return events.length;
    if (tab.id === 'other') {
      return events.filter(e => {
        const known = TABS.filter(t => t.eventId !== undefined).map(t => t.eventId!);
        return !known.includes(e.eventId);
      }).length;
    }
    return events.filter(e => e.eventId === tab.eventId).length;
  }

  return (
    <div className="event-tabs">
      {TABS.map(tab => {
        const count = countForTab(tab);
        return (
          <button
            key={tab.id}
            className={`event-tab${activeTab === tab.id ? ' event-tab--active' : ''}${count === 0 ? ' event-tab--empty' : ''}`}
            onClick={() => onTabChange(tab.id)}
            title={tab.description}
          >
            <span className="event-tab__label">{tab.label}</span>
            <span className="event-tab__count">{count.toLocaleString()}</span>
          </button>
        );
      })}
    </div>
  );
}
