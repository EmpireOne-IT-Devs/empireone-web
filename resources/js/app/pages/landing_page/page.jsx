import React from "react";
import HeaderSection from "./sections/header-section";
import HeroSection from "./sections/hero-section";
import CarouselSection from "./sections/carousel-section";
import ServicesSection from "./sections/services-section";
import AboutSection from "./sections/about-section";
import ContactSection from "./sections/contact-section";
import FooterSection from "./sections/footer-section";
import ProgressScrollSection from "./sections/progress-scroll-section";

export default function Page() {
    const images = [
        "https://picsum.photos/400/400?grayscale",
        "https://picsum.photos/500/500?grayscale",
        "https://picsum.photos/600/600?grayscale",
        "https://picsum.photos/700/700?grayscale",
        "https://picsum.photos/300/300?grayscale",
    ];

    const transformStyles = [
        "rotate(5deg) translate(-150px)",
        "rotate(0deg) translate(-70px)",
        "rotate(-5deg)",
        "rotate(5deg) translate(70px)",
        "rotate(-5deg) translate(150px)",
    ];
    return (
        <div>
            {/* Fixed overlay — sits above everything, no layout impact */}
            <ProgressScrollSection />

            <HeaderSection />
            <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 overflow-x-hidden">
                <div id="hero">
                    <HeroSection />
                </div>
                <CarouselSection />

                <AboutSection />
                <ServicesSection />

                <ContactSection />
                <FooterSection />
            </div>
        </div>
    );
}
