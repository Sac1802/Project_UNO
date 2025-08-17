export function limitTimeGame(game, time){
    const timeLimit = time * 60;
    const startTime = Date.now() + timeLimit;
    game.timeLimit = startTime;
}