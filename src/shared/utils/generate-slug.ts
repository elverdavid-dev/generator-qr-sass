import { nanoid } from 'nanoid'
import slugify from 'slugify'

export const generateSlug = (name: string) => {
	const uniqueId = nanoid(6)
	return slugify(`${uniqueId}-${name}`, {
		lower: true,
		strict: true,
		trim: true,
		replacement: '-',
	})
}
