import React, { useRef, useState, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { motion } from 'framer-motion';
import {
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useSEO } from '../hooks/useSEO';

/* ================================================================== */
/*  COMPANY DATA                                                       */
/* ================================================================== */

const services = [
  { title: 'Executive Protection', desc: 'We have designed our executive protection group with finest of security personnel. They are trained to remain vigilant, proactive, and always ready to protect any individual exposed to threat. Specially trained to handle all kinds of threat perceptions and intelligence gathering for VVIPs, diplomats, celebrities, and corporate executives.' },
  { title: 'Manned Guard Service', desc: 'Our manned guarding service is the biggest division of the company. We provide male and female security guards at industrial premises, corporate buildings, offices, banks, NGOs, construction sites, homes, apartments, and events. Guards available in 8-hour shifts as per client requirements.' },
  { title: 'Risk Consulting', desc: 'We support clients to evaluate and understand risks, acting to mitigate these risks wherever possible. We offer trusted security advice, risk mitigation strategies, proactive intelligence gathering, crisis management, and response capability.' },
  { title: 'Escort Service', desc: 'Countrywide safeguarding of valuables in transit. Our central monitoring cell continuously tracks consignment locations with GPS and geo-fencing technology. Currently escorting more than 5,500 countrywide consignments a year.' },
  { title: 'Event Security', desc: 'Special security arrangements for corporate AGMs, concerts, social and private gatherings, and sports events. We set up temporary CCTV systems, scanners, and access control systems depending on crowd and nature of event.' },
  { title: 'Integration (PSIM)', desc: 'We are the platinum distributor-partner of ISM UK in Physical Security Information Management. We offer state-of-the-art and scalable integration solutions, creating additional security and efficiency benefits for customers.' },
  { title: 'Digital Surveillance', desc: 'Wide range of digital security and surveillance equipment and maintenance services. Video surveillance, access control, fire detection, perimeter intrusion detection, scanning systems, and custom-built security efficiency systems.' },
  { title: 'Video Surveillance (CCTV)', desc: 'Complete CCTV solutions with project consulting, free security audits, and system integration. Analogue, IP, PTZ, 360°, GSM, thermal, and face-detection cameras. DVR, NVR, XVR, video analytics, and video wall solutions.' },
  { title: 'Access Control', desc: 'Physical, logical, and administrative access control. Biometric identification, access cards, security tokens, and other authentication mechanisms to prevent unauthorized access and protect sensitive resources.' },
];

const team = [
  { name: 'Mrs. Mayeeda Choudhury', role: 'Chairperson', cred: '' },
  { name: 'Major Zulfiqar H. Choudhury (Retd)', role: 'Managing Director', cred: '' },
  { name: 'Major Md. Nazmul Haque (Retd)', role: 'Executive Director', cred: 'MBA, PGDHRM' },
  { name: 'Major Kazi Ashfaq (Retd)', role: 'Director Marketing', cred: '' },
  { name: 'Major Asif Chowdhury (Retd)', role: 'Director Business Development', cred: 'MBA, MBCHRS' },
  { name: 'Mohammad Ali Yusuf Hossain', role: 'Director Finance & Digital Surveillance', cred: 'MCom, MBA, DCS, CSP' },
  { name: 'Lt. Mizanur Rahman BN (Retd)', role: 'General Manager (Admin & Ops)', cred: 'ISO 9001:2015 Lead Auditor' },
  { name: 'Md. Mostafizur Rahman', role: 'Deputy General Manager (Operations)', cred: '' },
  { name: 'Md. Jalal Ahmed', role: 'Manager Chittagong Region', cred: '' },
  { name: 'Engr. Sumon Parvez', role: 'Manager Digital Surveillance Solutions', cred: 'BSc (EEE)' },
  { name: 'Advocate Syed Mehedi Hasan', role: 'Advisor Legal Affairs', cred: '' },
  { name: 'DK Associates', role: 'Advisor Corporate Affairs', cred: '' },
];

const branches = [
  { name: 'Head Office — Dhaka', addr: 'House #155, Lane #3, Eastern Road, New DOHS Mohakhali, Dhaka 1206', phone: '+8801618325266', email: 'info@falconslimited.com' },
  { name: 'Chittagong Office', addr: 'Vernal Vale, House-568 A/1/1389, Road-04, North Khulshi, Chittagong', phone: '01913052845', email: 'chittagong@falconslimited.com' },
  { name: 'Khulna Office', addr: 'A 43/44 Mojid Saroni Road (4th Floor), Shib Bari More, Khulna', phone: '01711-480287', email: 'khulna@falconslimited.com' },
  { name: 'Bogra Office', addr: 'Fuldighi (Near Pepsi Gate), Banani, Bogra', phone: '01703-307173', email: 'Bogra@falconslimited.com' },
  { name: 'Training Center', addr: '6715 Gaoir Madrasa, Dakkhinkhan, Dhaka 1230', phone: '', email: '' },
];

const certs = [
  'ISO 9001:2015 — Quality Management System',
  'ISO 18788:2015 — Private Security Operations',
  'ISO 27001:2013 — Information Security Management',
  'Founder Member — BPSSPA',
  'Platinum Distributor-Partner — ISM UK',
  'Trademark Registered — Govt. of Bangladesh',
  'VAT & Tax Registered',
  'Registered under Ministry of Labour',
];

/* ================================================================== */
/*  REUSABLE PAGE COMPONENTS (must use React.forwardRef)               */
/* ================================================================== */

const PageWrapper = React.forwardRef<HTMLDivElement, {
  children: React.ReactNode;
  pageNum?: number;
  heading?: string;
  headerImage?: React.ReactNode;
}>(({ children, pageNum, heading, headerImage }, ref) => (
  <div ref={ref} className="page-content">
    <div
      className="w-full h-full flex flex-col bg-[#faf8f4] relative overflow-hidden"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Paper texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'4\' height=\'4\' viewBox=\'0 0 4 4\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 3h1v1H1V3zm2-2h1v1H3V1z\' fill=\'%23000\' fill-opacity=\'1\'/%3E%3C/svg%3E")',
      }} />

      {/* Header */}
      {heading && (
        <div className="px-5 sm:px-8 pt-5 sm:pt-7 pb-1">
          <h3 className="text-xs sm:text-base md:text-lg font-bold text-stone-800 tracking-wide uppercase">
            {heading}
          </h3>
          <div className="w-12 sm:w-16 h-[2px] bg-red-600 mt-1.5 rounded-full" />
        </div>
      )}

      {/* Header image area */}
      {headerImage && (
        <div className="mx-5 sm:mx-8 mt-3 sm:mt-4 rounded-lg overflow-hidden shadow-md">
          {headerImage}
        </div>
      )}

      {/* Body */}
      <div className="flex-1 min-h-0 px-5 sm:px-8 py-3 sm:py-4 overflow-y-auto text-[10px] sm:text-xs md:text-sm leading-relaxed text-stone-700 book-page-scroll">
        {children}
      </div>

      {/* Page number */}
      {pageNum !== undefined && (
        <div className="px-5 sm:px-8 pb-3 sm:pb-5 pt-1 text-center">
          <span className="text-[10px] sm:text-xs text-stone-400 italic">{pageNum}</span>
        </div>
      )}
    </div>
  </div>
));
PageWrapper.displayName = 'PageWrapper';

