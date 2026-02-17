import { Link } from 'react-router-dom';
import { Palette, Image, ArrowRight, Sparkles, Eye, Sun, User } from 'lucide-react';
import { Button, Card, CardContent } from '../components/common';
import { APP_NAME } from '../utils/constants';

const features = [
  {
    icon: Palette,
    title: 'Color Theory Tools',
    description: 'Interactive color wheel, harmonies, contrast checker, and palette generator for artists.',
    link: '/color',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Image,
    title: 'Reference Search',
    description: 'Search millions of high-quality reference photos from Unsplash for your artwork.',
    link: '/reference',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Sun,
    title: 'Light Reference',
    description: 'Interactive 3D lighting studio to study how light and shadow affect the human form.',
    link: '/light',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: User,
    title: 'Pose Creator',
    description: 'Create custom poses by manipulating a 3D skeleton. Export poses for reference.',
    link: '/pose',
    color: 'from-purple-500 to-violet-500',
  },
];

const highlights = [
  { icon: Sparkles, text: 'Interactive color wheel with harmonies' },
  { icon: Eye, text: 'WCAG contrast checker for accessibility' },
  { icon: Sun, text: '3D light reference studio' },
  { icon: User, text: 'Pose Creator for custom references' },
];

export const HomePage = () => {
  return (
    <div className="space-y-12">
      {/* Hero section */}
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to <span className="text-primary-600">{APP_NAME}</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          Your all-in-one toolkit for color theory and reference images.
          Designed for artists, illustrators, and designers.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/color">
            <Button variant="primary" size="lg">
              <Palette className="w-5 h-5 mr-2" />
              Explore Colors
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/reference">
            <Button variant="secondary" size="lg">
              <Image className="w-5 h-5 mr-2" />
              Find References
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/light">
            <Button variant="secondary" size="lg">
              <Sun className="w-5 h-5 mr-2" />
              Light Studio
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/pose">
            <Button variant="secondary" size="lg">
              <User className="w-5 h-5 mr-2" />
              Pose Creator
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link key={feature.title} to={feature.link}>
            <Card hover className="h-full">
              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {feature.description}
                </p>
                <span className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium">
                  Get started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Highlights */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Everything you need
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl"
            >
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick start */}
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to create?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Start exploring colors, find reference images, study lighting, or create poses.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/color">
            <Button variant="primary">
              Open Color Tools
            </Button>
          </Link>
          <Link to="/reference">
            <Button variant="secondary">
              Search References
            </Button>
          </Link>
          <Link to="/light">
            <Button variant="secondary">
              Light Studio
            </Button>
          </Link>
          <Link to="/pose">
            <Button variant="secondary">
              Pose Creator
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
