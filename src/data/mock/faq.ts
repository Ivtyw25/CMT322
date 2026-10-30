import { routes } from '@/config/routes';
import type { FaqCategory, FaqItem } from '@/data/models/faq';

/*
 * 22 questions in 4 topics (5 + 6 + 5 + 6), as Figma 1:557 counts them.
 * The five "Most asked this month" questions and the first answer are from Figma;
 * the other answers are written for this build. Legal and land answers are marked VERIFY.
 */
export const faqCategories: FaqCategory[] = [
  {
    id: 'getting-around',
    label: 'Getting around during the works',
    shortLabel: 'Getting around',
    summary: 'How are road closures handled? How will I be told about works?',
    audiences: ['travel', 'live-work'],
  },
  {
    id: 'living-near',
    label: 'Living or working near a site',
    shortLabel: 'Living near a site',
    summary: 'Construction hours, noise, water and power supply, property surveys.',
    audiences: ['live-work'],
  },
  {
    id: 'land',
    label: 'Land and compensation',
    shortLabel: 'Land and compensation',
    summary: 'Affected land, compensation, objections and notice to vacate.',
    audiences: ['land'],
  },
  {
    id: 'the-line',
    label: 'The line and its opening',
    shortLabel: 'The line',
    summary: 'Opening date, train frequency, fares and station access.',
    audiences: ['travel'],
  },
];

