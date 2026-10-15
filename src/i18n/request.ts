import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

const supportedLocales = ['en', 'hi', 'es', 'fr', 'de', 'ta', 'te', 'ja', 'zh-CN'];

export default getRequestConfig(async () => {
  let locale = 'en';
  try {
    const cookieStore = cookies();
    const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
    if (cookieLocale && supportedLocales.includes(cookieLocale)) {
      locale = cookieLocale;
    }
  } catch {
    // In static rendering or where cookies are unavailable, default to en
    locale = 'en';
  }

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    messages = (await import('../../messages/en.json')).default;
  }

  return {
    locale,
    messages
  };
});
