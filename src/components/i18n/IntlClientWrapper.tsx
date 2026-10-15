'use client';

import React, { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useAccessibility } from '@/lib/accessibility-context';
import { allMessages } from '@/lib/i18n';

export function IntlClientWrapper({ children }: { children: ReactNode }) {
  const { language } = useAccessibility();
  const messages = allMessages[language] || allMessages.en;

  return (
    <NextIntlClientProvider
      locale={language}
      messages={messages}
      timeZone="UTC"
    >
      {children}
    </NextIntlClientProvider>
  );
}
