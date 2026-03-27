type MasonryImage = {
  src: string;
  alt: string;
};

type MasonryGalleryProps = {
  images: MasonryImage[];
};

const MasonryGallery = ({ images }: MasonryGalleryProps) => (
  <div className="masonry">
    {images.map((img) => (
      <div key={img.src} className="masonry-item">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.src} alt={img.alt} />
      </div>
    ))}
  </div>
);

export default MasonryGallery;
