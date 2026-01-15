import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary (solo si las variables están disponibles)
// Esto se ejecuta en runtime, no en build time
export function configureCloudinary() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    return true;
  }
  return false;
}

// Configurar al importar el módulo
configureCloudinary();

export { cloudinary };
