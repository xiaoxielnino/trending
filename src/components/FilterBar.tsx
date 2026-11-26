import type { TimePeriod } from '../types';

interface FilterBarProps {
  period: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  languageFilter: string;
  onLanguageFilterChange: (language: string) => void;
  languages: string[];
}

export default function FilterBar({
  period,
  onPeriodChange,
  languageFilter,
  onLanguageFilterChange,
  languages,
}: FilterBarProps) {
  const periods: { value: TimePeriod; label: string }[] = [
    { value: 'daily', label: '今日' },
    { value: 'weekly', label: '本周' },
    { value: 'monthly', label: '本月' },
  ];

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label className="filter-label">时间范围</label>
        <div className="period-buttons">
          {periods.map(({ value, label }) => (
            <button
              key={value}
              className={`period-btn ${period === value ? 'active' : ''}`}
              onClick={() => onPeriodChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">编程语言</label>
        <select
          className="language-select"
          value={languageFilter}
          onChange={(e) => onLanguageFilterChange(e.target.value)}
        >
          <option value="">全部语言</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
