import axios from 'axios';
import { imageSize as sizeOf } from 'image-size';
import crypto from 'crypto';
import { imageCache, incrementCacheHit, incrementCacheMiss } from '../utils/cache.js';
import logger from '../utils/logger.js';

export class ImageService {
    async downloadImage(url: string): Promise<Buffer> {
        try {
            // Generate a hash of the URL to use as cache key
            // Make sure url is a string before hashing
            const urlHash = crypto.createHash('md5').update(String(url)).digest('hex');
            const cacheKey = `image_${urlHash}`;

            // Check if image is cached
            const cachedImage = imageCache.get(cacheKey);
            if (cachedImage) {
                incrementCacheHit();
                logger.debug(`Cache hit for image: ${url}`);
                return cachedImage as Buffer;
            }

            incrementCacheMiss();
            logger.debug(`Cache miss for image: ${url}`);

            // Download the image if not cached
            const response = await axios.get(url, {
                responseType: 'arraybuffer',
                timeout: 5000,
                headers: {
                    'Accept': 'image/*'
                }
            });

            if (response.status !== 200) {
                throw new Error(`Image download failed: ${response.status}`);
            }

            const imageBuffer = Buffer.from(response.data);

            // Cache the downloaded image
            imageCache.set(cacheKey, imageBuffer);

            return imageBuffer;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Failed to download image: ${error.message}`);
            }
            throw error;
        }
    }

    calculatePerimeter(imageBuffer: Buffer): number {
        try {
            // Generate a hash of the buffer to use as cache key
            // Ensure we're hashing a Buffer
            if (!Buffer.isBuffer(imageBuffer)) {
                throw new Error('Invalid image data: not a buffer');
            }

            const bufferHash = crypto.createHash('md5').update(imageBuffer).digest('hex');
            const cacheKey = `perimeter_${bufferHash}`;

            // Check if perimeter calculation is cached
            const cachedPerimeter = imageCache.get(cacheKey);
            if (cachedPerimeter) {
                incrementCacheHit();
                return cachedPerimeter as number;
            }

            incrementCacheMiss();

            const dimensions = sizeOf(imageBuffer);
            if (!dimensions || !dimensions.height || !dimensions.width) {
                throw new Error('Could not determine image dimensions');
            }

            const perimeter = 2 * (dimensions.height + dimensions.width);

            // Cache the calculation result
            imageCache.set(cacheKey, perimeter);

            return perimeter;
        } catch (error) {
            throw new Error(`Error calculating image perimeter: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async simulateGpuProcessing(): Promise<void> {
        // Random sleep between 100ms and 400ms (0.1 to 0.4 seconds)
        const sleepTime = Math.random() * 300 + 100;
        await new Promise(resolve => setTimeout(resolve, sleepTime));
    }
}

export const imageService = new ImageService();