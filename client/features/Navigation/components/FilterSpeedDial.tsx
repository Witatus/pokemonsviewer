import React, { useState } from 'react';
import { SpeedDial, SpeedDialAction } from '@mui/lab';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';

const actions = [
  { name: 'Filter', icon: <FilterListIcon /> },
  { name: 'Sort', icon: <SortIcon /> },
];

const FilterButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClick = (actionName: string) => {
    console.log(`Clicked ${actionName}`);
    handleClose();
  };

  return (
    <SpeedDial
      ariaLabel="Filter Sort Menu"
      sx={{
        position: 'fixed',
        bottom: 32, // Increase the distance from the bottom
        right: 32, // Increase the distance from the right
        '& .MuiSpeedDial-fab': {
          width: 150, // Increase the width
          height: 150, // Increase the height
        },
      }}
      icon={<FilterListIcon sx={{ fontSize: '5rem' }} />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      direction="up"
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          onClick={() => handleClick(action.name)}
        />
      ))}
    </SpeedDial>
  );
};

export default FilterButton;
