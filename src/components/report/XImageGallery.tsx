import { useEffect, useRef, useState } from 'react';

type GalleryImage = {
  src: string;
  alt: string;
};

type Props = {
  images: GalleryImage[];
  sourceUrl: string;
  locale?: 'en' | 'zh-TW';
};

export default function XImageGallery({ images, sourceUrl, locale = 'en' }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const label = locale === 'zh-TW' ? 'X 貼文圖片畫廊' : 'X post image gallery';

  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(index, images.length - 1));
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: next * track.clientWidth, behavior: 'smooth' });
    setActive(next);
  };

  useEffect(() => {
    if (!zoomed) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoomed(false);
      if (event.key === 'ArrowLeft') goTo(active - 1);
      if (event.key === 'ArrowRight') goTo(active + 1);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [zoomed, active]);

  return (
    <figure className="x-image-gallery" aria-label={label}>
      <div className="x-image-gallery-frame">
        <button className="x-image-gallery-arrow x-image-gallery-arrow-prev" type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label={locale === 'zh-TW' ? '上一張圖片' : 'Previous image'}>‹</button>
        <div className="x-image-gallery-track" ref={trackRef} onScroll={(event) => {
          const target = event.currentTarget;
          setActive(Math.round(target.scrollLeft / target.clientWidth));
        }}>
          {images.map((image, index) => (
            <button className="x-image-gallery-slide" type="button" onClick={() => { setActive(index); setZoomed(true); }} key={image.src} aria-label={`${image.alt}；點擊放大`}>
              <img src={image.src} alt={image.alt} loading={index === 0 ? 'eager' : 'lazy'} />
            </button>
          ))}
        </div>
        <button className="x-image-gallery-arrow x-image-gallery-arrow-next" type="button" onClick={() => goTo(active + 1)} disabled={active === images.length - 1} aria-label={locale === 'zh-TW' ? '下一張圖片' : 'Next image'}>›</button>
      </div>
      <div className="x-image-gallery-controls">
        <div className="x-image-gallery-dots" aria-label={locale === 'zh-TW' ? '圖片選擇' : 'Image selection'}>
          {images.map((image, index) => <button className={index === active ? 'is-active' : ''} type="button" onClick={() => goTo(index)} aria-label={`${locale === 'zh-TW' ? '第' : 'Image '}${index + 1}`} aria-current={index === active ? 'true' : undefined} key={image.src} />)}
        </div>
        <span className="x-image-gallery-count">{active + 1} / {images.length}</span>
      </div>
      <figcaption>{locale === 'zh-TW' ? '左右滑動或使用箭頭瀏覽圖片；點擊圖片可放大檢視。' : 'Swipe or use the arrows to browse; click an image to zoom.'} · <a href={sourceUrl} target="_blank" rel="noreferrer">X 原始貼文</a></figcaption>
      {zoomed && <div className="x-image-gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${images[active].alt}；放大檢視`} onClick={() => setZoomed(false)}>
        <button className="x-image-gallery-lightbox-close" type="button" onClick={() => setZoomed(false)} aria-label={locale === 'zh-TW' ? '關閉放大檢視' : 'Close zoom'}>×</button>
        <button className="x-image-gallery-lightbox-arrow x-image-gallery-lightbox-prev" type="button" onClick={(event) => { event.stopPropagation(); goTo(active - 1); }} disabled={active === 0} aria-label={locale === 'zh-TW' ? '上一張圖片' : 'Previous image'}>‹</button>
        <img src={images[active].src} alt={images[active].alt} onClick={(event) => event.stopPropagation()} />
        <button className="x-image-gallery-lightbox-arrow x-image-gallery-lightbox-next" type="button" onClick={(event) => { event.stopPropagation(); goTo(active + 1); }} disabled={active === images.length - 1} aria-label={locale === 'zh-TW' ? '下一張圖片' : 'Next image'}>›</button>
        <span className="x-image-gallery-lightbox-count">{active + 1} / {images.length}</span>
      </div>}
    </figure>
  );
}
