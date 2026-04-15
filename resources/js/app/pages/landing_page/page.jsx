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
import CareerSection from "./sections/career-section";

export default function Page() {
    return (
        <div>
            <ProgressScrollSection />

            <HeaderSection />
            <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 overflow-x-hidden">
                <div id="hero">
                    <HeroSection />
                </div>
                <CarouselSection />

                <AboutSection />
                <DeveloperSection />
                <ServicesSection />
                <TestimonialSection />
                <CareerSection />
                <ContactSection />
                {/* 
                <CarouselHighlightSection /> */}
                <FooterSection />
            </div>
        </div>
    );
}
