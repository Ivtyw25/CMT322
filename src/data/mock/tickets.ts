import type {
  Ticket,
  TicketAttachment,
  TicketHandler,
  TicketReply,
  TicketReporter,
} from '@/data/models/ticket';
import type { PhotoSource } from '@/data/models/photo';
import { reportPhotos } from './photos';

const NURUL: TicketHandler = {
  staffId: 'staff-nurul',
  name: 'Nurul Aisyah',
  organisation: 'Penang Island City Council',
};
const DANIEL: TicketHandler = {
  staffId: 'staff-daniel',
  name: 'Daniel Lim',
  organisation: 'MRT Corp project team',
};

const MEILING: TicketReporter = {
  name: 'Tan Mei Ling',
  email: 'meiling.tan@example.com',
  phone: '+60 12-345 6789',
};

const photo = (
  id: string,
  fileName: string,
  sizeBytes: number,
  src: PhotoSource,
): TicketAttachment => ({
  id,
  fileName,
  sizeBytes,
  mimeType: 'image/jpeg',
  src,
});
const pdf = (id: string, fileName: string, sizeBytes: number): TicketAttachment => ({
  id,
  fileName,
  sizeBytes,
  mimeType: 'application/pdf',
});

const reply = (
  handler: TicketHandler,
  fields: Pick<TicketReply, 'id' | 'at' | 'subject' | 'body' | 'status'> &
    Partial<Pick<TicketReply, 'attachments'>>,
): TicketReply => ({
  staffName: handler.name,
  organisation: handler.organisation,
  attachments: [],
  ...fields,
});

/**
 * Ten demo tickets, shared by the commuter pages and the staff portal. "Now" for the mock site is
 * 29 Oct 2026, 18:00. MLC-261028-0482 is exactly Figma 1:1175; Tan Mei Ling's four tickets are her
 * "My reports". Reports sent from the form are added in the browser (src/lib/tickets).
 */
