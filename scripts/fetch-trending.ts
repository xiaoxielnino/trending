import * as fs from 'fs';
import * as path from 'path';

interface TrendingRepo {
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
}

interface TrendingData {
  since: 'daily' | 'weekly' | 'monthly';
  fetchedAt: string;
  fetchedAtBeijing: string;
  repos: TrendingRepo[];
}

const LANGUAGE_COLORS: Record<string, string> = {
  'Python': '#3572A5',
  'JavaScript': '#f1e05a',
  'TypeScript': '#3178c6',
  'Java': '#b07219',
  'C++': '#f34b7d',
  'C': '#555555',
  'Go': '#00ADD8',
  'Rust': '#dea584',
  'Ruby': '#701516',
  'PHP': '#4F5D95',
  'Swift': '#F05138',
  'Kotlin': '#A97BFF',
  'Shell': '#89e051',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'Vue': '#41b883',
  'Dart': '#00B4AB',
  'Scala': '#c22d40',
  'R': '#198CE7',
  'Lua': '#000080',
  'Perl': '#0298c3',
  'Haskell': '#5e5086',
  'Clojure': '#db5855',
  'Elixir': '#6e4a7e',
  'Objective-C': '#438eff',
  'C#': '#178600',
  'Jupyter Notebook': '#DA5B0B',
  'SCSS': '#c6538c',
  'Dockerfile': '#384d54',
  'Makefile': '#427819',
  'TeX': '#3D6117',
  'Vim Script': '#199f4b',
  'PowerShell': '#012456',
  'Groovy': '#4298b8',
  'Julia': '#a270ba',
  'OCaml': '#3be133',
  'Nix': '#7e7eff',
  'Zig': '#ec915c',
};

function parseNumber(str: string): number {
  if (!str) return 0;
  const cleaned = str.replace(/,/g, '').trim();
  if (cleaned.includes('k')) {
    return Math.round(parseFloat(cleaned.replace('k', '')) * 1000);
  }
  return parseInt(cleaned, 10) || 0;
}

async function fetchGitHubRepoInfo(fullName: string): Promise<{ license: string | null; topics: string[]; homepage: string | null }> {
  try {
    const response = await fetch(`https://api.github.com/repos/${fullName}`, {
      headers: {
        'User-Agent': 'GitHub-Trending-Viewer/1.0',
        'Accept': 'application/vnd.github.v3+json',
      }
    });
    
    if (!response.ok) {
      console.log(`  API rate limited or error for ${fullName}: ${response.status}`);
      return { license: null, topics: [], homepage: null };
    }
    
    const data = await response.json();
    return {
      license: data.license?.spdx_id || data.license?.name || null,
      topics: data.topics || [],
      homepage: data.homepage || null,
    };
  } catch (error) {
    console.log(`  Failed to fetch API info for ${fullName}:`, error);
    return { license: null, topics: [], homepage: null };
  }
}

