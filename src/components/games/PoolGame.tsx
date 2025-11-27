import { useEffect, useRef, useState, useCallback } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import Matter from 'matter-js';
import { toast } from 'sonner';

// Endereço do servidor WebSocket do jogo
const WEBSOCKET_URL = 'ws://localhost:8081';

interface PoolGameProps {
  roomId: string;
  isHost: boolean;
}

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
}

export const PoolGame = ({ roomId, isHost }: PoolGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const playerIdRef = useRef<string | null>(null);

  const [aiming, setAiming] = useState(false);
  const [aimStart, setAimStart] = useState({ x: 0, y: 0 });
  const [aimEnd, setAimEnd] = useState({ x: 0, y: 0 });
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [opponentId, setOpponentId] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    playerIdRef.current = playerId;
  }, [playerId]);

  useEffect(() => {
    if (gameState && playerIdRef.current) {
      setIsMyTurn(gameState.currentPlayerId === playerIdRef.current);
    }
  }, [gameState, playerId]);

  // Corpos do cliente usados para exibir a simulação local
  const clientBodiesRef = useRef<{ [key: string]: Matter.Body }>({});

  // --- Sincronização de estado ---
  const handleStateUpdate = useCallback((serverTick: number, serverState: GameState) => {
    setGameState(serverState);
    setIsMyTurn(serverState.currentPlayerId === playerIdRef.current);
  }, []);

  // --- Conexão WebSocket ---
  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket(WEBSOCKET_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      toast.info('Conectado ao servidor de jogo! Procurando partida...');
      setConnectionError(null);
      ws.send(JSON.stringify({ action: 'matchFind' }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'playerID':
          setPlayerId(data.id);
          break;
        case 'waiting':
          toast.info(data.message);
          break;
        case 'gameStart':
          setOpponentId(data.opponentId);
          toast.success(`Partida contra ${data.opponentId} iniciada!`);
          break;
        case 'stateUpdate':
          handleStateUpdate(data.tick, data.state);
          break;
        case 'gameEnd':
          toast.warning(`Fim de Jogo: ${data.message}`);
          break;
        default:
          console.log('Mensagem recebida do servidor:', data);
      }
    };

    ws.onclose = () => {
      setConnectionError('Servidor de jogo indisponivel. Verifique se ws://localhost:8081 esta ativo.');
      toast.error('Conexao com o servidor de jogo perdida.');
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setConnectionError('Nao foi possivel conectar ao servidor de jogo.');
      toast.error('Erro na conexao WebSocket.');
    };
  }, [handleStateUpdate]);

  useEffect(() => {
    if (wsRef.current) return;
    connectWebSocket();

    return () => {
      wsRef.current?.close();
    };
  }, [connectWebSocket]);

  // --- Inicialização do Matter.js (uma vez) ---
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0, scale: 0 } });
    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine,
      options: {
        width: 800,
        height: 400,
        wireframes: false,
        background: '#0a5f38',
      },
    });

    const walls = [
      Matter.Bodies.rectangle(400, 0, 800, 20, { isStatic: true, render: { fillStyle: '#654321' } }),
      Matter.Bodies.rectangle(400, 400, 800, 20, { isStatic: true, render: { fillStyle: '#654321' } }),
      Matter.Bodies.rectangle(0, 200, 20, 400, { isStatic: true, render: { fillStyle: '#654321' } }),
      Matter.Bodies.rectangle(800, 200, 20, 400, { isStatic: true, render: { fillStyle: '#654321' } }),
    ];
    Matter.World.add(engine.world, walls);

    Matter.Render.run(render);
    Matter.Engine.run(engine);

    engineRef.current = engine;
    return () => {
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (render as any).textures = {};
    };
  }, []);

  // --- Replica do estado do servidor dentro do Matter.js ---
  useEffect(() => {
    if (!engineRef.current || !gameState) return;

    const world = engineRef.current.world;
    const currentBodies = clientBodiesRef.current;
    const activeIds = new Set<string>();

    gameState.balls.forEach((ball) => {
      activeIds.add(ball.id);
      let body = currentBodies[ball.id];

      if (!body) {
        body = Matter.Bodies.circle(ball.x, ball.y, 12, {
          restitution: 0.9,
          friction: 0.01,
          frictionAir: 0.01,
          render: { fillStyle: ball.color },
          label: ball.id,
        });
        currentBodies[ball.id] = body;
        Matter.World.add(world, body);
      }

      Matter.Body.setPosition(body, { x: ball.x, y: ball.y });
      Matter.Body.setVelocity(body, { x: ball.velocity_x, y: ball.velocity_y });
    });

    Object.entries(currentBodies).forEach(([id, body]) => {
      if (!activeIds.has(id)) {
        Matter.World.remove(world, body);
        delete currentBodies[id];
      }
    });
  }, [gameState]);

  // --- Input ---
  const isMoving = () => {
    const threshold = 0.1;
    return Object.values(clientBodiesRef.current).some(
      (body) => Math.abs(body.velocity.x) > threshold || Math.abs(body.velocity.y) > threshold
    );
  };

  const getCanvasCoords = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) {
      return { x: 0, y: 0 };
    }
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const handleMouseDown = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    if (!isMyTurn || isMoving() || !playerIdRef.current) return;
    const point = getCanvasCoords(event);
    setAiming(true);
    setAimStart(point);
    setAimEnd(point);
  };

  const handleMouseMove = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    if (!aiming) return;
    setAimEnd(getCanvasCoords(event));
  };

  const handleMouseUp = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    if (!aiming || !isMyTurn || !playerIdRef.current) return;

    const finalPoint = getCanvasCoords(event);
    setAimEnd(finalPoint);

    const dx = aimStart.x - finalPoint.x;
    const dy = aimStart.y - finalPoint.y;
    const force = Math.min(Math.sqrt(dx * dx + dy * dy) / 20, 10);
    const angle = Math.atan2(dy, dx);

    const inputPayload = {
      action: 'hit',
      force,
      angle,
    };

    if (wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          action: 'input',
          playerId: playerIdRef.current,
          payload: inputPayload,
          clientTick: engineRef.current?.timing.timestamp,
        })
      );
    }

    const cueBall = clientBodiesRef.current['white'];
    if (cueBall) {
      Matter.Body.setVelocity(cueBall, {
        x: Math.cos(angle) * force,
        y: Math.sin(angle) * force,
      });
    }

    setAiming(false);
    toast.success('Tacada enviada. Aguardando validacao do servidor...');
  };

  if (!gameState || !playerId) {
    return (
      <div className="text-center p-8">
        <p>Conectando ao servidor de jogo ({WEBSOCKET_URL})...</p>
        <p>Status: {wsRef.current?.readyState === WebSocket.OPEN ? 'Conectado' : 'Aguardando conexao...'}</p>
        {connectionError && <p className="text-red-400 mt-2">{connectionError}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">PlayPool</h2>
        <p className="text-muted-foreground">
          {isMyTurn
            ? isMoving()
              ? 'Aguarde as bolas pararem...'
              : 'Sua vez! Clique e arraste para mirar'
            : 'Turno do oponente'}
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

        {aiming && (
          <svg className="absolute inset-0 pointer-events-none" style={{ width: 800, height: 400 }}>
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
        <div className="text-sm">
          Seu ID: <strong>{playerId}</strong>
        </div>
        <div className="text-sm">
          Oponente: <strong>{opponentId || 'Aguardando Match'}</strong>
        </div>
        <div className="text-sm text-muted-foreground">Sala: {roomId}</div>
        {isHost && <div className="text-xs text-muted-foreground">Host</div>}
      </div>
    </div>
  );
};
