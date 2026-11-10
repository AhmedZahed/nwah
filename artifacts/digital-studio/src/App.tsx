import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowLeft,
  ArrowUpLeft,
  Check,
  Cloud,
  Fingerprint,
  Globe2,
  Menu,
  PanelsTopLeft,
  Search,
  ShoppingBag,
  Wrench,
  X,
} from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

const services = [
  {
    icon: PanelsTopLeft,
    number: '01',
    title: 'مواقع إلكترونية',
    description: 'مواقع سريعة ومدروسة، تقدّم قصتك بوضوح وتحول الزيارة إلى خطوة مفيدة.',
  },
  {
    icon: ShoppingBag,
    number: '02',
    title: 'متاجر إلكترونية',
    description: 'تجربة شراء بسيطة من أول نظرة حتى إتمام الطلب، على كل شاشة.',
  },
  {
    icon: Globe2,
    number: '03',
    title: 'تطبيقات ويب',
    description: 'أدوات رقمية مصممة حول طريقة عملك، لا حول قالب جاهز.',
  },
  {
    icon: Search,
    number: '04',
    title: 'تهيئة لمحركات البحث',
    description: 'أساس تقني ومحتوى منظم يساعدان جمهورك على العثور عليك.',
  },
  {
    icon: Fingerprint,
    number: '05',
    title: 'هوية بصرية',
    description: 'نظام بصري متماسك يجعل حضورك معروفًا قبل أن تُقرأ الكلمات.',
  },
  {
    icon: Cloud,
    number: '06',
    title: 'استضافة موثوقة',
    description: 'بيئة تشغيل مستقرة، مُهيأة لتبقي تجربتك الرقمية متاحة.',
  },
  {
    icon: Wrench,
    number: '07',
    title: 'صيانة ودعم',
    description: 'متابعة وتحديثات مستمرة كي يظل موقعك يعمل كما ينبغي.',
  },
];

const faqs = [
  {
    question: 'كيف تبدأون العمل على مشروع جديد؟',
    answer:
      'نبدأ بفهم أهداف المشروع والجمهور الذي يخاطبه، ثم نحدد نطاق العمل ونرسم تجربة واضحة قبل التصميم والتطوير. كل خطوة لها سبب، وكل قرار مرتبط بما يحتاجه عملك.',
  },
  {
    question: 'هل يمكن تطوير الموقع أو المتجر على مراحل؟',
    answer:
      'نعم. نرتب الأولويات معك ونبني أساسًا قابلًا للتوسع، بحيث يمكن إطلاق ما تحتاجه الآن وإضافة المزايا التالية عندما يحين وقتها.',
  },
  {
    question: 'هل تقدمون خدمات ما بعد الإطلاق؟',
    answer:
      'نعم، تشمل خدماتنا الاستضافة والصيانة والتحديثات. نتفق على نطاق المتابعة المناسب للمشروع حتى يبقى حضورك الرقمي مستقرًا ومحدثًا.',
  },
  {
    question: 'هل أحتاج إلى معرفة تقنية مسبقة؟',
    answer:
      'لا. نوضح الخيارات بلغة بسيطة ونشاركك القرارات المهمة، من هيكل الموقع إلى طريقة إدارته، لتكون الصورة واضحة طوال الطريق.',
  },
];

function usePageMotion() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealNodes = document.querySelectorAll<HTMLElement>('.reveal');
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealNodes.forEach((node) => node.classList.add('visible'));
      return;
    } else {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 },
      );
      revealNodes.forEach((node) => revealObserver.observe(node));
      return () => revealObserver.disconnect();
    }
  }, []);
}

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = document.getElementById(`count-${target}`);
    if (!node) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      setValue(target);
      return;
    }
    let frame = 0;
    let started = false;
    let frameId = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      const animate = () => {
        frame += 1;
        const progress = Math.min(frame / 45, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (progress < 1) frameId = window.requestAnimationFrame(animate);
      };
      frameId = window.requestAnimationFrame(animate);
      observer.disconnect();
    }, { threshold: 0.5 });
    observer.observe(node);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, [target]);

  return (
    <span id={`count-${target}`} className="proof-number" aria-label={`${target}${suffix}`}>
      {new Intl.NumberFormat('ar').format(value)}{suffix}
    </span>
  );
}

