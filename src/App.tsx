import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  Code2,
  Globe2,
  Layers3,
  Mail,
  MapPin,
  Menu,
  Sparkles,
  Target,
  Zap,
  ShieldCheck,
  Workflow,
  X,
} from 'lucide-react';

type Lang = 'en' | 'ar';

type Localized = { en: string; ar: string };

type Service = {
  id: string;
  number: string;
  title: Localized;
  description: Localized;
  points: { en: string[]; ar: string[] };
  icon: React.ReactNode;
};

type Project = {
  title: string;
  category: Localized;
  description: Localized;
  index: string;
  liveUrl: string;
  screenshotUrl: string;
};

const copy = {
  en: {
    nav: {
      home: 'Home',
      services: 'What We Do',
      work: 'Our Work',
      ai: 'AI & Data',
      about: 'Who We Are',
      contact: 'Contact',
      cta: 'Start a Project',
    },
    heroEyebrow: 'Technology & Digital Solutions',
    heroTitleA: 'Technology that turns',
    heroTitleB: 'ideas into impact.',
    heroText:
      'InomTechs builds scalable software, AI-powered solutions, data-driven systems, and digital experiences that help businesses move forward.',
    heroPrimary: 'Start a Project',
    heroSecondary: 'Explore Our Work',
    capability: 'Our capabilities',
    capabilityTitle: 'Built around the way modern businesses grow.',
    capabilityText:
      'From software delivery to AI, analytics, and digital growth, we combine technology and strategy to solve real business challenges.',
    impactLabel: 'Built for impact',
    impactItems: ['Scalable by design', 'AI-driven innovation', 'Long-term partnership'],
    workLabel: 'Selected work',
    workTitle: 'Digital products designed around real needs.',
    workText:
      'Two live projects from the InomTechs portfolio — available to explore online now.',
    aiLabel: 'AI & Data',
    aiTitle: 'From raw data to useful intelligence.',
    aiText:
      'We help teams explore AI opportunities, rapidly prototype ideas, automate workflows, and turn data into practical business insight.',
    aiCard1Title: 'AI Strategy & Rapid Prototyping',
    aiCard1Text:
      'AI strategy, capability building, LLM prototyping, automation development, and MVP validation for technical teams.',
    aiCard2Title: 'Data Analysis & Decision Support',
    aiCard2Text:
      'Data collection, cleaning, analysis, dashboards, reporting, and actionable insight for business decisions.',
    aboutLabel: 'Who we are',
    aboutTitle: 'A technology partner, not just a service provider.',
    aboutText1:
      'At InomTechs, we believe in collaboration over service. We work closely with clients to understand their goals, challenges, and vision before shaping the right digital solution.',
    aboutText2:
      'Our work spans software development, AI customization, data analysis, and digital marketing — with one goal: creating useful, scalable solutions that support growth and efficiency.',
    mission: 'Mission',
    missionText:
      'Deliver high-quality, customized technology solutions aligned with business goals, while using AI, analytics, automation, and continuous innovation to keep operations future-ready.',
    vision: 'Vision',
    visionText:
      'To innovate and transform the digital landscape by empowering businesses through cutting-edge technology, creativity, and practical solutions.',
    marketingLabel: 'Digital growth',
    marketingTitle: 'Strategy, content, execution, and optimization.',
    marketingText:
      'Our digital marketing work covers market research, positioning, branding, channel strategy, content planning, campaign execution, tracking, and continuous optimization.',
    contactEyebrow: 'Let’s build what’s next',
    contactTitle: 'Have an idea, challenge, or product in mind?',
    contactText: 'Tell us what you want to build and let’s explore the right path forward.',
    email: 'info@inom-techs.com',
    location: 'Alexandria, Egypt',
    footerText: 'Technology, AI, data, and digital growth — built around your business.',
    rights: 'All rights reserved.',
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      services: 'خدماتنا',
      work: 'أعمالنا',
      ai: 'الذكاء والبيانات',
      about: 'من نحن',
      contact: 'تواصل معنا',
      cta: 'ابدأ مشروعك',
    },
    heroEyebrow: 'حلول تقنية ورقمية متكاملة',
    heroTitleA: 'تقنية تحوّل',
    heroTitleB: 'الأفكار إلى أثر حقيقي.',
    heroText:
      'تطوّر InomTechs حلولاً برمجية قابلة للتوسع، وتطبيقات مدعومة بالذكاء الاصطناعي، وأنظمة قائمة على البيانات، وتجارب رقمية تساعد الشركات على النمو بثقة.',
    heroPrimary: 'ابدأ مشروعك',
    heroSecondary: 'استكشف أعمالنا',
    capability: 'قدراتنا',
    capabilityTitle: 'حلول مبنية حول احتياجات الأعمال الحديثة.',
    capabilityText:
      'من تطوير البرمجيات إلى الذكاء الاصطناعي وتحليل البيانات والنمو الرقمي، نجمع بين التقنية والاستراتيجية لحل تحديات أعمال حقيقية.',
    impactLabel: 'مصمم لصناعة أثر',
    impactItems: ['قابل للتوسع من البداية', 'ابتكار مدفوع بالذكاء الاصطناعي', 'شراكة تقنية طويلة المدى'],
    workLabel: 'أعمال مختارة',
    workTitle: 'منتجات رقمية مصممة حول احتياجات حقيقية.',
    workText:
      'مشروعان مباشران من أعمال InomTechs يمكنك استكشافهما الآن عبر الإنترنت.',
    aiLabel: 'الذكاء الاصطناعي والبيانات',
    aiTitle: 'من البيانات الخام إلى قرارات أكثر ذكاءً.',
    aiText:
      'نساعد الفرق على اكتشاف فرص الذكاء الاصطناعي، وبناء نماذج أولية بسرعة، وأتمتة العمليات، وتحويل البيانات إلى رؤى عملية قابلة للتنفيذ.',
    aiCard1Title: 'استراتيجية الذكاء الاصطناعي والنماذج الأولية',
    aiCard1Text:
      'استراتيجية للذكاء الاصطناعي، بناء القدرات، نماذج LLM الأولية، الأتمتة، والتحقق السريع من الأفكار والـ MVP.',
    aiCard2Title: 'تحليل البيانات ودعم القرار',
    aiCard2Text:
      'جمع وتنظيف وتحليل البيانات، وبناء لوحات المعلومات والتقارير، واستخراج رؤى تساعد الإدارة على اتخاذ القرار.',
    aboutLabel: 'من نحن',
    aboutTitle: 'شريك تقني، وليس مجرد مزود خدمة.',
    aboutText1:
      'في InomTechs نؤمن بالتعاون قبل الخدمة. نعمل مع عملائنا لفهم الأهداف والتحديات والرؤية قبل تصميم الحل الرقمي المناسب.',
    aboutText2:
      'تشمل أعمالنا تطوير البرمجيات، وتخصيص حلول الذكاء الاصطناعي، وتحليل البيانات، والتسويق الرقمي — بهدف واحد: بناء حلول عملية وقابلة للتوسع تدعم النمو والكفاءة.',
    mission: 'رسالتنا',
    missionText:
      'تقديم حلول تقنية عالية الجودة ومخصصة لأهداف الأعمال، مع الاستفادة من الذكاء الاصطناعي والتحليلات والأتمتة والابتكار المستمر لبناء عمليات جاهزة للمستقبل.',
    vision: 'رؤيتنا',
    visionText:
      'الابتكار وتحويل المشهد الرقمي عبر تمكين الشركات بالتقنيات الحديثة والإبداع والحلول العملية.',
    marketingLabel: 'النمو الرقمي',
    marketingTitle: 'استراتيجية، محتوى، تنفيذ، وتحسين مستمر.',
    marketingText:
      'تشمل خدماتنا في التسويق الرقمي أبحاث السوق وتحديد التموضع وبناء الهوية واختيار القنوات وتخطيط المحتوى وتنفيذ الحملات وقياس النتائج وتحسين الأداء.',
    contactEyebrow: 'لنصنع الخطوة القادمة',
    contactTitle: 'لديك فكرة أو تحدٍ أو منتج تريد تطويره؟',
    contactText: 'شاركنا ما تريد بناءه، ولنبحث معاً عن أفضل طريق للتنفيذ.',
    email: 'info@inom-techs.com',
    location: 'الإسكندرية، مصر',
    footerText: 'تقنية وذكاء اصطناعي وبيانات ونمو رقمي — مبنية حول احتياجات أعمالك.',
    rights: 'جميع الحقوق محفوظة.',
  },
} as const;

