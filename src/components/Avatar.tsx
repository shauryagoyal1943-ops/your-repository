import { avatarFor } from '../lib/api'

export function Avatar({
  url,
  username,
  full_name,
  size = 40,
  ring = false,
  className = '',
}: {
  url?: string | null
  username?: string | null
  full_name?: string | null
  size?: number
  ring?: boolean
  className?: string
}) {
  return (
    <img
      src={avatarFor({ avatar_url: url, username, full_name })}
      alt={username || 'avatar'}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`avatar ${ring ? 'ring-2 ring-brand-500 ring-offset-2' : ''} ${className}`}
      loading="lazy"
    />
  )
}
