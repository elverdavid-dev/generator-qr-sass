import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: siteUrl,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 1,
		},
		{
			url: `${siteUrl}/pricing`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.9,
		},
		{
			url: `${siteUrl}/login`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.5,
		},
		{
			url: `${siteUrl}/register`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.5,
		},
		{
			url: `${siteUrl}/terms`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.3,
		},
		{
			url: `${siteUrl}/privacy`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.3,
		},
	]
}
