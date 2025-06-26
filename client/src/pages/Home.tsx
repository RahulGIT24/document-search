import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
//   MessageCircle, 
  Zap, 
  Shield, 
  Upload, 
  Brain,
  ArrowRight,
  Menu,
  X,
//   Users,
//   Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced AI understands context and provides intelligent responses to your PDF queries."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get instant answers from your documents without scrolling through hundreds of pages."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your documents are encrypted and processed securely. We never store your sensitive data."
    },
    {
      icon: Upload,
      title: "Easy Upload",
      description: "Simply drag and drop your PDFs. Support for multiple file formats and sizes."
    }
  ];

//   const testimonials = [
//     {
//       name: "Sarah Chen",
//       role: "Research Analyst",
//       content: "This tool has revolutionized how I work with research papers. I can extract insights in minutes instead of hours.",
//       rating: 5
//     },
//     {
//       name: "Michael Rodriguez",
//       role: "Legal Consultant",
//       content: "Perfect for reviewing contracts and legal documents. The AI understands complex legal terminology.",
//       rating: 5
//     },
//     {
//       name: "Dr. Emily Watson",
//       role: "Academic Researcher",
//       content: "An invaluable tool for literature reviews. It helps me quickly find relevant information across multiple papers.",
//       rating: 5
//     }
//   ];

//   const stats = [
//     { icon: Users, value: "50K+", label: "Active Users" },
//     { icon: FileText, value: "2M+", label: "Documents Processed" },
//     { icon: MessageCircle, value: "10M+", label: "Questions Answered" },
//     { icon: Clock, value: "99.9%", label: "Uptime" }
//   ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">PDF ChatBot</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it Works</a>
              {/* <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a> */}
              {/* <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a> */}
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300">Welcome, {user.name}</span>
                  <button
                    onClick={logout}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/signin" className="text-gray-300 hover:text-white transition-colors">
                    Sign In
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it Works</a>
                <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
                {/* <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a> */}
                {user ? (
                  <button
                    onClick={logout}
                    className="text-left text-gray-300 hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link to="/signin" className="text-gray-300 hover:text-white transition-colors">
                      Sign In
                    </Link>
                    <Link 
                      to="/signup" 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-center"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Chat with Your
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> PDFs</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform how you interact with documents. Upload any PDF and have intelligent conversations 
              to extract insights, summaries, and answers instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Start Chatting Free
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </Link>
              {/* <button className="flex items-center text-white px-8 py-4 rounded-xl border border-gray-600 hover:border-gray-500 transition-all duration-200 group">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </button> */}
            </div>
            <p className="text-gray-400 mt-4">No credit card required • Free forever plan available</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features for Document Intelligence
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to unlock the knowledge hidden in your PDFs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-200 group">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Get started in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Upload Your PDF</h3>
              <p className="text-gray-400">
                Simply drag and drop your PDF document or click to browse and upload from your device.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Ask Questions</h3>
              <p className="text-gray-400">
                Type your questions in natural language. Our AI understands context and nuance.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Get Instant Answers</h3>
              <p className="text-gray-400">
                Receive accurate, contextual answers with references to specific sections in your document.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section id="testimonials" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Loved by Professionals Worldwide
            </h2>
            <p className="text-xl text-gray-400">
              See what our users are saying about PDF ChatBot
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Document Workflow?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professionals who are already saving hours every day with PDF ChatBot.
          </p>
          <Link 
            to="/signup" 
            className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Start Your Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <p className="text-gray-400 mt-4">No setup required • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-lg font-bold text-white">PDF ChatBot</span>
              </div>
              <p className="text-gray-400">
                The most intelligent way to interact with your PDF documents.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PDF ChatBot. All rights reserved.</p>
          </div>
        </div>
      </footer> */}
    </div>
  );
}