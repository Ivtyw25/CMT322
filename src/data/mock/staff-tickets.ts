import type {
  AssigneeId,
  StaffTicket,
  StaffTicketEvent,
  StaffTicketStatus,
} from '@/data/models/staff-ticket';
import type { ReportCategoryId, ReportType, TicketId } from '@/data/models/ticket';
import { assignees } from './staff-ticket-options';

const AUTHORITY = 'Nurul Aisyah';

const assigneeLabel = (id: AssigneeId): string =>
  assignees.find((assignee) => assignee.id === id)?.label ?? id;

type TimelineSeed = {
  key: string;
  submittedAt: string;
  status: StaffTicketStatus;
  assigneeId: AssigneeId | null;
};

/** Submitted, automated reply, then the assignment and status steps the ticket has reached. */
function timelineFor({ key, submittedAt, status, assigneeId }: TimelineSeed): StaffTicketEvent[] {
  const start = Date.parse(submittedAt);
  const at = (minutes: number) => new Date(start + minutes * 60_000).toISOString();
  const events: StaffTicketEvent[] = [
    { id: `${key}-1`, at: submittedAt, text: 'Submitted by the reporter', kind: 'event' },
    {
      id: `${key}-2`,
      at: submittedAt,
      text: 'Automated reply sent with the ticket ID',
      kind: 'event',
    },
  ];
  if (assigneeId) {
    events.push({
      id: `${key}-3`,
      at: at(45),
      text: `Assigned to ${assigneeLabel(assigneeId)} by ${AUTHORITY}`,
      kind: 'event',
    });
  }
  if (status === 'in-progress') {
    events.push({
      id: `${key}-4`,
      at: at(60),
      text: 'Status changed to In progress',
      kind: 'event',
    });
  }
  if (status === 'resolved') {
    events.push({
      id: `${key}-5`,
      at: at(60 * 30),
      text: 'Status changed to Resolved',
      kind: 'event',
    });
  }
  return events;
}

type Seed = {
  id: TicketId;
  subject: string;
  type: ReportType;
  categoryId: ReportCategoryId;
  description: string;
  areaLabel: string;
  location: string;
  status: StaffTicketStatus;
  highPriority: boolean;
  assigneeId: AssigneeId | null;
  submittedAt: string;
};

function fromSeed(seed: Seed): StaffTicket {
  return {
    id: seed.id,
    subject: seed.subject,
    type: seed.type,
    categoryId: seed.categoryId,
    description: seed.description,
    areaLabel: seed.areaLabel,
    location: seed.location,
    coordinates: null,
    locationNote: null,
    status: seed.status,
    priority: seed.highPriority ? 'high' : 'normal',
    assigneeId: seed.assigneeId,
    submittedAt: seed.submittedAt,
    reporter: null,
    attachments: [],
    events: timelineFor({
      key: seed.id.slice(-4),
      submittedAt: seed.submittedAt,
      status: seed.status,
      assigneeId: seed.assigneeId,
    }),
    notes: [],
    draftReply: null,
  };
}

/*
 * The first nine tickets are the rows of Figma 115:4681, in that order. MLC-261028-0482 is the
 * ticket of Figma 115:5036 and matches the commuter ticket of the same ID. The others (below) fill
 * the queue to the Figma totals: 105 tickets, 18 pending, 23 in progress, 64 resolved.
 */