async function fetchTrending(since: 'daily' | 'weekly' | 'monthly'): Promise<TrendingRepo[]> {
  const url = `https://github.com/trending?since=${since}`;
  
  console.log(`Fetching ${url}...`);
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  
  const html = await response.text();
  const repos: TrendingRepo[] = [];
  
  const articleRegex = /<article[^>]*class="[^"]*Box-row[^"]*"[^>]*>([\s\S]*?)<\/article>/g;
  let match;
  let rank = 0;
  
  while ((match = articleRegex.exec(html)) !== null) {
    const article = match[1];
    
    const repoLinkMatch = article.match(/<h2[^>]*>[\s\S]*?<a[^>]*href="\/([^/]+)\/([^/"]+)"[^>]*>/);
    if (!repoLinkMatch) continue;
    
    const owner = repoLinkMatch[1];
    const name = repoLinkMatch[2];
    
    if (owner === 'sponsors' || owner === 'login' || owner === 'signup' || owner === 'settings') continue;
    
    rank++;
    const fullName = `${owner}/${name}`;
    
    const descMatch = article.match(/<p[^>]*class="[^"]*col-9[^"]*"[^>]*>([\s\S]*?)<\/p>/);
    let description = descMatch 
      ? descMatch[1]
          .replace(/<[^>]*>/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/\s+/g, ' ')
          .trim()
      : '';
    
    const langMatch = article.match(/itemprop="programmingLanguage"[^>]*>([^<]+)</);
    const language = langMatch ? langMatch[1].trim() : null;
    
    const langColorMatch = article.match(/class="repo-language-color"[^>]*style="background-color:\s*([^"]+)"/);
    const languageColor = langColorMatch 
      ? langColorMatch[1].trim() 
      : (language ? LANGUAGE_COLORS[language] || '#8b8b8b' : null);
    
    const starsMatch = article.match(/href="\/[^/]+\/[^/]+\/stargazers"[^>]*>[\s\S]*?<\/svg>\s*([\d,]+)/);
    const stars = starsMatch ? parseNumber(starsMatch[1]) : 0;
    
    const forksMatch = article.match(/href="\/[^/]+\/[^/]+\/forks"[^>]*>[\s\S]*?<\/svg>\s*([\d,]+)/);
    const forks = forksMatch ? parseNumber(forksMatch[1]) : 0;
    
    let starsToday: number | null = null;
    const starsTodayMatch = article.match(/([\d,]+)\s*stars?\s*today/i);
    if (starsTodayMatch) {
      starsToday = parseNumber(starsTodayMatch[1]);
    } else {
      const starsWeekMatch = article.match(/([\d,]+)\s*stars?\s*this\s*week/i);
      if (starsWeekMatch) {
        starsToday = parseNumber(starsWeekMatch[1]);
      } else {
        const starsMonthMatch = article.match(/([\d,]+)\s*stars?\s*this\s*month/i);
        if (starsMonthMatch) {
          starsToday = parseNumber(starsMonthMatch[1]);
        }
      }
    }
    
    const avatar = `https://github.com/${owner}.png`;
    const repoUrl = `https://github.com/${fullName}`;
    const cloneUrl = `https://github.com/${fullName}.git`;
    const readmeUrl = `https://github.com/${fullName}#readme`;
    
    repos.push({
      rank,
      owner,
      name,
      fullName,
      description,
      language,
      languageColor,
      stars,
      forks,
      starsToday,
      url: repoUrl,
      avatar,
      cloneUrl,
      readmeUrl,
      license: null,
      topics: [],
      homepage: null,
    });
  }
  
  console.log(`Found ${repos.length} repos from trending page`);
  
  console.log('Fetching additional info from GitHub API (respecting rate limits)...');
  for (let i = 0; i < Math.min(repos.length, 25); i++) {
    const repo = repos[i];
    console.log(`  Fetching info for ${repo.fullName}...`);
    const apiInfo = await fetchGitHubRepoInfo(repo.fullName);
    repo.license = apiInfo.license;
    repo.topics = apiInfo.topics;
    repo.homepage = apiInfo.homepage;
    
    if (i < repos.length - 1 && i < 24) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return repos;
}

async function main() {
  const outputDir = path.join(process.cwd(), 'public', 'data');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const now = new Date();
  const beijingOffset = 8 * 60 * 60 * 1000;
  const beijingTime = new Date(now.getTime() + beijingOffset);
  const fetchedAt = now.toISOString();
  const fetchedAtBeijing = beijingTime.toISOString().replace('T', ' ').substring(0, 19) + ' (北京时间)';
  
  const periods: Array<'daily' | 'weekly' | 'monthly'> = ['daily', 'weekly', 'monthly'];
  
  for (const since of periods) {
    try {
      const repos = await fetchTrending(since);
      
      const data: TrendingData = {
        since,
        fetchedAt,
        fetchedAtBeijing,
        repos
      };
      
      const filename = `trending-${since}.json`;
      const filepath = path.join(outputDir, filename);
      
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`Saved ${repos.length} repos to ${filename}`);
    } catch (error) {
      console.error(`Failed to fetch ${since} trending:`, error);
      
      const filename = `trending-${since}.json`;
      const filepath = path.join(outputDir, filename);
      if (fs.existsSync(filepath)) {
        console.log(`Keeping existing cache for ${since}`);
      }
    }
  }
  
  console.log('Done!');
}

main();
