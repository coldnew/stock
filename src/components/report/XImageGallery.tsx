import { useRef, useState } from 'react';

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
  const label = locale === 'zh-TW' ? 'X 貼文圖片畫廊' : 'X post image gallery';

  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(index, images.length - 1));
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: next * track.clientWidth, behavior: 'smooth' });
    setActive(next);
  };

  return (
    <figure className="x-image-gallery" aria-label={label}>
      <div className="x-image-gallery-frame">
        <button className="x-image-gallery-arrow x-image-gallery-arrow-prev" type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label={locale === 'zh-TW' ? '上一張圖片' : 'Previous image'}>‹</button>
        <div className="x-image-gallery-track" ref={trackRef} onScroll={(event) => {
          const target = event.currentTarget;
          setActive(Math.round(target.scrollLeft / target.clientWidth));
        }}>
          {images.map((image, index) => (
            <a className="x-image-gallery-slide" href={image.src} target="_blank" rel="noreferrer" key={image.src}>
              <img src={image.src} alt={image.alt} loading={index === 0 ? 'eager' : 'lazy'} />
            </a>
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
      <figcaption>{locale === 'zh-TW' ? '左右滑動或使用箭頭瀏覽圖片；點擊圖片可開啟原尺寸。' : 'Swipe or use the arrows to browse; click an image to open the original size.'} · <a href={sourceUrl} target="_blank" rel="noreferrer">X 原始貼文</a></figcaption>
    </figure>
  );
}
