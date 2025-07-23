// "use client"
// import { api } from "@/lib/api";
// import stripePromise from "@/lib/stripe";
// import { Button } from "./ui/button";
// import { Card, CardContent } from "./ui/card";
// import { useRef, useEffect } from "react";
// // import Router from "next/router";
// import { useRouter } from "next/navigation";
// export function PricingSection() {
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const mousePos = useRef({ x: 0, y: 0 });
//    const router = useRouter();

//   const handleUpgrade = async () => {
//     try {
//       const response = await api.get("/payments/create-checkout-session");
//       const stripe = await stripePromise;
//       await stripe?.redirectToCheckout({
//         sessionId: response.data.sessionId,
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };
//    const handleGetStarted = () => {
//     router.push("https://contract-wise-et6d.vercel.app/dashboard");
//   };

//   useEffect(() => {
//     const handleMove = (x: number, y: number) => {
//       if (!sectionRef.current) return;
//       const rect = sectionRef.current.getBoundingClientRect();
//       const centerX = rect.width / 2;
//       const centerY = rect.height / 2;
//       const mouseX = (x - rect.left - centerX) / centerX * 100;
//       const mouseY = (y - rect.top - centerY) / centerY * 100;
//       const rotateX = mouseY * 0.03;
//       const rotateY = mouseX * -0.03;

//       // Apply to headline
//       const headline = sectionRef.current.querySelector(".pricing-title");
//       if (headline) {
//         (headline as HTMLElement).style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`;
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
//         p.style.opacity = `${0.5 + speed * 0.5}`;
//       });

//       // Apply to background wave
//       const wave = sectionRef.current.querySelector(".wave-effect");
//       if (wave) {
//         (wave as HTMLElement).style.transform = `translate(${mouseX * 0.1}px, ${mouseY * 0.1}px)`;
//         (wave as HTMLElement).style.opacity = `${0.3 + Math.abs(mouseX) * 0.001}`;
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
//       e.preventDefault();
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
//           .pricing-title {
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
//           .particle {
//             transition: transform 0.1s, opacity 0.1s;
//             box-shadow: 0 0 15px rgba(255, 111, 97, 0.5);
//           }
//           .wave-effect {
//             transition: transform 0.2s ease-out, opacity 0.2s ease-out;
//             background-size: 200% 200%;
//             mix-blend-mode: overlay;
//             z-index: 5;
//           }
//           @keyframes fadeIn {
//             0% { opacity: 0; transform: translateY(20px); }
//             100% { opacity: 1; transform: translateY(0); }
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
//           .action-button:hover {
//             transform: scale(1.08);
//             box-shadow: 0 8px 20px rgba(255, 111, 97, 0.5);
//           }
//           @media (max-width: 639px) {
//             .pricing-title {
//               flex-direction: column;
//               gap: 1rem;
//             }
//             .action-button {
//               width: 100%;
//               max-width: 300px;
//             }
//           }
//           @media (min-width: 640px) and (max-width: 767px) {
//             .pricing-title {
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
//         <h2 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#E0E0E0] to-[#FF6F61] mb-6 sm:mb-8 md:mb-10 drop-shadow-2xl pricing-title text-center">
//           Choose Your Plan
//         </h2>
//         <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-200 max-w-full sm:max-w-2xl md:max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 leading-relaxed drop-shadow-md subtext text-center">
//           Select the perfect plan for your needs. Upgrade anytime to unlock premium features and support.
//         </p>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full max-w-5xl mx-auto">
//           <PricingCard
//             title="Free"
//             description="For basic contract analysis"
//             price="$0"
//             period="/forever"
//             features={[
//               "Basic contract analysis",
//               "1 Project",
//               "Limited risk identification",
//               "Basic contract summary",
//             ]}
//             buttonText="Get Started"
//             onButtonClick={handleGetStarted}
//             highlight={false}
//           />
//           <PricingCard
//             title="Premium"
//             description="For comprehensive contract analysis"
//             price="$10"
//             period="/lifetime"
//             features={[
//               "Advanced contract analysis",
//               "Unlimited Projects",
//               "Chat with your contract",
//               "10+ risk and opportunities",
//               "Comprehensive contract summary",
//               "Improvement Recommendations",
//               "Key clause Identification",
//               "Negotiation Points",
//               "Contract duration Analysis",
//               "Performance metric identification",
//             ]}
//             buttonText="Upgrade"
//             onButtonClick={handleUpgrade}
//             highlight={true}
//           />
//         </div>
//       </div>
//     </section>
//   );
// }

