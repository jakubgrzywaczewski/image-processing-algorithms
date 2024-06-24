import React from 'react';

import './ImageUploader.css';

type ImageUploaderProps = {
  setImageData: (data: ImageData) => void;
};

export const ImageUploader = ({ setImageData }: ImageUploaderProps) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            setImageData(imageData);
          }
        };
        img.src = e?.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input id="load-file" type="file" accept="image/*" onChange={handleImageUpload} />
    </div>
  );
};
