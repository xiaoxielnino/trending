import type { TrendingRepo } from '../types';

interface RepoCardProps {
  repo: TrendingRepo;
  starsLabel: string;
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
}

function isSafeUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function RepoCard({ repo, starsLabel }: RepoCardProps) {
  return (
    <article className="repo-card">
      <div className="repo-header">
        <img
          src={repo.avatar}
          alt={`${repo.owner} avatar`}
          className="repo-avatar"
          loading="lazy"
        />
        <div className="repo-title">
          <h2>
            <a href={repo.url} target="_blank" rel="noopener noreferrer">
              <span className="repo-owner">{repo.owner}</span>
              <span className="repo-separator">/</span>
              <span className="repo-name">{repo.name}</span>
            </a>
          </h2>
          {repo.description && (
            <p className="repo-description">{repo.description}</p>
          )}
        </div>
      </div>

      <div className="repo-meta">
        {repo.language && (
          <span className="meta-item language">
            <span
              className="language-dot"
              style={{ backgroundColor: repo.languageColor || '#8b8b8b' }}
            />
            {repo.language}
          </span>
        )}
        
        <a
          href={`${repo.url}/stargazers`}
          target="_blank"
          rel="noopener noreferrer"
          className="meta-item stars"
        >
          <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
          </svg>
          {formatNumber(repo.stars)}
        </a>
        
        <a
          href={`${repo.url}/forks`}
          target="_blank"
          rel="noopener noreferrer"
          className="meta-item forks"
        >
          <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
          </svg>
          {formatNumber(repo.forks)}
        </a>

        {repo.starsToday !== null && (
          <span className="meta-item stars-today">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
            </svg>
            {starsLabel} +{formatNumber(repo.starsToday)}
          </span>
        )}

        {repo.license && (
          <span className="meta-item license">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M8.75.75V2h.985c.304 0 .603.08.867.231l1.29.736c.038.022.08.033.124.033h2.234a.75.75 0 0 1 0 1.5h-.427l2.111 4.692a.75.75 0 0 1-.154.838l-.53-.53.529.531-.001.002-.002.002-.006.006-.02.02a3.4 3.4 0 0 1-.093.082 3.618 3.618 0 0 1-.318.235 4.314 4.314 0 0 1-.937.457c-.78.278-1.906.481-3.277.481s-2.496-.203-3.277-.481a4.314 4.314 0 0 1-.937-.457 3.618 3.618 0 0 1-.318-.235 3.4 3.4 0 0 1-.093-.082l-.02-.02-.006-.006-.002-.002-.001-.001L5.5 9.75l-.529.529a.75.75 0 0 1-.154-.838L6.927 4.5H6.5a.75.75 0 0 1 0-1.5h2.234a.25.25 0 0 0 .124-.033l1.29-.736A1.75 1.75 0 0 1 11.015 2h.985V.75a.75.75 0 0 1 1.5 0Zm-5.904 10.5a1.5 1.5 0 0 0 1.5 1.5h6.308a1.5 1.5 0 0 0 1.5-1.5v-1a1.5 1.5 0 0 0-1.5-1.5H4.346a1.5 1.5 0 0 0-1.5 1.5v1Z" />
            </svg>
            {repo.license}
          </span>
        )}
      </div>

      {repo.topics && repo.topics.length > 0 && (
        <div className="repo-topics">
          {repo.topics.slice(0, 6).map((topic) => (
            <a
              key={topic}
              href={`https://github.com/topics/${topic}`}
              target="_blank"
              rel="noopener noreferrer"
              className="topic-tag"
            >
              {topic}
            </a>
          ))}
          {repo.topics.length > 6 && (
            <span className="topic-more">+{repo.topics.length - 6}</span>
          )}
        </div>
      )}

      <div className="repo-usage">
        <h3>怎么使用</h3>
        <div className="usage-content">
          <div className="usage-item">
            <span className="usage-label">克隆仓库</span>
            <code className="usage-code">git clone {repo.cloneUrl}</code>
          </div>
          <div className="usage-links">
            <a
              href={repo.readmeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="usage-link"
            >
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z" />
              </svg>
              查看 README
            </a>
            {isSafeUrl(repo.homepage) && (
              <a
                href={repo.homepage!}
                target="_blank"
                rel="noopener noreferrer"
                className="usage-link"
              >
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                  <path d="M7.775 3.275a.75.75 0 0 0 1.06 1.06l1.25-1.25a2 2 0 1 1 2.83 2.83l-2.5 2.5a2 2 0 0 1-2.83 0 .75.75 0 0 0-1.06 1.06 3.5 3.5 0 0 0 4.95 0l2.5-2.5a3.5 3.5 0 0 0-4.95-4.95l-1.25 1.25Zm-4.69 9.64a2 2 0 0 1 0-2.83l2.5-2.5a2 2 0 0 1 2.83 0 .75.75 0 0 0 1.06-1.06 3.5 3.5 0 0 0-4.95 0l-2.5 2.5a3.5 3.5 0 0 0 4.95 4.95l1.25-1.25a.75.75 0 0 0-1.06-1.06l-1.25 1.25a2 2 0 0 1-2.83 0Z" />
                </svg>
                项目主页
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