// interface PricingCardProps {
//   title: string;
//   description: string;
//   price: string;
//   period: string;
//   features: string[];
//   buttonText: string;
//   highlight?: boolean;
//   onButtonClick: () => void;
// }

// function PricingCard({
//   title,
//   description,
//   price,
//   period,
//   features,
//   buttonText,
//   onButtonClick,
//   highlight = false,
// }: PricingCardProps) {
//   return (
//     <Card
//       className={`h-full border-2 border-[#E0E0E0]/50 bg-[#1A237E]/40 backdrop-blur-md shadow-xl rounded-lg sm:rounded-xl transition-all duration-500 card ${
//         highlight ? "ring-2 ring-[#FF6F61]/50" : ""
//       }`}
//     >
//       <CardContent className="p-4 sm:p-6 md:p-7 flex flex-col items-center space-y-3 sm:space-y-4">
//         <h3 className="text-base sm:text-xl md:text-2xl font-semibold text-gray-200 text-center drop-shadow-sm">
//           {title}
//         </h3>
//         <p className="text-sm sm:text-base md:text-lg text-gray-400 text-center leading-relaxed">
//           {description}
//         </p>
//         <div className="flex items-baseline justify-center mb-4 sm:mb-5">
//           <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#E0E0E0]">{price}</span>
//           <span className="text-sm sm:text-base md:text-lg text-gray-400 ml-1">{period}</span>
//         </div>
//         <ul className="space-y-2 sm:space-y-3 w-full text-center">
//           {features.map((feature, index) => (
//             <li
//               key={index}
//               className="text-sm sm:text-base md:text-lg text-gray-300 flex items-center justify-center"
//             >
//               <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-[#E0E0E0]/80 to-[#FF6F61]/80 mr-2 sm:mr-3 flex-shrink-0" />
//               {feature}
//             </li>
//           ))}
//         </ul>
//         <Button
//           className="inline-flex items-center justify-center text-base sm:text-lg md:text-xl bg-gradient-to-r from-[#1A237E] to-[#FF6F61] text-white shadow-lg hover:from-[#E0E0E0]/10 hover:to-[#FF6F61] hover:shadow-[#1A237E]/50 transition-all duration-300 action-button w-full sm:w-auto mt-4 sm:mt-6"
//           size="lg"
//           onClick={onButtonClick}
//           aria-label={buttonText}
//         >
//           {buttonText}
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }



