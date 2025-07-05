
"use client";
import { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";

function PrivacyPolicySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (x: number, y: number) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseX = (x - rect.left - centerX) / centerX * 100;
      const mouseY = (y - rect.top - centerY) / centerY * 100;
      const rotateX = mouseY * 0.03;
      const rotateY = mouseX * -0.03;

      const headline = sectionRef.current.querySelector(".privacy-title");
      if (headline) {
        (headline as HTMLElement).style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`;
      }

      const cards = sectionRef.current.querySelectorAll(".card");
      cards.forEach((card, index) => {
        const offset = index % 2 === 0 ? 1 : -1;
        (card as HTMLElement).style.transform = `perspective(800px) rotateX(${rotateX / 3}deg) rotateY(${rotateY / 3}deg) translateZ(${15 + offset * 5}px)`;
      });

      const particles = sectionRef.current.querySelectorAll(".particle");
      particles.forEach((particle) => {
        const p = particle as HTMLElement;
        const dx = (mouseX - (parseFloat(p.style.left) || 50)) * 0.015;
        const dy = (mouseY - (parseFloat(p.style.top) || 50)) * 0.015;
        const speed = Math.sqrt(dx * dx + dy * dy) * 0.01;
        p.style.transform = `translate(${dx}px, ${dy}px) scale(${1 + speed * 1.5}) rotate(${mouseX * 0.05}deg)`;
        p.style.opacity = `${0.5 + speed * 0.5}`;
      });

      const wave = sectionRef.current.querySelector(".wave-effect");
      if (wave) {
        (wave as HTMLElement).style.transform = `translate(${mouseX * 0.1}px, ${mouseY * 0.1}px)`;
        (wave as HTMLElement).style.opacity = `${0.3 + Math.abs(mouseX) * 0.001}`;
      }
    };

    const handleClick = (e: MouseEvent | TouchEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const clickX = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - rect.left;
      const clickY = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - rect.top;

      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = `${clickX}px`;
      ripple.style.top = `${clickY}px`;
      sectionRef.current.appendChild(ripple);

      ripple.addEventListener("animationend", () => ripple.remove());
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
        mousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const section = sectionRef.current;
    section?.addEventListener("mousemove", handleMouseMove);
    section?.addEventListener("touchmove", handleTouchMove, { passive: false });
    section?.addEventListener("click", handleClick);
    section?.addEventListener("touchstart", handleClick);
    return () => {
      section?.removeEventListener("mousemove", handleMouseMove);
      section?.removeEventListener("touchmove", handleTouchMove);
      section?.removeEventListener("click", handleClick);
      section?.removeEventListener("touchstart", handleClick);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full min-h-screen bg-gradient-to-br from-[#1A237E] via-[#1A237E]/80 to-[#FF6F61]/15 relative overflow-hidden perspective-1000"
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
          .privacy-title {
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
          .card {
            transition: transform 0.3s ease-out, box-shadow 0.3s, opacity 0.3s;
            z-index: 30;
          }
          @media (max-width: 639px) {
            .privacy-title {
              flex-direction: column;
              gap: 1rem;
            }
          }
          @media (min-width: 640px) and (max-width: 767px) {
            .privacy-title {
              flex-direction: column;
              gap: 1.25rem;
            }
          }
        `}</style>
      </div>
      <div className="w-full flex flex-col items-center relative z-20 px-4 sm:px-6 md:px-8 lg:px-12 py-10">
        <h2 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#E0E0E0] to-[#FF6F61] mb-6 sm:mb-8 md:mb-10 drop-shadow-2xl privacy-title text-center">
          Privacy Policy
        </h2>
        <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-200 max-w-full sm:max-w-2xl md:max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 leading-relaxed drop-shadow-md subtext text-center">
          Your privacy is important to us. Learn how ContractWise protects your data.
        </p>
        <Card
          className="h-full border-2 border-[#E0E0E0]/50 bg-[#1A237E]/40 backdrop-blur-md shadow-xl rounded-lg sm:rounded-xl transition-all duration-500 card w-full max-w-4xl mx-auto"
        >
          <CardContent className="p-4 sm:p-6 md:p-8 flex flex-col space-y-6 text-gray-200">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">1. Introduction</h3>
              <p className="text-sm sm:text-base leading-relaxed">
                ContractWise  is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our AI-powered contract analysis platform ("Service"), which analyzes contracts to identify risks, opportunities, and negotiation points.
              </p>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">2. Information We Collect</h3>
              <p className="text-sm sm:text-base leading-relaxed">
                We collect the following information to provide and improve our Service:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <strong>Personal Information</strong>: Name, email address, and billing details (processed securely via Stripe for Premium plan subscriptions).
                </li>
                <li>
                  <strong>Contract Data</strong>: Contracts or documents you upload for analysis, including text and metadata.
                </li>
                <li>
                  <strong>Usage Data</strong>: Information about how you interact with the Service, such as analysis requests and feature usage.
                </li>
                <li>
                  <strong>Technical Data</strong>: IP address, browser type, device information, and analytics data to optimize performance.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">3. How We Use Your Information</h3>
              <p className="text-sm sm:text-base leading-relaxed">
                We use your information to:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Analyze contracts to provide risk identification, opportunity insights, and negotiation points.</li>
                <li>Manage your account and process payments for the Premium plan.</li>
                <li>Improve the Service through analytics and user feedback.</li>
                <li>Communicate with you about updates, support, or promotions (with your consent).</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">4. Data Sharing</h3>
              <p className="text-sm sm:text-base leading-relaxed">
                We do not sell your data. We may share information with:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <strong>Service Providers</strong>: Third parties like Stripe for payment processing or cloud providers for secure data storage.
                </li>
                <li>
                  <strong>Legal Compliance</strong>: When required by law or to protect our rights.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">5. Data Security</h3>
              <p className="text-sm sm:text-base leading-relaxed">
                We use industry-standard encryption and security measures to protect your data, including contracts uploaded for analysis. However, no system is completely secure, and we cannot guarantee absolute security.
              </p>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">6. Your Rights</h3>
              <p className="text-sm sm:text-base leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Access, correct, or delete your personal information.</li>
                <li>Opt out of promotional communications.</li>
                <li>Request a copy of your uploaded contracts or analysis data.</li>
              </ul>
              <p className="text-sm sm:text-base leading-relaxed mt-2">
                To exercise these rights, contact us at shivanshnegi2860@gmail.com.
              </p>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">7. Data Retention</h3>
              <p className="text-sm sm:text-base leading-relaxed">
                We retain personal information and contract data only as long as necessary to provide the Service or comply with legal obligations. You can request deletion of your data at any time.
              </p>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">8. Third-Party Services</h3>
              <p className="text-sm sm:text-base leading-relaxed">
                Our Service uses Stripe for payment processing. Stripe’s privacy policy applies to payment data. We do not store full payment details on our servers.
              </p>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">9. Changes to This Policy</h3>
              <p className="text-sm sm:text-base leading-relaxed">
                We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or through the Service.
              </p>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">10. Contact Us</h3>
              <p className="text-sm sm:text-base leading-relaxed">
                If you have questions about this Privacy Policy, contact us at:
                <br />
                Email: shivanshnegi2860@gmail.com
                <br />
                Address: ContractWise, 1234 AI Lane, Tech City, TC 12345
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* <Header /> */}
      <PrivacyPolicySection />
    </div>
  );
}
