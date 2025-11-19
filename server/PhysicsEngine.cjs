// PLAYDAY-GAMES/server/PhysicsEngine.js

/**
 * Motor de Física Determinística para 8 Ball Pool.
 * Este módulo DEVE ser usado tanto no Servidor (para Rollback) 
 * quanto no Cliente (para Prediction).
 */

class PhysicsEngine {

    /**
     * Inicializa o estado de 8 Ball Pool (16 bolas) para uma nova partida.
     */
    static initializeGameState(player1Id, player2Id) {
        // EM PROJETOS REAIS: Defina as coordenadas X/Y de cada bola
        const balls = [
            { id: 'white', x: 100, y: 300, color: 'white', velocity_x: 0, velocity_y: 0, speed: 0 },
            { id: '8_ball', x: 500, y: 300, color: 'black', velocity_x: 0, velocity_y: 0, speed: 0 },
            // ... Adicione as outras 14 bolas (sólidas e listradas)
        ];
        
        return {
            balls: balls,
            currentPlayerId: player1Id, // Começa com o jogador 1
            // Adicione outras propriedades (placar, bolas_do_jogador1, etc.)
        };
    }

    /**
     * Roda um único tick de simulação.
     * @param {Object} gameState - O estado atual do jogo.
     * @param {number} deltaTime - O tempo que passou desde o último tick.
     * @returns {Object} O novo estado do jogo após a simulação.
     */
    static runSimulation(gameState, deltaTime) {
        
        // --- 1. Movimento e Atrito ---
        gameState.balls.forEach(ball => {
            if (ball.speed > 0) {
                // Atualiza posição
                ball.x += ball.velocity_x * deltaTime;
                ball.y += ball.velocity_y * deltaTime;
                
                // Aplica atrito (Placeholder para simulação)
                ball.speed *= 0.995; 
                if (ball.speed < 0.01) {
                    ball.speed = 0; // Parada da bola
                }
            }
        });

        // --- 2. Detecção de Colisões (O mais difícil) ---
        // AQUI ENTRARIA a lógica complexa de colisão bola-bola e bola-borda
        
        // --- 3. Verificação de Caçapas (Pockets) ---
        // Se a bola estiver perto de uma caçapa, remova-a e chame a lógica de regras.

        return gameState;
    }
    
    /**
     * Aplica o impulso do taco na bola branca.
     */
    static applyCueHit(gameState, input) {
        const whiteBall = gameState.balls.find(b => b.id === 'white');
        if (whiteBall && whiteBall.speed === 0) {
            // Converte força e ângulo em componentes X e Y
            whiteBall.velocity_x = Math.cos(input.angle) * input.force;
            whiteBall.velocity_y = Math.sin(input.angle) * input.force;
            whiteBall.speed = input.force;
        }
    }
}

module.exports = PhysicsEngine;