import React from "react";
import HeroSection from "./hero-section";
import ServicesSection from "./services-section";
import AboutSection from "./about-section";
import ContactSection from "./contact-section";
import FooterSection from "./footer-section";

export default function HomeSection() {
    return (
        <>
            <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 overflow-x-hidden">
                <HeroSection />
                <ServicesSection />
                <AboutSection />
                <ContactSection />
                <FooterSection />
            </div>
        </>
    );
}
