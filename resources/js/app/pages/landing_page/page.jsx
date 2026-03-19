import React from "react";
import HeaderSection from "./sections/header-section";
import HeroSection from "./sections/hero-section";
import CarouselSection from "./sections/carousel-section";
import ServicesSection from "./sections/services-section";
import AboutSection from "./sections/about-section";
import ContactSection from "./sections/contact-section";
import FooterSection from "./sections/footer-section";
import DividerSection from "./sections/divider-section";

export default function Page() {
    return (
        <div>
            <HeaderSection />
            <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 overflow-x-hidden">
                <HeroSection />
                <CarouselSection />
                <ServicesSection />
                {/* <DividerSection /> */}
                <AboutSection />
                <ContactSection />
                <FooterSection />
            </div>
        </div>
    );
}
