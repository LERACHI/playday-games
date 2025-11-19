// PLAYDAY-GAMES/server/server.cjs
// IMPORTANTE: Aqui usamos require() porque o arquivo é .cjs

const express = require('express');
const http = require('http');
// O módulo 'ws' exporta o construtor do servidor diretamente em CommonJS:
const WebSocket = require('ws'); 
const GameServer = require('./GameServer.cjs'); // Importa a classe GameServer

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const GAME_PORT = 8081; // Usando a porta 8081 para evitar EADDRINUSE

// 1. Inicializa a Instância do Servidor de Jogo
const gameServer = new GameServer();

// --- LINHAS DE DEBUG ATIVADAS PARA DIAGNOSTICAR O ERRO startLoop ---
console.log('Objeto retornado por require (GameServer):', GameServer); // DEBUG
console.log('Tipo de gameServer.startLoop:', typeof gameServer.startLoop); // DEBUG
// -------------------------------------------------------------------

wss.on('connection', (ws) => {
    // 2. Adiciona o Novo Jogador e Obtém o ID
    const playerId = gameServer.addPlayer(ws);
    console.log(`[CONECTADO] Jogador: ${playerId}`);
    
    // Envia o ID para o cliente (útil para que o cliente saiba quem ele é)
    ws.send(JSON.stringify({ type: 'playerID', id: playerId }));

    ws.on('message', (message) => {
        // Se a mensagem for um Buffer (padrão em 'ws'), use .toString()
        // A linha abaixo já faz a conversão e parse para JSON
        const data = JSON.parse(message.toString()); 
        
        // 3. Processa Ações do Cliente
        const player = gameServer.players[playerId];
        
        switch (data.action) {
            case 'matchFind':
                gameServer.matchFind(playerId); 
                break;
            case 'input':
                if (player.gameId) {
                    gameServer.handleInput(playerId, player.gameId, data.payload);
                } else {
                    console.warn(`Input recebido de ${playerId} sem jogo ativo.`);
                }
                break;
            default:
                console.log(`Ação desconhecida: ${data.action}`);
        }
    });

    ws.on('close', () => {
        gameServer.removePlayer(playerId);
        console.log(`[DESCONECTADO] Jogador: ${playerId}`);
    });
});

server.listen(GAME_PORT, () => {
    console.log(`Servidor WebSocket de Jogo rodando em ws://localhost:${GAME_PORT}`);
    // 4. Inicia o Loop de Tick do Jogo
    gameServer.startLoop();
});