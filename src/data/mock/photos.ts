import type { Photo, PhotoSource } from '@/data/models/photo';

const photo = (name: string): PhotoSource => `/photos/${name}.jpg`;

/*
 * One shared set of stand-in site photos (AI-generated, see log.md) in public/photos, reused by
 * every record that shows the same kind of work. Replace a file there and every record follows.
 */
export const sitePhotos = {
  viaductPierCaps: {
    src: photo('viaduct-pier-caps'),
    alt: 'Concrete piers with pier caps in the middle of a main road',
  },
  viaductSpan: {
    src: photo('viaduct-span'),
    alt: 'A finished viaduct span between two piers above a city road',
  },
  launchingGantry: {
    src: photo('launching-gantry'),
    alt: 'The launching gantry on top of the viaduct, lifting a concrete segment',
  },
  boredPiling: {
    src: photo('bored-piling'),
    alt: 'A piling rig drilling foundations inside the site hoarding',
  },
  siteHoarding: {
    src: photo('site-hoarding'),
    alt: 'Site hoarding and traffic barriers along the edge of the road',
  },
  utilityTrench: {
    src: photo('utility-trench'),
    alt: 'New pipes and cable ducts laid in a trench beside the road',
  },
  concourseFormwork: {
    src: photo('concourse-formwork'),
    alt: 'Scaffolding and formwork holding up the station concourse slab',
  },
  platformBeamLift: {
    src: photo('platform-beam-lift'),
    alt: 'A crane lifting a precast platform beam onto the station piers at dusk',
  },
  trafficDiversion: {
    src: photo('traffic-diversion'),
    alt: 'Traffic using a new lane layout beside a pier worksite in George Town',
  },
  coveredWalkway: {
    src: photo('covered-walkway'),
    alt: 'A covered temporary footpath beside the site hoarding',
  },
} satisfies Record<string, Photo>;

/** The pictures on the demo tickets: what reporters and staff sent. */
export const reportPhotos = {
  temporaryBusStop: photo('temporary-bus-stop'),
  worksiteDust: photo('worksite-dust'),
  siteHoarding: photo('site-hoarding'),
  siteHoardingLorry: photo('site-hoarding-lorry'),
  roadPotholes: photo('road-potholes'),
  roadPotholesClose: photo('road-potholes-close'),
  blockedDrain: photo('blocked-drain'),
  clearedDrain: photo('cleared-drain'),
  wallCracks: photo('wall-cracks'),
};
