import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useConversations, useThread, useSendMessage } from '../lib/hooks'
import { useAuthStore } from '../store/auth'
import { Avatar } from '../components/Avatar'
import { SendIcon, ChevronLeftIcon } from '../components/icons'
import { Spinner } from '../components/Loaders'
import { timeAgo } from '../lib/api'
import type { Profile } from '../types'

export default function MessagesPage() {
  const { data: convos } = useConversations()
  const [partner, setPartner] = useState<string | null>(null)

  return (
    <div className="md:card md:m-0 h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3rem)] flex overflow-hidden">
      <div className={`${partner ? 'hidden md:flex' : 'flex'} md:w-72 flex-col border-r border-ink-100 dark:border-ink-800`}>
        <div className="px-4 py-3 border-b border-ink-100 dark:border-ink-800">
          <h2 className="font-display font-bold text-lg">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {convos && convos.length > 0 ? (
            convos.map((c) => (
              <button
                key={c.partner.id}
                onClick={() => setPartner(c.partner.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-ink-50 dark:hover:bg-ink-800 ${partner === c.partner.id ? 'bg-brand-50 dark:bg-brand-900/30' : ''}`}
              >
                <Avatar url={c.partner.avatar_url} username={c.partner.username} size={44} />
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-sm truncate">{c.partner.username}</p>
                  <p className="text-xs text-ink-500 dark:text-ink-400 truncate">{c.last.body}</p>
                </div>
                <span className="text-xs text-ink-400 dark:text-ink-500">{timeAgo(c.last.created_at)}</span>
              </button>
            ))
          ) : (
            <p className="text-sm text-ink-500 dark:text-ink-400 p-6">No conversations yet.</p>
          )}
        </div>
      </div>

      <div className={`${partner ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
        {partner ? <Thread partnerId={partner} onBack={() => setPartner(null)} /> : (
          <div className="flex-1 grid place-items-center text-ink-400 dark:text-ink-500">
            <div className="text-center">
              <p className="font-medium">Your messages</p>
              <p className="text-sm">Select a conversation to start chatting.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Thread({ partnerId, onBack }: { partnerId: string; onBack: () => void }) {
  const { data: msgs, isLoading } = useThread(partnerId)
  const { data: partner } = useQuery({
    queryKey: ['partner', partnerId],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', partnerId).maybeSingle()
      return data as Profile | null
    },
    enabled: !!partnerId,
  })
  const send = useSendMessage(partnerId)
  const [draft, setDraft] = useState('')
  const me = useAuthStore.getState().user?.id

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.trim()) return
    send.mutate(draft.trim())
    setDraft('')
  }

  return (
    <>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-ink-100 dark:border-ink-800">
        <button onClick={onBack} className="md:hidden icon-btn"><ChevronLeftIcon className="h-5 w-5" /></button>
        <Avatar url={partner?.avatar_url} username={partner?.username} size={36} />
        <span className="font-semibold text-sm">{partner?.username ?? 'Loading…'}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-ink-50 dark:bg-ink-950">
        {isLoading ? <div className="flex justify-center py-6"><Spinner /></div> : null}
        {msgs?.map((m) => {
          const mine = m.sender_id === me
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm ${mine ? 'bg-brand-600 text-white rounded-br-md' : 'bg-white border border-ink-100 rounded-bl-md dark:bg-ink-800 dark:border-ink-700'}`}>
                {m.body}
              </div>
            </div>
          )
        })}
        {!isLoading && msgs && msgs.length === 0 && (
          <p className="text-center text-sm text-ink-400 dark:text-ink-500 mt-8">Say hello 👋</p>
        )}
      </div>
      <form onSubmit={submit} className="flex items-center gap-2 p-3 border-t border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Message…" className="input flex-1" />
        <button type="submit" className="btn-primary px-3.5" disabled={!draft.trim() || send.isPending}>
          <SendIcon className="h-4 w-4" />
        </button>
      </form>
    </>
  )
}