/* ================================================================== */
/*  INDIVIDUAL PAGES                                                   */
/* ================================================================== */

/* Cover */
const CoverPage = React.forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="page-content">
    <div className="w-full h-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#0f1520] via-[#1a2332] to-[#0f1520] relative" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <div className="absolute inset-5 sm:inset-10 border border-amber-600/30 rounded pointer-events-none" />
      <div className="absolute inset-6 sm:inset-11 border border-amber-600/15 rounded pointer-events-none" />

      <div className="flex items-center gap-2 mb-5 sm:mb-8">
        <div className="w-10 sm:w-16 h-px bg-amber-500/50" />
        <div className="w-2 h-2 rotate-45 bg-amber-500/70" />
        <div className="w-10 sm:w-16 h-px bg-amber-500/50" />
      </div>

      <div className="w-14 h-14 sm:w-24 sm:h-24 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mb-5 sm:mb-8">
        <span className="text-2xl sm:text-4xl font-bold text-amber-400" style={{ fontFamily: 'Georgia, serif' }}>F</span>
      </div>

      <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-amber-100 tracking-wider leading-tight">
        FALCON<span className="text-amber-400">®</span>
      </h1>
      <h2 className="text-xs sm:text-lg md:text-xl text-amber-200/70 tracking-[0.2em] sm:tracking-[0.3em] uppercase mt-1 sm:mt-2">
        Security Limited
      </h2>

      <div className="w-14 sm:w-24 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent my-5 sm:my-8" />

      <p className="text-xs sm:text-sm text-amber-300/60 italic">Company Profile</p>
      <p className="text-[10px] sm:text-xs text-amber-500/40 mt-3 sm:mt-6">
        Established 1993 · Dhaka, Bangladesh
      </p>

      <div className="flex items-center gap-2 mt-6 sm:mt-10">
        <div className="w-10 sm:w-16 h-px bg-amber-500/50" />
        <div className="w-2 h-2 rotate-45 bg-amber-500/70" />
        <div className="w-10 sm:w-16 h-px bg-amber-500/50" />
      </div>
    </div>
  </div>
));
CoverPage.displayName = 'CoverPage';

