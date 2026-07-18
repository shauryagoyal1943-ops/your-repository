import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNotifications, useMarkNotificationsRead } from '../lib/hooks'
import { Avatar } from '../components/Avatar'
import { Spinner } from '../components/Loaders'
import { timeAgo } from '../lib/api'

const TYPE_LABELS: Record<string, string> = {
  like: 'liked your post',
  comment: 'commented on your post',
  follow: 'started following you',
}

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications()
  const markRead = useMarkNotificationsRead()

  useEffect(() => {
    if (data && data.some((n) => !n.read)) {
      const t = setTimeout(() => markRead.mutate(), 1500)
      return () => clearTimeout(t)
    }
  }, [data, markRead])

  return (
    <div className="px-4 md:px-0 py-4 md:py-0">
      <h2 className="font-display font-bold text-xl mb-4">Notifications</h2>
      <div className="card divide-y divide-ink-100 dark:divide-ink-800 overflow-hidden">
        {isLoading ? <div className="p-10 flex justify-center"><Spinner /></div> : null}
        {!isLoading && data && data.length === 0 && (
          <p className="p-8 text-center text-ink-500 dark:text-ink-400 text-sm">No notifications yet.</p>
        )}
        {data?.map((n) => (
          <Link to={n.actor ? `/u/${n.actor.username}` : '#'} key={n.id} className="flex items-center gap-3 px-4 py-3 hover:bg-ink-50 dark:hover:bg-ink-800">
            <Avatar url={n.actor?.avatar_url} username={n.actor?.username} size={44} />
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-semibold">{n.actor?.username}</span>{' '}
                <span className="text-ink-600 dark:text-ink-300">{TYPE_LABELS[n.type] ?? n.type}</span>
              </p>
              <p className="text-xs text-ink-400 dark:text-ink-500">{timeAgo(n.created_at)}</p>
            </div>
            {!n.read && <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />}
          </Link>
        ))}
      </div>
    </div>
  )
}
