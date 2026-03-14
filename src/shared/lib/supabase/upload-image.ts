import { createAdminClient } from './admin'

/**
 * Uploads an image to a given bucket and folder in Supabase Storage.
 *
 * @param file The image file to upload.
 * @param bucket The name of the bucket to upload the image to.
 * @param folder The name of the folder inside the bucket.
 * @returns The public URL and storage path of the uploaded image.
 */
export const uploadImage = async (
	file: File,
	bucket: string,
	folder: string,
) => {
	const supabase = createAdminClient()

	const pathName = `${folder}/${Date.now()}-${file.name}`

	const { data, error } = await supabase.storage
		.from(bucket)
		.upload(pathName, file)

	if (error) {
		return { error: error.message }
	}

	const result = supabase.storage
		.from(bucket)
		.getPublicUrl(data?.path ?? pathName)

	return {
		url_image: result.data.publicUrl,
		image_path: data?.path ?? pathName,
	}
}
