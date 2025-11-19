// C:\Users\USER\Desktop\playday-games\src\components\games\PoolGame.tsx

import { useEffect, useRef, useState, useCallback } from 'react';
import Matter, { Engine } from 'matter-js';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// URL do seu servidor WebSocket rodando na porta 8080
const WEBSOCKET_URL = "ws://localhost:8081"; 

interface PoolGameProps {
  roomId: string;
  isHost: boolean;
}

// O estado do jogo (deve espelhar o estado canônico do servidor)
interface BallState {
  id: string; 
  x: number; 
  y: number; 
  velocity_x: number; 
  velocity_y: number;
  speed: number;
  color: string; 
}

interface GameState {
  balls: BallState[];
  currentPlayerId: string;
  // Adicione outras propriedades do estado aqui
}

export const PoolGame = ({ roomId, isHost }: PoolGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const [aiming, setAiming] = useState(false);
  const [aimStart, setAimStart] = useState({ x: 0, y: 0 });
  const [aimEnd, setAimEnd] = useState({ x: 0, y: 0 });
  
  // Dados do Servidor (Estado Canônico)
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null); 
  const [opponentId, setOpponentId] = useState<string | null>(null);
  
  const { user } = useAuth();
  
  // Refs para os corpos do Matter.js no cliente (para Prediction e Renderização)
  const clientBodiesRef = useRef<{ [key: string]: Matter.Body }>({});

  // ----------------------------------------------------------------------
  // CONEXÃO E SINCRONIZAÇÃO WEBSOCKET
  // ----------------------------------------------------------------------

  const handleStateUpdate = useCallback((serverTick: number, serverState: GameState) => {
    // 1. Aplica o estado canônico (Rollback/Correção)
    setGameState(serverState);
    
    // 2. Atualiza a flag de turno
    setIsMyTurn(serverState.currentPlayerId === playerId);
    
    // 3. (A SER IMPLEMENTADO): Lógica de Prediction e Rollback
    // Aqui, o cliente compara o estado local previsto (Prediction) com o serverState
    // e corrige (Rollback) se houver discrepância.
    
    serverState.balls.forEach(ball => {
        const body = clientBodiesRef.current[ball.id];
        if (body) {
            // No momento, apenas forçamos a posição do servidor (para garantir o visual)
            // Em um sistema full-rollback, você aplicaria a correção aqui.
            Matter.Body.setPosition(body, { x: ball.x, y: ball.y });
            Matter.Body.setVelocity(body, { x: ball.velocity_x, y: ball.velocity_y });
        }
    });

  }, [playerId]);

  const connectWebSocket = useCallback(() => {
    wsRef.current = new WebSocket(WEBSOCKET_URL);

    wsRef.current.onopen = () => {
      toast.info('Conectado ao servidor de jogo! Iniciando busca de partida...');
      // 1. Envia a solicitação de Matchmaking ao GameServer
      wsRef.current?.send(JSON.stringify({ action: 'matchFind' }));
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'playerID':
          setPlayerId(data.id); // Armazena o ID único dado pelo servidor
          break;
        case 'waiting':
          // O servidor está buscando um oponente
          toast.info(data.message);
          break;
        case 'gameStart':
          // Partida encontrada! Inicia a renderização do jogo
          setOpponentId(data.opponentId);
          toast.success(`Partida contra ${data.opponentId} iniciada!`);
          break;
        case 'stateUpdate':
          // Recebe o estado canônico do jogo (Rollback)
          handleStateUpdate(data.tick, data.state);
          break;
        case 'gameEnd':
          toast.warning(`Fim de Jogo: ${data.message}`);
          // Você pode querer chamar `leaveRoom()` aqui
          break;
        default:
          console.log("Mensagem recebida do servidor:", data);
      }
    };

    wsRef.current.onclose = () => {
      toast.error('Conexão com o servidor de jogo perdida.');
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
      toast.error('Erro na conexão WebSocket.');
    };
  }, [handleStateUpdate]);

  // ----------------------------------------------------------------------
  // INICIALIZAÇÃO E RENDERIZAÇÃO MATTER.JS
  // ----------------------------------------------------------------------

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Garante que a conexão WebSocket seja feita apenas uma vez
    if (!wsRef.current) {
        connectWebSocket();
    }
    
    // 1. Cria o Engine Matter.js (Apenas para renderização/Prediction)
    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0, scale: 0 } });
    engineRef.current = engine;

    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: { 
        width: 800, height: 400, wireframes: false, background: '#0a5f38',
      },
    });
    renderRef.current = render;
    
    // 2. Cria as Bordas (Walls)
    const walls = [
      Matter.Bodies.rectangle(400, 0, 800, 20, { isStatic: true, render: { fillStyle: '#654321' } }),
      Matter.Bodies.rectangle(400, 400, 800, 20, { isStatic: true, render: { fillStyle: '#654321' } }),
      Matter.Bodies.rectangle(0, 200, 20, 400, { isStatic: true, render: { fillStyle: '#654321' } }),
      Matter.Bodies.rectangle(800, 200, 20, 400, { isStatic: true, render: { fillStyle: '#654321' } }),
    ];
    Matter.World.add(engine.world, walls);

    // 3. Popula a Renderização com Corpos (usando o estado inicial do servidor, se disponível)
    if (gameState) {
        // Recria os corpos do Matter.js com base no estado canônico inicial
        gameState.balls.forEach(ballData => {
            const body = Matter.Bodies.circle(ballData.x, ballData.y, 12, {
                restitution: 0.9,
                friction: 0.01,
                frictionAir: 0.01,
                render: { fillStyle: ballData.color },
                label: ballData.id,
            });
            clientBodiesRef.current[ballData.id] = body;
            Matter.World.add(engine.world, body);
        });
    }

    // 4. Inicia Renderização e Engine (para Prediction local)
    Matter.Render.run(render);
    Matter.Engine.run(engine); 

    // Limpeza
    return () => {
      wsRef.current?.close();
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
    };
  }, [connectWebSocket, gameState]); // gameState na dependência para recriar bolas quando o estado inicial chega


  // ----------------------------------------------------------------------
  // LÓGICA DE INPUT E ENVIO AO SERVIDOR
  // ----------------------------------------------------------------------

  const isMoving = () => {
     // Verifica se alguma bola no CLIENTE está se movendo (para impedir nova tacada)
     const threshold = 0.1;
     return Object.values(clientBodiesRef.current).some(body => 
         Math.abs(body.velocity.x) > threshold || Math.abs(body.velocity.y) > threshold
     );
  };
  
  const handleMouseUp = () => {
    if (!aiming || !isMyTurn) return;

    const dx = aimStart.x - aimEnd.x;
    const dy = aimStart.y - aimEnd.y;
    const force = Math.min(Math.sqrt(dx * dx + dy * dy) / 20, 10); // Limite de força
    
    const angle = Math.atan2(dy, dx);
    // Nota: O servidor é responsável por aplicar essa força, não o cliente!

    // 1. ENVIA O INPUT AO SERVIDOR (INPUT CLIENTE)
    const inputPayload = {
      action: 'hit',
      force: force,
      angle: angle,
    };
    
    // Envio para o GameServer (via server.js)
    if (wsRef.current && playerId) {
      wsRef.current.send(JSON.stringify({ 
        action: 'input',
        playerId: playerId,
        payload: inputPayload,
        // Adicione o tick local para o servidor auxiliar no Rollback
        clientTick: engineRef.current?.timing.timestamp 
      }));
    }

    // 2. EXECUTA PREDICTION LOCAL (opcional, para sentir a tacada imediatamente)
    // Opcionalmente, você pode aplicar a força na bola branca localmente
    // para dar a sensação de resposta imediata, mas o servidor irá corrigir.
    const cueBall = clientBodiesRef.current['white']; 
    if (cueBall) {
        // Isso é a Prediction. O estado canônico do servidor vai sobrepor isso.
        Matter.Body.setVelocity(cueBall, { 
             x: Math.cos(angle) * force, 
             y: Math.sin(angle) * force 
        });
    }

    setAiming(false);
    toast.success('Tacada enviada. Aguardando validação do servidor...');
  };
  
  // Handlers simples para mirar (Mantidos do código original)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
     if (!isMyTurn || isMoving() || !playerId) return;
     // ... (lógica de setAiming, setAimStart, setAimEnd)
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
     if (!aiming) return;
     // ... (lógica de setAimEnd)
  };

  // ... (use effect para eventos de mouse) ... (mantido do original)

  // ----------------------------------------------------------------------
  // RENDERIZAÇÃO
  // ----------------------------------------------------------------------

  // Se o GameState ainda não chegou ou o ID não foi atribuído
  if (!gameState || !playerId) {
      return (
          <div className="text-center p-8">
              <p>Conectando ao servidor de jogo ({WEBSOCKET_URL})...</p>
              <p>Status: {wsRef.current?.readyState === WebSocket.OPEN ? 'Conectado' : 'Aguardando conexão...'}</p>
          </div>
      );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">8 Ball Pool</h2>
        <p className="text-muted-foreground">
          {isMyTurn ? (isMoving() ? 'Aguarde as bolas pararem...' : 'Sua vez! Clique e arraste para mirar') : 'Turno do oponente'}
        </p>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="border-4 border-primary rounded-lg cursor-crosshair"
          style={{ width: 800, height: 400 }}
        />

        {/* Lógica de mira (SVG) mantida */}
        {aiming && (
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ width: 800, height: 400 }}
          >
            <line
              x1={aimStart.x}
              y1={aimStart.y}
              x2={aimEnd.x}
              y2={aimEnd.y}
              stroke="#ffffff"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <circle cx={aimStart.x} cy={aimStart.y} r="4" fill="#ffffff" />
          </svg>
        )}
      </div>

      <div className="flex gap-4 items-center">
        <div className="text-sm">Seu ID: <strong>{playerId}</strong></div>
        <div className="text-sm">Oponente: <strong>{opponentId || 'Aguardando Match'}</strong></div>
        <div className="text-sm text-muted-foreground">Sala: {roomId}</div>
      </div>
    </div>
  );
};