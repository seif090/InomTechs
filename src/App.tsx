/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Code, 
  Smartphone, 
  GraduationCap, 
  ChevronRight, 
  Menu, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Twitter,
  ExternalLink,
  Laptop,
  Users,
  Clock,
  ShieldCheck,
  MessageSquare,
  Send,
  Loader2,
  Bot,
  User,
  Moon,
  Sun,
  Quote
} from 'lucide-react';

// --- Gemini API Setup ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are the InomTechs AI Assistant, a professional and helpful representative of InomTechs Private Limited. 
Your goal is to help clients understand our services, showcase our projects, and facilitate business deals.

About InomTechs:
- Mission: Empowering small businesses in rural India to expand online.
- Services: IT Security, UI/UX Design, Web Development, App Development, AR/VR Solutions, and Marketing.
- Key Projects: 
  - OMRAH: Tourism solution for Saudi Arabia (Travel/Tourism).
  - TAJ Platform: Marketing and website design platform.
  - Alyoumlandmark: Agri-Export site.
  - Inovent VR: Remote exhibitions and conferences in VR.
  - Educhains: Educational platform for students and employees.
  - HASAD: Agri-Tech app linking farmers to markets.
  - Learnadora: Kids coding platform.
  - Eco+ Car Care: Comprehensive car service app.

