import { useEffect, useState } from 'react';

type CompareImage = {
  src: string;
  alt: string;
  label: string;
};

type Props = {
  images: [CompareImage, CompareImage];
  sourceUrl: string;
  locale?: 'en' | 'zh-TW';
};

export default function XImageCompare({ images, sourceUrl, locale = 'en' }: Props) {
  const [zoomed, setZoomed] = useState<number | null>(null);

  useEffect(() => {
    if (zoomed === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoomed(null);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [zoomed]);

  const zoomLabel = locale === 'zh-TW' ? '點擊圖片放大比較' : 'Click an image to zoom';

  return (
    <figure className="x-image-compare" aria-label={locale === 'zh-TW' ? 'X 貼文價格圖片比較' : 'X post image comparison'}>
      <div className="x-image-compare-grid">
        {images.map((image, index) => (
          <div className="x-image-compare-item" key={image.src}>
            <div className="x-image-compare-label">{image.label}</div>
            <button type="button" onClick={() => setZoomed(index)} aria-label={`${image.alt}；${zoomLabel}`}>
              <img src={image.src} alt={image.alt} loading={index === 0 ? 'eager' : 'lazy'} />
            </button>
          </div>
        ))}
      </div>
      <figcaption>{zoomLabel} · <a href={sourceUrl} target="_blank" rel="noreferrer">X 原始貼文</a></figcaption>
      {zoomed !== null && (
        <div className="x-image-compare-lightbox" role="dialog" aria-modal="true" aria-label={`${images[zoomed].alt}；放大檢視`} onClick={() => setZoomed(null)}>
          <button className="x-image-compare-lightbox-close" type="button" onClick={() => setZoomed(null)} aria-label={locale === 'zh-TW' ? '關閉放大檢視' : 'Close zoom'}>×</button>
          <img src={images[zoomed].src} alt={images[zoomed].alt} onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </figure>
  );
}
