import React from "react";
import { useState, useEffect } from "react";
import { DNA } from "react-loader-spinner";

const LoadingComponent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true); // Start fading out the loading screen
      setTimeout(() => {
        setIsLoading(false); // Hide the loading screen after fade-out
      }, 500); // Match this duration with the CSS transition duration
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {isLoading ? (
        <div
          className={`flex items-center justify-center h-screen bg-white transition-opacity duration-700 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex flex-col items-center">
            <h1 className="text-blue-600 text-6xl font-bold mb-4">
              Deep<span className="text-stone-800">{`{Code}`}</span>
            </h1>
            <div
              className="relative"
              style={{
                animation: "dna-slide-up 1s ease-out",
                animationFillMode: "forwards",
              }}
            >
              <DNA
                visible={true}
                height="160"
                width="160"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
              />
            </div>
            <style>
              {`
          @keyframes dna-slide-up {
            from {
              transform: translateY(+100px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          svg.dna-wrapper circle:nth-child(odd) { fill: #155dfc !important; }
          svg.dna-wrapper circle:nth-child(even) { fill: #292524 !important; }
              `}
            </style>
          </div>
        </div>
      ) : (
        <div className="fade-in opacity-0 transition-opacity duration-500 opacity-100">
          {children}
        </div>
      )}
    </div>
  );
};

export default LoadingComponent;
