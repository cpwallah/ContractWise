// "use client"
// import { ArrowRight, FileSearch, Hourglass, PiggyBank, Scale, Section, ShieldCheck, Sparkles, Zap } from "lucide-react";
// import { Button, buttonVariants } from "./ui/button";
// import { cn } from "@/lib/utils";
// import { Card, CardContent } from "./ui/card";
// import Link from "next/link";
// import { useEffect, useRef } from "react";

// const features = [
//   {
//     title: "AI-Powered Analysis",
//     description: "Analyze contracts with cutting-edge AI for unmatched speed and precision.",
//     icon: FileSearch,
//   },
//   {
//     title: "Risk Identification",
//     description: "Uncover risks and opportunities with intelligent insights.",
//     icon: ShieldCheck,
//   },
//   {
//     title: "Streamlined Negotiation",
//     description: "Accelerate negotiations with AI-driven clarity.",
//     icon: Hourglass,
//   },
//   {
//     title: "Cost Reduction",
//     description: "Slash legal costs with automated analysis.",
//     icon: PiggyBank,
//   },
//   {
//     title: "Improved Compliance",
//     description: "Ensure full compliance with regulatory standards.",
//     icon: Scale,
//   },
//   {
//     title: "Faster Turnaround",
//     description: "Review contracts in minutes, not hours.",
//     icon: Zap,
//   },
// ];

// export function HeroSection() {
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const mousePos = useRef({ x: 0, y: 0 });

//   useEffect(() => {
//     const handleMove = (x: number, y: number) => {
//       if (!sectionRef.current) return;
//       const rect = sectionRef.current.getBoundingClientRect();
//       const centerX = rect.width / 2;
//       const centerY = rect.height / 2;
//       const mouseX = (x - rect.left - centerX) / centerX * 100; // Percentage
//       const mouseY = (y - rect.top - centerY) / centerY * 100;
//       const rotateX = mouseY * 0.03; // Smoother rotation
//       const rotateY = mouseX * -0.03;

//       // Apply to headline
//       const headline = sectionRef.current.querySelector(".hero-title");
//       if (headline) {
//         (headline as HTMLElement).style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`;
//       }

//       // Apply to badge
//       const badge = sectionRef.current.querySelector(".badge-glow");
//       if (badge) {
//         (badge as HTMLElement).style.transform = `perspective(800px) rotateX(${rotateX / 2}deg) rotateY(${rotateY / 2}deg) translateZ(20px)`;
//       }

//       // Apply to buttons
//       const buttons = sectionRef.current.querySelectorAll("button");
//       buttons.forEach((button) => {
//         (button as HTMLElement).style.transform = `perspective(600px) rotateX(${rotateX / 2}deg) rotateY(${rotateY / 2}deg) scale(${1 + Math.abs(mouseX) / 2000})`;
//       });

//       // Apply to cards
//       const cards = sectionRef.current.querySelectorAll(".card");
//       cards.forEach((card, index) => {
//         const offset = index % 2 === 0 ? 1 : -1;
//         (card as HTMLElement).style.transform = `perspective(800px) rotateX(${rotateX / 3}deg) rotateY(${rotateY / 3}deg) translateZ(${15 + offset * 5}px)`;
//       });

//       // Apply to background particles
//       const particles = sectionRef.current.querySelectorAll(".particle");
//       particles.forEach((particle) => {
//         const p = particle as HTMLElement;
//         const dx = (mouseX - (parseFloat(p.style.left) || 50)) * 0.015;
//         const dy = (mouseY - (parseFloat(p.style.top) || 50)) * 0.015;
//         const speed = Math.sqrt(dx * dx + dy * dy) * 0.01;
//         p.style.transform = `translate(${dx}px, ${dy}px) scale(${1 + speed * 1.5}) rotate(${mouseX * 0.05}deg)`;
//         p.style.opacity = `${0.5 + speed * 0.5}`; // Dynamic opacity
//       });

//       // Apply to background wave
//       const wave = sectionRef.current.querySelector(".wave-effect");
//       if (wave) {
//         (wave as HTMLElement).style.transform = `translate(${mouseX * 0.1}px, ${mouseY * 0.1}px)`;
//         (wave as HTMLElement).style.opacity = `${0.3 + Math.abs(mouseX) * 0.001}`; // Dynamic opacity
//       }
//     };

//     const handleClick = (e: MouseEvent | TouchEvent) => {
//       if (!sectionRef.current) return;
//       const rect = sectionRef.current.getBoundingClientRect();
//       const clickX = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - rect.left;
//       const clickY = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - rect.top;

//       const ripple = document.createElement("span");
//       ripple.className = "ripple";
//       ripple.style.left = `${clickX}px`;
//       ripple.style.top = `${clickY}px`;
//       sectionRef.current.appendChild(ripple);

//       ripple.addEventListener("animationend", () => ripple.remove());
//     };

//     const handleMouseMove = (e: MouseEvent) => {
//       handleMove(e.clientX, e.clientY);
//       mousePos.current = { x: e.clientX, y: e.clientY };
//     };

