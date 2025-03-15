
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState('fadeIn');
  
  useEffect(() => {
    if (location.pathname !== displayChildren.props.location.pathname) {
      setTransitionStage('fadeOut');
      
      const timeout = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage('fadeIn');
      }, 300); // Match this with your CSS transition time
      
      return () => clearTimeout(timeout);
    }
  }, [location, children, displayChildren.props.location.pathname]);
  
  return (
    <div 
      className={`transition-all duration-300 ease-apple ${
        transitionStage === 'fadeIn' ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
