import axios from 'axios';
import { imageSize } from 'image-size';

export class ImageService {

    async downloadImage(url: string): Promise<Buffer> {
        try {
            const response = await axios.get(url, {
                responseType: 'arraybuffer',
                headers: {
                    'Accept': 'image/*'
                }
            });
            if (response.status !== 200) {
                throw new Error(`Image download failed: ${response.status}`);
            }
            return Buffer.from(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Failed to download image: ${error.message}`);
            }
            throw error;
        }
    }

    calculatePerimeter(imageBuffer: Buffer): number {
        try {
            const dimensions = imageSize(imageBuffer);
            if (!dimensions || !dimensions.height || !dimensions.width) {
                throw new Error('Could not determine image dimensions');
            }
            return 2 * (dimensions.height + dimensions.width);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(`Error calculating image perimeter: ${String(error)}`);
        }
    }

    async simulateGpuProcessing(): Promise<void> {
        

        // Random sleep between 100ms and 400ms (0.1 to 0.4 seconds)
        const sleepTime = Math.random() * 300 + 100;
        await new Promise(resolve => setTimeout(resolve, sleepTime));
    }
}

export const imageService = new ImageService();