//     const handleTouchMove = (e: TouchEvent) => {
//       e.preventDefault(); // Prevent scrolling
//       if (e.touches.length > 0) {
//         handleMove(e.touches[0].clientX, e.touches[0].clientY);
//         mousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
//       }
//     };

//     const section = sectionRef.current;
//     section?.addEventListener("mousemove", handleMouseMove);
//     section?.addEventListener("touchmove", handleTouchMove, { passive: false });
//     section?.addEventListener("click", handleClick);
//     section?.addEventListener("touchstart", handleClick);
//     return () => {
//       section?.removeEventListener("mousemove", handleMouseMove);
//       section?.removeEventListener("touchmove", handleTouchMove);
//       section?.removeEventListener("click", handleClick);
//       section?.removeEventListener("touchstart", handleClick);
//     };
//   }, []);

//   return (
//     <section
//       ref={sectionRef}
//       className="w-full py-8 sm:py-12 md:py-16 lg:py-20 xl:py-28 bg-gradient-to-br from-[#1A237E] via-[#1A237E]/80 to-[#FF6F61]/15 relative overflow-hidden perspective-1000"
//     >
//       {/* Attractive particle and wave background effect */}
//       <div className="absolute inset-0 pointer-events-none z-0">
//         {[...Array(60)].map((_, i) => (
//           <span
//             key={i}
//             className="absolute w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-gradient-to-br from-[#FF6F61]/70 to-[#E0E0E0]/50 particle"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animation: `particleFlow ${Math.random() * 10 + 15}s infinite ease-in-out`,
//             }}
//           />
//         ))}
//         <span className="absolute inset-0 bg-gradient-to-br from-transparent via-[#E0E0E0]/10 to-transparent wave-effect" />
//         <style>{`
//           @keyframes particleFlow {
//             0% { transform: translate(0, 0) scale(1); opacity: 0.6; }
//             50% { transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) scale(1.6); opacity: 0.9; }
//             100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
//           }
//           @keyframes ripple {
//             0% { transform: scale(0); opacity: 0.8; }
//             100% { transform: scale(20); opacity: 0; }
//           }
//           @keyframes gradientPulse {
//             0% { background-position: 0% 0%; }
//             50% { background-position: 100% 100%; }
//             100% { background-position: 0% 0%; }
//           }
//           .ripple {
//             position: absolute;
//             width: 8px;
//             height: 8px;
//             background: radial-gradient(circle, rgba(255, 111, 97, 0.8), transparent 70%);
//             border-radius: 50%;
//             pointer-events: none;
//             animation: ripple 1.5s ease-out;
//             z-index: 10;
//           }
//           ${Section} {
//             background-size: 200% 200%;
//             animation: gradientPulse 12s ease infinite;
//           }
//           .particle {
//             transition: transform 0.1s, opacity 0.1s;
//             box-shadow: 0 0 15px rgba(255, 111, 97, 0.5); /* Coral glow */
//           }
//           .wave-effect {
//             transition: transform 0.2s ease-out, opacity 0.2s ease-out;
//             background-size: 200% 200%;
//             mix-blend-mode: overlay;
//             z-index: 5;
//           }
//           .hero-title {
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             flex-wrap: wrap;
//             gap: 0.5rem;
//             transition: transform 0.2s ease-out, opacity 0.3s;
//             z-index: 40;
//             position: relative;
//             width: 100%;
//             max-width: 100%;
//             padding: 0 0.5rem;
//             overflow: visible;
//             animation: fadeIn 1s ease-out forwards;
//           }
//           .badge-glow {
//             position: relative;
//             z-index: 50;
//             opacity: 1;
//             white-space: normal;
//             min-width: fit-content;
//             padding: 0.5rem 1rem;
//             font-size: 1rem;
//             font-weight: 800;
//             background: linear-gradient(45deg, #FFFFFF, #FF8A65, #FFFFFF);
//             background-size: 200%;
//             animation: badgePulse 2s ease-in-out infinite;
//             color: #1A237E;
//             border: 3px solid rgba(255, 255, 255, 0.9);
//             border-radius: 8px;
//             box-shadow: 0 0 20px rgba(255, 138, 101, 0.9), 0 0 30px rgba(255, 255, 255, 0.7);
//             text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
//           }
//           @media (min-width: 640px) {
//             .badge-glow {
//               padding: 0.75rem 1.5rem;
//               font-size: 1.25rem;
//               border-radius: 10px;
//             }
//           }
//           @media (min-width: 1024px) {
//             .badge-glow {
//               padding: 0.75rem 2rem;
//               font-size: 1.5rem;
//               border-radius: 12px;
//             }
//           }
//           @keyframes fadeIn {
//             0% { opacity: 0; transform: translateY(20px); }
//             100% { opacity: 1; transform: translateY(0); }
//           }
//           @keyframes badgePulse {
//             0%, 100% { box-shadow: 0 0 10px rgba(255, 138, 101, 0.7), 0 0 20px rgba(255, 255, 255, 0.7); }
//             50% { box-shadow: 0 0 25px rgba(255, 138, 101, 1), 0 0 35px rgba(255, 255, 255, 1); }
//           }
//           .subtext {
//             opacity: 1;
//             z-index: 30;
//             position: relative;
//             width: 100%;
//             max-width: 100%;
//             animation: fadeIn 1.2s ease-out forwards;
//           }
//           .card:hover {
//             box-shadow: 0 10px 25px rgba(255, 111, 97, 0.6);
//             transform: translateY(-8px) scale(1.03);
//           }
//           .card, button {
//             transition: transform 0.3s ease-out, box-shadow 0.3s, opacity 0.3s;
//             z-index: 30;
//           }
//           .dashboard-link:hover {
//             transform: scale(1.05);
//             box-shadow: 0 4px 12px rgba(255, 111, 97, 0.4);
//           }
//           .dashboard-link {
//             animation: fadeIn 1s ease-out forwards;
//           }
//           .action-button:hover {
//             transform: scale(1.08);
//             box-shadow: 0 8px 20px rgba(255, 111, 97, 0.5);
//           }
//           @media (max-width: 639px) {
//             .hero-title {
//               flex-direction: column;
//               gap: 1rem;
//             }
//             .action-button {
//               width: 100%;
//               max-width: 300px;
//             }
//           }
//           @media (min-width: 640px) and (max-width: 767px) {
//             .hero-title {
//               flex-direction: column;
//               gap: 1.25rem;
//             }
//             .action-button {
//               max-width: 350px;
//             }
//           }
//         `}</style>
//       </div>
//       <div className="container px-4 sm:px-6 md:px-8 lg:px-12 max-w-full sm:max-w-7xl mx-auto flex flex-col items-center relative z-20">
//         <Link
//           href="/dashboard"
//           className={cn(
//             buttonVariants({ variant: "outline", size: "sm" }),
//             "px-4 sm:px-6 md:px-8 py-2 sm:py-3 mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl bg-[#1A237E]/70 text-white border-2 border-[#E0E0E0]/50 shadow-md hover:bg-[#FF6F61]/30 hover:shadow-[#E0E0E0]/40 transition-all duration-300 dashboard-link"
//           )}
//           aria-label="View Simple Metrics dashboard"
//         >
//           <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 animate-pulse" aria-hidden="true" />
//           <span className="font-semibold text-base sm:text-lg">Discover Simple Metrics for Your Team</span>
//         </Link>
//         <div className="text-center mb-8 sm:mb-10 md:mb-12 w-full">
//           <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#E0E0E0] to-[#FF6F61] mb-6 sm:mb-8 md:mb-10 drop-shadow-2xl hero-title">
//             Transform Your Contracts
//             <span className="inline-block badge-glow">
//               AI Brilliance
//             </span>
//           </h1>
//           <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-200 max-w-full sm:max-w-2xl md:max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 leading-relaxed drop-shadow-md subtext">
//             Elevate your team with stunning AI to redefine contract mastery.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 md:gap-7 justify-center mb-8 sm:mb-10 md:mb-12">
//             <Button
//               className="inline-flex items-center justify-center text-base sm:text-lg md:text-xl bg-gradient-to-r from-[#1A237E] to-[#FF6F61] text-white shadow-lg hover:from-[#E0E0E0]/10 hover:to-[#FF6F61] hover:shadow-[#1A237E]/50 transition-all duration-300 action-button w-full sm:w-auto"
//               size="lg"
//               aria-label="Get started with contract analysis"
//             >
//               Get Started
//               <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
//             </Button>
//             <Button
//               className="inline-flex items-center justify-center text-base sm:text-lg md:text-xl border-2 border-[#E0E0E0]/70 bg-[#1A237E]/60 text-white shadow-lg hover:bg-[#FF6F61]/40 hover:shadow-[#E0E0E0]/50 transition-all duration-300 action-button w-full sm:w-auto"
//               size="lg"
//               aria-label="Learn more about contract analysis"
//             >
//               Learn More
//               <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
//             </Button>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full">
//             {features.map((feature, index) => (
//               <Card
//                 key={index}
//                 className="h-full border-2 border-[#E0E0E0]/50 bg-[#1A237E]/40 backdrop-blur-md shadow-xl rounded-lg sm:rounded-xl transition-all duration-500 card"
//               >
//                 <CardContent className="p-4 sm:p-6 md:p-7 flex flex-col items-center space-y-3 sm:space-y-4">
//                   <div className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-br from-[#E0E0E0]/80 to-[#FF6F61]/80 flex items-center justify-center mb-4 sm:mb-5 transition-transform duration-300 hover:scale-110 sm:hover:scale-125 hover:shadow-glow">
//                     <feature.icon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-[#1A237E]" aria-hidden="true" />
//                   </div>
//                   <h3 className="text-base sm:text-xl md:text-2xl font-semibold text-gray-200 text-center drop-shadow-sm">{feature.title}</h3>
//                   <p className="text-sm sm:text-base md:text-lg text-gray-400 text-center leading-relaxed">{feature.description}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }