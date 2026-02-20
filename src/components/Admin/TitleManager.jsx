// components/TitleManager.js
'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { pageTitles, defaultTitle } from '../utils/pageTitles';

const TitleManager = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Get the title from config or use default
    const pageTitle = pageTitles[pathname] || defaultTitle;
    
    // Set the page title
    document.title = `${pageTitle} - ATD Money`;
    
    
    
  }, [pathname]);

  return null;
};

export default TitleManager;