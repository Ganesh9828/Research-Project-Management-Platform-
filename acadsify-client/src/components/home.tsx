import React from "react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { GraduationCap, Users, Calendar, Video } from "lucide-react";

export function Home() {
    return (
        <>
            <div className="container mx-auto px-4 py-12 bg-gradient-to-b from-secondary/10 to-background rounded-lg shadow-lg transition-colors duration-300">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-primary">
                        Transform Academic Collaboration
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        Connect students and teachers, streamline mentorship, and enhance
                        learning outcomes with our comprehensive academic management platform.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/80 transition-colors duration-300">
                            <Link to="/login">Get Started</Link>
                        </Button>
                        <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 hover:border-primary transition-colors duration-300">
                            Learn More
                        </Button>
                    </div>
                </div>

                <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <FeatureCard
                        icon={<GraduationCap className="h-8 w-8" />}
                        title="Smart Learning"
                        description="Personalized study plans and progress tracking for optimal academic growth."
                    />
                    <FeatureCard
                        icon={<Users className="h-8 w-8" />}
                        title="Project Mentorship"
                        description="Connect with expert mentors based on your interests and goals."
                    />
                    <FeatureCard
                        icon={<Calendar className="h-8 w-8" />}
                        title="Easy Scheduling"
                        description="Streamlined appointment booking and management system."
                    />
                    
                </div>
            </div>
        </>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card hover:shadow-xl transition-shadow duration-300">
            <div className="rounded-lg p-2 bg-primary/20 text-primary">{icon}</div>
            <h3 className="mt-4 text-xl font-semibold text-primary-foreground">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
    );
}