export const tickets: Ticket[] = [
  {
    id: 'MLC-261029-0514',
    type: 'complaint',
    categoryId: 'traffic',
    subject: 'Bus stop moved without notice',
    description:
      'The bus stop on Jalan Jelutong was moved about 200 metres up the road last night and there is no sign at the old stop. Older passengers keep waiting in the wrong place.',
    location: 'Jalan Jelutong, Jelutong, 11600 George Town',
    coordinates: { lat: 5.3905, lng: 100.3278 },
    stationCode: 'S17',
    areaLabel: 'Jelutong',
    status: 'pending',
    priority: 'normal',
    submittedAt: '2026-10-29T09:48:00+08:00',
    reporterId: null,
    reporter: { name: 'Ong Hui Min', email: 'huimin.ong@example.com', phone: '016-882 4410' },
    attachments: [
      photo(
        'MLC-261029-0514-s1',
        'bus-stop-new-spot.jpg',
        1_480_000,
        reportPhotos.temporaryBusStop,
      ),
    ],
    handler: null,
    replies: [],
    reporterReplies: [],
    events: [],
    notes: [],
  },
  {
    id: 'MLC-261029-0511',
    type: 'complaint',
    categoryId: 'dust',
    subject: 'Dust from the worksite on Jalan Penang',
    description:
      'Every afternoon dust from the KOMTAR worksite blows across Jalan Penang into the shops. The water spray does not seem to be running.',
    location: 'Jalan Penang, George Town, 10000 Penang',
    coordinates: { lat: 5.4152, lng: 100.3309 },
    stationCode: 'S20',
    areaLabel: 'George Town',
    status: 'pending',
    priority: 'normal',
    submittedAt: '2026-10-29T09:14:00+08:00',
    reporterId: 'user-meiling',
    reporter: MEILING,
    attachments: [
      photo(
        'MLC-261029-0511-s1',
        'dust-over-jalan-penang.jpg',
        2_150_000,
        reportPhotos.worksiteDust,
      ),
    ],
    handler: null,
    replies: [],
    reporterReplies: [],
    events: [],
    notes: [],
  },
  {
    id: 'MLC-261028-0482',
    type: 'complaint',
    categoryId: 'blocked-access',
    subject: 'Driveway blocked by site hoarding',
    description:
      'Since Monday the new hoarding on Lebuh Kampung Jawa covers half of our shop driveway. Delivery lorries cannot turn in and customers park on the road instead.',
    location: 'Lebuh Kampung Jawa, Bayan Lepas, 11900 Penang',
    coordinates: { lat: 5.3114, lng: 100.2921 },
    stationCode: 'S05',
    areaLabel: 'Bayan Lepas',
    status: 'in-progress',
    priority: 'high',
    submittedAt: '2026-10-28T14:41:00+08:00',
    reporterId: 'user-meiling',
    reporter: MEILING,
    attachments: [
      photo(
        'MLC-261028-0482-s1',
        'hoarding-across-driveway.jpg',
        2_410_000,
        reportPhotos.siteHoarding,
      ),
      photo(
        'MLC-261028-0482-s2',
        'lorry-cannot-turn.jpg',
        1_960_000,
        reportPhotos.siteHoardingLorry,
      ),
    ],
    handler: NURUL,
    replies: [
      reply(NURUL, {
        id: 'MLC-261028-0482-r1',
        at: '2026-10-29T10:12:00+08:00',
        subject: 'The site contractor will move the hoarding',
        body: 'Thank you for the photos. The site contractor has been told to move the hoarding back from your driveway. Work is scheduled within 3 working days and we will update this ticket once it is done. The attached plan shows the new hoarding line.',
        status: null,
        attachments: [pdf('MLC-261028-0482-r1-f1', 'hoarding-relocation-plan.pdf', 640_000)],
      }),
    ],
    reporterReplies: [
      {
        id: 'MLC-261028-0482-c1',
        at: '2026-10-29T15:45:00+08:00',
        name: MEILING.name,
        body: 'Thank you for the plan. A second lorry could not turn in this afternoon either. Can the contractor move the hoarding before Friday?',
        attachments: [],
      },
    ],
    events: [
      {
        id: 'MLC-261028-0482-e1',
        at: '2026-10-28T16:05:00+08:00',
        by: NURUL.name,
        kind: 'claimed',
      },
    ],
    notes: [
      {
        id: 'MLC-261028-0482-n1',
        at: '2026-10-29T09:30:00+08:00',
        authorId: DANIEL.staffId,
        author: DANIEL.name,
        text: '@Nurul Aisyah the site contractor confirmed the move is booked for Friday morning. Traffic marshals are arranged.',
        mentions: [NURUL.staffId],
      },
    ],
  },
  {
    id: 'MLC-261028-0479',
    type: 'inquiry',
    categoryId: 'other',
    subject: 'Will the footbridge near Sungai Nibong stay open?',
    description:
      'My children cross the footbridge near Sungai Nibong station to get to school. Will it stay open during the piling works, or should we plan another route?',
    location: 'Jalan Sungai Nibong, Sungai Nibong, 11900 Penang',
    coordinates: { lat: 5.3448, lng: 100.3041 },
    stationCode: 'S10',
    areaLabel: 'Sungai Nibong',
    status: 'pending',
    priority: 'normal',
    submittedAt: '2026-10-28T16:30:00+08:00',
    reporterId: null,
    reporter: { name: 'Rajesh Kumar', email: 'rajesh.kumar@example.com', phone: '019-770 3358' },
    attachments: [],
    handler: null,
    replies: [],
    reporterReplies: [],
    events: [],
    notes: [],
  },
  {
    id: 'MLC-261027-0466',
    type: 'complaint',
    categoryId: 'noise',
    subject: 'Night piling keeps us awake',
    description:
      'Piling near Gelugor station started again at 11 pm on Sunday and went on until after 2 am. Works are meant to stop at 7 pm. The vibration shook our windows.',
    location: 'Lorong Perak, Gelugor, 11700 Penang',
    coordinates: { lat: 5.3675, lng: 100.3118 },
    stationCode: 'S14',
    areaLabel: 'Gelugor',
    status: 'in-progress',
    priority: 'normal',
    submittedAt: '2026-10-27T22:05:00+08:00',
    reporterId: null,
    reporter: { name: 'Lim Wei Jie', email: 'weijie.lim@example.com', phone: '012-488 7120' },
    attachments: [],
    handler: DANIEL,
    replies: [
      reply(DANIEL, {
        id: 'MLC-261027-0466-r1',
        at: '2026-10-28T11:30:00+08:00',
        subject: 'We have asked the contractor to stop night piling',
        body: 'We are sorry about the noise. Night piling was not approved for this site, and the contractor has been told to stop it. A site inspector will check the working hours this week.',
        status: null,
      }),
    ],
    reporterReplies: [
      {
        id: 'MLC-261027-0466-c1',
        at: '2026-10-29T16:20:00+08:00',
        name: 'Lim Wei Jie',
        body: 'Thank you. The piling started again last night at 10 pm. Please ask the inspector to visit after dark this time.',
        attachments: [],
      },
    ],
    events: [
      {
        id: 'MLC-261027-0466-e1',
        at: '2026-10-28T09:00:00+08:00',
        by: DANIEL.name,
        kind: 'claimed',
      },
    ],
    notes: [],
  },
  {
    id: 'MLC-261026-0444',
    type: 'complaint',
    categoryId: 'road-damage',
    subject: 'Potholes where the road plates were removed',
    description:
      'After the steel road plates on Jalan Batu Uban were taken away there are three deep potholes. A motorbike skidded here yesterday.',
    location: 'Jalan Batu Uban, Batu Uban, 11700 Penang',
    coordinates: { lat: 5.3524, lng: 100.3068 },
    stationCode: 'S12',
    areaLabel: 'Gelugor',
    status: 'in-progress',
    priority: 'high',
    submittedAt: '2026-10-26T08:20:00+08:00',
    reporterId: null,
    reporter: { name: 'Siti Noraini', email: 'siti.noraini@example.com', phone: '017-205 9931' },
    attachments: [
      photo(
        'MLC-261026-0444-s1',
        'potholes-jalan-batu-uban.jpg',
        3_020_000,
        reportPhotos.roadPotholes,
      ),
      photo(
        'MLC-261026-0444-s2',
        'pothole-close-up.jpg',
        1_740_000,
        reportPhotos.roadPotholesClose,
      ),
    ],
    handler: NURUL,
    replies: [],
    reporterReplies: [],
    events: [
      {
        id: 'MLC-261026-0444-e1',
        at: '2026-10-27T09:10:00+08:00',
        by: NURUL.name,
        kind: 'claimed',
      },
    ],
    notes: [
      {
        id: 'MLC-261026-0444-n1',
        at: '2026-10-29T11:15:00+08:00',
        authorId: DANIEL.staffId,
        author: DANIEL.name,
        text: 'The steel plates were removed by the contractor on Jalan Batu Uban. I have asked them for a patching date.',
        mentions: [],
      },
    ],
  },
  {
    id: 'MLC-261025-0440',
    type: 'complaint',
    categoryId: 'drainage',
    subject: 'Drain blocked by site debris near SPICE',
    description:
      'The drain beside the SPICE worksite fence is full of sand and cement bags. After yesterday’s rain the water pooled across the whole lane.',
    location: 'Jalan Tun Dr Awang, Bayan Baru, 11900 Penang',
    coordinates: { lat: 5.3322, lng: 100.2958 },
    stationCode: 'S08',
    areaLabel: 'Bayan Baru',
    status: 'in-progress',
    priority: 'normal',
    submittedAt: '2026-10-25T07:55:00+08:00',
    reporterId: null,
    reporter: { name: 'Ahmad Faiz', email: 'ahmad.faiz@example.com', phone: '013-664 2078' },
    attachments: [
      photo('MLC-261025-0440-s1', 'blocked-drain-spice.jpg', 2_260_000, reportPhotos.blockedDrain),
    ],
    handler: DANIEL,
    replies: [
      reply(DANIEL, {
        id: 'MLC-261025-0440-r1',
        at: '2026-10-27T15:40:00+08:00',
        subject: 'The drain will be cleared on Thursday',
        body: 'Thanks for the report. The contractor will clear the drain and remove the bags on Thursday. We will send a photo when the drain is clear.',
        status: null,
      }),
      reply(DANIEL, {
        id: 'MLC-261025-0440-r2',
        at: '2026-10-29T14:05:00+08:00',
        subject: 'Photo of the cleared drain',
        body: 'The first section is now clear and water is flowing again. The crew returns tomorrow to finish the rest of the lane.',
        status: null,
        attachments: [
          photo('MLC-261025-0440-r2-f1', 'drain-cleared.jpg', 1_820_000, reportPhotos.clearedDrain),
        ],
      }),
    ],
    reporterReplies: [],
    events: [
      {
        id: 'MLC-261025-0440-e1',
        at: '2026-10-26T08:30:00+08:00',
        by: DANIEL.name,
        kind: 'claimed',
      },
    ],
    notes: [
      {
        id: 'MLC-261025-0440-n1',
        at: '2026-10-29T16:50:00+08:00',
        authorId: NURUL.staffId,
        author: NURUL.name,
        text: '@Daniel Lim please check with the crew that the second photo shows the whole lane before you send it.',
        mentions: [DANIEL.staffId],
      },
    ],
  },
  {
    id: 'MLC-261024-0417',
    type: 'complaint',
    categoryId: 'noise',
    subject: 'Night noise from the KOMTAR worksite',
    description:
      'Generators and a crane at the KOMTAR worksite run through the night. We live on the fourth floor across the road and can hear them in the bedroom.',
    location: 'Jalan Penang, George Town, 10000 Penang',
    coordinates: { lat: 5.4143, lng: 100.3301 },
    stationCode: 'S20',
    areaLabel: 'George Town',
    status: 'resolved',
    priority: 'normal',
    submittedAt: '2026-10-24T21:20:00+08:00',
    reporterId: 'user-meiling',
    reporter: MEILING,
    attachments: [],
    handler: NURUL,
    replies: [
      reply(NURUL, {
        id: 'MLC-261024-0417-r1',
        at: '2026-10-25T10:15:00+08:00',
        subject: 'We are checking the generator hours',
        body: 'Thank you for telling us. We have asked the KOMTAR site team why the generators run at night.',
        status: null,
      }),
      reply(NURUL, {
        id: 'MLC-261024-0417-r2',
        at: '2026-10-27T16:30:00+08:00',
        subject: 'Night generators switched off',
        body: 'The site team moved the generators behind a sound barrier and switched them off from 7 pm to 7 am. Please reply to this ticket if the noise comes back.',
        status: 'resolved',
      }),
    ],
    reporterReplies: [],
    events: [
      {
        id: 'MLC-261024-0417-e1',
        at: '2026-10-25T09:00:00+08:00',
        by: NURUL.name,
        kind: 'claimed',
      },
    ],
    notes: [],
  },
  {
    id: 'MLC-261022-0398',
    type: 'inquiry',
    categoryId: 'other',
    subject: 'Where can I see the station opening dates?',
    description:
      'I am planning to move house along the Mutiara Line. Is there a page that shows when each station is expected to open?',
    location: 'Jalan Macallum, George Town, 10300 Penang',
    coordinates: { lat: 5.4108, lng: 100.3358 },
    stationCode: 'S19',
    areaLabel: 'George Town',
    status: 'resolved',
    priority: 'normal',
    submittedAt: '2026-10-22T11:05:00+08:00',
    reporterId: null,
    reporter: { name: 'Wong Mei Yee', email: 'meiyee.wong@example.com', phone: '011-2087 6643' },
    attachments: [],
    handler: NURUL,
    replies: [
      reply(NURUL, {
        id: 'MLC-261022-0398-r1',
        at: '2026-10-22T14:20:00+08:00',
        subject: 'Opening dates are on the project pages',
        body: 'Each station page shows its build stages and the target opening. Open the station you are interested in from the Project section. Dates change when a stage finishes, so check back before you decide.',
        status: 'resolved',
      }),
    ],
    reporterReplies: [],
    events: [
      {
        id: 'MLC-261022-0398-e1',
        at: '2026-10-22T13:50:00+08:00',
        by: NURUL.name,
        kind: 'claimed',
      },
    ],
    notes: [],
  },
  {
    id: 'MLC-261019-0381',
    type: 'complaint',
    categoryId: 'property',
    subject: 'Cracks in our shophouse wall near the piling',
    description:
      'New cracks appeared in the side wall of our shophouse after the piling started next door. We would like someone to inspect before they get worse.',
    location: 'Jalan Bukit Jambul, Bayan Lepas, 11900 Penang',
    coordinates: { lat: 5.3379, lng: 100.2894 },
    stationCode: 'S09',
    areaLabel: 'Bayan Lepas',
    status: 'resolved',
    priority: 'normal',
    submittedAt: '2026-10-19T13:35:00+08:00',
    reporterId: null,
    reporter: { name: 'Kavitha Nair', email: 'kavitha.nair@example.com', phone: '014-322 5817' },
    attachments: [
      photo('MLC-261019-0381-s1', 'wall-cracks.jpg', 2_780_000, reportPhotos.wallCracks),
    ],
    handler: DANIEL,
    replies: [
      reply(DANIEL, {
        id: 'MLC-261019-0381-r1',
        at: '2026-10-20T10:00:00+08:00',
        subject: 'A surveyor will visit your shophouse',
        body: 'We take cracks seriously. An independent surveyor will visit on Wednesday between 10 am and 12 pm. Please make sure someone can let them in.',
        status: null,
      }),
      reply(DANIEL, {
        id: 'MLC-261019-0381-r2',
        at: '2026-10-23T17:10:00+08:00',
        subject: 'Survey report attached',
        body: 'The survey found the cracks are old settlement cracks, not caused by the piling. We will keep monitoring the wall during the works, and the attached report explains the readings.',
        status: 'resolved',
        attachments: [pdf('MLC-261019-0381-r2-f1', 'wall-survey-report.pdf', 1_120_000)],
      }),
    ],
    reporterReplies: [],
    events: [
      {
        id: 'MLC-261019-0381-e1',
        at: '2026-10-19T15:00:00+08:00',
        by: DANIEL.name,
        kind: 'claimed',
      },
    ],
    notes: [],
  },
];