/* About */
const AboutPage = React.forwardRef<HTMLDivElement>((_, ref) => (
  <PageWrapper ref={ref} pageNum={1} heading="The Company"
    headerImage={
      <div className="w-full h-20 sm:h-32 bg-gradient-to-r from-red-900 via-red-800 to-red-900 flex items-center justify-center">
        <p className="text-white/90 text-xs sm:text-sm italic px-4 text-center">"Your Security is Our Priority"</p>
      </div>
    }
  >
    <p className="mb-2 sm:mb-3 text-justify">
      <span className="text-2xl sm:text-3xl text-red-700 float-left mr-1.5 leading-[0.85] mt-0.5 font-bold">F</span>
      alcon® Security Limited is a security, planning, management, and services company
      enjoying the confidence of our clientele. Retired officers from Bangladesh Army having
      adequate training on security and related matters, both from home and abroad, manage
      the services of the company.
    </p>
    <p className="mb-2 sm:mb-3 text-justify">
      Our experience includes VVIP security, protection planning of key point installation
      (KPI), aviation security, planning and securing big industrial projects from inception
      till operation and providing security and other essential services to expatriate/local
      companies, offices, factories, residential complexes, and other installations.
    </p>
  </PageWrapper>
));
AboutPage.displayName = 'AboutPage';

/* Policy */
const PolicyPage = React.forwardRef<HTMLDivElement>((_, ref) => (
  <PageWrapper ref={ref} pageNum={2} heading="Our Policy & Vision"
    headerImage={
      <div className="w-full h-20 sm:h-32 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
        <p className="text-white/90 text-xs sm:text-sm italic px-4 text-center">"Concentrated and Quality Services"</p>
      </div>
    }
  >
    <p className="mb-2 sm:mb-3 text-justify">
      The company policy is to provide concentrated and quality services without overstretching
      our supervisory system. By this, we ensure strict supervision round the clock to maintain
      the high standard of performance set by us.
    </p>
    <p className="mb-2 sm:mb-3 text-justify">
      We ensure our clients receive a full range of quality assured products and services
      related to security and surveillance. We also try to achieve excellence and lead the
      industry both in the quality of provided services and customer satisfaction. We are
      continuously improving and in pursuit of excellence.
    </p>
    <div className="mt-3 sm:mt-4 bg-stone-100 rounded-lg p-3 sm:p-4 border-l-3 border-red-600">
      <p className="font-bold text-stone-800 text-xs sm:text-sm mb-1">Our Commitment</p>
      <p className="text-stone-600 text-justify">
        Fully trained, highly visible uniformed security personnel who deliver services in
        accordance with client requirements — regardless of project size.
      </p>
    </div>
  </PageWrapper>
));
PolicyPage.displayName = 'PolicyPage';

