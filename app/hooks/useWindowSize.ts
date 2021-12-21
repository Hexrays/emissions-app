import * as React from 'react';

function getSize() {
  const isClient = typeof window === 'object';
  return {
    width: isClient ? window.innerWidth : undefined,
    height: isClient ? window.innerHeight : undefined,
  };
}

export default function useWindowSize() {
  const [windowSize, setWindowSize] = React.useState(getSize);

  React.useEffect(() => {
    const isClient = typeof window === 'object';
    if (isClient) {
      function handleResize() {
        setWindowSize(getSize());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return windowSize;
}
