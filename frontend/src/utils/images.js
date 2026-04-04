import { API_ORIGIN } from './api';

export const PLACEHOLDER_IMAGE = '/pizza-placeholder.svg';

export const resolveImageUrl = (image) => {
  if (!image) {
    return PLACEHOLDER_IMAGE;
  }

  if (/^https?:\/\//i.test(image) || image.startsWith('data:')) {
    return image;
  }

  if (image.startsWith('/uploads/')) {
    return `${API_ORIGIN}${image}`;
  }

  return image;
};
