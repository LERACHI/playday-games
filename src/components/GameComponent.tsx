// Exemplo: src/components/GameComponent.tsx

import { WEBSOCKET_URL } from '../utils/config';

// ...
const socket = new WebSocket(WEBSOCKET_URL);

socket.onopen = () => {
    console.log("Conexão WebSocket estabelecida com o servidor de jogo!");
    // Envie o ID do jogador ou token de autenticação
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Aqui você recebe o estado canônico do servidor (Rollback)
    // E atualiza a interface do seu jogo
    console.log("Estado recebido do servidor:", data);
};

socket.onclose = () => {
    console.log("Conexão WebSocket encerrada.");
};

// ...