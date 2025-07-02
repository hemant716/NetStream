
"use client";
import React, { useRef, useState } from "react";
import { ImageKitProvider, IKImage, IKVideo, IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Progress } from "@/components/ui/progress";
type Props = {}

const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY!;
const privateKey = process.env.PRIVATE_KEY!;
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const authenticator = async () => {
    try {
        // Perform the request to the upload authentication endpoint.
        const response = await fetch("http://localhost:3000/api/upload-auth");
        if (!response.ok) {
            // If the server response is not successful, extract the error text for debugging.
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        // Parse and destructure the response JSON for upload credentials.
        const data = await response.json();
        const { signature, expire, token, publicKey } = data;
        return { signature, expire, token, publicKey };
    } catch (error) {
        // Log the original error for debugging before rethrowing a new error.
        console.error("Authentication error:", error);
        throw new Error("Authentication request failed");
    }
};
type IKUploadProps = {
    setVideoUrl?: (videoUrl: string) => void;
    setThumbnailUrl?: (thumbnailUrl: string) => void;
};

export default function Upload({ setVideoUrl, setThumbnailUrl }: IKUploadProps) {
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onError = (err: any) => {
        console.log("Error", err);
        setError(err.message);
        setUploadProgress(null);
    };

    const onSuccess = (res: IKUploadResponse) => {
        if (setVideoUrl && res.url) {
            setVideoUrl(res.url);
        }
        if (setThumbnailUrl && res.thumbnailUrl) {
            setThumbnailUrl(res.url);
        }
        setUploadProgress(100);
        setError(null);
    };

    const onUploadProgress = (evt: ProgressEvent<XMLHttpRequestEventTarget>) => {
        if (evt.lengthComputable) {
            const progress = Math.round(evt.loaded / evt.total / 100);
            setUploadProgress(progress);
        }
    };

    const onUploadStart = () => {
        setUploadProgress(0);
        setError(null);
    };

    return (
        <ImageKitProvider
            publicKey={publicKey}
            urlEndpoint={urlEndpoint}
            authenticator={authenticator}
        >
            <IKUpload
                useUniqueFileName={true}
                validateFile={(file) => file.size < 20 * 1024 * 1024}
                folder={"/netflix-uploads"}
                onError={onError}
                onSuccess={onSuccess}
                onUploadProgress={onUploadProgress}
                onUploadStart={onUploadStart}
                className="mt-1 block w-full text-sm tex-gray-900 file:mr-4 file:px-4 file:py-2 file:rounded-md"
            />

            {/* Show progress bar only when upload is in progress  */}
            {uploadProgress !== null && (
                <div className="mt-4">
                    <Progress value={uploadProgress} className="h-2" />
                </div>
            )}

            {/* Show error message if upload fails  */}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </ImageKitProvider>
    );
}

