/**
 * Utility to compress and resize images before uploading/storing
 * to avoid payload size limits (especially Vercel's 4.5MB limit).
 */

export const compressImage = (base64Str: string, maxWidth = 1200, maxHeight = 1200, quality = 0.7): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(base64Str); // Fallback
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to webp if possible for better compression, else jpeg
            const compressed = canvas.toDataURL('image/jpeg', quality);
            resolve(compressed);
        };
        img.onerror = () => {
            resolve(base64Str); // Fallback
        };
    });
};
