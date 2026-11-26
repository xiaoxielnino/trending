import { useState, useEffect } from 'react';
import type { TrendingData, TrendingRepo, TimePeriod } from './types';
import RepoCard from './components/RepoCard';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import HowToUse from './components/HowToUse';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';
import './App.css';

function App() {
  const [data, setData] = useState<TrendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<TimePeriod>('daily');
  const [languageFilter, setLanguageFilter] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data/trending-${period}.json`);
        if (!response.ok) {
          throw new Error(`获取数据失败: ${response.status}`);
        }
        const jsonData: TrendingData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据时发生未知错误');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const languages = data?.repos
    ? [...new Set(data.repos.map(r => r.language).filter((l): l is string => l !== null))]
        .sort((a, b) => a.localeCompare(b))
    : [];

  const filteredRepos: TrendingRepo[] = data?.repos
    ? languageFilter
      ? data.repos.filter(r => r.language === languageFilter)
      : data.repos
    : [];

  const periodLabels: Record<TimePeriod, string> = {
    daily: '今日新增',
    weekly: '本周新增',
    monthly: '本月新增',
  };

  return (
    <div className="app">
      <Header />
      
      <main className="main">
        <HowToUse />
        
        <FilterBar
          period={period}
          onPeriodChange={setPeriod}
          languageFilter={languageFilter}
          onLanguageFilterChange={setLanguageFilter}
          languages={languages}
        />

        {data && (
          <div className="fetch-time">
            数据更新时间：{data.fetchedAtBeijing}
          </div>
        )}

        {loading && <LoadingState />}
        
        {error && <ErrorState message={error} onRetry={() => setPeriod(period)} />}
        
        {!loading && !error && filteredRepos.length === 0 && (
          <EmptyState 
            hasFilter={!!languageFilter} 
            onClearFilter={() => setLanguageFilter('')} 
          />
        )}
        
        {!loading && !error && filteredRepos.length > 0 && (
          <div className="repo-list">
            {filteredRepos.map((repo) => (
              <RepoCard 
                key={repo.fullName} 
                repo={repo} 
                starsLabel={periodLabels[period]}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>
          数据来源：<a href="https://github.com/trending" target="_blank" rel="noopener noreferrer">GitHub Trending</a>
        </p>
        <p>本站仅展示 GitHub 官方 Trending 页面的数据，不保证实时性。</p>
      </footer>
    </div>
  );
}

export default App;
