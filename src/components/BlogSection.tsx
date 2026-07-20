import { useState } from 'react'

type Blog = {
  id: number
  title: string
  category: string
  readTime: string
  excerpt: string
  body: string[]
  emoji: string
  accent: string
}

const BLOGS: Blog[] = [
  {
    id: 1,
    title: 'The Messi Story: From Rosario to Immortality',
    category: 'Football Legend',
    readTime: '8 min',
    emoji: '⚽',
    accent: 'from-sky-500/15 to-sky-400/5 border-sky-200 dark:border-sky-800/50',
    excerpt: 'A boy told he was too small to play grew into the most decorated footballer in history — eight Ballons d\'Or, a World Cup, and the love of a nation.',
    body: [
      'Born in Rosario, Argentina in 1987, Lionel Messi was the smallest kid on every pitch. Diagnosed with growth hormone deficiency at 10, his family could not afford the nightly injections. FC Barcelona, alerted by a scout, offered to pay for the treatment — and the rest is the most consequential contract in football history.',
      'Through La Masia, Messi developed a preternatural blend of balance, close control, and vision. He debuted at 17, scored his first goal with a cheeky chip, and by 22 had won everything there was to win at club level: four Champions Leagues, ten La Liga titles, the Ballon d\'Or four times running.',
      'Yet the one trophy that eluded him — the World Cup — became his obsession. A lost final in 2014, a heartbreak in 2018, and finally, in 2022, the coronation: Messi lifted the World Cup in Qatar after a final for the ages against France. It was, many argued, the most complete redemption arc sport had ever seen.',
      'Off the pitch, Messi is famously quiet — no tattoos of his own face, no controversies, just a man who loves the game as much at 35 as he did at 8. His story is proof that greatness is not born from size, but from obsession, repetition, and an unshakable love for the ball at your feet.',
    ],
  },
  {
    id: 2,
    title: 'MS Dhoni: The Captain Who Never Panicked',
    category: 'Cricket Legend',
    readTime: '7 min',
    emoji: '🏏',
    accent: 'from-amber-500/15 to-amber-400/5 border-amber-200 dark:border-amber-800/50',
    excerpt: 'From a ticket collector in Kharagpur to the only captain to win all three ICC trophies — Dhoni rewrote what calm under pressure looks like.',
    body: [
      'Mahendra Singh Dhoni was born in Ranchi in 1981, a long way from India\'s cricket heartlands. He played football as a goalkeeper, was pushed into cricket by his coach, and for years worked as a ticket examiner at Kharagpur railway station — batting in the nets before and after his shifts.',
      'His rise was anything but linear. He debuted for India at 23, but his fearless lower-order hitting caught the selectors\' eye. By 2007, he was leading a young, unfancied India to the inaugural T20 World Cup title — a tournament that birthed a format and a captaincy legend simultaneously.',
      'In 2011, with the World Cup final on the line, Dhoni promoted himself up the order and finished the chase with a six that is now etched into Indian memory: "Dhoni finishes off in style!" He also led India to the 2013 Champions Trophy, making him the only captain to hold all three ICC white-ball trophies.',
      'What set Dhoni apart was not technique but temperament. In the final overs, with the game in the balance, he was the calmest person in the stadium — reading situations, marshalling bowlers, and backing his instincts. "Process over result," he would say. It is a lesson that travels far beyond cricket.',
    ],
  },
  {
    id: 3,
    title: 'Neymar: The Beautiful Game\'s Most Dazzling Showman',
    category: 'Football Legend',
    readTime: '6 min',
    emoji: '🇧🇷',
    accent: 'from-emerald-500/15 to-emerald-400/5 border-emerald-200 dark:border-emerald-800/50',
    excerpt: 'The heir to Pelé\'s legacy, the most expensive transfer in history, and a player whose flair divided purists and delighted fans.',
    body: [
      'Neymar da Silva Santos Júnior was born in Mogi das Cruzes, São Paulo, in 1992. He was scouted by Santos — Pelé\'s old club — at 11, and by 17 was scoring goals that went viral before "viral" was a marketing term. His rainbow flicks, no-look passes, and impossible dribbles made him the last great exponent of Brazilian street flair.',
      'His 2013 move to Barcelona formed the legendary MSN trio with Messi and Suárez, winning the 2015 Champions League. In 2017, Paris Saint-Germain paid his €222 million release clause — still the record transfer — to make him the face of their project.',
      'Neymar\'s career has been defined by brilliance and frustration in equal measure. Injuries at crucial World Cups, a 2022 campaign where he drew level with Pelé\'s all-time Brazil scoring record, and a move to Saudi Arabia in 2023. He is Brazil\'s all-time top scorer, a feat even Pelé never reached.',
      'Love him or critique him, Neymar kept joy in the game at a time when football was becoming increasingly mechanical. He played like the streets of Brazil were still watching.',
    ],
  },
  {
    id: 4,
    title: 'How Cricket Began: From Shepherds to the World Cup',
    category: 'Sport History',
    readTime: '9 min',
    emoji: '📜',
    accent: 'from-rose-500/15 to-rose-400/5 border-rose-200 dark:border-rose-800/50',
    excerpt: 'A children\'s game in the English countryside grew into the second most-watched sport on Earth — here is how it happened.',
    body: [
      'Cricket\'s origins are hazy, but the earliest references come from 16th-century southern England, where children played a bat-and-ball game in the Weald — the dense woodland of Kent and Sussex. The name may derive from the Old English "cricc," meaning a wooden staff or shepherd\'s crook.',
      'By the 17th century, adults had taken it up. Village cricket spread, and the first recorded match between organised teams was played in 1697. The Hambledon Club in Hampshire, active in the mid-1700s, is often called the "cradle of cricket" — it refined the laws, the bat design, and the tactics.',
      'The Marylebone Cricket Club (MCC), founded in 1787 at Lord\'s, became the custodian of the Laws of Cricket — a role it held until the 21st century. The MCC standardised overarm bowling, the size of the ball, and the length of the pitch at 22 yards, all of which still hold today.',
      'The British Empire carried cricket to its colonies: India, Australia, the West Indies, South Africa, New Zealand. The first Test match was played in 1877 between England and Australia. The one-day World Cup began in 1975; T20 internationals in 2005. Today, over a billion people watch the IPL alone each spring — a game that began with shepherds now unites a subcontinent.',
    ],
  },
  {
    id: 5,
    title: 'Shri Krishna: The Divine Statesman of the Mahabharata',
    category: 'Mythology & Spirituality',
    readTime: '10 min',
    emoji: '🪈',
    accent: 'from-violet-500/15 to-violet-400/5 border-violet-200 dark:border-violet-800/50',
    excerpt: 'A flute-playing cowherd, a strategist who never lifted a weapon, and the speaker of the Bhagavad Gita — Krishna is many things to many people.',
    body: [
      'Krishna is one of the most beloved and complex figures in Hindu tradition — worshipped as the supreme God in Vaishnavism, and as the eighth avatar of Vishnu more broadly. His life, as told in the Mahabharata, the Bhagavata Purana, and the Harivamsa, spans the playful and the cosmic in a single character.',
      'Born in a dungeon in Mathura to Devaki and Vasudeva, Krishna was smuggled across the Yamuna to Gokul to escape his tyrant uncle Kamsa. His childhood — stealing butter, dancing with the gopis, lifting the Govardhan hill — is the heart of devotional Hinduism: God as a playful, approachable child.',
      'As an adult, Krishna returned to Mathura, killed Kamsa, and became the king of Dwaraka. But his most consequential role was as charioteer and guide to Arjuna in the Kurukshetra war. When Arjuna collapsed in despair at the thought of fighting his kin, Krishna delivered the Bhagavad Gita — 700 verses on duty, devotion, and the nature of the self that remain among the most studied texts in world philosophy.',
      'Krishna never fought in the war himself, yet his strategy — diplomatic, psychological, and tactical — won it. He is the model of the karma yogi: one who acts without attachment to the fruits of action. To read Krishna is to read a guide to living fully in the world while remaining untouched by it.',
    ],
  },
  {
    id: 6,
    title: '5 Books That Will Change How You Think',
    category: 'Reading List',
    readTime: '5 min',
    emoji: '📚',
    accent: 'from-teal-500/15 to-teal-400/5 border-teal-200 dark:border-teal-800/50',
    excerpt: 'From Stoicism to flow, from habits to history — a short shelf of books that quietly reshape how you see the world.',
    body: [
      '"Meditations" by Marcus Aurelius — the private notebook of a Roman emperor wrestling with duty, mortality, and self-control. Read a page a day for a year and you will be a different person.',
      '"Atomic Habits" by James Clear — the clearest modern manual on how small changes compound. The lesson: you do not rise to the level of your goals, you fall to the level of your systems.',
      '"Sapiens" by Yuval Noah Harari — a sweeping history of our species that will make you question what money, religion, and nations really are. The best one-volume introduction to big-picture history.',
      '"Man\'s Search for Meaning" by Viktor Frankl — a psychiatrist\'s account of surviving Auschwitz, and the case that meaning, not pleasure, is what sustains a human being. Short, devastating, essential.',
      '"The Alchemist" by Paulo Coelho — a fable about a shepherd chasing a treasure. Sometimes what you need is not more information but a reminder to listen to your heart. A book to read when you are young, and again when you are not.',
    ],
  },
]

