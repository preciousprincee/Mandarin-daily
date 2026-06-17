import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'

export default function XPToast({ xpEarned, onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 300)
    }, 2500)
    return () => clearTimeout(t)
  }, [])

  if (!xpEarned || !visible) return null

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="flex items-center gap-2 bg-gold-500 text-white px-5 py-2.5 rounded-full shadow-xl font-bold text-sm">
        <Zap size={16} />
        +{xpEarned} XP
      </div>
    </div>
  )
}
