import en from '../../messages/en.json';
import hi from '../../messages/hi.json';
import es from '../../messages/es.json';
import fr from '../../messages/fr.json';
import de from '../../messages/de.json';
import ta from '../../messages/ta.json';
import te from '../../messages/te.json';
import ja from '../../messages/ja.json';
import zhCN from '../../messages/zh-CN.json';

export type SupportedLocale = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'ta' | 'te' | 'ja' | 'zh-CN';

export interface LanguageOption {
  code: SupportedLocale;
  label: string;
}

export const supportedLanguages: LanguageOption[] = [
  { code: 'en', label: 'English (EN)' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'es', label: 'Español (ES)' },
  { code: 'fr', label: 'Français (FR)' },
  { code: 'de', label: 'Deutsch (DE)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'ja', label: '日本語 (Japanese)' },
  { code: 'zh-CN', label: '中文 (Chinese)' },
];

export const allMessages: Record<SupportedLocale, any> = {
  en,
  hi,
  es,
  fr,
  de,
  ta,
  te,
  ja,
  'zh-CN': zhCN,
};

export const translations: Record<string, typeof en> = new Proxy(allMessages as any, {
  get(target: any, prop: string) {
    if (prop in target) {
      return target[prop];
    }
    // Handle region-based codes like zh, zh-CN, ta, te
    if (typeof prop === 'string') {
      const base = prop.split('-')[0];
      if (base in target) {
        return target[base];
      }
      if (base === 'zh') {
        return target['zh-CN'];
      }
    }
    return target.en;
  },
});
