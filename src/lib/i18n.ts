import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import esCommon from '../locales/es/common.json'
import esAuth from '../locales/es/auth.json'
import esCouple from '../locales/es/couple.json'
import esHome from '../locales/es/home.json'
import esMemories from '../locales/es/memories.json'
import esDates from '../locales/es/dates.json'
import esMoments from '../locales/es/moments.json'
import esTimecapsules from '../locales/es/timecapsules.json'

import enCommon from '../locales/en/common.json'
import enAuth from '../locales/en/auth.json'
import enCouple from '../locales/en/couple.json'
import enHome from '../locales/en/home.json'
import enMemories from '../locales/en/memories.json'
import enDates from '../locales/en/dates.json'
import enMoments from '../locales/en/moments.json'
import enTimecapsules from '../locales/en/timecapsules.json'

import deCommon from '../locales/de/common.json'
import deAuth from '../locales/de/auth.json'
import deCouple from '../locales/de/couple.json'
import deHome from '../locales/de/home.json'
import deMemories from '../locales/de/memories.json'
import deDates from '../locales/de/dates.json'
import deMoments from '../locales/de/moments.json'
import deTimecapsules from '../locales/de/timecapsules.json'

import frCommon from '../locales/fr/common.json'
import frAuth from '../locales/fr/auth.json'
import frCouple from '../locales/fr/couple.json'
import frHome from '../locales/fr/home.json'
import frMemories from '../locales/fr/memories.json'
import frDates from '../locales/fr/dates.json'
import frMoments from '../locales/fr/moments.json'
import frTimecapsules from '../locales/fr/timecapsules.json'

// Idiomas de lanzamiento, en el orden del plan de producto.
export const SUPPORTED_LANGS = ['es', 'en', 'de', 'fr'] as const
export type SupportedLang = (typeof SUPPORTED_LANGS)[number]

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        common: esCommon, auth: esAuth, couple: esCouple, home: esHome,
        memories: esMemories, dates: esDates, moments: esMoments, timecapsules: esTimecapsules,
      },
      en: {
        common: enCommon, auth: enAuth, couple: enCouple, home: enHome,
        memories: enMemories, dates: enDates, moments: enMoments, timecapsules: enTimecapsules,
      },
      de: {
        common: deCommon, auth: deAuth, couple: deCouple, home: deHome,
        memories: deMemories, dates: deDates, moments: deMoments, timecapsules: deTimecapsules,
      },
      fr: {
        common: frCommon, auth: frAuth, couple: frCouple, home: frHome,
        memories: frMemories, dates: frDates, moments: frMoments, timecapsules: frTimecapsules,
      },
    },
    supportedLngs: SUPPORTED_LANGS as unknown as string[],
    fallbackLng: 'es',
    ns: ['common', 'auth', 'couple', 'home', 'memories', 'dates', 'moments', 'timecapsules'],
    defaultNS: 'common',
    interpolation: { escapeValue: false }, // React ya escapa por su cuenta
    detection: {
      // Prioridad: elección explícita del usuario (guardada) > idioma del
      // navegador/dispositivo. localStorage es apropiado aquí: es solo una
      // preferencia de UI, no un dato de la pareja.
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'nh_lang',
    },
  })

export default i18n
