"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getPublicImages } from "@/lib/actions";
import { Loader2 } from "lucide-react";

type ImageGalleryModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onImageSelect: (imageUrl: string) => void;
};

export function ImageGalleryModal({ isOpen, onClose, onImageSelect }: ImageGalleryModalProps) {
    const [images, setImages] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (isOpen) {
            const fetchImages = async () => {
                setIsLoading(true);
                const imagePaths = await getPublicImages();
                setImages(imagePaths);
                setIsLoading(false);
            };
            fetchImages();
        }
    }, [isOpen]);

    const handleSelect = (imageUrl: string) => {
        onImageSelect(imageUrl);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Seleccionar Imagen de la Galería</DialogTitle>
                    <DialogDescription>
                        Haz clic en una imagen para asignarla al poema.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[70vh] overflow-y-auto p-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {images.map((src) => (
                                <div key={src} className="relative aspect-square cursor-pointer group" onClick={() => handleSelect(src)}>
                                    <Image
                                        src={src}
                                        alt="Imagen de la galería"
                                        fill
                                        className="object-cover rounded-md"
                                        sizes="(max-width: 768px) 50vw, 20vw"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                                        <p className="text-white font-bold">Seleccionar</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
