import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { contactPageSchema, siteUrl } from '@/lib/seo-schema';
import {
  Mail,
  Building,
  Globe,
  ExternalLink,
  MessageSquare,
  GraduationCap,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Atom,
  Send
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact QuanBit & REVERSUN — Enquiries & Support',
  description:
    'Get in touch with REVERSUN for QuanBit educational inquiries, university curriculum partnerships, and platform support via info@reversun.com.',
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: 'Contact QuanBit — REVERSUN Enquiries & Support',
    description:
      'Contact REVERSUN for QuanBit quantum computing platform inquiries and partnerships.',
    url: `${siteUrl}/contact`,
    type: 'website',
  },
};

export default function ContactPage() {
  const contactChannels = [
    {
      title: 'Direct Email Support',
      icon: Mail,
      description:
        'Have a question about QuanBit, curriculum integration, or verified certificates? Reach out directly to the REVERSUN team.',
      email: 'info@reversun.com',
      badge: 'Official Email',
      badgeColor: 'bg-primary-50 text-primary-800 border-primary-200 dark:bg-primary-950/60 dark:text-primary-300 dark:border-primary-800',
    },
    {
      title: 'REVERSUN Online Enquiry Form',
      icon: Send,
      description:
        'Submit partnerships, general questions, and project collaboration inquiries directly through the official REVERSUN enquiry form.',
      website: 'https://reversun.com/contact',
      actionLabel: 'Open REVERSUN Enquiry Form',
      badge: 'Online Enquiry',
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
    },
    {
      title: 'Academic & University Partnerships',
      icon: GraduationCap,
      description:
        'Interested in adopting QuanBit’s 3D Bloch sphere, multi-framework circuit builder, or verified certificates for your classrooms?',
      email: 'info@reversun.com',
      subject: 'Academic Curriculum Partnership',
      badge: 'Classroom Support',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    },
  ];

  return (
    <>
      {/* ContactPage Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 animate-fadeIn">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-xs font-bold text-primary-800 dark:text-primary-300">
            <Mail className="w-3.5 h-3.5 text-primary-600" />
            <span>Connect with REVERSUN</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark-900 dark:text-white tracking-tight">
            Contact QuanBit &amp; REVERSUN
          </h1>

          <p className="text-sm sm:text-base text-dark-600 dark:text-dark-300 leading-relaxed max-w-2xl mx-auto">
            QuanBit is developed and backed by <strong>REVERSUN</strong> (<a href="https://www.reversun.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 font-bold hover:underline inline-flex items-center gap-0.5">www.reversun.com <ExternalLink className="w-3 h-3" /></a>). Submit an enquiry below or email our team.
          </p>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactChannels.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-200 dark:border-dark-800 p-6 shadow-xs flex flex-col justify-between space-y-5 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${c.badgeColor}`}>
                      {c.badge}
                    </span>
                  </div>

                  <h2 className="font-bold text-base text-dark-900 dark:text-white">
                    {c.title}
                  </h2>

                  <p className="text-xs text-dark-600 dark:text-dark-300 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-dark-100 dark:border-dark-800 space-y-2">
                  {c.email && (
                    <a
                      href={`mailto:${c.email}?subject=${encodeURIComponent(c.subject || 'QuanBit Inquiry')}`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs transition-colors shadow-xs"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{c.email}</span>
                    </a>
                  )}

                  {c.website && (
                    <a
                      href={c.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-dark-900 dark:bg-dark-800 hover:bg-dark-800 text-white font-bold text-xs transition-colors shadow-xs"
                    >
                      <Globe className="w-3.5 h-3.5 text-primary-400" />
                      <span>{c.actionLabel || 'Visit reversun.com'}</span>
                      <ExternalLink className="w-3 h-3 text-dark-400" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Organization Information Card */}
        <div className="bg-gradient-to-br from-dark-50 via-white to-primary-50/30 dark:from-dark-900 dark:via-dark-900 dark:to-primary-950/40 rounded-3xl border border-dark-200 dark:border-dark-800 p-8 sm:p-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                Company &amp; Product
              </span>
              <h2 className="text-2xl font-extrabold text-dark-900 dark:text-white">
                REVERSUN
              </h2>
              <p className="text-xs sm:text-sm text-dark-600 dark:text-dark-300 leading-relaxed">
                REVERSUN builds transformative software tools, interactive educational applications, and high-performance computing platforms. QuanBit is an open-access quantum computing learning platform by REVERSUN.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 space-y-2 text-xs shrink-0 min-w-[260px]">
              <div className="flex items-center gap-2 text-dark-900 dark:text-white font-bold">
                <Building className="w-4 h-4 text-primary-600" />
                <span>REVERSUN</span>
              </div>
              <p className="text-dark-600 dark:text-dark-300">
                Website:{' '}
                <a href="https://www.reversun.com" target="_blank" rel="noopener noreferrer" className="font-bold text-primary-600 hover:underline">
                  www.reversun.com
                </a>
              </p>
              <p className="text-dark-600 dark:text-dark-300">Product: QuanBit (quanbit.tech)</p>
              <p className="text-dark-600 dark:text-dark-300">Team: QuanBit Team &amp; REVERSUN Team</p>
              <p className="text-dark-600 dark:text-dark-300">
                Email:{' '}
                <a href="mailto:info@reversun.com" className="font-bold text-primary-600 hover:underline">
                  info@reversun.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
