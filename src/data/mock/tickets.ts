import type { Ticket } from '@/data/models/ticket';

const AUTO = 'Automated reply';
const COUNCIL = 'Penang Island City Council';
const SITE_TEAM = 'Project developer site team';
const MRT_CORP = 'MRT Corp';

/*
 * MLC-261028-0482 is exactly Figma 1:1175. Tan Mei Ling's six tickets match Profile 92:2963
 * (1 pending, 1 in progress, 4 resolved). The three S20 tickets are the KOMTAR "Reports near this
 * station" list (95:3102). The others are invented so other station pages have reports too.
 */
export const tickets: Ticket[] = [
  // Tan Mei Ling (user-meiling)
  {
    id: 'MLC-261028-0482',
    type: 'complaint',
    categoryId: 'blocked-access',
    title: 'Driveway blocked by site hoarding',
    description:
      'Since Monday the new hoarding on Lebuh Kampung Jawa covers half of our shop driveway. Delivery lorries cannot turn in and customers park on the road instead.',
    location: 'Lebuh Kampung Jawa, Bayan Lepas',
    stationCode: 'S05',
    status: 'in-progress',
    submittedAt: '2026-10-28T14:41:00+08:00',
    updatedAt: '2026-10-29T10:12:00+08:00',
    reporterId: 'user-meiling',
    attachmentCount: 2,
    updates: [
      {
        id: '0482-1',
        at: '2026-10-28T14:41:00+08:00',
        status: 'submitted',
        author: AUTO,
        message: 'We received your report and emailed a confirmation to meiling.tan@example.com.',
      },
      {
        id: '0482-2',
        at: '2026-10-28T16:05:00+08:00',
        status: 'pending',
        author: COUNCIL,
        message: 'Your report was reviewed and assigned to the project developer’s site team.',
      },
      {
        id: '0482-3',
        at: '2026-10-29T10:12:00+08:00',
        status: 'in-progress',
        author: COUNCIL,
        message:
          'The site contractor has been told to move the hoarding back from your driveway. Work is scheduled within 3 working days and we will update this ticket once it is done.',
      },
    ],
    resolution: null,
  },
  {
    id: 'MLC-261027-0417',
    type: 'complaint',
    categoryId: 'dust',
    title: 'Dust from the worksite on Jalan Penang',
    description:
      'Every afternoon dust from the KOMTAR worksite blows across Jalan Penang into the shops. The water spray does not seem to be running.',
    location: 'Jalan Penang, George Town',
    stationCode: 'S20',
    status: 'pending',
    submittedAt: '2026-10-27T15:20:00+08:00',
    updatedAt: '2026-10-27T15:20:00+08:00',
    reporterId: 'user-meiling',
    attachmentCount: 1,
    updates: [
      {
        id: '0417-1',
        at: '2026-10-27T15:20:00+08:00',
        status: 'submitted',
        author: AUTO,
        message: 'We received your report and emailed a confirmation to meiling.tan@example.com.',
      },
      {
        id: '0417-2',
        at: '2026-10-27T15:21:00+08:00',
        status: 'pending',
        author: AUTO,
        message:
          'Your report is waiting for review by the city council. Most reports are reviewed within 2 working days.',
      },
    ],
    resolution: null,
  },
  {
    id: 'MLC-261015-0233',
    type: 'complaint',
    categoryId: 'drainage',
    title: 'Blocked drain at the bus terminal entrance',
    description:
      'The drain at the KOMTAR bus terminal entrance is full of sand from the worksite. After rain the water comes up over the pavement where people queue.',
    location: 'KOMTAR bus terminal, George Town',
    stationCode: 'S20',
    status: 'resolved',
    submittedAt: '2026-10-15T08:10:00+08:00',
    updatedAt: '2026-10-22T11:40:00+08:00',
    reporterId: 'user-meiling',
    attachmentCount: 2,
    updates: [
      {
        id: '0233-1',
        at: '2026-10-15T08:10:00+08:00',
        status: 'submitted',
        author: AUTO,
        message: 'We received your report and emailed a confirmation to meiling.tan@example.com.',
      },
      {
        id: '0233-2',
        at: '2026-10-15T13:45:00+08:00',
        status: 'pending',
        author: COUNCIL,
        message: 'Your report was reviewed and assigned to the project developer’s site team.',
      },
      {
        id: '0233-3',
        at: '2026-10-17T09:30:00+08:00',
        status: 'in-progress',
        author: SITE_TEAM,
        message:
          'We have inspected the drain. A cleaning crew is booked for 21 Oct, outside bus terminal peak hours.',
      },
      {
        id: '0233-4',
        at: '2026-10-22T11:40:00+08:00',
        status: 'resolved',
        author: COUNCIL,
        message:
          'The drain was cleared and a silt trap was added at the site gate. Thank you for reporting it.',
      },
    ],
    resolution:
      'The drain was cleared on 21 Oct and a silt trap was fitted at the site gate so sand cannot wash into it again.',
  },
  {
    id: 'MLC-260819-0127',
    type: 'complaint',
    categoryId: 'traffic',
    title: 'Detour sign missing near Jalan Universiti station',
    description:
      'The sign for the lane change on Jalan Sultan Azlan Shah, coming from Gelugor, has fallen over. Cars are braking late at the cones.',
    location: 'Jalan Sultan Azlan Shah, Gelugor',
    stationCode: 'S13',
    status: 'resolved',
    submittedAt: '2026-08-19T07:55:00+08:00',
    updatedAt: '2026-08-19T16:20:00+08:00',
    reporterId: 'user-meiling',
    attachmentCount: 1,
    updates: [
      {
        id: '0127-1',
        at: '2026-08-19T07:55:00+08:00',
        status: 'submitted',
        author: AUTO,
        message: 'We received your report and emailed a confirmation to meiling.tan@example.com.',
      },
      {
        id: '0127-2',
        at: '2026-08-19T08:40:00+08:00',
        status: 'pending',
        author: COUNCIL,
        message: 'Marked urgent and passed to the site team for a same-day fix.',
      },
      {
        id: '0127-3',
        at: '2026-08-19T10:05:00+08:00',
        status: 'in-progress',
        author: SITE_TEAM,
        message: 'A traffic crew is on the way to replace the sign.',
      },
      {
        id: '0127-4',
        at: '2026-08-19T16:20:00+08:00',
        status: 'resolved',
        author: SITE_TEAM,
        message:
          'The sign is back in place and weighted down. We added a second warning sign 100 m earlier.',
      },
    ],
    resolution:
      'The sign was replaced the same day, and a second warning sign now stands 100 m before the lane change.',
  },
  {
    id: 'MLC-260714-0088',
    type: 'suggestion',
    categoryId: 'other',
    title: 'Add a crossing point on the USM gate detour',
    description:
      'Students on the pedestrian detour at the USM main gate cross the road between the barriers. A marked crossing with a marshal at class times would help.',
    location: 'Jalan Universiti, Gelugor',
    stationCode: 'S13',
    status: 'resolved',
    submittedAt: '2026-07-14T12:30:00+08:00',
    updatedAt: '2026-07-24T10:00:00+08:00',
    reporterId: 'user-meiling',
    attachmentCount: 0,
    updates: [
      {
        id: '0088-1',
        at: '2026-07-14T12:30:00+08:00',
        status: 'submitted',
        author: AUTO,
        message: 'We received your report and emailed a confirmation to meiling.tan@example.com.',
      },
      {
        id: '0088-2',
        at: '2026-07-15T09:15:00+08:00',
        status: 'pending',
        author: MRT_CORP,
        message:
          'Thank you for the suggestion. We have shared it with the traffic management team.',
      },
      {
        id: '0088-3',
        at: '2026-07-17T14:00:00+08:00',
        status: 'in-progress',
        author: SITE_TEAM,
        message: 'A temporary crossing has been approved. Markings go down this weekend.',
      },
      {
        id: '0088-4',
        at: '2026-07-24T10:00:00+08:00',
        status: 'resolved',
        author: MRT_CORP,
        message:
          'The marked crossing is open, with a marshal on duty from 7.30 am to 9 am and 4 pm to 6 pm on weekdays.',
      },
    ],
    resolution:
      'A marked temporary crossing opened on 20 Jul with a marshal at peak class times. It stays until the detour ends.',
  },
  {
    id: 'MLC-260608-0041',
    type: 'hazard',
    categoryId: 'road-damage',
    title: 'Loose road plate on Jalan Gelugor',
    description:
      'A steel plate over the trench outside the Gelugor worksite moves and bangs when cars drive over it. A motorcyclist nearly fell this morning.',
    location: 'Jalan Gelugor, Gelugor',
    stationCode: 'S14',
    status: 'resolved',
    submittedAt: '2026-06-08T08:05:00+08:00',
    updatedAt: '2026-06-10T15:30:00+08:00',
    reporterId: 'user-meiling',
    attachmentCount: 1,
    updates: [
      {
        id: '0041-1',
        at: '2026-06-08T08:05:00+08:00',
        status: 'submitted',
        author: AUTO,
        message: 'We received your report and emailed a confirmation to meiling.tan@example.com.',
      },
      {
        id: '0041-2',
        at: '2026-06-08T08:30:00+08:00',
        status: 'pending',
        author: COUNCIL,
        message: 'Marked as a hazard and sent to the site team as urgent.',
      },
      {
        id: '0041-3',
        at: '2026-06-08T11:10:00+08:00',
        status: 'in-progress',
        author: SITE_TEAM,
        message: 'Warning signs and cones are in place. The plate will be fixed tonight.',
      },
      {
        id: '0041-4',
        at: '2026-06-10T15:30:00+08:00',
        status: 'resolved',
        author: SITE_TEAM,
        message: 'The plate is bolted down and the edges are ramped. We check it every morning.',
      },
    ],
    resolution:
      'The plate was bolted down with ramped edges on the night of 8 Jun and is checked daily.',
  },

  // Other members of the public
  {
    id: 'MLC-261028-0455',
    type: 'complaint',
    categoryId: 'blocked-access',
    title: 'Hoarding blocking a driveway on Jalan Penang',
    description:
      'The hoarding moved out overnight and now blocks the driveway to our building on Jalan Penang.',
    location: 'Jalan Penang, George Town',
    stationCode: 'S20',
    status: 'in-progress',
    submittedAt: '2026-10-28T09:05:00+08:00',
    updatedAt: '2026-10-28T15:30:00+08:00',
    reporterId: null,
    attachmentCount: 1,
    updates: [
      {
        id: '0455-1',
        at: '2026-10-28T09:05:00+08:00',
        status: 'submitted',
        author: AUTO,
        message: 'We received your report and emailed you a confirmation.',
      },
      {
        id: '0455-2',
        at: '2026-10-28T11:20:00+08:00',
        status: 'pending',
        author: COUNCIL,
        message: 'Your report was reviewed and assigned to the project developer’s site team.',
      },
      {
        id: '0455-3',
        at: '2026-10-28T15:30:00+08:00',
        status: 'in-progress',
        author: SITE_TEAM,
        message: 'We will move the hoarding panel back by tomorrow evening.',
      },
    ],
    resolution: null,
  },
  {
    id: 'MLC-261028-0471',
    type: 'complaint',
    categoryId: 'noise',
    title: 'Noise after 7 pm at the Bukit Jambul worksite',
    description: 'Drilling at the station site went on until about 9.30 pm last night.',
    location: 'Jalan Bukit Jambul, Bayan Lepas',
    stationCode: 'S09',
    status: 'pending',
    submittedAt: '2026-10-28T21:40:00+08:00',
    updatedAt: '2026-10-28T21:41:00+08:00',
    reporterId: null,
    attachmentCount: 0,
    updates: [
      {
        id: '0471-1',
        at: '2026-10-28T21:40:00+08:00',
        status: 'submitted',
        author: AUTO,
        message: 'We received your report and emailed you a confirmation.',
      },
      {
        id: '0471-2',
        at: '2026-10-28T21:41:00+08:00',
        status: 'pending',
        author: AUTO,
        message:
          'Your report is waiting for review by the city council. Most reports are reviewed within 2 working days.',
      },
    ],
    resolution: null,
  },
  {
    id: 'MLC-261027-0402',
    type: 'complaint',
    categoryId: 'noise',
    title: 'Road plates rattle at night near Jalan Universiti station',
    description: 'The new steel plates bang every time a lorry passes, all night.',
    location: 'Jalan Sultan Azlan Shah, Gelugor',
    stationCode: 'S13',
    status: 'in-progress',
    submittedAt: '2026-10-27T23:15:00+08:00',
    updatedAt: '2026-10-28T14:00:00+08:00',
    reporterId: null,
    attachmentCount: 0,
    updates: [
      {
        id: '0402-1',
        at: '2026-10-27T23:15:00+08:00',
        status: 'submitted',
        author: AUTO,
        message: 'We received your report and emailed you a confirmation.',
      },
      {
        id: '0402-2',
        at: '2026-10-28T09:10:00+08:00',
        status: 'pending',
        author: COUNCIL,
        message: 'Your report was reviewed and assigned to the project developer’s site team.',
      },
      {
        id: '0402-3',
        at: '2026-10-28T14:00:00+08:00',
        status: 'in-progress',
        author: SITE_TEAM,
        message: 'Rubber pads will be fitted under the plates tonight to stop the noise.',
      },
    ],
    resolution: null,
  },
  {
    id: 'MLC-261026-0391',
    type: 'complaint',
    categoryId: 'traffic',
    title: 'Slip road closure sign comes too late',
    description:
      'The sign for the closed FIZ Phase 3 slip road is right at the exit, so drivers swerve back onto the highway.',
    location: 'Lebuhraya Bayan Lepas, Bayan Lepas',
    stationCode: 'S06',
    status: 'pending',
    submittedAt: '2026-10-26T18:25:00+08:00',
    updatedAt: '2026-10-27T09:00:00+08:00',
    reporterId: null,
    attachmentCount: 0,
    updates: [
      {
        id: '0391-1',
        at: '2026-10-26T18:25:00+08:00',
        status: 'submitted',
        author: AUTO,
        message: 'We received your report and emailed you a confirmation.',
      },
      {
        id: '0391-2',
        at: '2026-10-27T09:00:00+08:00',
        status: 'pending',
        author: AUTO,
        message:
          'Your report is waiting for review by the city council. Most reports are reviewed within 2 working days.',
      },
    ],
    resolution: null,
  },
  {
    id: 'MLC-261009-0190',
    type: 'complaint',
    categoryId: 'traffic',
    title: 'Airport road sign covered by hoarding',
    description: 'The new hoarding hides the sign for the airport departure lane.',
    location: 'Jalan Lapangan Terbang, Bayan Lepas',
    stationCode: 'S03',
    status: 'resolved',
    submittedAt: '2026-10-09T06:50:00+08:00',
    updatedAt: '2026-10-13T12:00:00+08:00',
    reporterId: null,
    attachmentCount: 1,
    updates: [
      {
        id: '0190-1',
        at: '2026-10-09T06:50:00+08:00',
        status: 'submitted',
        author: AUTO,
        message: 'We received your report and emailed you a confirmation.',
      },
      {
        id: '0190-2',
        at: '2026-10-09T10:30:00+08:00',
        status: 'pending',
        author: COUNCIL,
        message: 'Your report was reviewed and assigned to the project developer’s site team.',
      },
      {
        id: '0190-3',
        at: '2026-10-10T09:00:00+08:00',
        status: 'in-progress',
        author: SITE_TEAM,
        message: 'A temporary sign will be put up in front of the hoarding.',
      },
      {
        id: '0190-4',
        at: '2026-10-13T12:00:00+08:00',
        status: 'resolved',
        author: SITE_TEAM,
        message: 'A temporary sign now stands 50 m before the hoarding.',
      },
    ],
    resolution: 'A temporary airport lane sign was put up 50 m before the hoarding on 12 Oct.',
  },
];