export const faqItems: FaqItem[] = [
  // Getting around during the works (5)
  {
    id: 'road-closures',
    categoryId: 'getting-around',
    question: 'How will road closures and traffic be handled?',
    summary:
      'Closures are planned with the traffic police and the city council, announced at least a week ahead and signed on site.',
    answer: [
      'Every closure, lane change and detour is planned with the traffic police and the city council before it starts.',
      'We publish each one on this site at least a week ahead, with the dates, hours and the signed detour. Big closures, such as lifting viaduct segments, are done at night or at weekends when traffic is light.',
      'On site, follow the detour signs and the instructions of traffic marshals, even if your usual route looks open.',
    ],
    nextSteps: [
      { label: 'See current closures', href: routes.traffic.announcements },
      { label: 'Open the traffic map', href: routes.traffic.map },
    ],
    keywords: ['road closures', 'detour', 'diversion', 'traffic', 'lane closure'],
    mostAskedRank: 2,
    updatedAt: '2026-10-21',
  },
  {
    id: 'told-about-works',
    categoryId: 'getting-around',
    question: 'How will I be told about works near me?',
    summary:
      'Follow your stations or choose an area, and we email you when a closure or night work is announced.',
    answer: [
      'Every closure and night work is listed under Announcements and on the traffic map.',
      'To get emails, sign in and follow the stations near you, or enter your email and area at the bottom of any page. We email you when something new is announced or a date changes.',
      'Residents right next to a worksite also get a printed notice at least 7 days before noisy or night work starts.',
    ],
    nextSteps: [
      { label: 'Follow a station', href: routes.project.stations },
      { label: 'See all announcements', href: routes.traffic.announcements },
    ],
    keywords: ['alerts', 'email', 'notification', 'notice', 'follow station'],
    mostAskedRank: 3,
    updatedAt: '2026-10-21',
  },
  {
    id: 'bus-stops',
    categoryId: 'getting-around',
    question: 'Will bus routes and bus stops change during the works?',
    summary:
      'Some stops move a short distance while a worksite is set up. The temporary stop is always signed.',
    answer: [
      'Most bus routes keep running as usual. Where a worksite takes over a bus stop, the stop moves a short distance and a sign at the old stop shows where to go.',
      'Moved stops are listed under Announcements with the dates. Rapid Penang publishes its own route changes.',
    ],
    nextSteps: [{ label: 'See current closures', href: routes.traffic.announcements }],
    keywords: ['bus', 'bus stop', 'Rapid Penang', 'public transport'],
    mostAskedRank: null,
    updatedAt: '2026-09-02',
  },
  {
    id: 'walk-cycle',
    categoryId: 'getting-around',
    question: 'Can I still walk or cycle past a worksite?',
    summary: 'Yes. Where a footpath closes, a lit and signed temporary path is provided.',
    answer: [
      'Yes. If a footpath has to close, we provide a temporary path that is lit at night, kept clear and wide enough for a wheelchair or pram.',
      'Never walk inside the hoarding or move a barrier, even to take a shortcut. If a temporary path is blocked, flooded or unlit, report it so the site team can fix it.',
    ],
    nextSteps: [{ label: 'Report a blocked path', href: routes.reportTrack.report }],
    keywords: ['walking', 'pedestrian', 'footpath', 'cycling', 'bicycle', 'wheelchair'],
    mostAskedRank: null,
    updatedAt: '2026-09-02',
  },
  {
    id: 'missing-detour-sign',
    categoryId: 'getting-around',
    question: 'What should I do if a detour sign is missing or wrong?',
    summary:
      'Report it with the road name and a photo. Call MRTCareline if it is causing danger now.',
    answer: [
      'Report it with the road name, which way you were travelling and a photo if you can take one safely. The site team checks signs every day, and reports help them find problems faster.',
      'If the sign is causing danger now, for example sending traffic the wrong way, call MRTCareline on 1800-88-6782. It is open 24 hours.',
    ],
    nextSteps: [{ label: 'Report an issue', href: routes.reportTrack.report }],
    keywords: ['sign', 'detour sign', 'missing sign', 'signage'],
    mostAskedRank: null,
    updatedAt: '2026-08-18',
  },

  // Living or working near a site (6)
  {
    id: 'construction-hours',
    categoryId: 'living-near',
    question: 'What are the construction hours?',
    summary:
      'Works normally run from 7 am to 7 pm. Some high-risk work, such as lifting the viaduct box girders, may happen at night outside peak traffic, with approval from the local authority.',
    answer: [
      'Works normally run from 7 am to 7 pm.',
      'Some high-risk work, such as lifting the viaduct box girders, is done at night outside peak traffic for safety. Night work needs approval from the local authority, and quieter work may continue a little past 7 pm.',
    ],
    nextSteps: [
      { label: 'See night works this week', href: routes.traffic.announcements },
      { label: 'Report noise outside these hours', href: routes.reportTrack.report },
    ],
    keywords: ['construction hours', 'working hours', 'night works', 'weekend', 'noise'],
    mostAskedRank: 1,
    updatedAt: '2026-10-21',
  },
  {
    id: 'property-damage',
    categoryId: 'living-near',
    question: 'What if my property is damaged by the works?',
    summary:
      'Report it with photos. An independent surveyor compares it with the condition survey done before work started.',
    answer: [
      'Report it as soon as you notice it, with photos and the date you first saw it. Choose "Damage to property" as the category.',
      'An independent surveyor visits and compares the damage with the condition survey made before work started near you. If the works caused it, the contractor repairs it or pays for the repair.',
      // VERIFY: who is liable and how claims are settled.
      'You do not need to pay for the survey visit.',
    ],
    nextSteps: [
      { label: 'Report property damage', href: routes.reportTrack.report },
      { label: 'Track a ticket', href: routes.reportTrack.track },
    ],
    keywords: ['property damage', 'crack', 'cracks', 'house', 'building', 'claim', 'repair'],
    mostAskedRank: 5,
    updatedAt: '2026-10-21',
  },
  {
    id: 'condition-survey',
    categoryId: 'living-near',
    question: 'What is a property condition survey?',
    summary:
      'Before work starts, an independent surveyor records the condition of buildings near the works. You can ask for a copy.',
    answer: [
      'Before work starts near you, an independent surveyor records the condition of nearby buildings with notes and photos, including any cracks that are already there.',
      'The survey is free, and you can ask for a copy of the record for your building. It protects you: if damage appears later, it can be compared with the survey.',
      'If you think your building should be surveyed and nobody has contacted you, send a report with your address.',
    ],
    nextSteps: [{ label: 'Ask for a survey', href: routes.reportTrack.report }],
    keywords: ['property survey', 'condition survey', 'surveyor', 'building', 'property damage'],
    mostAskedRank: null,
    updatedAt: '2026-09-15',
  },
  {
    id: 'noise-dust',
    categoryId: 'living-near',
    question: 'What is being done about noise and dust?',
    summary:
      'Sites use noise barriers, water sprays and wheel washing. Report anything that seems too much.',
    answer: [
      'Worksites use noise barriers on the hoarding, quieter equipment where possible and water sprays to keep dust down. Lorries pass through a wheel wash before they leave the site.',
      'Noise and dust levels are checked regularly. If noise or dust seems too much, or happens outside working hours, report it with the time and place.',
    ],
    nextSteps: [{ label: 'Report noise or dust', href: routes.reportTrack.report }],
    keywords: ['noise', 'dust', 'vibration', 'air quality', 'night works'],
    mostAskedRank: null,
    updatedAt: '2026-09-15',
  },
  {
    id: 'water-power',
    categoryId: 'living-near',
    question: 'Will my water or electricity be cut off?',
    summary: 'Not usually. If a short planned cut is needed, you are told at least 7 days before.',
    answer: [
      'Most pipes and cables are moved without any break in supply.',
      'If a short planned cut is needed, the utility company and the project team tell affected homes and businesses at least 7 days before, with the date and time. Unplanned cuts caused by the works are fixed as a priority.',
    ],
    nextSteps: [{ label: 'Report a supply problem', href: routes.reportTrack.report }],
    keywords: ['water', 'electricity', 'power cut', 'supply', 'utility'],
    mostAskedRank: null,
    updatedAt: '2026-08-18',
  },
  {
    id: 'access-home-business',
    categoryId: 'living-near',
    question: 'Can the works block access to my home or business?',
    summary:
      'No. Access must always be kept open. Report it if hoarding or vehicles block your way in.',
    answer: [
      'The contractor must keep safe access to every home, shop and driveway at all times, including for deliveries and emergency vehicles.',
      'If hoarding, materials or site vehicles block your way in, report it and choose "Blocked access to home or business". The site team is asked to act within 3 working days, sooner if it is urgent.',
    ],
    nextSteps: [{ label: 'Report blocked access', href: routes.reportTrack.report }],
    keywords: ['access', 'driveway', 'blocked', 'shop', 'business', 'hoarding'],
    mostAskedRank: null,
    updatedAt: '2026-10-21',
  },

  // Land and compensation (5)
  {
    id: 'land-affected',
    categoryId: 'land',
    question: 'How do I know if my land is affected?',
    summary:
      'Owners of affected land are told in writing by the land office. The railway scheme plans also show it.',
    answer: [
      // VERIFY: the notification process and the authority responsible.
      'If your land is needed for the line, the land office tells you in writing. The approved railway scheme plans also show the land that is needed.',
      'If you are not sure, send a question with your lot number or address and we will check it for you.',
    ],
    nextSteps: [{ label: 'Ask about your land', href: routes.reportTrack.report }],
    keywords: ['land acquisition', 'affected land', 'lot', 'railway scheme'],
    mostAskedRank: null,
    updatedAt: '2026-07-30',
  },
  {
    id: 'compensation',
    categoryId: 'land',
    question: 'How is compensation worked out?',
    summary:
      'Compensation is based on the market value of the land and buildings, set by the land office.',
    answer: [
      // VERIFY: compensation basis and the law that applies.
      'Compensation is based on the market value of the land and any buildings on it, as assessed by the land office under land acquisition law.',
      'You can attend the land office enquiry, bring your own valuation and explain any other losses, such as the cost of moving.',
    ],
    nextSteps: [],
    keywords: ['compensation', 'valuation', 'market value', 'land acquisition'],
    mostAskedRank: null,
    updatedAt: '2026-07-30',
  },
  {
    id: 'objection',
    categoryId: 'land',
    question: 'Can I object to the acquisition of my land?',
    summary:
      'You can object to the amount of compensation through the land office, within the time it gives you.',
    answer: [
      // VERIFY: grounds, deadlines and process for objections.
      'You can object to the amount of compensation, or to how the land area was measured, through the land office. You must do this within the time stated in the land office award.',
      'We recommend getting independent legal advice before you object.',
    ],
    nextSteps: [],
    keywords: ['objection', 'appeal', 'compensation', 'land acquisition'],
    mostAskedRank: null,
    updatedAt: '2026-07-30',
  },
  {
    id: 'notice-to-vacate',
    categoryId: 'land',
    question: 'How much notice will I get before I must vacate?',
    summary:
      'You get a written notice from the land office with the date. Nobody may ask you to leave without one.',
    answer: [
      // VERIFY: notice periods under land acquisition law.
      'You receive a written notice from the land office that gives the date you must leave. Nobody from the project may ask you to leave without that notice.',
      'If you need help planning your move, contact us and we will put you in touch with the team that handles relocation.',
    ],
    nextSteps: [],
    keywords: ['vacate', 'notice to vacate', 'eviction', 'move out', 'relocation'],
    mostAskedRank: null,
    updatedAt: '2026-07-30',
  },
  {
    id: 'land-help',
    categoryId: 'land',
    question: 'Who can help me with a land acquisition question?',
    summary:
      'Send a question here or call MRTCareline. For the award itself, contact the land office.',
    answer: [
      'Send a question through this site and choose "Something else" as the category. You get a ticket ID, and the reply comes from the team handling land matters.',
      'You can also call MRTCareline on 1800-88-6782. Questions about the award itself, such as the amount or payment date, are for the land office.',
    ],
    nextSteps: [{ label: 'Send a question', href: routes.reportTrack.report }],
    keywords: ['land office', 'help', 'contact', 'land acquisition'],
    mostAskedRank: null,
    updatedAt: '2026-07-30',
  },

  // The line and its opening (6)
  {
    id: 'opening-date',
    categoryId: 'the-line',
    question: 'When will the Mutiara Line start running?',
    summary: 'Operations are planned to start in December 2031.',
    answer: [
      'Operations are planned to start in December 2031, with trains on all 22 stations from PSR-A to Penang Sentral.',
      'Construction began in early 2025 on the PSR-A to KOMTAR segment. Work on the Macallum to Penang Sentral segment starts in January 2027.',
    ],
    nextSteps: [{ label: 'See the project timeline', href: routes.project.construction }],
    keywords: ['opening date', 'when', 'start running', '2031', 'operations'],
    mostAskedRank: 4,
    updatedAt: '2026-10-21',
  },
  {
    id: 'train-frequency',
    categoryId: 'the-line',
    question: 'How often will trains run?',
    // VERIFY: About page (Figma 1:332) says every 4 minutes at opening, its "Daily commuters" tab says about every 5 minutes.
    summary:
      'Every 4 minutes when the line opens, and up to every 2 minutes as more people use it.',
    answer: [
      'Trains are planned to run every 4 minutes when the line opens, and up to every 2 minutes as more people use it.',
      'The full timetable, including peak and off-peak times, will be published before the line opens.',
      'Follow a station or sign up for email updates to hear when it is announced.',
    ],
    nextSteps: [],
    keywords: ['frequency', 'timetable', 'schedule', 'how often', 'trains'],
    mostAskedRank: null,
    updatedAt: '2026-06-10',
  },
  {
    id: 'fares',
    categoryId: 'the-line',
    question: 'How much will fares be?',
    summary: 'Fares have not been set yet. They will be announced before the line opens.',
    answer: [
      'Fares have not been set yet. They will be announced before the line opens, together with the ways you can pay.',
    ],
    nextSteps: [],
    keywords: ['fares', 'ticket price', 'cost', 'payment'],
    mostAskedRank: null,
    updatedAt: '2026-06-10',
  },
  {
    id: 'stations-route',
    categoryId: 'the-line',
    question: 'How many stations are there, and where does the line go?',
    summary: '22 stations on a 29.67 km elevated line from PSR-A to Penang Sentral.',
    answer: [
      'The line has 22 stations on a 29.67 km elevated viaduct, with 2 depots.',
      'It runs from PSR-A in the south, past the airport, Bayan Lepas, Gelugor and George Town, then across to Penang Sentral in Butterworth.',
    ],
    nextSteps: [{ label: 'See all 22 stations', href: routes.project.stations }],
    keywords: ['stations', 'route', 'map', 'where', 'length'],
    mostAskedRank: null,
    updatedAt: '2026-06-10',
  },
  {
    id: 'station-access',
    categoryId: 'the-line',
    question: 'Will stations be accessible for wheelchairs and prams?',
    summary: 'Yes. Every station is designed with lifts and step-free routes to the platforms.',
    answer: [
      // VERIFY: accessibility features in the station design.
      'Yes. Every station is designed with lifts, ramps and step-free routes from the street to the platforms, and tactile paving for people with low vision.',
    ],
    nextSteps: [],
    keywords: ['accessibility', 'wheelchair', 'pram', 'lift', 'step-free'],
    mostAskedRank: null,
    updatedAt: '2026-06-10',
  },
  {
    id: 'two-segments',
    categoryId: 'the-line',
    question: 'Why is the line built in two segments?',
    summary:
      'Segment 1, PSR-A to KOMTAR, started first. Segment 2, Macallum to Penang Sentral, starts in January 2027.',
    answer: [
      // VERIFY: the reason given for building in two segments.
      'Building in two segments lets work start on the island while the crossing to the mainland is planned.',
      'Segment 1 runs from PSR-A to KOMTAR and has been under construction since early 2025. Segment 2 runs from Macallum to Penang Sentral and starts in January 2027. Macallum and KOMTAR are 0.79 km apart.',
    ],
    nextSteps: [{ label: 'Read about the line', href: routes.project.about }],
    keywords: ['segment', 'phase', 'Macallum', 'Penang Sentral', 'mainland'],
    mostAskedRank: null,
    updatedAt: '2026-06-10',
  },
];
