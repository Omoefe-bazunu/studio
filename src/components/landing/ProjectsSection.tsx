import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageHint: string;
  projectUrl?: string;
  category: string;
}

const projectsData: Project[] = [
  {
    id: 'project-1',
    title: 'E-commerce Platform Revamp for "UrbanStyle"',
    description: 'Complete overhaul of an online fashion retailer\'s website, focusing on UX, mobile responsiveness, and conversion optimization.',
    imageSrc: 'https://picsum.photos/600/400?random=16',
    imageHint: 'modern website design',
    projectUrl: '#', // Placeholder
    category: 'Web Development',
  },
  {
    id: 'project-2',
    title: 'SEO & Content Strategy for "TechSolutions Inc."',
    description: 'Developed and executed a comprehensive SEO and content marketing plan, resulting in a 150% increase in organic traffic.',
    imageSrc: 'https://picsum.photos/600/400?random=17',
    imageHint: 'data analytics chart',
    projectUrl: '#', // Placeholder
    category: 'Digital Marketing',
  },
  {
    id: 'project-3',
    title: 'Brand Identity & Ad Campaign for "GreenLeaf Cafe"',
    description: 'Created a fresh brand identity and launched a targeted local ad campaign, boosting brand awareness and foot traffic.',
    imageSrc: 'https://picsum.photos/600/400?random=18',
    imageHint: 'cafe branding logo',
    // projectUrl: '#', // Example of a project without a direct link
    category: 'Marketing & Ads Design',
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">Our Recent Projects</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Take a look at some of the impactful solutions we've delivered for our clients.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project) => (
            <Card key={project.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col group">
              <CardHeader className="p-0">
                <div className="relative h-52 w-full">
                  <Image
                    src={project.imageSrc}
                    alt={project.title}
                    data-ai-hint={project.imageHint}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <span className="text-xs font-semibold uppercase text-accent tracking-wider">{project.category}</span>
                <CardTitle className="text-xl font-semibold text-primary mt-1 mb-2 line-clamp-2">{project.title}</CardTitle>
                <CardDescription className="text-muted-foreground text-sm line-clamp-3">{project.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-6 bg-muted/50">
                {project.projectUrl ? (
                  <Button variant="default" asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                      View Project <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                   <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 cursor-not-allowed" disabled>
                      Details Coming Soon
                    </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
         <div className="mt-16 text-center">
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/portfolio">
              Explore More Projects
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}