/* Founder */
const FounderPage = React.forwardRef<HTMLDivElement>((_, ref) => (
  <PageWrapper ref={ref} pageNum={3} heading="Founder's Message"
    headerImage={
      <div className="w-full h-20 sm:h-32 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 flex items-center justify-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center">
          <span className="text-xl sm:text-2xl font-bold text-amber-400">F</span>
        </div>
      </div>
    }
  >
    <div className="border-l-2 border-stone-300 pl-3 sm:pl-4 italic text-stone-600 mb-3 sm:mb-4 text-justify">
      <p className="mb-2">
        "Everything we hold near and dear needs to be protected and cared for. But we need
        to find someone worthy enough to ensure the security of the fruits of our hard work
        and indeed, our very lives and properties, can be difficult."
      </p>
      <p>"That's where Falcon® comes in."</p>
    </div>
    <div className="border-t border-stone-200 pt-2 sm:pt-3 mt-auto">
      <p className="font-bold text-stone-800 text-xs sm:text-sm">Major Zulfiqar H. Choudhury (Retd)</p>
      <p className="text-red-700 text-[10px] sm:text-xs">Managing Director & Founder</p>
    </div>
  </PageWrapper>
));
FounderPage.displayName = 'FounderPage';

/* History */
const HistoryPage = React.forwardRef<HTMLDivElement>((_, ref) => (
  <PageWrapper ref={ref} pageNum={4} heading="History & Growth"
    headerImage={
      <div className="w-full h-20 sm:h-32 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-3xl sm:text-4xl font-bold text-white">1993</p>
          <p className="text-[10px] sm:text-xs text-amber-200/80">Year of Establishment</p>
        </div>
      </div>
    }
  >
    <p className="mb-2 sm:mb-3 text-justify">
      Falcon Security was set up as a Proprietorship Company under the management
      of the present Managing Director in 1993. The company was later registered in
      1997 with the registrar of joint-stock companies, Govt. of Bangladesh as a
      private limited company.
    </p>
    <p className="mb-2 sm:mb-3 text-justify">
      Falcon® logo and name received trademark registration from the government.
      With time, Falcon® established countrywide operations with regional offices
      in Khulna, Chittagong, Sylhet, Barishal, and Bogura.
    </p>
    <p className="text-justify">
      Falcon® Security Limited is the founder member of the Bangladesh Professional
      Security Service Provider's Association (BPSSPA) and the platinum
      distributor-partner of ISM UK in integration.
    </p>
  </PageWrapper>
));
HistoryPage.displayName = 'HistoryPage';

/* Services page 1 */
const Services1Page = React.forwardRef<HTMLDivElement>((_, ref) => (
  <PageWrapper ref={ref} pageNum={5} heading="Our Services"
    headerImage={
      <div className="w-full h-20 sm:h-28 bg-gradient-to-r from-red-900 via-red-700 to-red-900 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-sm sm:text-lg font-bold text-white">9 Core Services</p>
          <p className="text-[10px] sm:text-xs text-red-200/80">Comprehensive Security Solutions</p>
        </div>
      </div>
    }
  >
    <div className="space-y-2 sm:space-y-3">
      {services.slice(0, 3).map((s, i) => (
        <div key={i}>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 rounded bg-red-600 text-white flex items-center justify-center text-[9px] sm:text-xs font-bold">{i + 1}</span>
            <p className="font-bold text-stone-800 text-xs sm:text-sm">{s.title}</p>
          </div>
          <p className="text-stone-600 text-justify pl-7 sm:pl-8">{s.desc}</p>
        </div>
      ))}
    </div>
  </PageWrapper>
));
Services1Page.displayName = 'Services1Page';

/* Services page 2 */
const Services2Page = React.forwardRef<HTMLDivElement>((_, ref) => (
  <PageWrapper ref={ref} pageNum={6} heading="Services (continued)">
    <div className="space-y-2 sm:space-y-3">
      {services.slice(3, 6).map((s, i) => (
        <div key={i}>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 rounded bg-red-600 text-white flex items-center justify-center text-[9px] sm:text-xs font-bold">{i + 4}</span>
            <p className="font-bold text-stone-800 text-xs sm:text-sm">{s.title}</p>
          </div>
          <p className="text-stone-600 text-justify pl-7 sm:pl-8">{s.desc}</p>
        </div>
      ))}
    </div>
  </PageWrapper>
));
Services2Page.displayName = 'Services2Page';