const figmaTickets: StaffTicket[] = [
  fromSeed({
    id: 'MLC-261029-0514',
    subject: 'Bus stop moved without notice',
    type: 'feedback',
    categoryId: 'traffic',
    description: 'The bus stop on Jalan Jelutong was moved last night and there was no notice.',
    areaLabel: 'Jelutong',
    location: 'Jalan Jelutong, Jelutong',
    status: 'pending',
    highPriority: false,
    assigneeId: null,
    submittedAt: '2026-10-29T09:48:00+08:00',
  }),
  fromSeed({
    id: 'MLC-261029-0511',
    subject: 'Dust from the worksite on Jalan Penang',
    type: 'complaint',
    categoryId: 'dust',
    description: 'Dust from the worksite on Jalan Penang is coming into our shop every morning.',
    areaLabel: 'George Town',
    location: 'Jalan Penang, George Town',
    status: 'pending',
    highPriority: false,
    assigneeId: null,
    submittedAt: '2026-10-29T09:14:00+08:00',
  }),
  {
    id: 'MLC-261028-0482',
    subject: 'Hoarding blocking a driveway',
    type: 'complaint',
    categoryId: 'blocked-access',
    description:
      'Since Monday the new hoarding on Lebuh Kampung Jawa covers half of our shop driveway. Delivery lorries cannot turn in and customers park on the road instead.',
    areaLabel: 'Bayan Lepas',
    location: 'Lebuh Kampung Jawa, Bayan Lepas',
    coordinates: { lat: 5.2945, lng: 100.265 },
    locationNote: 'Near the S05 FIZ South worksite',
    status: 'in-progress',
    priority: 'high',
    assigneeId: 'mrt-corp',
    submittedAt: '2026-10-28T14:41:00+08:00',
    reporter: { name: 'Tan Mei Ling', email: 'meiling.tan@example.com', phone: '012-345 6789' },
    attachments: [
      { id: 'a1', fileName: 'driveway-front.jpg', sizeBytes: 2.1 * 1024 * 1024 },
      { id: 'a2', fileName: 'hoarding-close-up.jpg', sizeBytes: 1.6 * 1024 * 1024 },
    ],
    events: [
      {
        id: '0482-1',
        at: '2026-10-28T14:41:00+08:00',
        text: 'Submitted by the reporter',
        kind: 'event',
      },
      {
        id: '0482-2',
        at: '2026-10-28T14:41:00+08:00',
        text: 'Automated reply sent with the ticket ID',
        kind: 'event',
      },
      {
        id: '0482-3',
        at: '2026-10-28T16:05:00+08:00',
        text: 'Assigned to MRT Corp project team by Nurul Aisyah',
        kind: 'event',
      },
      {
        id: '0482-4',
        at: '2026-10-29T10:12:00+08:00',
        text: 'Status changed to In progress. Reply sent: “The site contractor has been told to move the hoarding back from your driveway.”',
        kind: 'event',
      },
      {
        id: '0482-5',
        at: '2026-10-29T10:40:00+08:00',
        text: 'Site note from Daniel Lim (project team): hoarding will be moved 1.5 m back on 31 Oct.',
        kind: 'site-note',
      },
    ],
    notes: [],
    draftReply: {
      templateId: 'action-scheduled',
      text: 'Hello, the site contractor will move the hoarding 1.5 m back from your driveway on Saturday 31 October. We will update this ticket once the work is done.',
    },
  },
  fromSeed({
    id: 'MLC-261028-0479',
    subject: 'Night works noisy after 11 pm',
    type: 'complaint',
    categoryId: 'noise',
    description: 'Works next to our street carry on after 11 pm and the noise keeps us awake.',
    areaLabel: 'Bayan Lepas',
    location: 'Jalan Bayan Lepas, Bayan Lepas',
    status: 'pending',
    highPriority: false,
    assigneeId: null,
    submittedAt: '2026-10-28T23:52:00+08:00',
  }),
  fromSeed({
    id: 'MLC-261027-0466',
    subject: 'Detour sign facing the wrong way',
    type: 'feedback',
    categoryId: 'traffic',
    description: 'The detour sign at the junction faces the wrong way, so drivers miss the turn.',
    areaLabel: 'George Town',
    location: 'Jalan Magazine, George Town',
    status: 'in-progress',
    highPriority: true,
    assigneeId: 'traffic-contractor',
    submittedAt: '2026-10-27T16:30:00+08:00',
  }),
  fromSeed({
    id: 'MLC-261026-0444',
    subject: 'Lorry parked on the footpath at night',
    type: 'complaint',
    categoryId: 'safety',
    description:
      'A site lorry is parked on the footpath every night, so people must walk on the road.',
    areaLabel: 'Gelugor',
    location: 'Jalan Gelugor, Gelugor',
    status: 'pending',
    highPriority: false,
    assigneeId: null,
    submittedAt: '2026-10-26T22:05:00+08:00',
  }),
  fromSeed({
    id: 'MLC-261026-0440',
    subject: 'Pothole beside the lane closure',
    type: 'complaint',
    categoryId: 'road-damage',
    description: 'There is a deep pothole right beside the lane closure and it damages tyres.',
    areaLabel: 'Bayan Lepas',
    location: 'Jalan Tun Dr Awang, Bayan Lepas',
    status: 'in-progress',
    highPriority: true,
    assigneeId: 'council-road-works',
    submittedAt: '2026-10-26T08:20:00+08:00',
  }),
  fromSeed({
    id: 'MLC-261024-0420',
    subject: 'Request for a property condition survey',
    type: 'inquiry',
    categoryId: 'property',
    description: 'Our house is close to the works. Can we ask for a survey of its condition?',
    areaLabel: 'Sungai Nibong',
    location: 'Jalan Sungai Nibong, Sungai Nibong',
    status: 'pending',
    highPriority: false,
    assigneeId: null,
    submittedAt: '2026-10-24T11:02:00+08:00',
  }),
  fromSeed({
    id: 'MLC-261020-0398',
    subject: 'Blocked drain at the bus terminal entrance',
    type: 'complaint',
    categoryId: 'drainage',
    description:
      'The drain at the bus terminal entrance is blocked and the road floods when it rains.',
    areaLabel: 'George Town',
    location: 'KOMTAR bus terminal, George Town',
    status: 'resolved',
    highPriority: false,
    assigneeId: 'council-drainage',
    submittedAt: '2026-10-20T07:45:00+08:00',
  }),
];

