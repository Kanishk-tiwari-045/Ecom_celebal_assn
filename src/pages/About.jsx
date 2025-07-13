import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Target, 
  Award, 
  Heart, 
  Globe, 
  Truck, 
  Shield, 
  Zap,
  Mail,
  Linkedin,
  Twitter,
  Github,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { cn } from '../utils';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const About = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('story');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'Happy Customers', value: '50K+', icon: Users },
    { label: 'Products Sold', value: '100K+', icon: Target },
    { label: 'Years Experience', value: '10+', icon: Award },
    { label: 'Countries Served', value: '25+', icon: Globe }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We put our customers at the heart of everything we do, ensuring exceptional service and satisfaction.'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Every product is carefully selected and tested to meet our high standards of quality and reliability.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We continuously innovate to bring you the latest technology and trends in e-commerce.'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to get your products to you as fast as possible.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300',
      bio: 'Passionate about creating exceptional shopping experiences and building meaningful customer relationships.',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'sarah@shophub.com'
      }
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      bio: 'Tech enthusiast focused on building scalable platforms and innovative e-commerce solutions.',
      social: {
        linkedin: '#',
        github: '#',
        email: 'michael@shophub.com'
      }
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Marketing',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
      bio: 'Creative strategist dedicated to connecting brands with customers through compelling storytelling.',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'emily@shophub.com'
      }
    },
    {
      name: 'David Kim',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
      bio: 'Operations expert ensuring smooth logistics and exceptional customer service delivery.',
      social: {
        linkedin: '#',
        email: 'david@shophub.com'
      }
    }
  ];

  const milestones = [
    {
      year: '2014',
      title: 'Company Founded',
      description: 'Started as a small online marketplace with a vision to revolutionize e-commerce.'
    },
    {
      year: '2016',
      title: 'First Million',
      description: 'Reached our first million in revenue and expanded our product catalog significantly.'
    },
    {
      year: '2020',
      title: 'Mobile App Launch',
      description: 'Released our mobile app, making shopping even more convenient for customers.'
    },
    {
      year: '2024',
      title: 'AI Integration',
      description: 'Implemented AI-powered recommendations and customer service chatbots.'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <LoadingSpinner size="xl" text="Loading our story..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              About <span className="text-primary-400">ShopHub</span>
            </h1>
            <p className="text-xl text-secondary-200 max-w-3xl mx-auto mb-8 animate-slide-up">
              We're on a mission to make online shopping more personal, convenient, and enjoyable for everyone. 
              Discover quality products from trusted brands, all in one place.
            </p>
            <div className="flex justify-center space-x-4 animate-bounce-subtle">
              <button
                onClick={() => setActiveSection('story')}
                className={cn(
                  'btn btn-lg transition-all duration-300',
                  activeSection === 'story' ? 'btn-primary' : 'btn-outline'
                )}
              >
                Our Story
              </button>
              <button
                onClick={() => setActiveSection('team')}
                className={cn(
                  'btn btn-lg transition-all duration-300',
                  activeSection === 'team' ? 'btn-primary' : 'btn-outline'
                )}
              >
                Meet the Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Our Story */}
          {activeSection === 'story' && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
                  <div className="space-y-4 text-secondary-300">
                    <p>
                      Founded in 2014, ShopHub began as a simple idea: to create an online marketplace 
                      that puts customers first. What started as a small team of passionate entrepreneurs 
                      has grown into a global platform serving millions of customers worldwide.
                    </p>
                    <p>
                      We believe that shopping should be more than just a transaction. It should be an 
                      experience that brings joy, convenience, and value to your life. That's why we've 
                      built our platform with cutting-edge technology, curated product selections, and 
                      exceptional customer service.
                    </p>
                    <p>
                      Today, we're proud to offer over 100,000 products from trusted brands, with fast 
                      shipping to 25+ countries and a customer satisfaction rate of over 98%.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600"
                    alt="Our team"
                    className="rounded-2xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/50 to-transparent rounded-2xl" />
                </div>
              </div>

              {/* Values */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-white text-center mb-12">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {values.map((value, index) => (
                    <div 
                      key={value.title}
                      className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm hover:bg-secondary-700/50 transition-all duration-300 animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mb-4">
                        <value.icon className="w-6 h-6 text-primary-400" />
                      </div>
                      <h3 className="text-white font-semibold mb-2">{value.title}</h3>
                      <p className="text-secondary-400 text-sm">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h2 className="text-3xl font-bold text-white text-center mb-12">Our Journey</h2>
                <div className="space-y-8">
                  {milestones.map((milestone, index) => (
                    <div 
                      key={milestone.year}
                      className="flex items-start space-x-6 animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex-shrink-0 w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center border-2 border-primary-500/20">
                        <span className="text-primary-400 font-bold">{milestone.year}</span>
                      </div>
                      <div className="flex-1 bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm">
                        <h3 className="text-white font-semibold text-lg mb-2">{milestone.title}</h3>
                        <p className="text-secondary-400">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Team Section */}
          {activeSection === 'team' && (
            <div className="animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Meet Our Team</h2>
                <p className="text-secondary-400 max-w-2xl mx-auto">
                  Behind every great product is a great team. Meet the passionate individuals 
                  who make ShopHub possible.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {team.map((member, index) => (
                  <div 
                    key={member.name}
                    className="bg-secondary-800/50 rounded-2xl overflow-hidden backdrop-blur-sm hover:bg-secondary-700/50 transition-all duration-300 group animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Social Links */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {member.social.email && (
                          <a
                            href={`mailto:${member.social.email}`}
                            className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <Mail className="w-4 h-4 text-secondary-600" />
                          </a>
                        )}
                        {member.social.linkedin && (
                          <a
                            href={member.social.linkedin}
                            className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <Linkedin className="w-4 h-4 text-secondary-600" />
                          </a>
                        )}
                        {member.social.twitter && (
                          <a
                            href={member.social.twitter}
                            className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <Twitter className="w-4 h-4 text-secondary-600" />
                          </a>
                        )}
                        {member.social.github && (
                          <a
                            href={member.social.github}
                            className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <Github className="w-4 h-4 text-secondary-600" />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-white font-semibold text-lg mb-1">{member.name}</h3>
                      <p className="text-primary-400 text-sm mb-3">{member.role}</p>
                      <p className="text-secondary-400 text-sm">{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default About;