"use client"
import { api } from "@/lib/api";
import stripePromise from "@/lib/stripe";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const router = useRouter();

  const handleUpgrade = async () => {
    try {
      const response = await api.get("/payments/create-checkout-session");
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({
        sessionId: response.data.sessionId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetStarted = () => {
    router.push("https://contract-wise-et6d.vercel.app/dashboard");
  };

  useEffect(() => {
    // Detect if the device is mobile based on user agent
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const handleMove = (x: number, y: number, targetElement: HTMLElement) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseX = (x - rect.left - centerX) / centerX * 100;
      const mouseY = (y - rect.top - centerY) / centerY * 100;
      const rotateX = mouseY * 0.03;
      const rotateY = mouseX * -0.03;

      // Apply to headline
      if (headlineRef.current && headlineRef.current.contains(targetElement)) {
        headlineRef.current.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`;
      }

      // Apply to buttons
      buttonRefs.current.forEach((button) => {
        if (button && button.contains(targetElement)) {
          button.style.transform = `perspective(600px) rotateX(${rotateX / 2}deg) rotateY(${rotateY / 2}deg) scale(${1 + Math.abs(mouseX) / 2000})`;
        }
      });

      // Apply to cards
      cardRefs.current.forEach((card, index) => {
        if (card && card.contains(targetElement)) {
          const offset = index % 2 === 0 ? 1 : -1;
          card.style.transform = `perspective(800px) rotateX(${rotateX / 3}deg) rotateY(${rotateY / 3}deg) translateZ(${15 + offset * 5}px)`;
        }
      });

      // Apply to background particles
      const particles = sectionRef.current.querySelectorAll(".particle");
      particles.forEach((particle) => {
        if (sectionRef.current?.contains(targetElement)) {
          const p = particle as HTMLElement;
          const dx = (mouseX - (parseFloat(p.style.left) || 50)) * 0.015;
          const dy = (mouseY - (parseFloat(p.style.top) || 50)) * 0.015;
          const speed = Math.sqrt(dx * dx + dy * dy) * 0.01;
          p.style.transform = `translate(${dx}px, ${dy}px) scale(${1 + speed * 1.5}) rotate(${mouseX * 0.05}deg)`;
          p.style.opacity = `${0.5 + speed * 0.5}`;
        }
      });

      // Apply to background wave
      const wave = sectionRef.current.querySelector(".wave-effect");
      if (wave && sectionRef.current?.contains(targetElement)) {
        (wave as HTMLElement).style.transform = `translate(${mouseX * 0.1}px, ${mouseY * 0.1}px)`;
        (wave as HTMLElement).style.opacity = `${0.3 + Math.abs(mouseX) * 0.001}`;
      }
    };

    const handleClick = (e: MouseEvent | TouchEvent) => {
      if (!sectionRef.current) return;
      const target = e.target as HTMLElement;
      // Only trigger ripple effect if the target is within the pricing section
      if (sectionRef.current.contains(target)) {
        const rect = sectionRef.current.getBoundingClientRect();
        const clickX = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - rect.left;
        const clickY = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - rect.top;

        const ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.left = `${clickX}px`;
        ripple.style.top = `${clickY}px`;
        sectionRef.current.appendChild(ripple);

        ripple.addEventListener("animationend", () => ripple.remove());
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY, e.target as HTMLElement);
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const target = e.target as HTMLElement;
        handleMove(touch.clientX, touch.clientY, target);
      }
    };

    // Add event listeners to specific interactive elements
    const headline = headlineRef.current;
    const cards = cardRefs.current;
    const buttons = buttonRefs.current;

    // Only add mousemove and click for desktop, touchmove and touchstart for mobile
    headline?.addEventListener("mousemove", handleMouseMove);
    headline?.addEventListener("click", handleClick);
    if (isMobile) {
      headline?.addEventListener("touchstart", handleClick);
    } else {
      headline?.addEventListener("touchmove", handleTouchMove, { passive: true });
    }

    cards.forEach((card) => {
      card?.addEventListener("mousemove", handleMouseMove);
      card?.addEventListener("click", handleClick);
      if (isMobile) {
        card?.addEventListener("touchstart", handleClick);
      } else {
        card?.addEventListener("touchmove", handleTouchMove, { passive: true });
      }
    });

    buttons.forEach((button) => {
      button?.addEventListener("mousemove", handleMouseMove);
      button?.addEventListener("click", handleClick);
      if (isMobile) {
        button?.addEventListener("touchstart", handleClick);
      } else {
        button?.addEventListener("touchmove", handleTouchMove, { passive: true });
      }
    });

    return () => {
      headline?.removeEventListener("mousemove", handleMouseMove);
      headline?.removeEventListener("click", handleClick);
      headline?.removeEventListener("touchmove", handleTouchMove);
      headline?.removeEventListener("touchstart", handleClick);

      cards.forEach((card) => {
        card?.removeEventListener("mousemove", handleMouseMove);
        card?.removeEventListener("click", handleClick);
        card?.removeEventListener("touchmove", handleTouchMove);
        card?.removeEventListener("touchstart", handleClick);
      });

      buttons.forEach((button) => {
        button?.removeEventListener("mousemove", handleMouseMove);
        button?.removeEventListener("click", handleClick);
        button?.removeEventListener("touchmove", handleTouchMove);
        button?.removeEventListener("touchstart", handleClick);
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-8 sm:py-12 md:py-16 lg:py-20 xl:py-28 bg-gradient-to-br from-[#1A237E] via-[#1A237E]/80 to-[#FF6F61]/15 relative overflow-hidden perspective-1000"
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(60)].map((_, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-gradient-to-br from-[#FF6F61]/70 to-[#E0E0E0]/50 particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particleFlow ${Math.random() * 10 + 15}s infinite ease-in-out`,
            }}
          />
        ))}
        <span className="absolute inset-0 bg-gradient-to-br from-transparent via-[#E0E0E0]/10 to-transparent wave-effect" />
        <style>{`
          @keyframes particleFlow {
            0% { transform: translate(0, 0) scale(1); opacity: 0.6; }
            50% { transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) scale(1.6); opacity: 0.9; }
            100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          }
          @keyframes ripple {
            0% { transform: scale(0); opacity: 0.8; }
            100% { transform: scale(20); opacity: 0; }
          }
          @keyframes gradientPulse {
            0% { background-position: 0% 0%; }
            50% { background-position: 100% 100%; }
            100% { background-position: 0% 0%; }
          }
          .ripple {
            position: absolute;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, rgba(255, 111, 97, 0.8), transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: ripple 1.5s ease-out;
            z-index: 10;
          }
          .pricing-title {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 0.5rem;
            transition: transform 0.2s ease-out, opacity 0.3s;
            z-index: 40;
            position: relative;
            width: 100%;
            max-width: 100%;
            padding: 0 0.5rem;
            overflow: visible;
            animation: fadeIn 1s ease-out forwards;
          }
          .particle {
            transition: transform 0.1s, opacity 0.1s;
            box-shadow: 0 0 15px rgba(255, 111, 97, 0.5);
          }
          .wave-effect {
            transition: transform 0.2s ease-out, opacity 0.2s ease-out;
            background-size: 200% 200%;
            mix-blend-mode: overlay;
            z-index: 5;
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .subtext {
            opacity: 1;
            z-index: 30;
            position: relative;
            width: 100%;
            max-width: 100%;
            animation: fadeIn 1.2s ease-out forwards;
          }
          .card:hover {
            box-shadow: 0 10px 25px rgba(255, 111, 97, 0.6);
            transform: translateY(-8px) scale(1.03);
          }
          .card, button {
            transition: transform 0.3s ease-out, box-shadow 0.3s, opacity 0.3s;
            z-index: 30;
          }
          .action-button:hover {
            transform: scale(1.08);
            box-shadow: 0 8px 20px rgba(255, 111, 97, 0.5);
          }
          @media (max-width: 639px) {
            .pricing-title {
              flex-direction: column;
              gap: 1rem;
            }
            .action-button {
              width: 100%;
              max-width: 300px;
            }
          }
          @media (min-width: 640px) and (max-width: 767px) {
            .pricing-title {
              flex-direction: column;
              gap: 1.25rem;
            }
            .action-button {
              max-width: 350px;
            }
          }
        `}</style>
      </div>
      <div className="container px-4 sm:px-6 md:px-8 lg:px-12 max-w-full sm:max-w-7xl mx-auto flex flex-col items-center relative z-20">
        <h2 ref={headlineRef} className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#E0E0E0] to-[#FF6F61] mb-6 sm:mb-8 md:mb-10 drop-shadow-2xl pricing-title text-center">
          Choose Your Plan
        </h2>
        <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-200 max-w-full sm:max-w-2xl md:max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 leading-relaxed drop-shadow-md subtext text-center">
          Select the perfect plan for your needs. Upgrade anytime to unlock premium features and support.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full max-w-5xl mx-auto">
          <PricingCard
            title="Free"
            description="For basic contract analysis"
            price="$0"
            period="/forever"
            features={[
              "Basic contract analysis",
              "1 Project",
              "Limited risk identification",
              "Basic contract summary",
            ]}
            buttonText="Get Started"
            onButtonClick={handleGetStarted}
            highlight={false}
            cardRef={(el) => (cardRefs.current[0] = el)}
            buttonRef={(el) => (buttonRefs.current[0] = el)}
          />
          <PricingCard
            title="Premium"
            description="For comprehensive contract analysis"
            price="$10"
            period="/lifetime"
            features={[
              "Advanced contract analysis",
              "Unlimited Projects",
              "Chat with your contract",
              "10+ risk and opportunities",
              "Comprehensive contract summary",
              "Improvement Recommendations",
              "Key clause Identification",
              "Negotiation Points",
              "Contract duration Analysis",
              "Performance metric identification",
            ]}
            buttonText="Upgrade"
            onButtonClick={handleUpgrade}
            highlight={true}
            cardRef={(el) => (cardRefs.current[1] = el)}
            buttonRef={(el) => (buttonRefs.current[1] = el)}
          />
        </div>
      </div>
    </section>
  );
}

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  highlight?: boolean;
  onButtonClick: () => void;
  cardRef?: (el: HTMLDivElement | null) => void;
  buttonRef?: (el: HTMLButtonElement | null) => void;
}

