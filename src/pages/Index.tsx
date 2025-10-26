import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

    const colors = ["#f472b6", "#a855f7", "#fbbf24", "#ec4899", "#8b5cf6"];
    const shapes = ["square", "circle", "triangle", "star"];

    const createConfetti = () => {
      for (let i = 0; i < 400; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          vx: (Math.random() - 0.5) * 10,
          vy: Math.random() * 6 + 4,
          size: Math.random() * 10 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.25,
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

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
};

const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 6 + 3}px`,
            height: `${Math.random() * 6 + 3}px`,
            background: ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))"][
              Math.floor(Math.random() * 3)
            ],
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${8 + Math.random() * 8}s`,
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
      setError("Incorrect password. Try again!");
      setPassword("");
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50 overflow-hidden p-4">
      <FloatingParticles />
      
      <Card className="glass-card-hover max-w-md w-full relative z-10 shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.5)]">
        <CardContent className="p-8 md:p-12 text-center space-y-8">
          {/* Emoji */}
          <div className="text-8xl animate-bounce">🎂</div>
          
          {/* Badge */}
          <div>
            <span className="badge-pill">Special Access</span>
          </div>
          
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
              <span className="gradient-text font-display">Birthday Celebration</span>
            </h1>
            <p className="text-muted-foreground text-base">
              Enter the password to unlock the surprise
            </p>
          </div>
          
          {/* Password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter password..."
              className="h-12 text-center text-lg bg-input/50 border-border/60 focus:border-primary transition-all"
            />
            {error && (
              <p className="text-destructive text-sm animate-pulse">{error}</p>
            )}
            <Button
              type="submit"
              size="lg"
              className="w-full h-12 text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.6)] transition-all hover:scale-105 active:scale-95"
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
    <div className="flex flex-col items-center gap-3">
      <Card className="glass-card-hover min-w-[75px] md:min-w-[95px] shadow-[0_8px_30px_hsl(0_0%_0%_/_0.3)]">
        <CardContent className="p-4 md:p-6">
          <div className="text-3xl md:text-5xl font-black gradient-text">
            {String(value).padStart(2, "0")}
          </div>
        </CardContent>
      </Card>
      <span className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex justify-center gap-3 md:gap-5 flex-wrap">
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
    <div className="min-h-screen bg-background overflow-hidden">
      <FloatingParticles />
      {triggerConfetti && <AdvancedConfetti confettiKey={triggerConfetti} />}

      <main className="relative min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="relative z-10 w-full max-w-4xl mx-auto space-y-10 md:space-y-12">
          
          {/* Hero Card */}
          <Card className="glass-card shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.5)] animate-fadeIn">
            <CardContent className="p-8 md:p-12 space-y-8">
              
              {/* Badge */}
              <div className="text-center">
                <span className="badge-pill">October 27, 2025</span>
              </div>
              
              {/* Main Heading */}
              <div className="text-center space-y-4">
                <h1 className="text-5xl md:text-7xl font-black text-foreground leading-tight">
                  Happy Birthday
                  <br />
                  <span className="gradient-text font-display">Ananya</span> 🎉
                </h1>
              </div>

              {/* Message */}
              <Card className="glass-card-hover shadow-[0_8px_30px_hsl(0_0%_0%_/_0.3)]">
                <CardContent className="p-6 md:p-8">
                  <p className="text-base md:text-xl leading-relaxed text-center text-foreground/90">
                    Another year <span className="text-highlight">older</span>, another year{" "}
                    <span className="text-highlight">wiser</span>, another year more{" "}
                    <span className="text-highlight">beautiful</span>. Today is your day to{" "}
                    <span className="text-highlight">shine</span>, to celebrate all the{" "}
                    <span className="text-highlight">amazing things</span> you've accomplished, and to look forward to the{" "}
                    <span className="text-highlight">incredible adventures</span> ahead. Make this birthday{" "}
                    <span className="text-highlight">unforgettable!</span>
                  </p>
                  
                  {/* Emojis */}
                  <div className="flex justify-center gap-6 mt-6 text-4xl md:text-5xl">
                    <span className="hover:scale-125 transition-transform cursor-pointer animate-pulse-slow">✨</span>
                    <span className="hover:scale-125 transition-transform cursor-pointer animate-pulse-slow" style={{ animationDelay: '0.5s' }}>🎉</span>
                    <span className="hover:scale-125 transition-transform cursor-pointer animate-pulse-slow" style={{ animationDelay: '1s' }}>💖</span>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleConfetti}
                  size="lg"
                  className="h-14 px-10 text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.6)] transition-all hover:scale-105 active:scale-95"
                >
                  🎊 Launch Celebration
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Countdown Card */}
          <Card className="glass-card shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.5)] animate-slideUp">
            <CardContent className="p-8 md:p-12 space-y-8">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2">
                  Countdown to the <span className="gradient-text">Big Day</span>
                </h2>
              </div>
              <CountdownTimer targetDate={BIRTHDAY_DATE} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