/* Services page 3 */
const Services3Page = React.forwardRef<HTMLDivElement>((_, ref) => (
  <PageWrapper ref={ref} pageNum={7} heading="Services (continued)"
    headerImage={
      <div className="w-full h-20 sm:h-28 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-sm sm:text-lg font-bold text-white">Technology Solutions</p>
          <p className="text-[10px] sm:text-xs text-blue-200/80">Digital & Integrated Security</p>
        </div>
      </div>
    }
  >
    <div className="space-y-2 sm:space-y-3">
      {services.slice(6).map((s, i) => (
        <div key={i}>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 rounded bg-blue-700 text-white flex items-center justify-center text-[9px] sm:text-xs font-bold">{i + 7}</span>
            <p className="font-bold text-stone-800 text-xs sm:text-sm">{s.title}</p>
          </div>
          <p className="text-stone-600 text-justify pl-7 sm:pl-8">{s.desc}</p>
        </div>
      ))}
    </div>
  </PageWrapper>
));
Services3Page.displayName = 'Services3Page';

/* Team page 1 */
const Team1Page = React.forwardRef<HTMLDivElement>((_, ref) => (
  <PageWrapper ref={ref} pageNum={8} heading="Management Team"
    headerImage={
      <div className="w-full h-20 sm:h-28 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 flex items-center justify-center px-4">
        <p className="text-white/90 text-[10px] sm:text-xs text-center italic">
          "Veterans of the Bangladesh Armed Forces with training in security and intelligence"
        </p>
      </div>
    }
  >
    <div className="space-y-1.5 sm:space-y-2">
      {team.slice(0, 6).map((m, i) => (
        <div key={i} className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg bg-stone-50 border border-stone-100">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-red-600 to-blue-800 flex items-center justify-center text-white text-[9px] sm:text-xs font-bold flex-shrink-0">
            {m.name[0]}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-stone-800 text-[10px] sm:text-xs truncate">{m.name}</p>
            <p className="text-red-700 text-[9px] sm:text-[11px]">{m.role}</p>
            {m.cred && <p className="text-stone-500 text-[8px] sm:text-[10px]">{m.cred}</p>}
          </div>
        </div>
      ))}
    </div>
  </PageWrapper>
));
Team1Page.displayName = 'Team1Page';

/* Team page 2 */
const Team2Page = React.forwardRef<HTMLDivElement>((_, ref) => (
  <PageWrapper ref={ref} pageNum={9} heading="Management (continued)">
    <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
      {team.slice(6).map((m, i) => (
        <div key={i} className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg bg-stone-50 border border-stone-100">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-red-600 to-blue-800 flex items-center justify-center text-white text-[9px] sm:text-xs font-bold flex-shrink-0">
            {m.name[0]}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-stone-800 text-[10px] sm:text-xs truncate">{m.name}</p>
            <p className="text-red-700 text-[9px] sm:text-[11px]">{m.role}</p>
            {m.cred && <p className="text-stone-500 text-[8px] sm:text-[10px]">{m.cred}</p>}
          </div>
        </div>
      ))}
    </div>
    <div className="bg-stone-100 rounded-lg p-2 sm:p-3 mt-auto">
      <p className="text-stone-600 text-justify">
        Our management team consists of veterans of the Bangladesh Armed Forces with sufficient
        training in security and intelligence at home and abroad, plus a dedicated team of IT
        experts for digital surveillance solutions.
      </p>
    </div>
  </PageWrapper>
));
Team2Page.displayName = 'Team2Page';

/* Certifications */
const CertsPage = React.forwardRef<HTMLDivElement>((_, ref) => (
  <PageWrapper ref={ref} pageNum={10} heading="Certifications & Standards"
    headerImage={
      <div className="w-full h-20 sm:h-28 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-sm sm:text-lg font-bold text-white">Standards & Compliance</p>
          <p className="text-[10px] sm:text-xs text-purple-200/80">International Quality Certifications</p>
        </div>
      </div>
    }
  >
    <div className="space-y-1.5 sm:space-y-2">
      {certs.map((c, i) => (
        <div key={i} className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 border border-stone-200 rounded-lg bg-white">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-stone-700 text-[10px] sm:text-xs">{c}</p>
        </div>
      ))}
    </div>
  </PageWrapper>
));
CertsPage.displayName = 'CertsPage';