const services: Service[] = [
  {
    id: 'software',
    number: '01',
    title: { en: 'Software Development', ar: 'تطوير البرمجيات' },
    description: {
      en: 'End-to-end software development that turns ideas into scalable, user-focused digital products.',
      ar: 'تطوير برمجي متكامل يحوّل الأفكار إلى منتجات رقمية قابلة للتوسع ومتمحورة حول المستخدم.',
    },
    points: {
      en: ['Web & app development', 'Testing & delivery', 'Product development'],
      ar: ['تطوير الويب والتطبيقات', 'الاختبار والتسليم', 'تطوير المنتجات'],
    },
    icon: <Code2 size={28} />,
  },
  {
    id: 'ai',
    number: '02',
    title: { en: 'AI Customization', ar: 'حلول الذكاء الاصطناعي' },
    description: {
      en: 'Tailored AI solutions designed to improve efficiency, accelerate experimentation, and support innovation.',
      ar: 'حلول ذكاء اصطناعي مخصصة لتحسين الكفاءة وتسريع التجربة ودعم الابتكار.',
    },
    points: {
      en: ['AI strategy', 'Rapid prototyping', 'Automation development'],
      ar: ['استراتيجية الذكاء الاصطناعي', 'النماذج الأولية السريعة', 'تطوير الأتمتة'],
    },
    icon: <BrainCircuit size={28} />,
  },
  {
    id: 'data',
    number: '03',
    title: { en: 'Data Analysis', ar: 'تحليل البيانات' },
    description: {
      en: 'Data preparation, analysis, visualization, and reporting that turn complex information into useful insight.',
      ar: 'إعداد وتحليل وتصور البيانات والتقارير لتحويل المعلومات المعقدة إلى رؤى مفيدة.',
    },
    points: {
      en: ['Data preparation', 'Business insights', 'Dashboards & reporting'],
      ar: ['إعداد البيانات', 'رؤى الأعمال', 'لوحات المعلومات والتقارير'],
    },
    icon: <BarChart3 size={28} />,
  },
  {
    id: 'marketing',
    number: '04',
    title: { en: 'Digital Marketing', ar: 'التسويق الرقمي' },
    description: {
      en: 'Full-funnel digital marketing covering research, brand positioning, content, channels, campaigns, and optimization.',
      ar: 'تسويق رقمي متكامل يبدأ من البحث والتموضع ويشمل المحتوى والقنوات والحملات والتحسين المستمر.',
    },
    points: {
      en: ['Brand & positioning', 'Content & campaigns', 'Performance optimization'],
      ar: ['الهوية والتموضع', 'المحتوى والحملات', 'تحسين الأداء'],
    },
    icon: <Target size={28} />,
  },
];

