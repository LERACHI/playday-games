// PLAYDAY-GAMES/server/GameServer.js
const PhysicsEngine = require('./PhysicsEngine.cjs'); // Importa o motor de física

class GameServer {
    constructor() {
        this.players = {};           // Conexões WebSocket ativas { playerId: ws }
        this.matchmakingQueue = [];  // Fila de jogadores buscando partida
        this.activeGames = {};       // Partidas ativas { gameId: { player1, player2, state, history } }

        this.TICK_RATE = 1000 / 60;  // 60 ticks por segundo
        this.tick = 0;
    }

    addPlayer(ws) {
        // Gera um ID de jogador simples (em produção, use autenticação)
        const playerId = `player_${Math.random().toString(16).slice(2)}`;
        this.players[playerId] = { ws: ws, gameId: null, elo: this.getPlayerElo(playerId) };
        return playerId;
    }

    removePlayer(playerId) {
        // Lógica para remover da fila, se estiver nela
        this.matchmakingQueue = this.matchmakingQueue.filter(id => id !== playerId);
        
        // Lógica para encerrar o jogo, se estiver jogando
        if (this.players[playerId].gameId) {
             this.endGame(this.players[playerId].gameId, `${playerId} desconectou.`);
        }
        
        delete this.players[playerId];
    }
    
    // --- LÓGICA DE MATCHMAKING (matchFind) ---

    getPlayerElo(playerId) {
        // EM PROJETOS REAIS: Consulte Supabase/Banco de Dados.
        // Mock data
        const player = this.players[playerId];
        if (player && player.elo) return player.elo;
        return 1200 + Math.floor(Math.random() * 200); // ELO inicial/aleatório
    }

    matchFind(requestingPlayerId) {
        const player = this.players[requestingPlayerId];
        if (!player) return;

        const playerElo = player.elo;
        let bestMatchIndex = -1;
        let smallestEloDiff = Infinity;
        const MAX_TOLERANCE = 150; 

        // 1. Procura o melhor oponente na fila
        for (let i = 0; i < this.matchmakingQueue.length; i++) {
            const opponentId = this.matchmakingQueue[i];
            // Não parear consigo mesmo
            if (opponentId === requestingPlayerId) continue; 
            
            const opponentElo = this.players[opponentId].elo;
            const eloDiff = Math.abs(playerElo - opponentElo);

            if (eloDiff < smallestEloDiff && eloDiff <= MAX_TOLERANCE) {
                smallestEloDiff = eloDiff;
                bestMatchIndex = i;
            }
        }

        // 2. Processa o resultado
        if (bestMatchIndex !== -1) {
            const opponentId = this.matchmakingQueue.splice(bestMatchIndex, 1)[0];
            
            // Remove o jogador atual da fila caso ele já estivesse lá
            this.matchmakingQueue = this.matchmakingQueue.filter(id => id !== requestingPlayerId);

            console.log(`Partida encontrada: ${requestingPlayerId} (${playerElo}) vs ${opponentId} (${this.players[opponentId].elo})`);
            this.startNewGame(requestingPlayerId, opponentId);

        } else {
            // Adiciona à fila (se já não estiver)
            if (!this.matchmakingQueue.includes(requestingPlayerId)) {
                this.matchmakingQueue.push(requestingPlayerId);
                console.log(`${requestingPlayerId} adicionado à fila de matchmaking.`);
            }
            player.ws.send(JSON.stringify({ type: 'waiting', message: 'Aguardando oponente...' }));
        }
    }

    // --- LÓGICA DE JOGO (Prediction + Rollback) ---

    /**
     * Valida se a posição/input recebido é fisicamente ou logicamente possível.
     */
    verifyMove(playerId, gameId, input) {
        const game = this.activeGames[gameId];
        if (!game) return false;

        // 1. VALIDAÇÕES DE TURNO (apenas o jogador da vez pode fazer o hit)
        if (playerId !== game.state.currentPlayerId) {
            // console.warn(`[REJEITADO] Jogador tentou jogar fora de turno.`);
            return false;
        }

        // 2. VALIDAÇÕES DE FÍSICA
        if (input.action === 'hit') {
            // Limite a força do taco
            if (input.force > 10.0 || input.force < 0.1) { 
                // console.warn(`[REJEITADO] Força impossível: ${input.force}`);
                return false; 
            }
            // Outras verificações de sanidade de coordenadas/ângulos...
        }

        return true;
    }

