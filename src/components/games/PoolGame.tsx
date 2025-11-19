import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface PoolGameProps {
  roomId: string;
  isHost: boolean;
}

interface GameState {
  balls: Array<{ x: number; y: number; vx: number; vy: number; id: number }>;
  cueBall: { x: number; y: number; vx: number; vy: number };
  turn: string;
  shotInProgress: boolean;
}

export const PoolGame = ({ roomId, isHost }: PoolGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const [aiming, setAiming] = useState(false);
  const [aimStart, setAimStart] = useState({ x: 0, y: 0 });
  const [aimEnd, setAimEnd] = useState({ x: 0, y: 0 });
  const [myTurn, setMyTurn] = useState(isHost);
  const { user } = useAuth();
  const channelRef = useRef<any>(null);
  const cueBallRef = useRef<Matter.Body | null>(null);
  const ballsRef = useRef<Matter.Body[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create engine
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0, scale: 0 },
    });
    engineRef.current = engine;

    // Create renderer
    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 400,
        wireframes: false,
        background: '#0a5f38',
      },
    });
    renderRef.current = render;

    // Table dimensions
    const tableWidth = 800;
    const tableHeight = 400;
    const wallThickness = 20;

    // Create walls
    const walls = [
      Matter.Bodies.rectangle(tableWidth / 2, 0, tableWidth, wallThickness, { isStatic: true, render: { fillStyle: '#654321' } }),
      Matter.Bodies.rectangle(tableWidth / 2, tableHeight, tableWidth, wallThickness, { isStatic: true, render: { fillStyle: '#654321' } }),
      Matter.Bodies.rectangle(0, tableHeight / 2, wallThickness, tableHeight, { isStatic: true, render: { fillStyle: '#654321' } }),
      Matter.Bodies.rectangle(tableWidth, tableHeight / 2, wallThickness, tableHeight, { isStatic: true, render: { fillStyle: '#654321' } }),
    ];

    // Create cue ball (white)
    const cueBall = Matter.Bodies.circle(200, 200, 12, {
      restitution: 0.9,
      friction: 0.01,
      frictionAir: 0.01,
      render: { fillStyle: '#ffffff' },
      label: 'cueBall',
    });
    cueBallRef.current = cueBall;

    // Create colored balls in triangle formation
    const balls: Matter.Body[] = [];
    const startX = 600;
    const startY = 200;
    const ballRadius = 12;
    const gap = 2;
    const colors = ['#ffff00', '#0000ff', '#ff0000', '#800080', '#ff8c00', '#008000', '#8b0000', '#000000'];

    let ballId = 0;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col <= row; col++) {
        const x = startX + row * (ballRadius * 2 + gap);
        const y = startY + (col - row / 2) * (ballRadius * 2 + gap);
        const ball = Matter.Bodies.circle(x, y, ballRadius, {
          restitution: 0.9,
          friction: 0.01,
          frictionAir: 0.01,
          render: { fillStyle: colors[ballId % colors.length] },
          label: `ball-${ballId}`,
        });
        balls.push(ball);
        ballId++;
      }
    }
    ballsRef.current = balls;

    // Add all bodies to world
    Matter.World.add(engine.world, [...walls, cueBall, ...balls]);

    // Run engine and renderer
    Matter.Engine.run(engine);
    Matter.Render.run(render);

    // Setup realtime sync
    const channel = supabase.channel(`pool-${roomId}`);
    channelRef.current = channel;

    channel
      .on('broadcast', { event: 'shot' }, ({ payload }) => {
        if (payload.userId !== user?.id) {
          applyShotFromRemote(payload);
        }
      })
      .on('broadcast', { event: 'sync' }, ({ payload }) => {
        if (payload.userId !== user?.id) {
          syncBallsFromRemote(payload.gameState);
        }
      })
      .subscribe();

    // Sync ball positions every 100ms when balls are moving
    const syncInterval = setInterval(() => {
      if (isMoving()) {
        broadcastGameState();
      }
    }, 100);

    return () => {
      clearInterval(syncInterval);
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      channel.unsubscribe();
    };
  }, [roomId]);

  const isMoving = () => {
    if (!cueBallRef.current) return false;
    const threshold = 0.1;
    const cueBallMoving = Math.abs(cueBallRef.current.velocity.x) > threshold || Math.abs(cueBallRef.current.velocity.y) > threshold;
    const ballsMoving = ballsRef.current.some(ball => Math.abs(ball.velocity.x) > threshold || Math.abs(ball.velocity.y) > threshold);
    return cueBallMoving || ballsMoving;
  };

  const broadcastGameState = () => {
    if (!channelRef.current || !cueBallRef.current) return;

    const gameState: GameState = {
      cueBall: {
        x: cueBallRef.current.position.x,
        y: cueBallRef.current.position.y,
        vx: cueBallRef.current.velocity.x,
        vy: cueBallRef.current.velocity.y,
      },
      balls: ballsRef.current.map((ball, idx) => ({
        id: idx,
        x: ball.position.x,
        y: ball.position.y,
        vx: ball.velocity.x,
        vy: ball.velocity.y,
      })),
      turn: myTurn ? user?.id || '' : '',
      shotInProgress: isMoving(),
    };

    channelRef.current.send({
      type: 'broadcast',
      event: 'sync',
      payload: { userId: user?.id, gameState },
    });
  };

  const syncBallsFromRemote = (gameState: GameState) => {
    if (!cueBallRef.current) return;

    Matter.Body.setPosition(cueBallRef.current, { x: gameState.cueBall.x, y: gameState.cueBall.y });
    Matter.Body.setVelocity(cueBallRef.current, { x: gameState.cueBall.vx, y: gameState.cueBall.vy });

    gameState.balls.forEach((ballData) => {
      const ball = ballsRef.current[ballData.id];
      if (ball) {
        Matter.Body.setPosition(ball, { x: ballData.x, y: ballData.y });
        Matter.Body.setVelocity(ball, { x: ballData.vx, y: ballData.vy });
      }
    });
  };

  const applyShotFromRemote = (payload: any) => {
    if (!cueBallRef.current) return;
    Matter.Body.setVelocity(cueBallRef.current, { x: payload.forceX, y: payload.forceY });
    setMyTurn(true);
    toast.info('Turno do oponente!');
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!myTurn || isMoving()) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setAiming(true);
    setAimStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setAimEnd({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!aiming) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setAimEnd({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseUp = () => {
    if (!aiming || !cueBallRef.current) return;

    const dx = aimStart.x - aimEnd.x;
    const dy = aimStart.y - aimEnd.y;
    const force = Math.min(Math.sqrt(dx * dx + dy * dy) / 20, 15);

    const angle = Math.atan2(dy, dx);
    const forceX = Math.cos(angle) * force;
    const forceY = Math.sin(angle) * force;

    Matter.Body.setVelocity(cueBallRef.current, { x: forceX, y: forceY });

    // Broadcast shot to other player
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'shot',
        payload: { userId: user?.id, forceX, forceY },
      });
    }

    setAiming(false);
    setMyTurn(false);
    toast.success('Tacada realizada!');

    // After balls stop moving, switch turn
    setTimeout(() => {
      if (!isMoving()) {
        setMyTurn(true);
      }
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">8 Ball Pool</h2>
        <p className="text-muted-foreground">
          {myTurn ? (isMoving() ? 'Aguarde as bolas pararem...' : 'Sua vez! Clique e arraste para mirar') : 'Turno do oponente'}
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
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-primary" />
          <span className="text-sm">Você: {isHost ? 'Player 1' : 'Player 2'}</span>
        </div>
        <div className="text-sm text-muted-foreground">Sala: {roomId}</div>
      </div>
    </div>
  );
};
