import React, { useState } from "react";
import { X } from "lucide-react";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function Image({ className = "", alt = "", ...props }: ImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-lg">
        {isLoading && (
          <>
            <div
              className={`absolute inset-0 animate-[pulse_1.5s_ease-in-out_infinite] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] ${className}`}
            />
            <Loader />
          </>
        )}
        <img
          {...props}
          alt={alt}
          onClick={(e) => {
            e.preventDefault();
            setIsModalOpen(true);
          }}
          onLoad={() => setIsLoading(false)}
          className={`cursor-pointer transition-transform hover:scale-[1.02] ${className} ${
            isLoading ? "invisible" : ""
          }`}
        />
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <button
              onClick={closeModal}
              className="absolute -right-4 -top-4 z-[101] rounded-full bg-white p-2 shadow-lg transition-transform hover:scale-110 active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative overflow-hidden rounded-lg">
              {isLoading && (
                <>
                  <div
                    className="absolute inset-0 animate-[pulse_1.5s_ease-in-out_infinite] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]"
                    style={{ aspectRatio: "1 / 1" }}
                  />
                  <Loader />
                </>
              )}
              <img
                {...props}
                alt={alt}
                onClick={(e) => e.stopPropagation()}
                className={`max-h-[85vh] max-w-[85vw] rounded-lg object-contain ${
                  isLoading ? "invisible" : ""
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export function Loader() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="h-8 w-8 animate-spin">
        <div className="h-full w-full rounded-full border-4 border-gray-200 border-t-gray-800" />
      </div>
    </div>
  );
}
