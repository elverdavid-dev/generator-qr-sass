import { createClient } from './server'

/**
 * Uploads an image to a given bucket and folder in Supabase.
 *
 * @param file The image file to upload.
 * @param bucket The name of the bucket to upload the image to.
 * @param folder The name of the folder to upload the image to.
 * @returns The public URL of the uploaded image.
 */
export const uploadImage = async (
	file: File,
	bucket: string,
	folder: string,
) => {
	const supabase = await createClient()

	const pathName = `${folder}/${Date.now()}-${file.name}`

	// Upload the image
	const { data, error } = await supabase.storage
		.from(bucket)
		.upload(pathName, file)
	// Handle errors
	if (error) {
		return {
			error: error.message,
		}
	}

	// Get the public URL
	const result = supabase.storage
		.from(bucket)
		.getPublicUrl(data?.path ?? pathName)

	return {
		url_image: result.data.publicUrl,
		image_path: data?.path ?? pathName,
	}
}
