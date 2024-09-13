import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Divider,
} from '@material-ui/core';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { Game } from '../../../types/game';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 300,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 300,
  },
  toggleButton: {
    position: 'absolute',
    top: '50%',
    left: 0,
    transform: 'translateY(-50%)',
  },
  drawerHeader: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(1),
  },
  content: {
    textAlign: 'center',
    padding: theme.spacing(2),
  },
}));

interface GameResultsProps {
  game: Game;
}

export const GameResults: React.FC<GameResultsProps> = ({ game }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <Drawer
        variant='persistent'
        anchor='left'
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeft />
          </IconButton>
        </div>
        <Divider />
        <Typography variant='h6' className={classes.content}>
          {t('GameResults.title')}
        </Typography>
        <List>
          {game.results?.map((result: Number, index: Number) => (
            <ListItem key={index.toString()}>
              <ListItemText
                primary={`${t(
                  index !== (game.results?.length ?? 0) - 1
                    ? 'GameResults.gameID'
                    : 'GameResults.lastGameID',
                )}: ${index}`}
                secondary={`${t('GameResults.average')}: ${result}`}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
      {!open && (
        <IconButton onClick={toggleDrawer} className={classes.toggleButton}>
          <ChevronRight />
        </IconButton>
      )}
    </>
  );
};