function Brand() {
  return (
    <a className="brand" href="#home" aria-label="نواة الرقمية — الصفحة الرئيسية" data-testid="link-brand-home">
      <span className="brand-mark" aria-hidden="true">ن</span>
      <span className="brand-name">نواة الرقمية<small>NAWA DIGITAL</small></span>
    </a>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  usePageMotion();

  const closeMenu = () => setMenuOpen(false);
  const links = [
    { href: '#services', label: 'خدماتنا' },
    { href: '#approach', label: 'كيف نعمل' },
    { href: '#about', label: 'عن نواة' },
    { href: '#faq', label: 'أسئلة شائعة' },
  ];

  return (
    <main className="site-shell" dir="rtl">
      <section className="hero" id="home" aria-labelledby="hero-title">
        <header className="topbar">
          <div className="container-wide nav-wrap">
            <Brand />
            <nav id="mobile-navigation" className={`nav-links${menuOpen ? ' open' : ''}`} aria-label="التنقل الرئيسي">
              {links.map((link) => (
                <a key={link.href} href={link.href} onClick={closeMenu} data-testid={`link-nav-${link.href.slice(1)}`}>
                  {link.label}
                </a>
              ))}
            </nav>
            <a className="nav-cta" href="#services" data-testid="link-nav-services-cta">
              اكتشف خدماتنا <ArrowUpLeft size={15} aria-hidden="true" />
            </a>
            <button
              className="menu-toggle"
              type="button"
              aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
              data-testid="button-mobile-menu"
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </header>

        <div className="container-wide hero-content">
          <div className="hero-copy">
            <span className="eyebrow">استوديو رقمي للأعمال الطموحة</span>
            <h1 id="hero-title">نحوّل فكرتك إلى <em>تجربة رقمية</em> تعيش.</h1>
            <p>
              من أول انطباع إلى آخر نقرة — نبني مواقع ومتاجر وتطبيقات ويب تساعد أعمالك على التقدّم بثقة.
            </p>
            <div className="hero-actions">
              <a className="button-primary" href="#services" data-testid="link-hero-services">
                اكتشف ما يمكننا بناؤه <ArrowLeft size={16} aria-hidden="true" />
              </a>
              <a className="button-outline" href="#approach" data-testid="link-hero-approach">
                تعرّف على طريقتنا
              </a>
            </div>
            <div className="hero-note"><span aria-hidden="true" /> تفكير استراتيجي، تصميم واضح، وتطوير جاهز للنمو</div>
          </div>

          <div className="hero-art" aria-label="تصور لوحة أداء رقمية" role="img">
            <div className="orbit" aria-hidden="true"><i className="orbit-dot" /></div>
            <div className="float-chip top">أداء أسرع<small>بنية رقمية محسوبة</small></div>
            <div className="dashboard" aria-hidden="true">
              <div className="dash-top">
                <div className="dash-brand"><b>ن</b> مساحة عملك</div>
                <div className="dash-dots"><i /><i /><i /></div>
              </div>
              <div className="dash-main">
                <div>
                  <p className="dash-welcome">صباحٌ مليء بالفرص</p>
                  <p className="dash-sub">نظرة على حضورك الرقمي</p>
                  <div><span className="dash-value">تجربة</span><span className="dash-change">↗</span></div>
                  <div className="chart">
                    <svg viewBox="0 0 280 90" preserveAspectRatio="none" aria-hidden="true">
                      <defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#167c6c" stopOpacity=".2" /><stop offset="1" stopColor="#167c6c" stopOpacity="0" /></linearGradient></defs>
                      <path className="chart-fill" d="M0 76 C25 68 32 71 52 60 S88 65 108 48 S145 54 165 34 S202 47 220 26 S255 31 280 10 L280 90 L0 90Z" />
                      <path d="M0 76 C25 68 32 71 52 60 S88 65 108 48 S145 54 165 34 S202 47 220 26 S255 31 280 10" />
                    </svg>
                  </div>
                </div>
                <div className="dash-side">
                  <span className="side-label">مكوّنات التجربة</span>
                  <span className="side-num">متكاملة</span>
                  <div className="mini-bars"><i style={{ height: '35%' }} /><i style={{ height: '58%' }} /><i style={{ height: '47%' }} /><i style={{ height: '76%' }} /><i style={{ height: '62%' }} /><i style={{ height: '94%' }} /></div>
                  <span className="side-label">تجربة متوازنة</span>
                </div>
              </div>
              <div className="dash-foot"><span>تصميم يضع المستخدم أولًا</span><strong>ناوا / ٠١</strong></div>
            </div>
            <div className="float-chip bottom">كل شيء في مكانه<small>تجربة واحدة، متكاملة</small></div>
          </div>
        </div>
        <a className="hero-scroll" href="#proof" aria-label="انتقل إلى الأرقام">اكتشف نواة</a>
      </section>

      <section className="proof-strip" id="proof" aria-label="أرقام نواة الرقمية">
        <div className="container-wide proof-inner">
          <span className="proof-label">خبرة تُبنى عليها الخطوة التالية</span>
          <div className="proof-stats">
            <div className="proof-stat">
              <CountUp target={140} suffix="+" />
              <p>مشروعًا رقميًا منجزًا</p>
            </div>
            <div className="proof-stat">
              <CountUp target={98} suffix="٪" />
              <p>من العملاء يثقون بنا</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section services" id="services" aria-labelledby="services-title">
        <div className="container-wide">
          <div className="section-head reveal">
            <div>
              <span className="section-kicker">01 — ما نبنيه</span>
              <h2 className="section-title" id="services-title">كل ما يحتاجه حضورك<br />الرقمي، في نواة واحدة.</h2>
            </div>
            <p className="section-lead">نربط الاستراتيجية بالتصميم والتقنية، لتجد كل مرحلة من رحلتك الرقمية يدًا خبيرة.</p>
          </div>
          <div className="service-grid">
            {services.map(({ icon: Icon, number, title, description }, index) => (
              <article className={`service-card reveal${index % 3 ? ` reveal-delay-${index % 3}` : ''}`} key={number} data-testid={`card-service-${number}`}>
                <span className="service-index">{number}</span>
                <span className="service-icon"><Icon size={21} strokeWidth={1.7} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{description}</p>
                <ArrowLeft className="service-arrow" size={17} aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section manifesto" id="about" aria-labelledby="manifesto-title">
        <div className="container-wide manifesto-inner">
          <div className="manifesto-aside reveal">
            <span className="section-kicker">02 — فلسفتنا</span>
            <p id="manifesto-title">التقنية ليست واجهة جميلة فحسب. إنها طريقة أذكى ليتواصل عملك مع الناس.</p>
          </div>
          <blockquote className="manifesto-quote reveal reveal-delay-1">
            نبدأ من <span>جوهر عملك</span>، ثم نصنع تجربة تجعل قيمته واضحة — من أول نظرة، وكل مرة بعدها.
          </blockquote>
        </div>
      </section>

      <section className="section method" id="approach" aria-labelledby="method-title">
        <div className="container-wide">
          <div className="section-head reveal">
            <div>
              <span className="section-kicker">03 — كيف نعمل</span>
              <h2 className="section-title" id="method-title">خطوات واضحة.<br />نتيجة تعرف طريقها.</h2>
            </div>
            <p className="section-lead">عملية تعاونية تبقي الرؤية واضحة والعمل متقدمًا، من أول سؤال إلى ما بعد الإطلاق.</p>
          </div>
          <div className="steps">
            {[
              ['١', 'نستمع', 'نفهم أهدافك، جمهورك، والتحدي الذي تريد أن تحله.'],
              ['٢', 'نخطط', 'نرسم الهيكل والتجربة ونحدد ما يصنع الفرق فعلًا.'],
              ['٣', 'نبني', 'نصمم ونطور باهتمام بالتفاصيل والأداء وسهولة الاستخدام.'],
              ['٤', 'نطلق ونواصل', 'نختبر، نطلق، ونبقى إلى جانبك في التطوير والصيانة.'],
            ].map(([number, title, description], index) => (
              <article className={`step reveal${index ? ` reveal-delay-${Math.min(index, 3)}` : ''}`} key={number}>
                <span className="step-num">{number} / ٠{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <div className="capabilities reveal" aria-label="مبادئنا في التنفيذ">
            <span className="capability">نهج يضع المستخدم أولًا</span>
            <span className="capability">أداء سريع ومتجاوب</span>
            <span className="capability">بنية قابلة للتوسع</span>
            <span className="capability">عناية بالتفاصيل</span>
          </div>
        </div>
      </section>

      <section className="approach" aria-labelledby="thought-title">
        <div className="container-wide approach-grid">
          <div className="approach-visual reveal" role="img" aria-label="تكوين بصري يعبر عن بناء التجارب الرقمية">
            <span className="visual-label">BUILT AROUND YOUR NEXT MOVE</span>
            <p className="visual-note">الأساس القوي يترك مساحة <span>للنمو.</span></p>
          </div>
          <div className="approach-copy reveal reveal-delay-1">
            <span className="section-kicker">04 — قيمة تدوم</span>
            <h2 className="section-title" id="thought-title">ليس مجرد إطلاق.<br />بل بداية مدروسة.</h2>
            <p>نوازن بين ما تحتاجه اليوم وما قد تحتاجه غدًا، لنصنع حضورًا رقميًا يعمل لعملك الآن ويستعد لما بعده.</p>
            <ul className="principles">
              <li><i><Check size={14} aria-hidden="true" /></i><span>وضوح قبل التنفيذ<small>قرارات تصميم وتقنية مبنية على هدف واضح.</small></span></li>
              <li><i><Check size={14} aria-hidden="true" /></i><span>تجربة متكاملة<small>من الهوية والمحتوى إلى الأداء والاكتشاف.</small></span></li>
              <li><i><Check size={14} aria-hidden="true" /></i><span>شراكة تستمر<small>دعم وصيانة يساعدان مشروعك على التطور.</small></span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section faq" id="faq" aria-labelledby="faq-title">
        <div className="container-wide faq-grid">
          <div className="faq-intro reveal">
            <span className="section-kicker">05 — أسئلة شائعة</span>
            <h2 className="section-title" id="faq-title">قبل أن تبدأ،<br />لديك أسئلة.</h2>
            <p>إجابات موجزة تساعدك على تكوين صورة أوضح عن رحلة العمل معنا.</p>
          </div>
          <div className="faq-list reveal reveal-delay-1">
            {faqs.map((faq, index) => (
              <div className="faq-item" key={faq.question}>
                <button
                  className="faq-question"
                  type="button"
                  aria-expanded={openFaq === index}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => setOpenFaq((current) => current === index ? null : index)}
                  data-testid={`button-faq-${index + 1}`}
                >
                  <span>{faq.question}</span><span className="faq-plus" aria-hidden="true">+</span>
                </button>
                <div id={`faq-answer-${index}`} className={`faq-answer${openFaq === index ? ' open' : ''}`} role="region" aria-label={faq.question}>
                  <div><p>{faq.answer}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="closing" id="start" aria-labelledby="closing-title">
        <div className="container-wide">
          <div className="closing-panel reveal">
            <div className="closing-content">
              <div>
                <span className="section-kicker">خطوتك التالية تبدأ هنا</span>
                <h2 id="closing-title">لديك فكرة؟<br />لنجعلها تجربة رقمية تستحق.</h2>
                <p>استكشف الخدمات، وتخيّل ما يمكن أن نبنيه معًا.</p>
              </div>
              <a className="button-primary" href="#services" data-testid="link-closing-services">
                ابدأ من خدماتنا <ArrowLeft size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container-wide">
          <div className="footer-inner">
            <div><Brand /><p className="footer-note">نبني تجارب رقمية تنمو مع أعمالك.</p></div>
            <nav className="footer-nav" aria-label="روابط الصفحة">
              {links.map((link) => <a href={link.href} key={link.href} data-testid={`link-footer-${link.href.slice(1)}`}>{link.label}</a>)}
            </nav>
          </div>
          <p className="copyright">© NAWA DIGITAL</p>
        </div>
      </footer>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
