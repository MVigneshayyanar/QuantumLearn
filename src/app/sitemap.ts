import { MetadataRoute } from 'next';
import { PRACTICE_PROBLEMS } from '@/lib/practice-problems';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.quanbit.tech';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/bloch-sphere`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/simulator`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/learn/grover`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/learn/deutsch-jozsa`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/learn/teleportation`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/learn/superdense-coding`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/practice`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/concepts`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/blog/grovers-algorithm-explained`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog/bloch-sphere-complete-guide`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
  ];

  const practiceProblemRoutes: MetadataRoute.Sitemap = PRACTICE_PROBLEMS.map((problem) => ({
    url: `${BASE_URL}/practice/${problem.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [...coreRoutes, ...practiceProblemRoutes];
}
