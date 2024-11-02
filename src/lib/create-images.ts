import { AtpAgent, } from "@atproto/api";
import imageCompression from "browser-image-compression/dist/browser-image-compression"
import { dataURItoBlob } from "../utils/uri-to-blob";

// copied from https://github.com/mimonelu/klearsky/blob/589314d3e8eff4cdaca0d57081b2a35b099c59ce/src/composables/atp-wrapper/create/create-file-blob-ref.ts#L68
const convertMapForCompress: { [mimeType: string]: string } = {
    "image/apng": "image/jpeg",
    "image/avif": "image/jpeg",
    "image/bmp": "image/jpeg",
    "image/gif": "image/jpeg",
    "image/jpeg": "image/jpeg",
    "image/png": "image/jpeg",
    "image/svg+xml": "image/jpeg",
    "image/webp": "image/jpeg",
}

export const createImages = async (
    agent: AtpAgent,
    images: string[],
) => {
    

    const result: any[] = [];

    const maxFileSize = 0.953671875 // 953.671875 KB
    const maxWidth = 2000;
    const maxHeight = 2000;

    for (const image of images) {
        const blob = dataURItoBlob(image);
        const currentFileSize = blob.size / 1024 // KB
        const convertMapType = convertMapForCompress[blob.type];

        if (currentFileSize > maxFileSize) {
            const compressedImage = await imageCompression(new File([blob], 'image', { type: blob.type }), {
                maxSizeMB: maxFileSize,
                maxWidthOrHeight: Math.max(maxWidth ?? 0, maxHeight ?? 0) || undefined,
                useWebWorker: true,
                fileType: convertMapType,
            })
            const compressedBlob = new Blob([compressedImage], { type: convertMapType });
            const compressedBlobRef = await agent.uploadBlob(compressedBlob, {
                encoding: convertMapType,
            })
            result.push(compressedBlobRef.data.blob)
        } else {
            const blobRef = await agent.uploadBlob(blob, {
                encoding: blob.type,
            })
            result.push(blobRef.data.blob)
        }
    }

    return result;
}