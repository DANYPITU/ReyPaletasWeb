import { privateApi } from './api'

const MAX_FILE_SIZE = 4 * 1024 * 1024

export const ALLOWED_BUCKETS = ['Products', 'Announcements', 'Franchises', 'HeroImages', 'Associates']

function describeError(error) {
  switch (error?.status) {
    case 413:
      return 'El archivo supera el tamaño máximo de 4 MB'
    case 415:
      return 'El tipo de archivo no es una imagen válida'
    case 400:
      return 'El bucket o los parámetros enviados no son válidos'
    default:
      return error?.message || 'Error al procesar la imagen'
  }
}

function validateFile(file) {
  if (!file) return 'No se seleccionó ningún archivo'
  if (!file.type.startsWith('image/')) return 'El archivo debe ser una imagen'
  if (file.size > MAX_FILE_SIZE) return 'El archivo supera el tamaño máximo de 4 MB'
  return null
}

function validateBucket(bucket) {
  return ALLOWED_BUCKETS.includes(bucket) ? null : `Bucket no permitido: ${bucket}`
}

export function validateImages(files) {
  if (!files || files.length === 0) return 'No se seleccionó ningún archivo'
  for (const file of files) {
    const error = validateFile(file)
    if (error) return error
  }
  return null
}

function buildFormData(files, bucket, folder) {
  const formData = new FormData()
  for (const file of files) {
    formData.append('files', file)
  }
  formData.append('bucket', bucket)
  if (folder) formData.append('folder', folder)
  return formData
}

function getPathFromUrl(url) {
  if (!url) return null
  const marker = '/storage/v1/object/public/'
  const index = url.indexOf(marker)
  if (index !== -1) {
    return url.slice(index + marker.length)
  }
  const parts = url.split('/')
  return parts[parts.length - 1] || null
}

export async function uploadImage(file, bucket = 'Products', folder = '') {
  const fileError = validateFile(file)
  if (fileError) throw new Error(fileError)

  const bucketError = validateBucket(bucket)
  if (bucketError) throw new Error(bucketError)

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', bucket)
    if (folder) formData.append('folder', folder)

    const result = await privateApi.uploadImage(formData)
    return result?.url || null
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error(describeError(error))
  }
}

export async function uploadMultipleImages(files, bucket = 'Products', folder = '') {
  const filesError = validateImages(files)
  if (filesError) throw new Error(filesError)

  const bucketError = validateBucket(bucket)
  if (bucketError) throw new Error(bucketError)

  try {
    const formData = buildFormData(files, bucket, folder)
    const result = await privateApi.uploadMultipleImages(formData)
    return (result?.data || []).map((item) => item?.url).filter(Boolean)
  } catch (error) {
    console.error('Error uploading images:', error)
    throw new Error(describeError(error))
  }
}

export async function deleteImage(bucket, url) {
  const bucketError = validateBucket(bucket)
  if (bucketError) throw new Error(bucketError)

  const path = getPathFromUrl(url)
  if (!path) throw new Error('No se pudo determinar la ruta de la imagen')

  try {
    await privateApi.deleteStorage(bucket, path)
    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    throw new Error(describeError(error))
  }
}