Tone: Professional, innovative, encouraging, and efficient.
When asked about deals: Encourage them to leave their contact details in the form or suggest specific service packages based on their needs.
If unsure: Ask clarifying questions about their business goals.`;

// --- Components ---

const Chatbot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Hello! I am your InomTechs assistant. How can I help you build your business today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        })), { role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });

      const botText = response.text || "I'm sorry, I encountered an error. Please try again.";
      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "I'm having trouble connecting to my brain right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-orange-600 text-white p-4 rounded-full shadow-2xl hover:bg-orange-700 transition-colors"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800"
          >
            {/* Header */}
            <div className="bg-black p-4 text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm">InomTechs Assistant</h4>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] text-gray-400 font-medium">Online & Ready</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-950/50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'bg-gray-800 dark:bg-gray-700 text-white'}`}>
                      {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700 rounded-tl-none'}`}>
                      {m.text}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-700">
                    <Loader2 size={18} className="animate-spin text-orange-600" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors dark:text-white"
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-black dark:bg-orange-600 text-white p-2 rounded-xl hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Navbar = ({ darkMode, toggleDarkMode }: { darkMode: boolean, toggleDarkMode: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('home'), href: '#' },
    { name: t('about'), href: '#about' },
    { name: t('services_nav'), href: '#services' },
    { name: t('projects_nav'), href: '#projects' },
    { name: t('products_nav'), href: '#products' },
    { name: t('contact'), href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md py-3 shadow-sm' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className={`text-2xl font-bold tracking-tighter ${scrolled ? 'text-black dark:text-white' : 'text-black dark:text-white'}`}>
              InomTechs<span className="text-orange-600">.</span>
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className={`ml-10 flex items-baseline ${i18n.language === 'ar' ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className={`flex items-center ${i18n.language === 'ar' ? 'mr-8 gap-4' : 'gap-4'}`}>
                <button
                  onClick={toggleLanguage}
                  className="px-3 py-1 text-sm font-bold border-2 border-orange-600 rounded-md hover:bg-orange-600 hover:text-white transition-all text-orange-600 dark:text-orange-500"
                >
                  {i18n.language === 'en' ? 'AR' : 'EN'}
                </button>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button className="bg-black dark:bg-orange-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-orange-600 dark:hover:bg-orange-700 transition-all">
                  {t('get_started')}
                </button>
              </div>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 text-xs font-bold border border-orange-600 rounded-md text-orange-600"
            >
              {i18n.language === 'en' ? 'AR' : 'EN'}
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-black dark:text-white p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 px-3">
                <button className="w-full bg-black dark:bg-orange-600 text-white py-3 rounded-xl font-medium">
                  {t('get_started')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- About Us Component ---
const AboutUs = () => {
  return (
    <section id="about" className="py-24 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-[40px] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070" 
                alt="InomTechs professional team working collaboratively on innovative technology solutions" 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
                  <p className="text-white font-medium text-lg italic text-center">
                    "Driving innovation, improving efficiency, and contributing to the advancement of technology."
                  </p>
                </div>
              </div>
            </div>
            
            {/* Background Accent */}
            <div className="absolute -z-10 -bottom-6 -left-6 w-64 h-64 bg-orange-100 dark:bg-orange-950/20 rounded-full blur-3xl opacity-50" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-orange-600 dark:text-orange-500 font-bold tracking-widest uppercase text-xs mb-2">Our Story</p>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl mb-8">About Us</h2>
            
            <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                Inomtechs specialize in the creation, development, and provision of products, services, and solutions that are rooted in technology, including software development, application development, business development, marketing, and content management systems.
              </p>
              <p>
                As a leading provider of technology capabilities, Inomtechs contributes to the development of a variety of fields by driving innovation, improving efficiency, and contributing to the advancement of technology.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-8">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800">
                <h4 className="text-3xl font-bold text-orange-600 dark:text-orange-500 mb-1">50+</h4>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expert Developers</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800">
                <h4 className="text-3xl font-bold text-orange-600 dark:text-orange-500 mb-1">2014+</h4>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Years of Excellence</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-12 bg-black dark:bg-orange-600 text-white px-8 py-4 rounded-full font-bold shadow-xl flex items-center gap-2 group transition-all"
            >
              Explore Mission <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-50 dark:bg-orange-950/10 hidden lg:block transform skew-x-12 translate-x-24" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
              Empowering Small Businesses
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] text-gray-900 dark:text-white mb-6">
              {t('welcome')} <span className="text-orange-600">Company.</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-lg leading-relaxed">
              We are thrilled to welcome you to Inomtechs, where innovation meets limitless possibilities in the world of technology. Today, we want to take a few moments to introduce you to our company and the incredible journey we're on.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-black dark:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-600 dark:hover:bg-orange-700 transition-all flex items-center justify-center gap-2 group shadow-xl hover:shadow-orange-200">
                {t('explore_services')} <ArrowRight className={`${i18n.language === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform`} size={20} />
              </button>
              <button className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                {t('our_mission')}
              </button>
            </div>
            
            <div className={`mt-12 flex items-center ${i18n.language === 'ar' ? 'flex-row-reverse sm:flex-row gap-6' : 'gap-6'}`}>
              <div className={`flex ${i18n.language === 'ar' ? '-space-x-reverse -space-x-3' : '-space-x-3'}`}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-bold text-gray-900 dark:text-white font-mono">100+</span> {t('businesses_empowered')}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072" 
                alt="Modern technology workspace representing InomTechs digital development environment" 
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating Cards */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-6 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-lg z-20 flex items-center gap-3 border border-orange-100 dark:border-gray-800"
            >
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{t('projects_done')}</p>
                <p className="text-lg font-bold dark:text-white">150+</p>
              </div>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute -bottom-6 ${i18n.language === 'ar' ? '-left-6' : '-right-6'} bg-white dark:bg-gray-900 p-4 rounded-xl shadow-lg z-20 flex items-center gap-3 border border-blue-100 dark:border-gray-800`}
            >
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{t('students_trained')}</p>
                <p className="text-lg font-bold dark:text-white">500+</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const { t, i18n } = useTranslation();
  const services = [
    {
      title: i18n.language === 'ar' ? 'أمن المعلومات' : "IT Security",
      desc: i18n.language === 'ar' ? 'حلول قوية للأمن السيبراني لحماية أصولك الرقمية وضمان استمرارية الأعمال.' : "Robust cybersecurity solutions to protect your digital assets and ensure business continuity.",
      icon: <ShieldCheck size={32} />,
      lightColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-600 dark:text-red-400"
    },
    {
      title: i18n.language === 'ar' ? 'تصميم واجهة وتجربة المستخدم' : "UI/UX Design",
      desc: i18n.language === 'ar' ? 'تصميم واجهات مستخدم بديهية وجذابة توفر تجارب رقمية سلسة.' : "Crafting intuitive and engaging user interfaces that provide seamless digital experiences.",
      icon: <Users size={32} />,
      lightColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      title: i18n.language === 'ar' ? 'تطوير المواقع' : "Web Development",
      desc: i18n.language === 'ar' ? 'بناء مواقع إلكترونية سريعة الاستجابة وعالية الأداء مصممة خصيصاً لأهداف عملك.' : "Building high-performance, responsive websites tailored to your specific business goals.",
      icon: <Laptop size={32} />,
      lightColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400"
    },
    {
      title: i18n.language === 'ar' ? 'تطوير التطبيقات' : "App Development",
      desc: i18n.language === 'ar' ? 'تطوير تطبيقات الهاتف المحمول للهواتف الذكية التي تربطك بمستخدميك.' : "Developing native and cross-platform mobile applications that connect you with your users.",
      icon: <Smartphone size={32} />,
      lightColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400"
    },
    {
      title: i18n.language === 'ar' ? 'حلول الواقع الافتراضي والمعزز' : "AR/VR Solutions",
      desc: i18n.language === 'ar' ? 'تجارب واقع معزز وافتراضي غامرة للتسويق والتدريب والمعارض.' : "Immersive augmented and virtual reality experiences for marketing, training, and exhibitions.",
      icon: <Code size={32} />,
      lightColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: i18n.language === 'ar' ? 'التسويق الرقمي' : "Marketing",
      desc: i18n.language === 'ar' ? 'خدمات التسويق الرقمي الاستراتيجية لتعزيز تواجدك عبر الإنترنت والوصول إلى جمهورك المستهدف.' : "Strategic digital marketing services to enhance your online presence and reach your target audience.",
      icon: <ExternalLink size={32} />,
      lightColor: "bg-yellow-50 dark:bg-yellow-900/20",
      textColor: "text-yellow-600 dark:text-yellow-400"
    }
  ];

  return (
    <section id="services" className="py-24 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-orange-600 dark:text-orange-500 font-bold tracking-widest uppercase text-xs mb-2">{t('our_capabilities')}</p>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">{t('services_title')}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl dark:bg-gray-900/50 transition-all duration-300 group"
            >
              <div className={`${service.lightColor} ${service.textColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {service.desc}
              </p>
              <a href="#" className={`text-sm font-bold flex items-center gap-2 ${service.textColor} group-hover:underline underline-offset-4`}>
                {i18n.language === 'ar' ? 'اقرأ المزيد' : 'Learn More'} {i18n.language === 'ar' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const projects = [
    {
      title: "OMRAH",
      category: "Tourism Solution",
      image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=2070",
      desc: "An application and website serving tourists interested in visiting the Kingdom of Saudi Arabia. Challenge: Handling peak season traffic spikes. Solution: Implemented elastic cloud scaling and optimized CDN delivery to ensure zero downtime during Hajj and Umrah.",
      technologies: ["React", "FastAPI", "Cloudflare", "ElasticSearch"],
      testimonial: {
        author: "Ahmed Al-Farsi",
        text: "The scalability InomTechs delivered for OMRAH during peak season was phenomenal. Our users experienced zero lag."
      }
    },
    {
      title: "TAJ Platform",
      category: "Marketing & Design",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2070",
      desc: "Integrated platform for marketing and website design. Challenge: Diverse branding needs for small businesses. Solution: Created a modular 'drag-and-drop' component library that allows non-technical owners to build a professional-grade online presence.",
      technologies: ["Next.js", "Tailwind CSS", "PostgreSQL", "Firebase"],
      testimonial: {
        author: "Meera Nair",
        text: "The TAJ Platform gave our craft business a professional edge that we couldn't have achieved ourselves."
      }
    },
    {
      title: "Alyoumlandmark",
      category: "Agri-Export",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=2044",
      desc: "Exports agricultural crops like fruits and vegetables. Challenge: Real-time supply chain transparency. Solution: Integrated a blockchain-based tracking system to provide buyers with verifiable data on produce origin and quality.",
      technologies: ["Hyperledger Fabric", "Node.js", "IoT Sensors", "React Native"],
      testimonial: {
        author: "Samir Gupta",
        text: "Transparency is key in exports. The blockchain solution from InomTechs has built massive trust with our EU buyers."
      }
    },
    {
      title: "Inovent VR",
      category: "Virtual Reality",
      image: "https://images.unsplash.com/photo-1478416272538-5f7e51dc5400?auto=format&fit=crop&q=80&w=2070",
      desc: "Holds exhibitions and conferences remotely in VR. Challenge: High latency on low-bandwidth networks. Solution: Developed a progressive rendering engine that delivers immersive 360-degree experiences even in areas with limited internet speeds.",
      technologies: ["Unity 3D", "WebXR", "WebRTC", "Socket.io"],
      testimonial: {
        author: "Elena Petrova",
        text: "Inovent's VR quality is unmatched. Even with moderate speeds, the immersion is seamless."
      }
    },
    {
      title: "Educhains",
      category: "Education",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1974",
      desc: "Educational platform for students and employees. Challenge: Low student engagement in remote models. Solution: Introduced gamified learning paths and automated peer-to-peer assessment modules to drive higher completion rates.",
      technologies: ["LMS architecture", "Python", "React", "AWS Lambda"],
      testimonial: {
        author: "Professor Marcus",
        text: "Completion rates jumped by 40% after we implemented InomTech's gamified learning module."
      }
    },
    {
      title: "HASAD",
      category: "Agri-Tech",
      image: "https://images.unsplash.com/photo-1495539406979-bf61750d38ad?auto=format&fit=crop&q=80&w=2070",
      desc: "Links farmers to market statistics. Challenge: Complex data visualization for non-experts. Solution: Designed a simplified 'traffic-light' decision logic that tells farmers exactly when to sell based on predictive market analytics.",
      technologies: ["Data Science", "React", "D3.js", "Serverless"],
      testimonial: {
        author: "Farmer Gopal",
        text: "The simple red/green lights tell me exactly when to sell my crop. My profits are up significantly."
      }
    }
  ];

  return (
    <section id="projects" className="py-24 bg-gray-50 dark:bg-gray-950 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <p className="text-orange-600 dark:text-orange-500 font-bold tracking-widest uppercase text-xs mb-2">Our Portfolio</p>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">Successful Projects</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative rounded-3xl overflow-hidden shadow-md bg-white dark:bg-gray-900 h-96 cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="h-full overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">{project.category}</p>
                    <h3 className="text-xl font-bold">{project.title}</h3>
                  </div>
                  <button className="bg-orange-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2 mb-4">
                  {project.desc}
                </p>
                <div className="mt-2">
                  <span className="text-xs font-bold border border-white/30 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                    View Details
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 sm:pt-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-md transition-all border border-white/20"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col md:flex-row h-full overflow-y-auto">
                <div className="md:w-5/12 h-64 md:h-auto sticky top-0 md:relative">
                  <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                </div>
                <div className="md:w-7/12 p-8 md:p-14 lg:p-20 overflow-y-auto">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="px-4 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-500 rounded-full text-xs font-bold uppercase tracking-widest">
                      {selectedProject.category}
                    </span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                    {selectedProject.title}
                  </h2>
                  
                  <div className="space-y-12">
                    <section>
                      <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">Case Overview</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                        {selectedProject.desc}
                      </p>
                    </section>

                    <section>
                      <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">Stack & Tools</h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedProject.technologies?.map((tech: string, i: number) => (
                          <span key={i} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </section>

                    {selectedProject.testimonial && (
                      <section className="bg-orange-50 dark:bg-orange-900/10 p-8 md:p-10 rounded-[32px] border border-orange-100 dark:border-orange-900/20">
                        <div className="text-orange-500 mb-6">
                          <Quote size={40} fill="currentColor" className="opacity-20" />
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 text-xl font-medium mb-6 italic leading-snug">
                          "{selectedProject.testimonial.text}"
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-orange-200 dark:bg-orange-800 flex items-center justify-center text-orange-700 dark:text-orange-300 font-bold">
                            {selectedProject.testimonial.author[0]}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white text-lg">
                              {selectedProject.testimonial.author}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 font-medium">Verify Client Review</p>
                          </div>
                        </div>
                      </section>
                    )}
                  </div>

                  <div className="mt-16 flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:bg-orange-600 dark:hover:bg-orange-500 hover:text-white font-bold py-5 rounded-2xl shadow-xl transition-all text-lg">
                      Explore Case Study
                    </button>
                    <button 
                      onClick={() => setSelectedProject(null)}
                      className="px-10 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold py-5 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

const AnalyticsChart = () => {
  const data = useMemo(() => [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 500 },
    { name: 'Apr', value: 450 },
    { name: 'May', value: 600 },
    { name: 'Jun', value: 550 },
  ], []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 h-[400px] w-full border border-orange-100 dark:border-gray-800 relative overflow-hidden group transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-300" />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h5 className="font-bold text-gray-900 dark:text-white">Production Velocity</h5>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Live System Metrics</p>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-green-600 uppercase">Active</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB33" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }}
            dy={10}
          />
          <YAxis 
            hide 
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              backgroundColor: '#1F2937',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#F3F4F6'
            }}
            itemStyle={{ color: '#F3F4F6' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#f97316" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: 'Uptime', val: '99.9%' },
          { label: 'Latency', val: '24ms' },
          { label: 'Security', val: 'Verified' }
        ].map((item, i) => (
          <div key={i} className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-[8px] text-gray-400 font-bold uppercase">{item.label}</p>
            <p className="text-[10px] font-bold text-gray-900 dark:text-gray-100">{item.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Products = () => {
  const products = [
    {
      name: "Multilingual eCommerce",
      type: "Online Store",
      desc: "Advanced eCommerce solution supporting Arabic & English with integrated payment gateways and responsive design.",
      features: ["Multi-Language", "Payment Gateways", "Search Friendly", "Inventory Management"]
    },
    {
      name: "IMS - IT Management",
      type: "Enterprise System",
      desc: "Comprehensive IT department management software covering assets, inventory, VOIP, and security.",
      features: ["Assets Management", "Inventory Control", "VOIP Admin", "License Tracking"]
    },
    {
      name: "Almattjer",
      type: "Daily Needs",
      desc: "Electronic store and mobile application for selling all daily necessities with merchant hosting capabilities.",
      features: ["Mobile App", "Vendor Portal", "Order Tracking", "Daily Essentials"]
    },
    {
      name: "Green Syntax Portal",
      type: "Development Tool",
      desc: "Advanced reporting and data management portal for system administrators and developers.",
      features: ["Advanced Reports", "Data Encryption", "User Management", "Task Automation"]
    }
  ];

  return (
    <section id="products" className="py-24 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-orange-600 dark:text-orange-500 font-bold tracking-widest uppercase text-xs mb-2">Our Offerings</p>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl mb-8">Proprietary Products</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed italic border-l-4 border-orange-500 pl-6">
              "Technology should be accessible to everyone, regardless of their location or bandwidth. Our products are built with this core philosophy."
            </p>
            <div className="space-y-6">
              {products.map((product, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors border border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h4>
                    <span className="text-[10px] font-bold bg-white dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">SOFTWARE</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{product.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feat, i) => (
                      <span key={i} className="text-[10px] uppercase font-bold text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="bg-orange-50 dark:bg-orange-950/10 rounded-[40px] p-4 lg:p-12 border border-orange-100 dark:border-gray-800 shadow-inner">
               <AnalyticsChart />
              <div className="absolute top-1/2 -right-12 hidden xl:block">
                <div className="bg-black dark:bg-gray-900 text-white p-6 rounded-2xl shadow-2xl max-w-xs border border-white/10 dark:border-gray-800">
                  <ShieldCheck className="text-orange-500 mb-4" size={32} />
                  <h5 className="font-bold mb-2">Real-time Optimization</h5>
                  <p className="text-xs text-gray-400">Our proprietary products utilize live data analytics to optimize performance across all rural deployments.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Testimonials Component ---
const Testimonials = () => {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      company: "Heritage Crafts",
      role: "CEO",
      feedback: "InomTechs transformed our small local business into a global brand. Their web development team is professional, responsive, and truly understands the needs of rural entrepreneurs.",
      image: "https://i.pravatar.cc/150?u=rajesh"
    },
    {
      name: "Sarah Ahmed",
      company: "EduReach",
      role: "Founder",
      feedback: "The educational software built by InomTechs has revolutionized how we teach students in remote areas. Their commitment to social impact through technology is inspiring.",
      image: "https://i.pravatar.cc/150?u=sarah"
    },
    {
      name: "Amit Singh",
      company: "AgriExport Solutions",
      role: "Director",
      feedback: "Their AR/VR solutions helped our clients visualize agricultural products across continents. It significantly reduced our sales cycle and built immense trust with international buyers.",
      image: "https://i.pravatar.cc/150?u=amit"
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-orange-600 dark:text-orange-500 font-bold tracking-widest uppercase text-xs mb-2">Success Stories</p>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">What Our Clients Say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 relative group"
            >
              <div className="absolute top-6 right-8 text-orange-100 dark:text-orange-900/20 group-hover:text-orange-200 dark:group-hover:text-orange-900/40 transition-colors">
                <Quote size={64} fill="currentColor" />
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={t.image} 
                  alt={t.name} 
                  className="w-14 h-14 rounded-full border-2 border-orange-500"
                />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{t.name}</h4>
                  <p className="text-xs text-orange-600 dark:text-orange-500 font-semibold">{t.role}, {t.company}</p>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed relative z-10">
                "{t.feedback}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  const reasons = [
    {
      title: "Passionate",
      desc: "We are deeply committed to empowering small businesses in rural India, bringing them into the digital age.",
      icon: <Users className="text-orange-600" />
    },
    {
      title: "Professional",
      desc: "Our high-standard service in development ensures your business gets the quality it deserves.",
      icon: <ShieldCheck className="text-orange-600" />
    },
    {
      title: "Support 24/7",
      desc: "Technology doesn't sleep, and neither do we. Our team is always ready to assist you.",
      icon: <Clock className="text-orange-600" />
    }
  ];

  return (
    <section className="py-24 bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-600 rounded-full blur-[100px] opacity-20" />
            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
              Why Teams Choose <span className="text-orange-500">InomTechs.</span>
            </h2>
            <p className="text-gray-400 text-lg mb-12">
              We try to make small business owners expand their businesses online. Our approach is not just about code, it is about community impact.
            </p>
            <div className="grid gap-8">
              {reasons.map((reason, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-600/10 flex items-center justify-center">
                    {reason.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">{reason.title}</h4>
                    <p className="text-gray-400 leading-relaxed">{reason.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2071" className="rounded-2xl h-64 w-full object-cover mt-12" alt="InomTechs creative team collaborating in a modern office environment" />
             <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070" className="rounded-2xl h-64 w-full object-cover" alt="Interactive software workshop for small business owners at InomTechs" />
             <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=2070" className="rounded-2xl h-64 w-full object-cover mt-4" alt="Successful project completion celebrated by InomTechs developers" />
             <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015" className="rounded-2xl h-64 w-full object-cover -mt-8" alt="Data analytics providing insights for business growth and optimization" />
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Request Consultation CTA ---
const RequestConsultation = () => {
  const { t, i18n } = useTranslation();
  return (
    <section className="py-16 bg-orange-600 dark:bg-orange-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col md:flex-row items-center justify-between gap-8 text-white ${i18n.language === 'ar' ? 'md:flex-row-reverse' : ''}`}>
          <div className={`text-center ${i18n.language === 'ar' ? 'md:text-right' : 'md:text-left'}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('ready_to_transform')}</h2>
            <p className="text-lg text-orange-100 max-w-xl">
              {t('get_free_consultation')}
            </p>
          </div>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="whitespace-nowrap bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:bg-orange-50 transition-all flex items-center gap-2"
          >
            {t('request_consultation')} <ArrowRight className={i18n.language === 'ar' ? 'rotate-180' : ''} size={22} />
          </motion.a>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError(i18n.language === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.');
      return;
    }
    setEmailError('');
    // Handle form submission logic would go here
    console.log('Form status: Valid email, proceeding with submission');
  };

  return (
    <section id="contact" className="py-24 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-[40px] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="grid lg:grid-cols-5">
            <div className="lg:col-span-2 bg-black dark:bg-gray-900 p-8 lg:p-12 text-white">
              <h3 className="text-3xl font-bold mb-8">{t('get_in_touch')}</h3>
              <p className="text-gray-400 mb-12">
                {i18n.language === 'ar' ? 'هل لديك مشروع في بالك أو تريد معرفة المزيد عن برامجنا التعليمية؟ نحن هنا للمساعدة.' : "Have a project in mind or want to learn more about our education programs? We're here to help."}
              </p>
              
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Mail size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">{i18n.language === 'ar' ? 'راسلنا' : 'Email Us'}</p>
                    <p className="font-medium">info@inomtechs.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Phone size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">{i18n.language === 'ar' ? 'اتصل بنا' : 'Call Us'}</p>
                    <p className="font-medium">+201556783315</p>
                  </div>
                </div>

              </div>

              <div className="mt-16 pt-8 border-t border-white/10 flex gap-6">
                <a href="#" className="hover:text-orange-500 transition-colors"><Github size={20} /></a>
                <a href="#" className="hover:text-orange-500 transition-colors"><Linkedin size={20} /></a>
                <a href="#" className="hover:text-orange-500 transition-colors"><Twitter size={20} /></a>
              </div>
            </div>
            
            <div className="lg:col-span-3 p-8 lg:p-12">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">{t('full_name')}</label>
                    <input type="text" required className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 dark:text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder={i18n.language === 'ar' ? 'أحمد محمد' : "John Doe"} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">{t('email_address')}</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      className={`w-full bg-white dark:bg-gray-800 border ${emailError ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl px-4 py-3 dark:text-white focus:outline-none focus:border-orange-500 transition-colors`} 
                      placeholder="john@example.com" 
                    />
                    {emailError && <p className="text-red-500 text-xs mt-1 ml-1 font-bold">{emailError}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 ml-1">{t('service_required')}</label>
                  <select className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 dark:text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none">
                    <option>{i18n.language === 'ar' ? 'تطوير المواقع' : 'Web Development'}</option>
                    <option>{i18n.language === 'ar' ? 'تطوير التطبيقات' : 'App Development'}</option>
                    <option>{i18n.language === 'ar' ? 'التعليم / التدريب' : 'Education / Training'}</option>
                    <option>{i18n.language === 'ar' ? 'استفسارات المنتجات' : 'Product Inquiries'}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 ml-1">{t('your_message')}</label>
                  <textarea rows={4} required className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 dark:text-white focus:outline-none focus:border-orange-500 transition-colors resize-none" placeholder={i18n.language === 'ar' ? 'أخبرنا عن مشروعك...' : "Tell us about your project..."}></textarea>
                </div>
                <button type="submit" className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-200 dark:shadow-none">
                   {t('send_message')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { t, i18n } = useTranslation();
  return (
    <footer className="py-12 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col md:flex-row justify-between items-center gap-8 ${i18n.language === 'ar' ? 'md:flex-row-reverse' : ''}`}>
          <div className={i18n.language === 'ar' ? 'text-right' : 'text-left'}>
            <span className="text-2xl font-bold tracking-tighter dark:text-white">
              InomTechs<span className="text-orange-600">.</span>
            </span>
            <p className="text-gray-400 text-xs mt-2">© 2024 InomTechs Private Limited. {t('footer_rights')}</p>
          </div>
          
          <div className={`flex gap-8 text-sm font-medium text-gray-600 dark:text-gray-400 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <a href="#" className="hover:text-orange-600 dark:hover:text-orange-500">{i18n.language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</a>
            <a href="#" className="hover:text-orange-600 dark:hover:text-orange-500">{i18n.language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}</a>
            <a href="#" className="hover:text-orange-600 dark:hover:text-orange-500">{i18n.language === 'ar' ? 'الوظائف' : 'Careers'}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- App ---

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`min-h-screen text-gray-900 dark:text-gray-100 dark:bg-gray-950 selection:bg-orange-200 selection:text-orange-900 font-sans transition-colors duration-300`}>
      <header>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </header>
      <main>
        <Hero />
        <AboutUs />
        <Services />
        <Projects />
        <Products />
        <Testimonials />
        <WhyChooseUs />
        <RequestConsultation />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
