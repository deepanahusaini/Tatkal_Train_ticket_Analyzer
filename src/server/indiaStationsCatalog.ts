import type {
  ClassAvailability,
  DataProvenance,
  RouteTrainMatch,
  Station,
  TrainCategory,
  TravelClass,
} from '../types/railway.ts';

/**
 * Pan-India directory of 95+ major Indian Railways stations & cities across all zones.
 * Real station codes, names, cities, zones, and geographic coordinates.
 */
export const INDIA_PASSENGER_STATIONS: Station[] = [
  // Delhi NCR
  { code: 'NDLS', name: 'New Delhi', city: 'Delhi', zone: 'NR', lat: 28.6429, lng: 77.2191, nearbyHubs: ['NZM', 'ANVT', 'DLI'] },
  { code: 'NZM', name: 'Hazrat Nizamuddin', city: 'Delhi', zone: 'NR', lat: 28.5879, lng: 77.2512, nearbyHubs: ['NDLS', 'ANVT'] },
  { code: 'ANVT', name: 'Anand Vihar Terminal', city: 'Delhi', zone: 'NR', lat: 28.6469, lng: 77.316, nearbyHubs: ['NDLS', 'NZM'] },
  { code: 'DLI', name: 'Old Delhi Junction', city: 'Delhi', zone: 'NR', lat: 28.6619, lng: 77.2274, nearbyHubs: ['NDLS', 'ANVT'] },
  { code: 'GZB', name: 'Ghaziabad Junction', city: 'Ghaziabad', zone: 'NR', lat: 28.6512, lng: 77.4314, nearbyHubs: ['ANVT', 'NDLS'] },

  // Mumbai Metropolitan & Maharashtra
  { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai', zone: 'WR', lat: 18.9696, lng: 72.8193, nearbyHubs: ['BDTS', 'CSMT', 'LTT'] },
  { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai', zone: 'CR', lat: 18.9401, lng: 72.8355, nearbyHubs: ['LTT', 'MMCT', 'BDTS'] },
  { code: 'BDTS', name: 'Bandra Terminus', city: 'Mumbai', zone: 'WR', lat: 19.0625, lng: 72.8407, nearbyHubs: ['MMCT', 'LTT'] },
  { code: 'LTT', name: 'Lokmanya Tilak Terminus', city: 'Mumbai', zone: 'CR', lat: 19.0701, lng: 72.8913, nearbyHubs: ['CSMT', 'BDTS'] },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune', zone: 'CR', lat: 18.5289, lng: 73.8744, nearbyHubs: ['CSMT'] },
  { code: 'NGP', name: 'Nagpur Junction', city: 'Nagpur', zone: 'CR', lat: 21.1525, lng: 79.0888, nearbyHubs: [] },
  { code: 'NK', name: 'Nashik Road', city: 'Nashik', zone: 'CR', lat: 19.9482, lng: 73.8427, nearbyHubs: ['LTT', 'PUNE'] },
  { code: 'AWB', name: 'Aurangabad', city: 'Aurangabad', zone: 'SCR', lat: 19.8602, lng: 75.3112, nearbyHubs: ['PUNE'] },
  { code: 'SUR', name: 'Solapur Junction', city: 'Solapur', zone: 'CR', lat: 17.6656, lng: 75.8942, nearbyHubs: ['PUNE'] },
  { code: 'KOP', name: 'Kolhapur SCSMT', city: 'Kolhapur', zone: 'CR', lat: 16.7028, lng: 74.2383, nearbyHubs: ['PUNE'] },

  // Uttar Pradesh & Uttarakhand
  { code: 'LKO', name: 'Lucknow Charbagh NR', city: 'Lucknow', zone: 'NR', lat: 26.8318, lng: 80.9191, nearbyHubs: ['CNB'] },
  { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', zone: 'NCR', lat: 26.4539, lng: 80.3511, nearbyHubs: ['LKO'] },
  { code: 'PRYJ', name: 'Prayagraj Junction', city: 'Prayagraj', zone: 'NCR', lat: 25.4461, lng: 81.8303, nearbyHubs: ['CNB', 'BSB'] },
  { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi', zone: 'NR', lat: 25.3267, lng: 82.9866, nearbyHubs: ['DDU', 'PRYJ'] },
  { code: 'GKP', name: 'Gorakhpur Junction', city: 'Gorakhpur', zone: 'NER', lat: 26.7596, lng: 83.3818, nearbyHubs: ['LKO', 'BSB'] },
  { code: 'AGC', name: 'Agra Cantt', city: 'Agra', zone: 'NCR', lat: 27.1578, lng: 77.9896, nearbyHubs: ['MTJ', 'NDLS'] },
  { code: 'VGLJ', name: 'Virangana Lakshmibai Jhansi', city: 'Jhansi', zone: 'NCR', lat: 25.4414, lng: 78.5542, nearbyHubs: ['GWL', 'BPL'] },
  { code: 'MTJ', name: 'Mathura Junction', city: 'Mathura', zone: 'NCR', lat: 27.4766, lng: 77.6731, nearbyHubs: ['AGC', 'NDLS'] },
  { code: 'BE', name: 'Bareilly Junction', city: 'Bareilly', zone: 'NR', lat: 28.3435, lng: 79.4106, nearbyHubs: ['MB', 'LKO'] },
  { code: 'MB', name: 'Moradabad Junction', city: 'Moradabad', zone: 'NR', lat: 28.8286, lng: 78.7695, nearbyHubs: ['BE', 'NDLS'] },
  { code: 'MTC', name: 'Meerut City Junction', city: 'Meerut', zone: 'NR', lat: 28.9724, lng: 77.6768, nearbyHubs: ['GZB', 'NDLS'] },
  { code: 'AYC', name: 'Ayodhya Cantt', city: 'Ayodhya', zone: 'NR', lat: 26.7749, lng: 82.1422, nearbyHubs: ['LKO', 'BSB'] },
  { code: 'DDN', name: 'Dehradun Terminal', city: 'Dehradun', zone: 'NR', lat: 30.3143, lng: 78.0329, nearbyHubs: ['HW'] },
  { code: 'HW', name: 'Haridwar Junction', city: 'Haridwar', zone: 'NR', lat: 29.9479, lng: 78.1558, nearbyHubs: ['DDN', 'RK'] },
  { code: 'RK', name: 'Roorkee', city: 'Roorkee', zone: 'NR', lat: 29.8599, lng: 77.8726, nearbyHubs: ['HW', 'SRE'] },
  { code: 'SRE', name: 'Saharanpur Junction', city: 'Saharanpur', zone: 'NR', lat: 29.9633, lng: 77.5416, nearbyHubs: ['UMB', 'HW'] },
  { code: 'KGM', name: 'Kathgodam (Nainital)', city: 'Nainital', zone: 'NER', lat: 29.2606, lng: 79.5469, nearbyHubs: ['BE'] },

  // Punjab, Haryana, Himachal & Jammu-Kashmir
  { code: 'CDG', name: 'Chandigarh Junction', city: 'Chandigarh', zone: 'NR', lat: 30.7016, lng: 76.8213, nearbyHubs: ['UMB', 'KLK'] },
  { code: 'ASR', name: 'Amritsar Junction', city: 'Amritsar', zone: 'NR', lat: 31.6331, lng: 74.867, nearbyHubs: ['JUC', 'LDH'] },
  { code: 'LDH', name: 'Ludhiana Junction', city: 'Ludhiana', zone: 'NR', lat: 30.9126, lng: 75.8479, nearbyHubs: ['JUC', 'UMB'] },
  { code: 'JUC', name: 'Jalandhar City', city: 'Jalandhar', zone: 'NR', lat: 31.3316, lng: 75.5917, nearbyHubs: ['ASR', 'LDH'] },
  { code: 'UMB', name: 'Ambala Cantt Junction', city: 'Ambala', zone: 'NR', lat: 30.3372, lng: 76.8295, nearbyHubs: ['CDG', 'SRE'] },
  { code: 'KLK', name: 'Kalka (Shimla Gateway)', city: 'Shimla', zone: 'NR', lat: 30.8364, lng: 76.9329, nearbyHubs: ['CDG'] },
  { code: 'JAT', name: 'Jammu Tawi', city: 'Jammu', zone: 'NR', lat: 32.7061, lng: 74.8808, nearbyHubs: ['SVDK'] },
  { code: 'SVDK', name: 'Shri Mata Vaishno Devi Katra', city: 'Katra', zone: 'NR', lat: 32.9896, lng: 74.9317, nearbyHubs: ['JAT'] },

  // West Bengal, Bihar, Jharkhand & Odisha
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', zone: 'ER', lat: 22.5839, lng: 88.3426, nearbyHubs: ['SDAH', 'KOAA'] },
  { code: 'SDAH', name: 'Sealdah', city: 'Kolkata', zone: 'ER', lat: 22.5675, lng: 88.3702, nearbyHubs: ['HWH'] },
  { code: 'NJP', name: 'New Jalpaiguri (Siliguri)', city: 'Siliguri', zone: 'NFR', lat: 26.6852, lng: 88.4426, nearbyHubs: ['GHY'] },
  { code: 'ASN', name: 'Asansol Junction', city: 'Asansol', zone: 'ER', lat: 23.6911, lng: 86.9746, nearbyHubs: ['DHN', 'HWH'] },
  { code: 'PNBE', name: 'Patna Junction', city: 'Patna', zone: 'ECR', lat: 25.6036, lng: 85.1376, nearbyHubs: ['GAYA', 'MFP'] },
  { code: 'GAYA', name: 'Gaya Junction', city: 'Gaya', zone: 'ECR', lat: 24.8034, lng: 84.9999, nearbyHubs: ['PNBE', 'DDU'] },
  { code: 'MFP', name: 'Muzaffarpur Junction', city: 'Muzaffarpur', zone: 'ECR', lat: 26.1197, lng: 85.3792, nearbyHubs: ['PNBE'] },
  { code: 'BGP', name: 'Bhagalpur Junction', city: 'Bhagalpur', zone: 'ER', lat: 25.2425, lng: 86.9718, nearbyHubs: ['PNBE'] },
  { code: 'DHN', name: 'Dhanbad Junction', city: 'Dhanbad', zone: 'ECR', lat: 23.7905, lng: 86.4298, nearbyHubs: ['ASN', 'RNC'] },
  { code: 'RNC', name: 'Ranchi Junction', city: 'Ranchi', zone: 'SER', lat: 23.3502, lng: 85.3347, nearbyHubs: ['TATA', 'DHN'] },
  { code: 'TATA', name: 'Tatanagar Junction (Jamshedpur)', city: 'Jamshedpur', zone: 'SER', lat: 22.7689, lng: 86.1972, nearbyHubs: ['RNC', 'HWH'] },
  { code: 'BBS', name: 'Bhubaneswar', city: 'Bhubaneswar', zone: 'ECoR', lat: 20.2666, lng: 85.8436, nearbyHubs: ['PURI', 'CTC'] },
  { code: 'PURI', name: 'Puri Terminal', city: 'Puri', zone: 'ECoR', lat: 19.8168, lng: 85.8398, nearbyHubs: ['BBS'] },
  { code: 'CTC', name: 'Cuttack Junction', city: 'Cuttack', zone: 'ECoR', lat: 20.4649, lng: 85.8994, nearbyHubs: ['BBS'] },

  // Northeast India
  { code: 'GHY', name: 'Guwahati', city: 'Guwahati', zone: 'NFR', lat: 26.1823, lng: 91.7508, nearbyHubs: ['DBRG', 'NJP'] },
  { code: 'DBRG', name: 'Dibrugarh', city: 'Dibrugarh', zone: 'NFR', lat: 27.4728, lng: 94.912, nearbyHubs: ['GHY'] },
  { code: 'AGTL', name: 'Agartala', city: 'Agartala', zone: 'NFR', lat: 23.7984, lng: 91.2817, nearbyHubs: ['GHY'] },

  // Gujarat & Rajasthan
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', zone: 'WR', lat: 23.0268, lng: 72.6012, nearbyHubs: ['BRC', 'RJT'] },
  { code: 'BRC', name: 'Vadodara Junction', city: 'Vadodara', zone: 'WR', lat: 22.3108, lng: 73.1811, nearbyHubs: ['ADI', 'ST'] },
  { code: 'ST', name: 'Surat', city: 'Surat', zone: 'WR', lat: 21.2049, lng: 72.8411, nearbyHubs: ['BRC', 'MMCT'] },
  { code: 'RJT', name: 'Rajkot Junction', city: 'Rajkot', zone: 'WR', lat: 22.3132, lng: 70.8022, nearbyHubs: ['ADI'] },
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', zone: 'NWR', lat: 26.9196, lng: 75.7878, nearbyHubs: ['AII', 'KOTA'] },
  { code: 'JU', name: 'Jodhpur Junction', city: 'Jodhpur', zone: 'NWR', lat: 26.2838, lng: 73.0225, nearbyHubs: ['JP', 'AII'] },
  { code: 'UDZ', name: 'Udaipur City', city: 'Udaipur', zone: 'NWR', lat: 24.5715, lng: 73.7003, nearbyHubs: ['AII', 'ADI'] },
  { code: 'AII', name: 'Ajmer Junction', city: 'Ajmer', zone: 'NWR', lat: 26.4564, lng: 74.6377, nearbyHubs: ['JP'] },
  { code: 'KOTA', name: 'Kota Junction', city: 'Kota', zone: 'WCR', lat: 25.2237, lng: 75.8819, nearbyHubs: ['JP', 'RTM'] },
  { code: 'BKN', name: 'Bikaner Junction', city: 'Bikaner', zone: 'NWR', lat: 28.0195, lng: 73.3119, nearbyHubs: ['JU', 'JP'] },

  // Madhya Pradesh & Chhattisgarh
  { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', zone: 'WCR', lat: 23.2677, lng: 77.413, nearbyHubs: ['INDB', 'JBP'] },
  { code: 'INDB', name: 'Indore Junction', city: 'Indore', zone: 'WR', lat: 22.7179, lng: 75.8686, nearbyHubs: ['UJN', 'BPL'] },
  { code: 'UJN', name: 'Ujjain Junction', city: 'Ujjain', zone: 'WR', lat: 23.1793, lng: 75.7819, nearbyHubs: ['INDB', 'RTM'] },
  { code: 'RTM', name: 'Ratlam Junction', city: 'Ratlam', zone: 'WR', lat: 23.3315, lng: 75.0367, nearbyHubs: ['UJN', 'BRC'] },
  { code: 'GWL', name: 'Gwalior Junction', city: 'Gwalior', zone: 'NCR', lat: 26.2156, lng: 78.1818, nearbyHubs: ['AGC', 'VGLJ'] },
  { code: 'JBP', name: 'Jabalpur Junction', city: 'Jabalpur', zone: 'WCR', lat: 23.1656, lng: 79.951, nearbyHubs: ['BPL', 'NGP'] },
  { code: 'R', name: 'Raipur Junction', city: 'Raipur', zone: 'SECR', lat: 21.2568, lng: 81.6296, nearbyHubs: ['BSP', 'NGP'] },
  { code: 'BSP', name: 'Bilaspur Junction', city: 'Bilaspur', zone: 'SECR', lat: 22.0574, lng: 82.1642, nearbyHubs: ['R'] },

  // South India & Goa
  { code: 'MAS', name: 'MGR Chennai Central', city: 'Chennai', zone: 'SR', lat: 13.0827, lng: 80.2757, nearbyHubs: ['KPD'] },
  { code: 'SBC', name: 'KSR Bengaluru', city: 'Bengaluru', zone: 'SWR', lat: 12.9781, lng: 77.5715, nearbyHubs: ['SMVB', 'MYS'] },
  { code: 'SMVB', name: 'SMVT Bengaluru', city: 'Bengaluru', zone: 'SWR', lat: 13.0054, lng: 77.6489, nearbyHubs: ['SBC'] },
  { code: 'MYS', name: 'Mysuru Junction', city: 'Mysuru', zone: 'SWR', lat: 12.3168, lng: 76.6448, nearbyHubs: ['SBC'] },
  { code: 'MAQ', name: 'Mangaluru Central', city: 'Mangaluru', zone: 'SR', lat: 12.8624, lng: 74.8427, nearbyHubs: ['MAO'] },
  { code: 'UBL', name: 'Hubballi Junction', city: 'Hubballi', zone: 'SWR', lat: 15.3458, lng: 75.1449, nearbyHubs: ['MAO', 'SBC'] },
  { code: 'SC', name: 'Secunderabad Junction', city: 'Hyderabad', zone: 'SCR', lat: 17.4344, lng: 78.5013, nearbyHubs: ['BZA'] },
  { code: 'VSKP', name: 'Visakhapatnam Junction', city: 'Visakhapatnam', zone: 'ECoR', lat: 17.7222, lng: 83.2896, nearbyHubs: ['BZA', 'BBS'] },
  { code: 'BZA', name: 'Vijayawada Junction', city: 'Vijayawada', zone: 'SCR', lat: 16.5186, lng: 80.6199, nearbyHubs: ['SC', 'VSKP'] },
  { code: 'TPTY', name: 'Tirupati', city: 'Tirupati', zone: 'SCR', lat: 13.6288, lng: 79.4192, nearbyHubs: ['KPD', 'MAS'] },
  { code: 'KPD', name: 'Katpadi Junction', city: 'Vellore', zone: 'SR', lat: 12.9718, lng: 79.1381, nearbyHubs: ['MAS', 'SBC'] },
  { code: 'CBE', name: 'Coimbatore Junction', city: 'Coimbatore', zone: 'SR', lat: 10.9968, lng: 76.9665, nearbyHubs: ['ERS', 'MAS'] },
  { code: 'MDU', name: 'Madurai Junction', city: 'Madurai', zone: 'SR', lat: 9.9195, lng: 78.1101, nearbyHubs: ['TPJ', 'TVC'] },
  { code: 'TPJ', name: 'Tiruchchirappalli Junction', city: 'Trichy', zone: 'SR', lat: 10.7905, lng: 78.6869, nearbyHubs: ['MDU', 'MAS'] },
  { code: 'ERS', name: 'Ernakulam Junction (Kochi)', city: 'Kochi', zone: 'SR', lat: 9.9699, lng: 76.2904, nearbyHubs: ['TVC', 'CLT'] },
  { code: 'TVC', name: 'Thiruvananthapuram Central', city: 'Thiruvananthapuram', zone: 'SR', lat: 8.4875, lng: 76.9525, nearbyHubs: ['ERS'] },
  { code: 'CLT', name: 'Kozhikode (Calicut)', city: 'Kozhikode', zone: 'SR', lat: 11.2471, lng: 75.7804, nearbyHubs: ['ERS', 'MAQ'] },
  { code: 'MAO', name: 'Madgaon Junction (Goa)', city: 'Goa', zone: 'KR', lat: 15.2689, lng: 73.9693, nearbyHubs: ['CSMT', 'PUNE', 'MAQ'] },
];

export const INDIA_PLACE_ALIASES: Record<string, string> = {
  bangalore: 'bengaluru',
  blr: 'bengaluru',
  bombay: 'mumbai',
  bom: 'mumbai',
  calcutta: 'kolkata',
  ccu: 'kolkata',
  madras: 'chennai',
  maa: 'chennai',
  allahabad: 'prayagraj',
  ald: 'prayagraj',
  banaras: 'varanasi',
  benaras: 'varanasi',
  kashi: 'varanasi',
  baroda: 'vadodara',
  poona: 'pune',
  secunderabad: 'hyderabad',
  hyd: 'hyderabad',
  nizamuddin: 'delhi',
  ncr: 'delhi',
  howrah: 'kolkata',
  sealdah: 'kolkata',
  csmt: 'mumbai',
  vt: 'mumbai',
  charbagh: 'lucknow',
  ljn: 'lucknow',
  'lucknow junction': 'lucknow',
  'lucknow nr': 'lucknow',
  trivandrum: 'thiruvananthapuram',
  cochin: 'kochi',
  ernakulam: 'kochi',
  calicut: 'kozhikode',
  vizag: 'visakhapatnam',
  waltair: 'visakhapatnam',
  mysore: 'mysuru',
  mangalore: 'mangaluru',
  hubli: 'hubballi',
  panjim: 'goa',
  panaji: 'goa',
  madgaon: 'goa',
  margao: 'goa',
  jamshedpur: 'jamshedpur',
  tatanagar: 'jamshedpur',
  nainital: 'nainital',
  kathgodam: 'nainital',
  shimla: 'shimla',
  kalka: 'shimla',
  vaishno: 'katra',
  'vaishno devi': 'katra',
  jhansi: 'jhansi',
  jhs: 'jhansi',
  trichy: 'trichy',
  tiruchirappalli: 'trichy',
  siliguri: 'siliguri',
  darjeeling: 'siliguri',
  mughalsarai: 'varanasi',
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function deterministicHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function formatHHMM(totalMinutes: number): string {
  const mins = ((totalMinutes % 1440) + 1440) % 1440;
  const hh = String(Math.floor(mins / 60)).padStart(2, '0');
  const mm = String(mins % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * Deterministically generates realistic Demo Mode Indian Railways corridor services
 * for ANY valid pan-India boarding -> destination station pair that isn't already covered
 * by the live-WebSocket-monitored trunk trains. Always tagged DEMO_SIMULATED.
 */
export function buildPanIndiaDemoCorridorMatches(
  boardingStation: Station,
  destinationStation: Station,
  dayFilter: string,
  existingTrainNumbers: Set<string>,
  provenance: DataProvenance
): RouteTrainMatch[] {
  if (boardingStation.code === destinationStation.code) return [];
  if (boardingStation.city.toLowerCase() === destinationStation.city.toLowerCase()) return [];

  const airKm = haversineKm(
    boardingStation.lat,
    boardingStation.lng,
    destinationStation.lat,
    destinationStation.lng
  );
  const railDistanceKm = Math.max(45, Math.round(airKm * 1.19));
  const seed = deterministicHash(`${boardingStation.code}->${destinationStation.code}`);

  // Determine how many trains realistically serve a pair of this distance
  const targetCount = railDistanceKm < 450 ? 4 : railDistanceKm < 1100 ? 3 : 2;
  const nowIso = new Date().toISOString();

  const templates: {
    suffix: string;
    category: TrainCategory;
    speedKmh: number;
    classes: TravelClass[];
    daily: boolean;
    baseDepMin: number;
    farePerKm: number;
  }[] =
    railDistanceKm <= 560
      ? [
          {
            suffix: 'Vande Bharat Express',
            category: 'Vande Bharat',
            speedKmh: 88,
            classes: ['CC', 'EC'],
            daily: false,
            baseDepMin: 365 + (seed % 50),
            farePerKm: 2.9,
          },
          {
            suffix: 'Intercity Superfast Express',
            category: 'Superfast',
            speedKmh: 66,
            classes: ['CC', '2S', '3A'],
            daily: true,
            baseDepMin: 560 + (seed % 90),
            farePerKm: 1.45,
          },
          {
            suffix: 'Shatabdi / Jan Shatabdi',
            category: 'Shatabdi',
            speedKmh: 76,
            classes: ['CC', 'EC', '2S'],
            daily: true,
            baseDepMin: 910 + (seed % 70),
            farePerKm: 2.2,
          },
          {
            suffix: 'Overnight Express',
            category: 'Express',
            speedKmh: 58,
            classes: ['2A', '3A', 'SL'],
            daily: true,
            baseDepMin: 1320 + (seed % 75),
            farePerKm: 1.85,
          },
        ]
      : [
          {
            suffix: 'Superfast Express',
            category: 'Superfast',
            speedKmh: 65,
            classes: ['1A', '2A', '3A', '3E', 'SL'],
            daily: true,
            baseDepMin: 410 + (seed % 140),
            farePerKm: 1.75,
          },
          {
            suffix: 'Humsafar / AC Express',
            category: 'Express',
            speedKmh: 62,
            classes: ['2A', '3A', '3E'],
            daily: false,
            baseDepMin: 890 + (seed % 160),
            farePerKm: 2.05,
          },
          {
            suffix: 'Sampark Kranti / Mail Express',
            category: 'Superfast',
            speedKmh: 60,
            classes: ['1A', '2A', '3A', 'SL'],
            daily: true,
            baseDepMin: 1180 + (seed % 140),
            farePerKm: 1.68,
          },
        ];

  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const partialDaySets = [
    ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    ['Mon', 'Wed', 'Fri', 'Sun'],
    ['Tue', 'Thu', 'Sat'],
  ];

  const generated: RouteTrainMatch[] = [];

  for (let i = 0; i < targetCount && i < templates.length; i++) {
    const tpl = templates[i];
    const trainNumVal = 12100 + ((seed + i * 733) % 10700);
    const trainNumber = String(trainNumVal);
    if (existingTrainNumbers.has(trainNumber)) continue;

    const runningDays = tpl.daily ? allDays : partialDaySets[(seed + i) % partialDaySets.length];
    if (dayFilter && dayFilter !== 'ALL' && !runningDays.includes(dayFilter)) {
      continue;
    }

    const durationMins = Math.max(55, Math.round((railDistanceKm / tpl.speedKmh) * 60));
    const depStr = formatHHMM(tpl.baseDepMin);
    const arrStr = formatHHMM(tpl.baseDepMin + durationMins);
    const stopsBetween = Math.max(1, Math.min(14, Math.round(railDistanceKm / 145)));

    const availRoll = (seed + i * 19) % 10;
    const primaryClass = tpl.classes.includes('3A') ? '3A' : tpl.classes[0];
    const estFare = Math.round((railDistanceKm * tpl.farePerKm + 260) / 10) * 10;

    let primaryAvailability: ClassAvailability;
    if (availRoll < 6) {
      const seats = 6 + ((seed + i * 13) % 44);
      primaryAvailability = {
        travelClass: primaryClass,
        quota: 'TQ',
        status: 'AVAILABLE',
        statusText: `AVL ${seats}`,
        availableSeats: seats,
        racNumber: 0,
        waitlistType: 'NONE',
        waitlistNumber: 0,
        fareInr: estFare,
        fareNote: 'Demo Mode corridor estimate',
        depletionRatePerMin: Number((4.5 + ((seed + i) % 8)).toFixed(1)),
        lastUpdated: nowIso,
        freshnessSeconds: 5,
        provenance,
      };
    } else if (availRoll < 8) {
      const rac = 3 + ((seed + i * 7) % 14);
      primaryAvailability = {
        travelClass: primaryClass,
        quota: 'GN',
        status: 'RAC',
        statusText: `RAC ${rac}`,
        availableSeats: 0,
        racNumber: rac,
        waitlistType: 'RAC',
        waitlistNumber: 0,
        fareInr: estFare,
        fareNote: 'Demo Mode corridor estimate',
        depletionRatePerMin: Number((8.2 + ((seed + i) % 6)).toFixed(1)),
        lastUpdated: nowIso,
        freshnessSeconds: 5,
        provenance,
      };
    } else {
      const wl = 5 + ((seed + i * 11) % 24);
      primaryAvailability = {
        travelClass: primaryClass,
        quota: 'TQ',
        status: 'WAITLIST',
        statusText: `TQWL ${wl}`,
        availableSeats: 0,
        racNumber: 0,
        waitlistType: 'TQWL',
        waitlistNumber: wl,
        fareInr: estFare,
        fareNote: 'Demo Mode corridor estimate',
        depletionRatePerMin: Number((12.4 + ((seed + i) % 9)).toFixed(1)),
        lastUpdated: nowIso,
        freshnessSeconds: 5,
        provenance,
      };
    }

    const demandLevels: ('MODERATE' | 'HIGH' | 'CRITICAL')[] = ['MODERATE', 'HIGH', 'CRITICAL'];
    const demandLevel = demandLevels[(seed + i) % demandLevels.length];

    generated.push({
      trainNumber,
      trainName: `${boardingStation.city} - ${destinationStation.city} ${tpl.suffix}`,
      category: tpl.category,
      zone: boardingStation.zone,
      boardingStopCode: boardingStation.code,
      boardingStopName: boardingStation.name,
      boardingDeparture: depStr,
      destinationStopCode: destinationStation.code,
      destinationStopName: destinationStation.name,
      destinationArrival: arrStr,
      segmentDistanceKm: railDistanceKm,
      stopsBetween,
      isDirectOriginToDest: i === 0,
      runningDays,
      classes: tpl.classes,
      demandLevel,
      punctualityPercent: 86 + ((seed + i * 5) % 12),
      primaryAvailability,
      hasAvailableSeats: primaryAvailability.status === 'AVAILABLE',
      trainOriginCode: boardingStation.code,
      trainDestinationCode: destinationStation.code,
    });
  }

  return generated;
}