type Topic = Pick<
  Seed,
  'subject' | 'type' | 'categoryId' | 'description' | 'areaLabel' | 'location'
>;

const topics: Topic[] = [
  {
    subject: 'Noise after 7 pm at the worksite',
    type: 'complaint',
    categoryId: 'noise',
    description: 'Works continue after 7 pm and the noise carries into nearby homes.',
    areaLabel: 'Sungai Nibong',
    location: 'Jalan Bukit Jambul, Sungai Nibong',
  },
  {
    subject: 'Slip road closure sign comes too late',
    type: 'complaint',
    categoryId: 'traffic',
    description:
      'The closure sign appears after the last turn-off, so drivers cannot avoid the slip road.',
    areaLabel: 'Bayan Lepas',
    location: 'Slip road, Bayan Lepas',
  },
  {
    subject: 'Loose road plate on the main road',
    type: 'complaint',
    categoryId: 'road-damage',
    description: 'A steel road plate has come loose and rattles when vehicles drive over it.',
    areaLabel: 'Gelugor',
    location: 'Jalan Gelugor, Gelugor',
  },
  {
    subject: 'Add a crossing point on the detour',
    type: 'feedback',
    categoryId: 'other',
    description: 'Please add a safe crossing point on the detour for people walking to school.',
    areaLabel: 'Gelugor',
    location: 'Jalan Universiti, Gelugor',
  },
  {
    subject: 'Mud on the road outside the worksite',
    type: 'complaint',
    categoryId: 'dust',
    description: 'Lorries leave mud on the road after rain and it is slippery for motorcycles.',
    areaLabel: 'Butterworth',
    location: 'Jalan Bagan Luar, Butterworth',
  },
  {
    subject: 'Question about the compensation process',
    type: 'inquiry',
    categoryId: 'property',
    description: 'Who do we ask about compensation for the loss of parking in front of our shop?',
    areaLabel: 'George Town',
    location: 'Lebuh Chulia, George Town',
  },
  {
    subject: 'Footpath closed with no signed detour',
    type: 'complaint',
    categoryId: 'safety',
    description: 'The footpath is closed and there is no sign that shows people another way.',
    areaLabel: 'Jelutong',
    location: 'Jalan Jelutong, Jelutong',
  },
  {
    subject: 'Airport road sign covered by hoarding',
    type: 'complaint',
    categoryId: 'traffic',
    description: 'A new hoarding covers the road sign, so drivers cannot read the direction.',
    areaLabel: 'Bayan Lepas',
    location: 'Jalan Tun Dr Awang, Bayan Lepas',
  },
];

/** The entry at `index`, wrapping around the list. Lists here are never empty. */
function pick<T>(list: readonly T[], index: number): T {
  const entry = list[index % list.length];
  if (entry === undefined) throw new Error('Cannot pick from an empty list.');
  return entry;
}

const FILLER_COUNTS = { pending: 13, inProgress: 20, resolved: 63 } as const;
const FILLER_TOTAL = FILLER_COUNTS.pending + FILLER_COUNTS.inProgress + FILLER_COUNTS.resolved;

const fillerStatuses: StaffTicketStatus[] = [
  ...Array.from({ length: FILLER_COUNTS.pending }, (): StaffTicketStatus => 'pending'),
  ...Array.from({ length: FILLER_COUNTS.inProgress }, (): StaffTicketStatus => 'in-progress'),
  ...Array.from({ length: FILLER_COUNTS.resolved }, (): StaffTicketStatus => 'resolved'),
];

const MALAYSIA_OFFSET_MS = 8 * 3_600_000;
const FILLER_START = Date.parse('2026-10-19T17:30:00+08:00');
const FILLER_STEP_MS = 7 * 3_600_000;

/** Older tickets, newest first, so the Figma rows stay on the first page. */
const fillerTickets: StaffTicket[] = Array.from({ length: FILLER_TOTAL }, (_, index) => {
  const topic = pick(topics, index);
  // 37 and 96 share no factor, so this visits every status once, spread through the list.
  const status = pick(fillerStatuses, index * 37);
  const submitted = new Date(FILLER_START - index * FILLER_STEP_MS);
  const day = new Date(submitted.getTime() + MALAYSIA_OFFSET_MS)
    .toISOString()
    .slice(2, 10)
    .replaceAll('-', '');
  const assigneeId: AssigneeId | null = status === 'pending' ? null : pick(assignees, index).id;
  return fromSeed({
    ...topic,
    id: `MLC-${day}-${String(397 - index).padStart(4, '0')}`,
    status,
    highPriority: status !== 'resolved' && index % 6 === 0,
    assigneeId,
    submittedAt: submitted.toISOString(),
  });
});

export const staffTickets: StaffTicket[] = [...figmaTickets, ...fillerTickets];
