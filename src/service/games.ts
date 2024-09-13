import { ulid } from 'ulid';
import {
  addGameToStore,
  addPlayerToGameInStore,
  getGameFromStore,
  getPlayersFromStore,
  streamData,
  streamPlayersFromStore,
  updateGameDataInStore,
  removeGameFromStore,
  removeOldGameFromStore,
  updateAverageResultsInStore,
} from '../repository/firebase';
import { NewGame } from '../types/game';
import { Player } from '../types/player';
import { Status } from '../types/status';
import { removeGameFromCache, resetPlayers, updatePlayerGames } from './players';
import { CardConfig } from '../components/Players/CardPicker/CardConfigs';

export const addNewGame = async (newGame: NewGame): Promise<string> => {
  const player = {
    name: newGame.createdBy,
    id: ulid(),
    status: Status.NotStarted,
  };
  const gameData = {
    ...newGame,
    id: ulid(),
    average: 0,
    createdById: player.id,
    gameStatus: Status.Started,
  };
  await addGameToStore(gameData.id, gameData);
  await addPlayerToGameInStore(gameData.id, player);
  updatePlayerGames(
    gameData.id,
    gameData.name,
    gameData.createdBy,
    gameData.createdById,
    player.id,
  );

  return gameData.id;
};

export const streamGame = (id: string) => {
  return streamData(id);
};

export const streamPlayers = (id: string) => {
  return streamPlayersFromStore(id);
};

export const getGame = (id: string) => {
  return getGameFromStore(id);
};

export const updateGame = async (gameId: string, updatedGame: any): Promise<boolean> => {
  await updateGameDataInStore(gameId, updatedGame);
  return true;
};

export const resetGame = async (gameId: string) => {
  const game = await getGameFromStore(gameId);
  if (game) {
    const updatedGame = {
      average: 0,
      gameStatus: Status.Started,
    };
    updateGame(gameId, updatedGame);
    await resetPlayers(gameId);
  }
};

export const finishGame = async (gameId: string) => {
  const game = await getGameFromStore(gameId);
  const players = await getPlayersFromStore(gameId);
  const gameAverage = getAverage(players, game ? game.cards : []);

  if (game && players) {
    const updatedGame = {
      average: gameAverage,
      gameStatus: Status.Finished,
    };

    updateGame(gameId, updatedGame);
    updateAverageResultsInStore(gameId, gameAverage);
  }
};

export const getAverage = (players: Player[], gameCards: CardConfig[] = []): number => {
  let values = 0;
  let numberOfPlayersPlayed = 0;
  let average: number;

  players.forEach((player) => {
    if (player.status === Status.Finished && player.value && player.value >= 0) {
      values = values + player.value;
      numberOfPlayersPlayed++;
    }
  });

  average = numberOfPlayersPlayed !== 0 ? Math.ceil(values / numberOfPlayersPlayed) : 0;

  // If the cards array has any content, this section iterates
  // over the content and sets the average from the calculated
  // result to the nearest value in the cards of the calculated
  // value
  if (gameCards.length > 0 && average !== 0) {
    let closestCardValue = Infinity;
    let smallestDifferece = Infinity;

    gameCards.forEach((card) => {
      if (card.value < 0) return;

      let difference = Math.abs(average - card.value);

      if (difference < smallestDifferece) {
        closestCardValue = card.value;
        smallestDifferece = difference;
      }
    });

    average = closestCardValue;
  }

  return average;
};

export const getGameStatus = (players: Player[]): Status => {
  let numberOfPlayersPlayed = 0;
  players.forEach((player: Player) => {
    if (player.status === Status.Finished) {
      numberOfPlayersPlayed++;
    }
  });
  if (numberOfPlayersPlayed === 0) {
    return Status.Started;
  }
  return Status.InProgress;
};

export const updateGameStatus = async (gameId: string): Promise<boolean> => {
  const game = await getGame(gameId);
  if (!game) {
    console.log('Game not found');
    return false;
  }
  const players = await getPlayersFromStore(gameId);
  if (players) {
    const status = getGameStatus(players);
    const dataToUpdate = {
      gameStatus: status,
    };
    const result = await updateGameDataInStore(gameId, dataToUpdate);
    return result;
  }
  return false;
};

export const removeGame = async (gameId: string) => {
  await removeGameFromStore(gameId);
  removeGameFromCache(gameId);
};

export const deleteOldGames = async () => {
  await removeOldGameFromStore();
};