/* Why Falcon */
const WhyPage = React.forwardRef<HTMLDivElement>((_, ref) => (
  <PageWrapper ref={ref} pageNum={11} heading="Why Falcon®"
    headerImage={
      <div className="w-full h-20 sm:h-28 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 flex items-center justify-center px-4">
        <p className="text-amber-300/90 text-xs sm:text-sm italic text-center">
          "If security is in your priority list, Falcon® is just a call away."
        </p>
      </div>
    }
  >
    {[
      { icon: '🛡️', t: '33+ Years of Trust', d: 'Serving since 1993 with an impeccable track record across Bangladesh.' },
      { icon: '⭐', t: 'Military Leadership', d: 'Managed by retired Bangladesh Army officers with specialized security training.' },
      { icon: '📋', t: 'Triple ISO Certified', d: 'ISO 9001:2015, ISO 18788:2015, and ISO 27001:2013 certified.' },
      { icon: '🌐', t: 'Nationwide Reach', d: 'Regional offices in Dhaka, Chittagong, Khulna, Bogra with a dedicated training center.' },
      { icon: '🔒', t: '5,500+ Consignments/Year', d: 'GPS tracked escort services across the entire country.' },
      { icon: '🤝', t: 'ISM UK Partner', d: 'Platinum distributor-partner for Physical Security Information Management.' },
    ].map((item, i) => (
      <div key={i} className="flex gap-2 sm:gap-3 mb-2 sm:mb-3 items-start">
        <span className="text-sm sm:text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
        <div>
          <p className="font-bold text-stone-800 text-[10px] sm:text-xs">{item.t}</p>
          <p className="text-stone-600 text-justify">{item.d}</p>
        </div>
      </div>
    ))}
  </PageWrapper>
));
WhyPage.displayName = 'WhyPage';

/* Locations */
const LocationsPage = React.forwardRef<HTMLDivElement>((_, ref) => (
  <PageWrapper ref={ref} pageNum={12} heading="Our Locations"
    headerImage={
      <div className="w-full h-20 sm:h-28 bg-gradient-to-r from-teal-900 via-teal-800 to-teal-900 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-sm sm:text-lg font-bold text-white">Nationwide Presence</p>
          <p className="text-[10px] sm:text-xs text-teal-200/80">Offices Across Bangladesh</p>
        </div>
      </div>
    }
  >
    <div className="space-y-1.5 sm:space-y-2">
      {branches.map((b, i) => (
        <div key={i} className="p-2 sm:p-3 border border-stone-200 rounded-lg bg-white">
          <p className="font-bold text-stone-800 text-[10px] sm:text-xs">{b.name}</p>
          <p className="text-stone-500 text-[9px] sm:text-[11px]">📍 {b.addr}</p>
          {b.phone && <p className="text-stone-500 text-[9px] sm:text-[11px]">📞 {b.phone}</p>}
          {b.email && <p className="text-stone-500 text-[9px] sm:text-[11px]">✉ {b.email}</p>}
        </div>
      ))}
    </div>
  </PageWrapper>
));
LocationsPage.displayName = 'LocationsPage';