function PricingCard({
  title,
  description,
  price,
  period,
  features,
  buttonText,
  onButtonClick,
  highlight = false,
  cardRef,
  buttonRef,
}: PricingCardProps) {
  return (
    <Card
      ref={cardRef}
      className={`h-full border-2 border-[#E0E0E0]/50 bg-[#1A237E]/40 backdrop-blur-md shadow-xl rounded-lg sm:rounded-xl transition-all duration-500 card ${
        highlight ? "ring-2 ring-[#FF6F61]/50" : ""
      }`}
    >
      <CardContent className="p-4 sm:p-6 md:p-7 flex flex-col items-center space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-xl md:text-2xl font-semibold text-gray-200 text-center drop-shadow-sm">
          {title}
        </h3>
        <p className="text-sm sm:text-base md:text-lg text-gray-400 text-center leading-relaxed">
          {description}
        </p>
        <div className="flex items-baseline justify-center mb-4 sm:mb-5">
          <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#E0E0E0]">{price}</span>
          <span className="text-sm sm:text-base md:text-lg text-gray-400 ml-1">{period}</span>
        </div>
        <ul className="space-y-2 sm:space-y-3 w-full text-center">
          {features.map((feature, index) => (
            <li
              key={index}
              className="text-sm sm:text-base md:text-lg text-gray-300 flex items-center justify-center"
            >
              <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-[#E0E0E0]/80 to-[#FF6F61]/80 mr-2 sm:mr-3 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        <Button
          ref={buttonRef}
          className="inline-flex items-center justify-center text-base sm:text-lg md:text-xl bg-gradient-to-r from-[#1A237E] to-[#FF6F61] text-white shadow-lg hover:from-[#E0E0E0]/10 hover:to-[#FF6F61] hover:shadow-[#1A237E]/50 transition-all duration-300 action-button w-full sm:w-auto mt-4 sm:mt-6"
          size="lg"
          onClick={onButtonClick}
          aria-label={buttonText}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}