import { useEffect } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from './lib/auth-store'
import { useMyCouple } from './features/couple/useCouple'
import { Login } from './features/auth/Login'
import { Register } from './features/auth/Register'
import { Onboarding } from './features/couple/Onboarding'
import { InviteScreen } from './features/couple/InviteScreen'
import { Home } from './features/home/Home'
import { MemoriesPage } from './features/memories/MemoriesPage'
import { DatesPage } from './features/dates/DatesPage'
import { MomentsPage } from './features/moments/MomentsPage'
import { Button } from './ui/Button'
import { LanguageSwitcher } from './ui/LanguageSwitcher'
import { supabase } from './lib/supabase'
import type { CoupleWithMembers } from './features/couple/api'

const TABS = [
  { to: '/', end: true, key: 'home' as const },
  { to: '/memories', end: false, key: 'memories' as const },
  { to: '/dates', end: false, key: 'dates' as const },
  { to: '/moments', end: false, key: 'moments' as const },
]

function Nav() {
  const { t } = useTranslation(['common', 'memories', 'dates', 'moments'])
  const labels: Record<(typeof TABS)[number]['key'], string> = {
    home: t('app.name', { ns: 'common' }),
    memories: t('nav', { ns: 'memories' }),
    dates: t('nav', { ns: 'dates' }),
    moments: t('nav', { ns: 'moments' }),
  }
  return (
    <nav className="tab-scroll flex gap-1 overflow-x-auto">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-150 ${
              isActive
                ? 'bg-[var(--color-surface-2)] text-[var(--color-ink)]'
                : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-2)]/60 hover:text-[var(--color-ink)]'
            }`
          }
        >
          {labels[tab.key]}
        </NavLink>
      ))}
    </nav>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation('common')
  return (
    <div className="min-h-dvh">
      <header className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-3">
          <span className="[font-family:var(--font-display)] text-xl">{t('app.name')}</span>
          <div className="flex items-center gap-3 sm:hidden">
            <LanguageSwitcher />
            <Button variant="ghost" onClick={() => supabase.auth.signOut()}>
              {t('action.logout')}
            </Button>
          </div>
        </div>
        <Nav />
        <div className="hidden items-center gap-3 sm:flex">
          <LanguageSwitcher />
          <Button variant="ghost" onClick={() => supabase.auth.signOut()}>
            {t('action.logout')}
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 pb-16">{children}</main>
    </div>
  )
}

// Con la pareja completa (2 miembros), estas son las rutas reales de la
// app. Todas reciben coupleId: lo necesitan para insertar contenido nuevo
// (el couple_id no lo pone la política, lo tiene que mandar el cliente).
function CoupleRoutes({ couple }: { couple: CoupleWithMembers }) {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home couple={couple} />} />
        <Route path="/memories" element={<MemoriesPage coupleId={couple.id} />} />
        <Route path="/dates" element={<DatesPage coupleId={couple.id} />} />
        <Route path="/moments" element={<MomentsPage coupleId={couple.id} />} />
      </Routes>
    </Shell>
  )
}

// Puerta principal: sin sesión -> login/registro. Con sesión pero sin
// pareja todavía -> onboarding. Con sesión y pareja de un solo miembro ->
// pantalla de invitación. Con los dos miembros -> la app de verdad.
function Gate() {
  const { data: couple, isLoading } = useMyCouple()
  if (isLoading) return null
  if (!couple) return <Onboarding />
  if (couple.members.length < 2) return <InviteScreen couple={couple} />
  return <CoupleRoutes couple={couple} />
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((s) => s.session)
  const loading = useAuthStore((s) => s.loading)
  const location = useLocation()
  if (loading) return null
  if (!session) return <Navigate to="/login" state={{ from: location }} replace />
  return <>{children}</>
}

export default function App() {
  const init = useAuthStore((s) => s.init)
  const session = useAuthStore((s) => s.session)
  useEffect(() => {
    init()
  }, [init])

  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={session ? <Navigate to="/" replace /> : <Register />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <Gate />
          </RequireAuth>
        }
      />
    </Routes>
  )
}
