import { Card, CardContent, Grow, Slide, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { updatePlayerValue } from '../../../service/players';
import { Game } from '../../../types/game';
import { Player } from '../../../types/player';
import { Status } from '../../../types/status';
import { CardConfig, getCards, getRandomEmoji } from './CardConfigs';
import './CardPicker.css';
import { GoogleAd } from '../../GoogleAd/GoogleAd';
import { useTranslation } from 'react-i18next';

interface CardPickerProps {
  game: Game;
  players: Player[];
  currentPlayerId: string;
}
export const CardPicker: React.FC<CardPickerProps> = ({ game, players, currentPlayerId }) => {
  const { t } = useTranslation();
  const [randomEmoji, setRandomEmoji] = useState(getRandomEmoji);
  const playPlayer = (gameId: string, playerId: string, card: CardConfig) => {
    if (game.gameStatus !== Status.Finished) {
      updatePlayerValue(gameId, playerId, card.value, randomEmoji);
    }
  };

  useEffect(() => {
    if (game.gameStatus === Status.Started) {
      setRandomEmoji(getRandomEmoji);
    }
  }, [game.gameStatus]);

  const cards = game.cards?.length ? game.cards : getCards(game.gameType);

  return (
    <Grow in={true} timeout={100}>
      <div>
        <div
          className='CardPickerContainer'
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            maxWidth: '1200px',
          }}
        >
          {cards.map((card: CardConfig, index) => (
            <div key={card.value} style={{ flex: '0 1 130px', textAlign: 'center' }}>
              <Slide in={true} direction={'right'} timeout={(100 * index) / 2}>
                <Card
                  id={`card-${card.displayValue}`}
                  className='CardPicker'
                  variant='outlined'
                  onClick={() => playPlayer(game.id, currentPlayerId, card)}
                  style={{
                    ...getCardStyle(players, currentPlayerId, card),
                    pointerEvents: getPointerEvent(game),
                  }}
                >
                  <CardContent className='CardContent'>
                    {card.value >= 0 && (
                      <>
                        <Typography className='CardContentTop' variant='caption'>
                          {card.displayValue}
                        </Typography>

                        <Typography
                          className='CardContentMiddle'
                          variant={card.displayValue.length < 2 ? 'h4' : 'h5'}
                        >
                          {card.displayValue}
                        </Typography>
                        <Typography className='CardContentBottom' variant='caption'>
                          {card.displayValue}
                        </Typography>
                      </>
                    )}
                    {card.value === -1 && (
                      <Typography className='CardContentMiddle' variant='h3'>
                        {randomEmoji}
                      </Typography>
                    )}
                    {card.value === -2 && (
                      <Typography className='CardContentMiddle' variant='h3'>
                        ❓
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Slide>
            </div>
          ))}
        </div>
        {/* <div className='CardPickerContainer'>
          <Grid container spacing={4} justify='center'>
            {cards.map((card: CardConfig, index) => (
              <Grid className='CentralizedCard' key={card.value} item xs>
                <Slide in={true} direction={'right'} timeout={(100 * index) / 2}>
                  <Card
                    id={`card-${card.displayValue}`}
                    className='CardPicker'
                    variant='outlined'
                    onClick={() => playPlayer(game.id, currentPlayerId, card)}
                    style={{
                      ...getCardStyle(players, currentPlayerId, card),
                      pointerEvents: getPointerEvent(game),
                    }}
                  >
                    <CardContent className='CardContent'>
                      {card.value >= 0 && (
                        <>
                          <Typography className='CardContentTop' variant='caption'>
                            {card.displayValue}
                          </Typography>

                          <Typography
                            className='CardContentMiddle'
                            variant={card.displayValue.length < 2 ? 'h4' : 'h5'}
                          >
                            {card.displayValue}
                          </Typography>
                          <Typography className='CardContentBottom' variant='caption'>
                            {card.displayValue}
                          </Typography>
                        </>
                      )}
                      {card.value === -1 && (
                        <Typography className='CardContentMiddle' variant='h3'>
                          {randomEmoji}
                        </Typography>
                      )}
                      {card.value === -2 && (
                        <Typography className='CardContentMiddle' variant='h3'>
                          ❓
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        </div> */}
        <Typography variant='h6'>
          {game.gameStatus !== Status.Finished
            ? t('Poker.cardPicker.sessionReady')
            : t('Poker.cardPicker.sessionNotReady')}
        </Typography>
        <GoogleAd />
      </div>
    </Grow>
  );
};

const getCardStyle = (players: Player[], playerId: string, card: CardConfig) => {
  const player = players.find((player) => player.id === playerId);
  if (player && player.value !== undefined && player.value === card.value) {
    return {
      marginTop: '-15px',
      zIndex: 5,
      backgroundColor: card.color,
      border: '2px dashed black',
      boxShadow: '0 0px 12px 0 grey',
    };
  }
  return { backgroundColor: card.color };
};

const getPointerEvent = (game: Game) => {
  if (game.gameStatus === Status.Finished) {
    return 'none';
  }
  return 'inherit';
};
