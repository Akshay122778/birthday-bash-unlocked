import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Password for accessing the website
const CORRECT_PASSWORD = "birthday2025";

// Birthday date (October 27, 2025)
const BIRTHDAY_DATE = new Date("2025-10-27T00:00:00").getTime();

const AdvancedConfetti = ({ confettiKey }: { confettiKey: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = [
      "#FF1493",
      "#FFD700",
      "#00CED1",
      "#FF69B4",
      "#00FF00",
      "#FF4500",
      "#9370DB",
      "#00BFFF",
      "#FF6347",
      "#32CD32",
    ];
    const shapes = ["square", "circle", "triangle", "star"];

    const createConfetti = () => {
      for (let i = 0; i < 500; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          vx: (Math.random() - 0.5) * 12,
          vy: Math.random() * 8 + 6,
          size: Math.random() * 12 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.3,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          life: 1,
          decay: Math.random() * 0.0008 + 0.0002,
        });
      }
    };

    const drawShape = (ctx: CanvasRenderingContext2D, shape: string, size: number) => {
      if (shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (shape === "triangle") {
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(size / 2, size / 2);
        ctx.lineTo(-size / 2, size / 2);
        ctx.closePath();
        ctx.fill();
      } else if (shape === "star") {
        const spikes = 5;
        const outerRadius = size / 2;
        const innerRadius = size / 4;
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / spikes - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(-size / 2, -size / 2, size, size);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => p.y < canvas.height && p.life > 0);

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.rotation += p.rotationSpeed;
        p.life -= p.decay;

        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        drawShape(ctx, p.shape, p.size);
        ctx.restore();
      });

      if (particlesRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    createConfetti();
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [confettiKey]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-40" />;
};

const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(80)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 8 + 2}px`,
            height: `${Math.random() * 8 + 2}px`,
            background: ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))"][
              Math.floor(Math.random() * 3)
            ],
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${6 + Math.random() * 10}s`,
            opacity: Math.random() * 0.6 + 0.2,
            boxShadow: `0 0 ${Math.random() * 20 + 10}px currentColor`,
          }}
        />
      ))}
    </div>
  );
};

const PasswordGate = ({ onUnlock }: { onUnlock: () => void }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      onUnlock();
    } else {
      setError("❌ Incorrect password. Try again!");
      setPassword("");
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50 overflow-hidden p-4">
      <FloatingParticles />
      <Card className="glass-card-hover max-w-md w-full relative z-10 celebration-glow">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto animate-bounce">
            <div className="text-8xl drop-shadow-lg">🎂</div>
          </div>
          <CardTitle className="text-4xl md:text-5xl font-bold gradient-text">
            Birthday Surprise
          </CardTitle>
          <CardDescription className="text-foreground/80 text-base">
            Enter the password to unlock the celebration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter password..."
                className="text-center text-lg h-12 bg-input/50 border-border focus:border-primary transition-all"
              />
              {error && (
                <p className="text-destructive text-sm text-center animate-pulse">{error}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:shadow-celebration transition-all"
            >
              Unlock 🔓
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const CountdownTimer = ({ targetDate }: { targetDate: number }) => {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTime({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <Card className="glass-card-hover text-center min-w-[80px] md:min-w-[100px]">
      <CardContent className="p-4 md:p-6">
        <div className="text-3xl md:text-5xl font-black gradient-text">
          {String(value).padStart(2, "0")}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest font-bold mt-2">
          {label}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex justify-center gap-2 md:gap-4 flex-wrap">
      <TimeUnit value={time.days} label="Days" />
      <TimeUnit value={time.hours} label="Hours" />
      <TimeUnit value={time.minutes} label="Minutes" />
      <TimeUnit value={time.seconds} label="Seconds" />
    </div>
  );
};

const Index = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [triggerConfetti, setTriggerConfetti] = useState(false);

  const handleConfetti = () => {
    setTriggerConfetti(!triggerConfetti);
  };

  if (!isUnlocked) {
    return <PasswordGate onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <FloatingParticles />
      {triggerConfetti && <AdvancedConfetti confettiKey={triggerConfetti} />}

      <main className="relative min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="relative z-10 w-full max-w-4xl mx-auto space-y-8">
          {/* Hero Card */}
          <Card className="glass-card celebration-glow">
            <CardHeader className="text-center space-y-6 pb-4">
              <div className="space-y-2 animate-fadeIn">
                <CardTitle className="text-4xl md:text-6xl font-black gradient-text hover-text-effect">
                  Happy Birthday Ananya! 🎉
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card className="glass-card-hover">
                <CardContent className="p-6 md:p-8">
                  <p className="text-sm md:text-lg text-foreground/90 leading-relaxed font-medium text-center">
                    "Another year older, another year wiser, another year more beautiful. Today is your day to shine, to
                    celebrate all the amazing things you've accomplished, and to look forward to the incredible adventures
                    ahead. Make this birthday unforgettable!"
                  </p>
                  <div className="mt-6 flex gap-4 justify-center text-4xl md:text-5xl">
                    <span className="hover:scale-125 transition-transform cursor-pointer animate-pulse-slow">✨</span>
                    <span className="hover:scale-125 transition-transform cursor-pointer animate-pulse-slow" style={{ animationDelay: '0.5s' }}>🎉</span>
                    <span className="hover:scale-125 transition-transform cursor-pointer animate-pulse-slow" style={{ animationDelay: '1s' }}>💖</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button
                  onClick={handleConfetti}
                  size="lg"
                  className="text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:shadow-celebration transition-all hover:scale-105 active:scale-95 px-8"
                >
                  🎊 Launch Celebration
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Countdown Card */}
          <Card className="glass-card celebration-glow">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl md:text-3xl font-black gradient-text hover-text-effect">
                Countdown to the Big Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CountdownTimer targetDate={BIRTHDAY_DATE} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
