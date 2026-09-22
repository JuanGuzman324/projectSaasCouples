import { usePhotoUrl } from '../features/storage/usePhotoUrl'

export function Photo({
  path,
  alt,
  className = '',
}: {
  path: string | null
  alt: string
  className?: string
}) {
  const { data: url } = usePhotoUrl(path)
  if (!path || !url) return null
  return <img src={url} alt={alt} loading="lazy" className={className} />
}