export default function BlogSection() {
  const [openId, setOpenId] = useState<number | null>(null)
  const open = BLOGS.find((b) => b.id === openId) || null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">📖</span>
        <h3 className="font-display font-bold text-base">Stories & Reads</h3>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {BLOGS.map((b) => (
          <button
            key={b.id}
            onClick={() => setOpenId(b.id)}
            className={`card p-4 text-left hover:shadow-pop transition group bg-gradient-to-br ${b.accent} border`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">{b.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="chip bg-white/70 dark:bg-ink-900/50 text-ink-600 dark:text-ink-300 text-[10px]">{b.category}</span>
                  <span className="text-[11px] text-ink-400">{b.readTime}</span>
                </div>
                <h4 className="font-display font-bold text-sm leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">{b.title}</h4>
                <p className="text-xs text-ink-500 dark:text-ink-400 mt-1.5 leading-relaxed line-clamp-3">{b.excerpt}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-ink-950/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in" onClick={() => setOpenId(null)}>
          <div className="card w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{open.emoji}</span>
                <div>
                  <span className="chip bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 text-[10px]">{open.category}</span>
                  <h2 className="font-display font-bold text-xl leading-tight mt-1.5">{open.title}</h2>
                  <p className="text-xs text-ink-400 mt-0.5">{open.readTime} read</p>
                </div>
              </div>
              <button onClick={() => setOpenId(null)} className="icon-btn shrink-0">✕</button>
            </div>
            <div className="space-y-4">
              {open.body.map((p, i) => (
                <p key={i} className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
