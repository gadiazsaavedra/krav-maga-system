import React, { useState, useRef } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useDrag } from '@use-gesture/react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 80
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const bind = useDrag(
    ({ down, movement: [, my], velocity: [, vy] }) => {
      // Solo activar si estamos en la parte superior
      if (containerRef.current?.scrollTop !== 0) return;
      
      if (down && my > 0) {
        setPullDistance(Math.min(my, threshold * 1.5));
      } else if (!down && pullDistance > threshold && !isRefreshing) {
        handleRefresh();
      } else if (!down) {
        setPullDistance(0);
      }
    },
    {
      axis: 'y',
      filterTaps: true,
      rubberband: true
    }
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
    }
  };

  const refreshOpacity = Math.min(pullDistance / threshold, 1);
  const shouldShowRefresh = pullDistance > 20 || isRefreshing;

  return (
    <Box
      ref={containerRef}
      {...bind()}
      sx={{
        height: '100%',
        overflow: 'auto',
        touchAction: 'pan-y',
        transform: `translateY(${isRefreshing ? 60 : Math.min(pullDistance * 0.5, 30)}px)`,
        transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s ease' : 'none'
      }}
    >
      {/* Indicador de refresh */}
      {shouldShowRefresh && (
        <Box
          sx={{
            position: 'absolute',
            top: -60,
            left: 0,
            right: 0,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: refreshOpacity,
            zIndex: 1000
          }}
        >
          {isRefreshing ? (
            <CircularProgress size={24} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {pullDistance > threshold ? '↓ Suelta para actualizar' : '↓ Desliza para actualizar'}
            </Typography>
          )}
        </Box>
      )}
      
      {children}
    </Box>
  );
};

export default PullToRefresh;