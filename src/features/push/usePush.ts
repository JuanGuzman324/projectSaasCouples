import { useEffect, useState } from 'react'
import {
  getExistingSubscription,
  isPushSupported,
  subscribeToPush,
  unsubscribeFromPush,
} from './api'

export function usePush(coupleId: string, userId: string | undefined) {
  const [subscribed, setSubscribed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supported = isPushSupported()

  useEffect(() => {
    if (!supported) {
      setChecking(false)
      return
    }
    getExistingSubscription()
      .then((sub) => setSubscribed(!!sub))
      .finally(() => setChecking(false))
  }, [supported])

  async function enable() {
    if (!userId) return
    setBusy(true)
    setError(null)
    try {
      await subscribeToPush(coupleId, userId)
      setSubscribed(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown-error')
    } finally {
      setBusy(false)
    }
  }

  async function disable() {
    setBusy(true)
    setError(null)
    try {
      await unsubscribeFromPush()
      setSubscribed(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown-error')
    } finally {
      setBusy(false)
    }
  }

  return { supported, subscribed, checking, busy, error, enable, disable }
}
