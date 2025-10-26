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
    <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            background: ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))"][
              Math.floor(Math.random() * 3)
            ],
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${8 + Math.random() * 8}s`,
          }}
        />
      ))}
    </div>
  );
};

const WaveDivider = ({ flip = false }: { flip?: boolean }) => {
  return (
    <div className={`absolute left-0 w-full h-24 ${flip ? 'top-0' : 'bottom-0'} overflow-hidden ${flip ? 'rotate-180' : ''}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block w-full h-full"
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          className="fill-background"
        />
      </svg>
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
    <div className="fixed inset-0 section-dark flex items-center justify-center z-50 overflow-hidden">
      <FloatingParticles />
      
      {/* Wavy bottom */}
      <WaveDivider />
      
      <div className="relative z-10 w-full max-w-md px-6 animate-fadeIn">
        <div className="text-center space-y-8">
          {/* Emoji */}
          <div className="text-8xl animate-bounce">🎂</div>
          
          {/* Badge */}
          <div className="flex justify-center">
            <span className="badge-pill">Special Access</span>
          </div>
          
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-black text-[hsl(var(--dark-foreground))] leading-tight">
              Birthday
              <br />
              <span className="gradient-text">Celebration</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
          </div>
          
          {/* Password form */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[hsl(var(--dark-foreground))/80]">
                    Enter Password
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="••••••••"
                    className="h-12 text-center text-lg bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-primary transition-all"
                  />
                  {error && (
                    <p className="text-destructive text-sm text-center">{error}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all shadow-lg"
                >
                  Unlock Celebration 🔓
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
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
    <div className="flex flex-col items-center gap-2">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
        <Card className="relative bg-card border-2 border-border hover:border-primary/50 transition-all shadow-soft hover:shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.3)] min-w-[70px] md:min-w-[90px]">
          <CardContent className="p-4 md:p-6">
            <div className="text-3xl md:text-5xl font-black gradient-text">
              {String(value).padStart(2, "0")}
            </div>
          </CardContent>
        </Card>
      </div>
      <span className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-widest">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex justify-center gap-3 md:gap-6 flex-wrap">
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

      {/* Hero Section with Dark Background */}
      <section className="section-dark relative min-h-[60vh] flex items-center justify-center py-20 md:py-32">
        <WaveDivider />
        
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center space-y-8 animate-fadeIn">
          {/* Badge */}
          <div>
            <span className="badge-pill">October 27, 2025</span>
          </div>
          
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[hsl(var(--dark-foreground))] leading-[1.1]">
              Celebrating
              <br />
              <span className="gradient-text font-display">Ananya's Birthday</span>
            </h1>
            <div className="flex justify-center">
              <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-accent to-secondary rounded-full" />
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="pt-12">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2 mx-auto">
              <div className="w-1.5 h-3 bg-white/50 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Content Section with Light Background */}
      <section className="relative bg-background py-16 md:py-24">
        <div className="w-full max-w-4xl mx-auto px-6 space-y-12">
          
          {/* Message Card */}
          <div className="animate-slideUp">
            <Card className="bg-card border-2 border-border hover:border-primary/30 transition-all shadow-soft hover:shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.2)]">
              <CardContent className="p-8 md:p-12">
                <p className="text-lg md:text-2xl leading-relaxed text-center">
                  I'm celebrating <span className="text-highlight">another year</span> with{" "}
                  <span className="text-highlight">incredible memories</span> and{" "}
                  <span className="text-highlight">amazing experiences</span>, looking forward to{" "}
                  <span className="text-highlight">new adventures</span> and building{" "}
                  <span className="text-highlight">unforgettable moments</span>.
                </p>
                
                {/* Emojis */}
                <div className="flex justify-center gap-6 mt-8 text-5xl">
                  <span className="hover:scale-125 transition-transform cursor-pointer">✨</span>
                  <span className="hover:scale-125 transition-transform cursor-pointer">🎉</span>
                  <span className="hover:scale-125 transition-transform cursor-pointer">💖</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <Button
              onClick={handleConfetti}
              size="lg"
              className="h-14 px-10 text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.4)] transition-all hover:scale-105 active:scale-95"
            >
              🎊 Launch Celebration
            </Button>
          </div>

          {/* Countdown Section */}
          <div className="pt-8 animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-black mb-2">
                Countdown to the <span className="gradient-text">Big Day</span>
              </h2>
              <div className="flex justify-center mt-4">
                <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
              </div>
            </div>
            <CountdownTimer targetDate={BIRTHDAY_DATE} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground text-sm">
        <p>Made with 💖 for Ananya's special day</p>
      </footer>
    </div>
  );
};

export default Index;
