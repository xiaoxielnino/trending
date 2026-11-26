export type TrendingRepo = {
  rank: number;
  owner: string;
  name: string;
  fullName: string;
  description: string;
  language: string | null;
  languageColor: string | null;
  stars: number;
  forks: number;
  starsToday: number | null;
  url: string;
  avatar: string;
  cloneUrl: string;
  readmeUrl: string;
  license: string | null;
  topics: string[];
  homepage: string | null;
};

export type TrendingData = {
  since: 'daily' | 'weekly' | 'monthly';
  fetchedAt: string;
  fetchedAtBeijing: string;
  repos: TrendingRepo[];
};

export type TimePeriod = 'daily' | 'weekly' | 'monthly';
