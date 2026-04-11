import React from "react";
import HeaderSection from "./sections/header-section";
import HeroSection from "./sections/hero-section";
import CarouselSection from "./sections/carousel-section";
import ServicesSection from "./sections/services-section";
import AboutSection from "./sections/about-section";
import ContactSection from "./sections/contact-section";
import FooterSection from "./sections/footer-section";
import ProgressScrollSection from "./sections/progress-scroll-section";
import CarouselHighlightSection from "./sections/carousel-highlight-section";
import TestimonialSection from "./sections/testimonial-section";
import DeveloperSection from "./sections/developer-section";

export default function Page() {
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
                <TestimonialSection />
                <ContactSection />
                <DeveloperSection />
{/* 
                <CarouselHighlightSection /> */}
                <FooterSection />
            </div>
        </div>
    );
}
