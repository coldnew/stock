import { useEffect, useRef, useState } from 'react';

type MediaItem = {
  type: 'video' | 'image';
  src: string;
  poster?: string;
  alt: string;
  label: string;
  caption: string;
  sourceUrl: string;
};

type Props = {
  items: MediaItem[];
  locale?: 'en' | 'zh-TW';
};

export default function XMediaCarousel({ items, locale = 'en' }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(index, items.length - 1));
    const track = trackRef.current;
    if (!track) return;
    const slide = track.querySelectorAll<HTMLElement>('.x-media-carousel-slide')[next];
    track.scrollTo({ left: slide?.offsetLeft ?? 0, behavior: 'smooth' });
    setActive(next);
  };

  const updateActive = (track: HTMLDivElement) => {
    const slides = Array.from(track.querySelectorAll<HTMLElement>('.x-media-carousel-slide'));
    if (!slides.length) return;
    const next = slides.reduce((closest, slide, index) =>
      Math.abs(slide.offsetLeft - track.scrollLeft) < Math.abs(slides[closest].offsetLeft - track.scrollLeft) ? index : closest, 0);
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

  if (!items.length) return null;
  const current = items[active];
  const label = locale === 'zh-TW' ? 'X 貼文影片與圖片輪播' : 'X post media carousel';

  return (
    <figure className="x-media-carousel" aria-label={label}>
      <div className="x-media-carousel-frame">
        <button className="x-media-carousel-arrow x-media-carousel-arrow-prev" type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="上一則媒體">‹</button>
        <div className="x-media-carousel-track" ref={trackRef} onScroll={(event) => updateActive(event.currentTarget)}>
          {items.map((item, index) => (
            <article className="x-media-carousel-slide" key={item.src}>
              <div className="x-media-carousel-media">
                {item.type === 'video' ? (
                  <video controls playsInline preload={index === 0 ? 'metadata' : 'none'} poster={item.poster} aria-label={item.alt}>
                    <source src={item.src} type="video/mp4" />
                    您的瀏覽器不支援 MP4 影片播放。
                  </video>
                ) : (
                  <button type="button" className="x-media-carousel-image-button" onClick={() => { setActive(index); setZoomed(true); }} aria-label={`${item.alt}；點擊放大`}>
                    <img src={item.src} alt={item.alt} loading={index === 0 ? 'eager' : 'lazy'} />
                  </button>
                )}
              </div>
              <div className="x-media-carousel-copy">
                <span className="x-media-carousel-label">{item.label}</span>
                <p>{item.caption}</p>
                <a href={item.sourceUrl} target="_blank" rel="noreferrer">查看 X 原始貼文</a>
              </div>
            </article>
          ))}
        </div>
        <button className="x-media-carousel-arrow x-media-carousel-arrow-next" type="button" onClick={() => goTo(active + 1)} disabled={active === items.length - 1} aria-label="下一則媒體">›</button>
      </div>
      <div className="x-media-carousel-controls">
        <div className="x-media-carousel-dots" aria-label="媒體選擇">
          {items.map((item, index) => <button className={index === active ? 'is-active' : ''} type="button" onClick={() => goTo(index)} aria-label={`第 ${index + 1} 則`} aria-current={index === active ? 'true' : undefined} key={item.src} />)}
        </div>
        <span>{active + 1} / {items.length}</span>
      </div>
      <figcaption>影片集中於前兩張，圖片集中於後兩張；左右滑動或使用箭頭瀏覽，圖片可點擊放大。</figcaption>
      {zoomed && current.type === 'image' && <div className="x-media-carousel-lightbox" role="dialog" aria-modal="true" aria-label={`${current.alt}；放大檢視`} onClick={() => setZoomed(false)}>
        <button className="x-media-carousel-lightbox-close" type="button" onClick={() => setZoomed(false)} aria-label="關閉放大檢視">×</button>
        <button className="x-media-carousel-lightbox-arrow x-media-carousel-lightbox-prev" type="button" onClick={(event) => { event.stopPropagation(); goTo(active - 1); }} disabled={active === 0} aria-label="上一則媒體">‹</button>
        <img src={current.src} alt={current.alt} onClick={(event) => event.stopPropagation()} />
        <button className="x-media-carousel-lightbox-arrow x-media-carousel-lightbox-next" type="button" onClick={(event) => { event.stopPropagation(); goTo(active + 1); }} disabled={active === items.length - 1} aria-label="下一則媒體">›</button>
        <span>{active + 1} / {items.length}</span>
      </div>}
    </figure>
  );
}
