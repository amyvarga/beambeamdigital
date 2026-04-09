type MasonryImage = {
  src: string;
  alt: string;
  href?: string;
  title?: string;
  columns?: number;
};

type MasonryGalleryProps ={
  images: MasonryImage[];
  title?: string;
};

const MasonryGallery = ({ images, title }: MasonryGalleryProps) => (
  <div className="masonry">
    {title && <h3 className="masonry-title">{title}</h3>}
    <div className="masonry-gallery">
    {images.map((img) => (
      <div key={img.src} className="masonry-item" style={img.columns && img.columns > 1 ? { gridColumn: `span ${img.columns}` } : undefined}>
        {img.href ? (
          <a href={img.href} title={img.title ?? img.alt} target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt}  className="transition-all duration-300 hover:sepia"/>
          </a>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img.src} alt={img.alt} />
        )}
      </div>
    ))}
    </div>
  </div>
);

export default MasonryGallery;
