import React, { useState } from 'react';
import { Box, List, ListItem, Paper } from '@mui/material';
import { useDrag } from '@use-gesture/react';

interface DragDropItem {
  id: string | number;
  content: React.ReactNode;
}

interface DragDropListProps {
  items: DragDropItem[];
  onReorder: (newItems: DragDropItem[]) => void;
  renderItem?: (item: DragDropItem, index: number) => React.ReactNode;
}

const DragDropList: React.FC<DragDropListProps> = ({
  items,
  onReorder,
  renderItem
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedOver, setDraggedOver] = useState<number | null>(null);

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    onReorder(newItems);
  };

  const DragDropItem: React.FC<{ item: DragDropItem; index: number }> = ({ item, index }) => {
    const bind = useDrag(
      ({ down, movement: [, my] }) => {
        if (down) {
          setDraggedIndex(index);
          // Calcular sobre qué elemento estamos
          const itemHeight = 60; // Altura aproximada del item
          const newIndex = Math.max(0, Math.min(items.length - 1, 
            index + Math.round(my / itemHeight)
          ));
          setDraggedOver(newIndex);
        } else {
          if (draggedIndex !== null && draggedOver !== null && draggedIndex !== draggedOver) {
            moveItem(draggedIndex, draggedOver);
          }
          setDraggedIndex(null);
          setDraggedOver(null);
        }
      },
      {
        axis: 'y',
        filterTaps: true
      }
    );

    const isDragged = draggedIndex === index;
    const isOver = draggedOver === index && draggedIndex !== index;

    return (
      <Paper
        {...bind()}
        elevation={isDragged ? 8 : 1}
        sx={{
          mb: 1,
          transform: isDragged ? 'scale(1.05)' : 'scale(1)',
          opacity: isDragged ? 0.8 : 1,
          transition: isDragged ? 'none' : 'all 0.2s ease',
          cursor: 'grab',
          touchAction: 'none',
          userSelect: 'none',
          border: isOver ? '2px dashed #1976d2' : '1px solid transparent',
          '&:active': {
            cursor: 'grabbing'
          }
        }}
      >
        <ListItem sx={{ py: 2 }}>
          {renderItem ? renderItem(item, index) : item.content}
        </ListItem>
      </Paper>
    );
  };

  return (
    <List sx={{ p: 0 }}>
      {items.map((item, index) => (
        <DragDropItem key={item.id} item={item} index={index} />
      ))}
    </List>
  );
};

export default DragDropList;