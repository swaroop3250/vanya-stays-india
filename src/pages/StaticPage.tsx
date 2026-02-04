import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface StaticPageProps {
  title: string;
  subtitle?: string;
}

const StaticPage = ({ title, subtitle }: StaticPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl">{subtitle}</p>
          )}
          <div className="mt-10 rounded-3xl border border-border bg-card/80 p-8 text-muted-foreground">
            Content for {title} is coming soon. Please check back shortly.
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StaticPage;