const projects: Project[] = [
  {
    title: 'Inovents',
    index: '01',
    category: { en: 'Smart Event Engagement Platform', ar: 'منظومة ذكية للفعاليات' },
    description: {
      en: 'A live smart-events platform from the InomTechs portfolio, built around digital event experiences and audience engagement.',
      ar: 'منصة فعاليات ذكية مباشرة ضمن أعمال InomTechs، تركز على التجارب الرقمية للفعاليات وتفاعل الجمهور.',
    },
    liveUrl: 'https://inovents.net',
    screenshotUrl: '/projects/inovents.png',
  },
  {
    title: 'Upseeds',
    index: '02',
    category: { en: 'AI-Powered Climate Risk Platform', ar: 'منصة مخاطر مناخية مدعومة بالذكاء الاصطناعي' },
    description: {
      en: 'A live AI-powered ClimateTech platform focused on real-time climate-risk scoring, startup growth, and digital ecosystem tools.',
      ar: 'منصة ClimateTech مباشرة مدعومة بالذكاء الاصطناعي، تركّز على تقييم مخاطر المناخ في الوقت الفعلي وأدوات نمو الشركات الناشئة والمنظومة الرقمية.',
    },
    liveUrl: 'https://upseeds.inovents.net/',
    screenshotUrl: '/projects/upseeds.png',
  },
];

