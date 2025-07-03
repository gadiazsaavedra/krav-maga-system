import React, { useState, useRef } from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';

interface MenuOption {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  color?: 'inherit' | 'primary' | 'secondary' | 'error';
}

interface LongPressMenuProps {
  children: React.ReactNode;
  options: MenuOption[];
  longPressDuration?: number;
}

const LongPressMenu: React.FC<LongPressMenuProps> = ({
  children,
  options,
  longPressDuration = 500
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (event: React.TouchEvent) => {
    setIsPressed(true);
    timeoutRef.current = setTimeout(() => {
      if (isPressed) {
        setAnchorEl(elementRef.current);
        // Vibración táctil si está disponible
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }, longPressDuration);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (option: MenuOption) => {
    option.onClick();
    handleClose();
  };

  return (
    <>
      <div
        ref={elementRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{ 
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
      >
        {children}
      </div>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            minWidth: 200,
            boxShadow: 4,
            borderRadius: 2
          }
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={index}
            onClick={() => handleOptionClick(option)}
            sx={{
              color: option.color === 'error' ? 'error.main' : 'inherit',
              py: 1.5
            }}
          >
            {option.icon && (
              <ListItemIcon sx={{ color: 'inherit' }}>
                {option.icon}
              </ListItemIcon>
            )}
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LongPressMenu;