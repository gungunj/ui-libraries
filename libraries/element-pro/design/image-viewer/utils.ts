import { ElImageViewerProps, ImageInfo } from './type';

export const downloadFile = function (imgSrc: string) {
  const image = new Image();
  const name = imgSrc?.split?.('/').pop() || Math.random().toString(32).slice(2);

  image.setAttribute('crossOrigin', 'anonymous');

  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, image.width, image.height);
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.download = name;
      a.href = url;
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  };
  image.src = imgSrc;
};

const isImageInfo = (image: string | File | ImageInfo): image is ImageInfo => !!image && typeof image !== 'string' && !(image instanceof File);

export const formatImages = (images: ElImageViewerProps['images']): ImageInfo[] => {
  if (!Array.isArray(images)) return [];
  return images.map((item) => {
    if (isImageInfo(item)) {
      return {
        download: true,
        thumbnail: item.mainImage,
        ...item,
      };
    }
    return {
      mainImage: item,
      thumbnail: item,
      download: true,
    };
  });
};

export const getOverlay = (props: ElImageViewerProps) => {
  if (props.showOverlay !== undefined) {
    return props.showOverlay;
  }
  return props.mode === 'modal';
};
