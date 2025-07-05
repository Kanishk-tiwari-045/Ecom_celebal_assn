import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  Headphones,
  Globe,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn, isValidEmail, isValidPhone } from '../utils';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email',
      contact: 'support@shophub.com',
      availability: '24/7 Response',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak with our team',
      contact: '+1 (555) 123-4567',
      availability: 'Mon-Fri 9AM-6PM EST',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with support',
      contact: 'Available on website',
      availability: 'Mon-Fri 9AM-6PM EST',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Headphones,
      title: 'Help Center',
      description: 'Browse FAQs & guides',
      contact: 'help.shophub.com',
      availability: 'Available 24/7',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    }
  ];

  const officeLocations = [
    {
      city: 'New York',
      address: '123 Business Ave, Suite 100',
      zipCode: 'New York, NY 10001',
      phone: '+1 (555) 123-4567',
      email: 'ny@shophub.com'
    },
    {
      city: 'San Francisco',
      address: '456 Tech Street, Floor 5',
      zipCode: 'San Francisco, CA 94105',
      phone: '+1 (555) 987-6543',
      email: 'sf@shophub.com'
    },
    {
      city: 'London',
      address: '789 Commerce Road',
      zipCode: 'London, UK EC1A 1BB',
      phone: '+44 20 1234 5678',
      email: 'london@shophub.com'
    }
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Customer Support' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'technical', label: 'Technical Issues' },
    { value: 'partnership', label: 'Business Partnership' },
    { value: 'feedback', label: 'Feedback & Suggestions' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!isValidEmail(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters';
    if (formData.phone && !isValidPhone(formData.phone)) newErrors.phone = 'Invalid phone number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general'
      });
      
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
            Get in <span className="text-primary-400">Touch</span>
          </h1>
          <p className="text-xl text-secondary-200 max-w-3xl mx-auto animate-slide-up">
            Have a question, need support, or want to share feedback? We're here to help. 
            Reach out to us through any of the channels below.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <div 
              key={method.title}
              className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm hover:bg-secondary-700/50 transition-all duration-300 group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300',
                method.bgColor
              )}>
                <method.icon className={cn('w-6 h-6', method.color)} />
              </div>
              <h3 className="text-white font-semibold mb-2">{method.title}</h3>
              <p className="text-secondary-400 text-sm mb-3">{method.description}</p>
              <p className="text-primary-400 font-medium text-sm mb-2">{method.contact}</p>
              <p className="text-secondary-500 text-xs">{method.availability}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-secondary-800/50 rounded-2xl p-8 backdrop-blur-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Send us a Message</h2>
              <p className="text-secondary-400">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            {/* Success/Error Messages */}
            {submitStatus === 'success' && (
              <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4 animate-slide-up">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <h3 className="text-green-400 font-medium">Message Sent!</h3>
                    <p className="text-green-300 text-sm">
                      Thank you for contacting us. We'll respond within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 animate-slide-up">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <div>
                    <h3 className="text-red-400 font-medium">Error Sending Message</h3>
                    <p className="text-red-300 text-sm">
                      Something went wrong. Please try again or contact us directly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={cn('input', errors.name && 'input-error')}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={cn('input', errors.email && 'input-error')}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Phone and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={cn('input', errors.phone && 'input-error')}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="input"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className={cn('input', errors.subject && 'input-error')}
                  placeholder="Enter message subject"
                />
                {errors.subject && (
                  <p className="text-red-400 text-sm mt-1">{errors.subject}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={6}
                  className={cn('input resize-none', errors.message && 'input-error')}
                  placeholder="Enter your message..."
                />
                {errors.message && (
                  <p className="text-red-400 text-sm mt-1">{errors.message}</p>
                )}
                <p className="text-secondary-500 text-xs mt-1">
                  {formData.message.length}/500 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn btn-primary btn-lg group"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" color="white" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Office Locations & Info */}
          <div className="space-y-8">
            {/* Office Locations */}
            <div className="bg-secondary-800/50 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6">Our Offices</h2>
              <div className="space-y-6">
                {officeLocations.map((office, index) => (
                  <div 
                    key={office.city}
                    className="border-b border-secondary-700 last:border-b-0 pb-6 last:pb-0 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <h3 className="text-white font-semibold text-lg mb-3">{office.city}</h3>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-4 h-4 text-primary-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-secondary-300 text-sm">{office.address}</p>
                          <p className="text-secondary-300 text-sm">{office.zipCode}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-primary-400" />
                        <p className="text-secondary-300 text-sm">{office.phone}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-primary-400" />
                        <p className="text-secondary-300 text-sm">{office.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-secondary-800/50 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Clock className="w-6 h-6 text-primary-400 mr-3" />
                Business Hours
              </h2>
              <div className="space-y-3">
                {[
                  { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM EST' },
                  { day: 'Saturday', hours: '10:00 AM - 4:00 PM EST' },
                  { day: 'Sunday', hours: 'Closed' }
                ].map((schedule, index) => (
                  <div 
                    key={schedule.day}
                    className="flex justify-between items-center py-2 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-secondary-300">{schedule.day}</span>
                    <span className="text-white font-medium">{schedule.hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-primary-400" />
                  <div>
                    <p className="text-primary-400 font-medium">24/7 Online Support</p>
                    <p className="text-primary-300 text-sm">
                      Our online help center and email support are available around the clock.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8">
              <h3 className="text-white font-bold text-xl mb-2">Need Quick Answers?</h3>
              <p className="text-primary-100 mb-6">
                Check out our comprehensive FAQ section for instant answers to common questions.
              </p>
              <button className="btn bg-white text-primary-600 hover:bg-primary-50 btn-md">
                Visit FAQ Center
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
