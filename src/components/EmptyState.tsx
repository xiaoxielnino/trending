interface EmptyStateProps {
  hasFilter: boolean;
  onClearFilter: () => void;
}

export default function EmptyState({ hasFilter, onClearFilter }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <svg viewBox="0 0 16 16" width="48" height="48" fill="currentColor">
          <path d="M6.5 2.75V5a.75.75 0 0 0 1.5 0V1.5a.75.75 0 0 0-.75-.75h-3A.75.75 0 0 0 3.5 1.5v3c0 .414.336.75.75.75h1.5ZM4.252 1.5c.138 0 .25.112.25.25v2.5a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-3c0-.138.112-.25.25-.25h1.5Zm7.5 0c.138 0 .25.112.25.25v2.5a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-3c0-.138.112-.25.25-.25h1.5Zm.248 11.5a.75.75 0 0 0-.75-.75H7.75a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 .75-.75Zm0-3.5a.75.75 0 0 0-.75-.75H7.75a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 .75-.75Z" />
        </svg>
      </div>
      <h3>暂无数据</h3>
      {hasFilter ? (
        <>
          <p>没有找到符合筛选条件的仓库</p>
          <button className="clear-filter-btn" onClick={onClearFilter}>
            清除筛选
          </button>
        </>
      ) : (
        <p>当前没有热门仓库数据</p>
      )}
    </div>
  );
}