/* Back Cover */
const BackPage = React.forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="page-content">
    <div className="w-full h-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#0f1520] via-[#1a2332] to-[#0f1520] relative" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <div className="absolute inset-5 sm:inset-10 border border-amber-600/25 rounded pointer-events-none" />

      <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mb-4 sm:mb-6">
        <span className="text-xl sm:text-3xl font-bold text-amber-400" style={{ fontFamily: 'Georgia, serif' }}>F</span>
      </div>

      <h2 className="text-sm sm:text-xl font-bold text-amber-100 mb-1">Falcon® Security Limited</h2>
      <div className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent my-3 sm:my-5" />

      <div className="space-y-0.5 sm:space-y-1 text-[10px] sm:text-sm text-amber-300/70">
        <p>House #155, Lane #3, Eastern Road</p>
        <p>New DOHS Mohakhali, Dhaka 1206</p>
        <p className="mt-2 sm:mt-3">📞 +8801618325266</p>
        <p>✉ info@falconslimited.com</p>
      </div>

      <div className="mt-5 sm:mt-8 px-6 sm:px-10">
        <p className="text-[9px] sm:text-xs text-amber-500/50 italic">
          "Your Security is Our Priority"
        </p>
      </div>

      <div className="flex items-center gap-2 mt-5 sm:mt-8">
        <div className="w-10 sm:w-16 h-px bg-amber-500/50" />
        <div className="w-2 h-2 rotate-45 bg-amber-500/70" />
        <div className="w-10 sm:w-16 h-px bg-amber-500/50" />
      </div>
    </div>
  </div>
));
BackPage.displayName = 'BackPage';

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export default function CompanyProfile() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 14;

  const seoData = useSEO({
    title: 'Company Profile - Falcon® Security Limited',
    description: 'Browse the official company profile book of Falcon® Security Limited.',
    keywords: ['falcon security', 'company profile', 'security brochure'],
    type: 'website',
  });

  const onFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
  }, []);

  const flipNext = () => bookRef.current?.pageFlip()?.flipNext();
  const flipPrev = () => bookRef.current?.pageFlip()?.flipPrev();

  /* Download */
  const handleDownload = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head>
      <title>Falcon® Security Limited — Company Profile</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Source+Sans+3:wght@300;400;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Source Sans 3',sans-serif;color:#1c1917;-webkit-print-color-adjust:exact;print-color-adjust:exact}h1,h2,h3{font-family:'Playfair Display',serif}
        .cv{min-height:100vh;background:linear-gradient(135deg,#0f172a,#1e293b);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#fef3c7;page-break-after:always;padding:60px}.cv h1{font-size:44px;letter-spacing:2px}.cv h2{font-size:20px;letter-spacing:6px;opacity:.7;text-transform:uppercase;margin-top:4px}
        .s{padding:36px 48px;page-break-inside:avoid}.s+.s{border-top:2px solid #e7e5e4}.st{font-size:22px;color:#dc2626;margin-bottom:12px;padding-bottom:6px;border-bottom:3px solid #dc2626;display:inline-block}
        .s p{margin-bottom:8px;font-size:13px;line-height:1.7;color:#44403c}.g{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .c{border:1px solid #e7e5e4;border-radius:6px;padding:12px}.c h4{font-size:13px;font-weight:700;margin-bottom:2px}.c p{font-size:11px;color:#78716c;margin:0}
        .sv{margin-bottom:12px;padding:10px;border-left:4px solid #dc2626;background:#fef2f2;border-radius:0 6px 6px 0}.sv h4{font-size:13px;font-weight:700;margin-bottom:2px}.sv p{font-size:11px;color:#44403c;margin:0}
        .cr{display:inline-block;background:#f0fdf4;border:1px solid #bbf7d0;padding:4px 12px;border-radius:16px;font-size:11px;color:#166534;margin:2px}
        .ft{text-align:center;padding:24px;background:#1e293b;color:#94a3b8;font-size:11px;page-break-before:always}
      </style></head><body>
      <div class="cv"><h1>FALCON®</h1><h2>Security Limited</h2><div style="width:60px;height:2px;background:linear-gradient(90deg,transparent,#d97706,transparent);margin:24px auto"></div><p style="font-size:13px;opacity:.5">Company Profile · Since 1993</p></div>
      <div class="s"><h2 class="st">The Company</h2><p>Falcon® Security Limited is a security, planning, management, and services company enjoying the confidence of our clientele. Retired officers from Bangladesh Army having adequate training on security and related matters manage the services.</p><p>Our experience includes VVIP security, protection planning of key point installation (KPI), aviation security, and securing big industrial projects from inception till operation.</p><p><strong>Policy:</strong> Concentrated and quality services without overstretching our supervisory system.</p></div>
      <div class="s"><h2 class="st">Founder's Message</h2><p><em>"Everything we hold near and dear needs to be protected and cared for. That's where Falcon® comes in."</em></p><p><strong>Major Zulfiqar H. Choudhury (Retd)</strong> — Managing Director & Founder</p></div>
      <div class="s"><h2 class="st">History</h2><p>Founded 1993 as Proprietorship. Registered 1997 as Private Limited Company. Nationwide expansion. Founder member of BPSSPA. Platinum partner of ISM UK.</p></div>
      <div class="s"><h2 class="st">Our Services</h2>${services.map((s, i) => `<div class="sv"><h4>${i + 1}. ${s.title}</h4><p>${s.desc}</p></div>`).join('')}</div>
      <div class="s"><h2 class="st">Management Team</h2><div class="g">${team.map(m => `<div class="c"><h4>${m.name}</h4><p style="color:#dc2626;font-weight:600">${m.role}</p>${m.cred ? `<p>${m.cred}</p>` : ''}</div>`).join('')}</div></div>
      <div class="s"><h2 class="st">Certifications</h2><div>${certs.map(c => `<span class="cr">✓ ${c}</span>`).join('')}</div></div>
      <div class="s"><h2 class="st">Locations</h2><div class="g">${branches.map(b => `<div class="c"><h4>${b.name}</h4><p>📍 ${b.addr}</p>${b.phone ? `<p>📞 ${b.phone}</p>` : ''}${b.email ? `<p>✉ ${b.email}</p>` : ''}</div>`).join('')}</div></div>
      <div class="ft"><p>© ${new Date().getFullYear()} Falcon® Security Limited. All rights reserved.</p><p>+8801618325266 · info@falconslimited.com</p></div>
    </body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  return (
    <>
      <SEO {...seoData} keywords={seoData.keywords?.join(', ')} />

      <style>{`
        .book-page-scroll::-webkit-scrollbar{width:3px}
        .book-page-scroll::-webkit-scrollbar-track{background:transparent}
        .book-page-scroll::-webkit-scrollbar-thumb{background:#d6d3d1;border-radius:99px}
        .page-content{background-color:#faf8f4}
        .stf__parent{margin:0 auto!important}
      `}</style>

      <div className="min-h-screen pt-20 pb-10 bg-gradient-to-b from-[#3a3632] via-[#2c2926] to-[#1f1c1a]">

        {/* Top bar */}
        <div className="max-w-5xl mx-auto px-4 pb-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <h1 className="text-lg sm:text-2xl font-bold text-amber-100" style={{ fontFamily: 'Georgia, serif' }}>
              Company Profile
            </h1>
            <p className="text-[10px] sm:text-sm text-stone-400" style={{ fontFamily: 'Georgia, serif' }}>
              Falcon® Security Limited · Since 1993
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold text-sm transition-colors shadow-lg"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Download PDF
          </motion.button>
        </div>

        {/* ═══════════════ THE BOOK ═══════════════ */}
        <div className="max-w-[1000px] mx-auto px-2 sm:px-4">
          <HTMLFlipBook
            ref={bookRef}
            width={450}
            height={580}
            size="stretch"
            minWidth={280}
            maxWidth={500}
            minHeight={380}
            maxHeight={620}
            showCover={true}
            maxShadowOpacity={0.5}
            drawShadow={true}
            flippingTime={800}
            usePortrait={true}
            mobileScrollSupport={true}
            swipeDistance={30}
            clickEventForward={true}
            useMouseEvents={true}
            showPageCorners={true}
            className="mx-auto"
            style={{}}
            onFlip={onFlip}
            startZIndex={0}
            autoSize={true}
            startPage={0}
            disableFlipByClick={false}
          >
            <CoverPage />
            <AboutPage />
            <PolicyPage />
            <FounderPage />
            <HistoryPage />
            <Services1Page />
            <Services2Page />
            <Services3Page />
            <Team1Page />
            <Team2Page />
            <CertsPage />
            <WhyPage />
            <LocationsPage />
            <BackPage />
          </HTMLFlipBook>

          {/* Navigation controls */}
          <div className="flex items-center justify-center gap-4 mt-5 sm:mt-7">
            <button
              onClick={flipPrev}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-stone-700 hover:bg-stone-600 flex items-center justify-center text-amber-200 transition shadow-lg disabled:opacity-30"
              disabled={currentPage === 0}
            >
              <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: Math.ceil(totalPages / 2) + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => bookRef.current?.pageFlip()?.flip(i === 0 ? 0 : i * 2 - 1)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    Math.floor(currentPage / 2) === i || (i === 0 && currentPage === 0)
                      ? 'w-6 sm:w-8 bg-amber-500'
                      : 'w-1.5 bg-stone-600 hover:bg-stone-500'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={flipNext}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-stone-700 hover:bg-stone-600 flex items-center justify-center text-amber-200 transition shadow-lg disabled:opacity-30"
              disabled={currentPage >= totalPages - 1}
            >
              <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <p className="text-center text-[10px] sm:text-xs text-stone-500 mt-2" style={{ fontFamily: 'Georgia, serif' }}>
            Page {currentPage + 1} of {totalPages}
          </p>
          <p className="text-center text-[10px] text-stone-600 mt-2 hidden sm:block" style={{ fontFamily: 'Georgia, serif' }}>
            Click page corners or drag to flip · Use arrows or swipe on mobile
          </p>
        </div>
      </div>
    </>
  );
}
