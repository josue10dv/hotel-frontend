import React, { memo } from 'react';

interface ImageGalleryProps {
  images: string[];
}

export const ImageGallery = memo(function ImageGallery({ images }: ImageGalleryProps) {
  const safeImages = images && images.length > 0 ? images : [];
  const mainImage = safeImages[0];
  const subImages = safeImages.slice(1, 3);

  if (!mainImage) {
      return <div className="h-[400px] w-full bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">No images</div>
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="w-full h-[320px] rounded-3xl overflow-hidden shadow-sm">
        <img 
          src={mainImage} 
          alt="Main view" 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="flex gap-4 h-[180px]">
        {subImages.map((img, idx) => (
          <div key={idx} className="flex-1 rounded-3xl overflow-hidden relative shadow-sm">
             <img 
              src={img} 
              alt={`View ${idx + 2}`} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
        {subImages.length < 2 && (
             <div className="flex-1 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-400">
                <span className="text-sm">More photos coming soon</span>
             </div>
        )}
         {subImages.length === 0 && (
             <div className="flex-1 bg-gray-100 rounded-3xl"></div>
        )}
      </div>
    </div>
  );
});