    handleInput(playerId, gameId, input) {
        if (!this.verifyMove(playerId, gameId, input)) {
            // Opcional: Reconciliação imediata para o cliente trapaceiro
            this.sendStateToPlayer(playerId, this.activeGames[gameId].state);
            return; 
        }

        // Adiciona o input válido na fila do jogo para processamento no próximo tick
        this.activeGames[gameId].pendingInputs.push({ tick: this.tick, playerId, input });
    }
    
    // --- LÓGICA DE EXECUÇÃO ---

    startNewGame(player1Id, player2Id) {
        const gameId = `game_${Date.now()}`;
        
        // Inicializa o estado canônico do jogo (16 bolas, posições iniciais)
        const initialState = PhysicsEngine.initializeGameState(player1Id, player2Id); 
        
        this.activeGames[gameId] = {
            id: gameId,
            players: [player1Id, player2Id],
            state: initialState,
            history: {}, // Histórico de estados para Rollback
            pendingInputs: [],
        };
        
        // Liga os jogadores ao jogo ativo
        this.players[player1Id].gameId = gameId;
        this.players[player2Id].gameId = gameId;
        
        // Notifica os clientes para iniciar a tela de jogo
        const payload = JSON.stringify({ type: 'gameStart', gameId, opponentId: player2Id });
        this.players[player1Id].ws.send(payload);
        this.players[player2Id].ws.send(JSON.stringify({ type: 'gameStart', gameId, opponentId: player1Id }));
    }

    endGame(gameId, reason) {
        // Lógica de Supabase: registrar partida, atualizar XP/ELO, etc.
        // ...
        
        const game = this.activeGames[gameId];
        if (!game) return;

        // Notifica os jogadores
        const payload = JSON.stringify({ type: 'gameEnd', message: reason });
        game.players.forEach(pId => {
            if (this.players[pId] && this.players[pId].ws) {
                this.players[pId].ws.send(payload);
                this.players[pId].gameId = null; // Desliga do jogo
            }
        });
        
        delete this.activeGames[gameId];
    }

    // --- LOOP CENTRAL (60 vezes por segundo) ---

    gameLoop() {
        this.tick++;

        Object.values(this.activeGames).forEach(game => {
            // 1. Processa inputs pendentes (Rollback)
            // (Para simplificar, vamos processar inputs diretamente, mas em um sistema real faria o rollback)
            game.pendingInputs.forEach(input => {
                if (input.action === 'hit') {
                    PhysicsEngine.applyCueHit(game.state, input);
                }
            });
            game.pendingInputs = []; // Limpa inputs processados

            // 2. Executa a Simulação da Física/Regras
            const deltaTime = this.TICK_RATE / 1000;
            game.state = PhysicsEngine.runSimulation(game.state, deltaTime); 

            // 3. Salva o Estado Atual (para Rollback)
            game.history[this.tick] = JSON.parse(JSON.stringify(game.state)); 
            
            // 4. Envia o Estado Canônico (verdadeiro) aos Clientes
            this.broadcastState(game.id, game.state);
        });

        // Agenda o próximo tick
        setTimeout(() => this.gameLoop(), this.TICK_RATE);
    }
    
    broadcastState(gameId, state) {
        const game = this.activeGames[gameId];
        if (!game) return;
        
        const payload = JSON.stringify({ 
            type: 'stateUpdate', 
            tick: this.tick, 
            state: state 
        });

        game.players.forEach(pId => {
            if (this.players[pId] && this.players[pId].ws) {
                this.players[pId].ws.send(payload);
            }
        });
    }

    startLoop() {
        console.log("[GameServer] startLoop() foi chamado e está definido!"); // LINHA NOVA
        this.gameLoop();
    }
}

module.exports = GameServer;