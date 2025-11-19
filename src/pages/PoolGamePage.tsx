import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PoolGame } from '@/components/games/PoolGame';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft } from 'lucide-react';

export default function PoolGamePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roomId, setRoomId] = useState(searchParams.get('room') || '');
  const [isInGame, setIsInGame] = useState(false);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    if (searchParams.get('room')) {
      setIsInGame(true);
      setIsHost(searchParams.get('host') === 'true');
    }
  }, [searchParams]);

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(7);
    setRoomId(newRoomId);
    setIsHost(true);
    setIsInGame(true);
    navigate(`?room=${newRoomId}&host=true`);
  };

  const joinRoom = () => {
    if (!roomId.trim()) return;
    setIsHost(false);
    setIsInGame(true);
    navigate(`?room=${roomId}&host=false`);
  };

  const leaveRoom = () => {
    setIsInGame(false);
    setRoomId('');
    navigate('/game/pool');
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Autenticação Necessária</CardTitle>
            <CardDescription>Você precisa estar logado para jogar</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/auth')}>Fazer Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isInGame) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>8 Ball Pool - Multiplayer</CardTitle>
              <CardDescription>
                Jogue sinuca em tempo real com outro jogador
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Criar Nova Sala</h3>
                <Button onClick={createRoom} className="w-full">
                  Criar Sala
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Ou</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Entrar em Sala Existente</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite o código da sala"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                  />
                  <Button onClick={joinRoom} disabled={!roomId.trim()}>
                    Entrar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Como Jogar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• <strong>Mira:</strong> Clique e arraste a partir da bola branca para mirar</p>
              <p>• <strong>Força:</strong> A distância do arraste determina a força da tacada</p>
              <p>• <strong>Turno:</strong> Aguarde seu turno para jogar</p>
              <p>• <strong>Sincronização:</strong> As posições das bolas são sincronizadas em tempo real</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={leaveRoom}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Sair da Sala
        </Button>
        <div className="text-sm text-muted-foreground">
          Compartilhe o código da sala: <strong>{roomId}</strong>
        </div>
      </div>

      <PoolGame roomId={roomId} isHost={isHost} />
    </div>
  );
}