function App() {
  const { i18n } = useTranslation();
  const lang = (i18n.language?.startsWith('ar') ? 'ar' : 'en') as Lang;
  const t = copy[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const navItems = useMemo(
    () => [
      [t.nav.services, '#services'],
      [t.nav.work, '#work'],
      [t.nav.ai, '#ai-data'],
      [t.nav.about, '#about'],
      [t.nav.contact, '#contact'],
    ],
    [t],
  );

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const switchLanguage = () => {
    const next = lang === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="site-shell">
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <header className={`topbar ${scrolled ? 'topbar--scrolled' : ''}`}>
        <div className="nav-wrap">
          <a href="#top" className="brand" aria-label="InomTechs home">
            <img src="/assets/inomtechs-logo.jpg" alt="InomTechs" width="200" height="200" />
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map(([label, href]) => (
              <a key={href} href={href}>{label}</a>
            ))}
          </nav>

          <div className="nav-actions">
            <button type="button" className="lang-btn" onClick={switchLanguage} aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}>{lang === 'en' ? 'AR' : 'EN'}</button>
            <a className="nav-cta" href="#contact">{t.nav.cta}<ArrowUpRight size={17} /></a>
            <button type="button" className="menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} aria-controls="mobile-navigation"><Menu /></button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div id="mobile-navigation" className="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mobile-menu-panel">
              <div className="mobile-menu-head">
                <img src="/assets/inomtechs-logo.jpg" alt="InomTechs" width="200" height="200" />
                <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
              </div>
              <div className="mobile-links">
                {navItems.map(([label, href], idx) => (
                  <a key={href} href={href} onClick={() => setMenuOpen(false)}><span>0{idx + 1}</span>{label}</a>
                ))}
              </div>
              <a className="mobile-cta" href="#contact" onClick={() => setMenuOpen(false)}>{t.nav.cta}<ArrowRight /></a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="top">
        <section className="hero section-pad">
          <div className="hero-orb hero-orb--one" />
          <div className="hero-orb hero-orb--two" />
          <div className="hero-grid max-wrap">
            <motion.div className="hero-copy" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75 }}>
              <p className="eyebrow"><Sparkles size={16} />{t.heroEyebrow}</p>
              <h1>{t.heroTitleA}<span>{t.heroTitleB}</span></h1>
              <p className="hero-description">{t.heroText}</p>
              <div className="hero-actions">
                <a href="#contact" className="primary-btn">{t.heroPrimary}<ArrowUpRight /></a>
                <a href="#work" className="text-link">{t.heroSecondary}<ArrowRight /></a>
              </div>
            </motion.div>

            <motion.div className="hero-visual" initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, delay: .08 }}>
              <motion.div className="brand-orbit" animate={{ rotate: 360 }} transition={{ duration: 34, repeat: Infinity, ease: 'linear' }} aria-hidden="true">
                <span className="orbit-node orbit-node--1" />
                <span className="orbit-node orbit-node--2" />
                <span className="orbit-node orbit-node--3" />
              </motion.div>
              <div className="logo-mark-bg" aria-hidden="true"><span /><span /><span /><span /></div>
              <motion.div className="hero-card hero-card--main" animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
                <div className="hero-card-top"><span>INOM / 2026</span><Globe2 /></div>
                <div className="hero-card-center">
                  <img src="/assets/inomtechs-logo.jpg" alt="InomTechs logo" width="200" height="200" />
                </div>
                <div className="hero-card-bottom"><span>SOFTWARE</span><span>AI</span><span>DATA</span><span>DIGITAL</span></div>
              </motion.div>
              <div className="mini-card mini-card--one"><BrainCircuit /><span>AI Solutions</span></div>
              <div className="mini-card mini-card--two"><Layers3 /><span>Digital Products</span></div>
            </motion.div>
          </div>
        </section>

        <section className="impact-strip" aria-label={t.impactLabel}>
          <div className="max-wrap impact-inner">
            <p>{t.impactLabel}</p>
            <div className="impact-items">
              <span><Zap />{t.impactItems[0]}</span>
              <span><Workflow />{t.impactItems[1]}</span>
              <span><ShieldCheck />{t.impactItems[2]}</span>
            </div>
          </div>
        </section>

        <section className="services section-pad" id="services">
          <div className="max-wrap">
            <div className="section-heading split-heading">
              <div><p className="eyebrow">{t.capability}</p><h2>{t.capabilityTitle}</h2></div>
              <p>{t.capabilityText}</p>
            </div>

            <div className="services-layout">
              <div className="service-list">
                {services.map((service, index) => (
                  <button key={service.id} className={`service-row ${activeService === index ? 'active' : ''}`} onMouseEnter={() => setActiveService(index)} onFocus={() => setActiveService(index)} onClick={() => setActiveService(index)}>
                    <span className="service-number">{service.number}</span>
                    <span className="service-title">{service.title[lang]}</span>
                    <span className="service-arrow"><ArrowUpRight /></span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={activeService} className="service-detail" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: .28 }}>
                  <div className="service-icon">{services[activeService].icon}</div>
                  <h3>{services[activeService].title[lang]}</h3>
                  <p>{services[activeService].description[lang]}</p>
                  <ul>
                    {services[activeService].points[lang].map(point => <li key={point}><span />{point}</li>)}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="work section-pad" id="work">
          <div className="max-wrap">
            <div className="section-heading work-heading">
              <p className="eyebrow">{t.workLabel}</p>
              <h2>{t.workTitle}</h2>
              <p>{t.workText}</p>
            </div>
            <div className="project-stack">
              {projects.map((project, index) => (
                <motion.a
                  className="project-card project-card--live"
                  key={project.title}
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: .2 }}
                  transition={{ duration: .55, delay: index * .04 }}
                >
                  <div className="project-index">{project.index}</div>
                  <div className="project-main">
                    <div className="project-meta"><p>{project.category[lang]}</p><span className="live-pill"><i />LIVE</span></div>
                    <h3>{project.title}</h3>
                    <span>{project.description[lang]}</span>
                    <strong className="project-link-label">{lang === 'ar' ? 'عرض المشروع' : 'View live project'}<ArrowUpRight size={16} /></strong>
                  </div>
                  <div className="project-preview">
                    <div className="browser-bar"><span/><span/><span/><small>{project.liveUrl.replace('https://', '').replace(/\/$/, '')}</small></div>
                    <img src={project.screenshotUrl} alt={`${project.title} live website preview`} loading="lazy" decoding="async" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
                    <div className="project-preview-fallback"><span>{project.title.slice(0, 2).toUpperCase()}</span><small>{project.category[lang]}</small></div>
                  </div>
                  <ArrowUpRight className="project-arrow" />
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        <section className="ai-data section-pad" id="ai-data">
          <div className="ai-logo-motif" aria-hidden="true"><span/><span/><span/><span/></div>
          <div className="max-wrap ai-grid">
            <div className="ai-copy">
              <p className="eyebrow eyebrow--light">{t.aiLabel}</p>
              <h2>{t.aiTitle}</h2>
              <p>{t.aiText}</p>
            </div>
            <div className="ai-cards">
              <article className="ai-card">
                <div className="ai-card-number">01</div>
                <BrainCircuit />
                <h3>{t.aiCard1Title}</h3>
                <p>{t.aiCard1Text}</p>
              </article>
              <article className="ai-card">
                <div className="ai-card-number">02</div>
                <BarChart3 />
                <h3>{t.aiCard2Title}</h3>
                <p>{t.aiCard2Text}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="about section-pad" id="about">
          <div className="max-wrap about-grid">
            <div className="about-sticky">
              <p className="eyebrow">{t.aboutLabel}</p>
              <h2>{t.aboutTitle}</h2>
            </div>
            <div className="about-copy">
              <p className="lead">{t.aboutText1}</p>
              <p>{t.aboutText2}</p>
              <div className="mission-vision">
                <article><span>01</span><h3>{t.mission}</h3><p>{t.missionText}</p></article>
                <article><span>02</span><h3>{t.vision}</h3><p>{t.visionText}</p></article>
              </div>
            </div>
          </div>
        </section>

        <section className="marketing-band section-pad">
          <div className="max-wrap marketing-grid">
            <div className="marketing-icon"><Target /></div>
            <div><p className="eyebrow">{t.marketingLabel}</p><h2>{t.marketingTitle}</h2></div>
            <p>{t.marketingText}</p>
          </div>
        </section>

        <section className="contact section-pad" id="contact">
          <div className="max-wrap contact-box">
            <div className="contact-mark" aria-hidden="true"><span/><span/><span/><span/></div>
            <div>
              <p className="eyebrow eyebrow--light">{t.contactEyebrow}</p>
              <h2>{t.contactTitle}</h2>
              <p>{t.contactText}</p>
            </div>
            <div className="contact-actions">
              <a href="mailto:info@inom-techs.com" className="contact-pill"><Mail /><span><small>Email</small>{t.email}</span><ArrowUpRight /></a>
              <div className="contact-pill"><MapPin /><span><small>Location</small>{t.location}</span></div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="max-wrap footer-grid">
          <div className="footer-brand"><img src="/assets/inomtechs-logo.jpg" alt="InomTechs" width="200" height="200" /><p>{t.footerText}</p></div>
          <div className="footer-links">
            {navItems.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          </div>
          <div className="footer-bottom"><span>© {new Date().getFullYear()} InomTechs. {t.rights}</span><a href="mailto:info@inom-techs.com">info@inom-techs.com</a></div>
        </div>
      </footer>
    </div>
  );
}

export default App;
