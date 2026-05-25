import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
}


let activePortalsCount = 0;

export function Portal({ children }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    activePortalsCount++;
    const root = document.getElementById('root');
    if (root) {
      root.classList.add('modal-open-blur');
    }
    
    return () => {
      setMounted(false);
      activePortalsCount--;
      if (activePortalsCount === 0 && root) {
        root.classList.remove('modal-open-blur');
      }
    };
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}

