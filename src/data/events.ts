export interface Event {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  price: number;
  priceLabel: string;
  image: string;
  heroImage?: string;
  duration: string;
  language: string;
  ageRating: string;
  description: string;
  longDescription: string;
  artist: string;
  artistBio: string;
  tags: string[];
  isFeatured?: boolean;
  isPromoted?: boolean;
  isNew?: boolean;
  soldOut?: boolean;
  seatsLeft?: number;
}

export const CATEGORIES = [
  'All',
  'Classical Music',
  'Theatre',
  'Dance',
  'Comedy',
  'Jazz & Blues',
  'Folk',
  'Opera',
  'Contemporary',
];

export const EVENTS: Event[] = [
  {
    id: '1',
    slug: 'raag-yaman-ritu-agarwal',
    title: 'Raag Yaman',
    subtitle: 'An Evening of Hindustani Vocals',
    category: 'Classical Music',
    date: '28 Jun 2025',
    time: '7:00 PM',
    venue: 'NCPA Tata Theatre',
    city: 'Mumbai',
    price: 800,
    priceLabel: '₹800 onwards',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1400&q=90',
    duration: '2 hrs 30 min',
    language: 'Hindi',
    ageRating: 'All ages',
    description: 'An intimate evening of Hindustani classical vocals exploring the transcendent Raag Yaman.',
    longDescription: `Raag Yaman, one of Hindustani classical music's most beloved evening ragas, takes centre stage in this intimate concert. Ritu Agarwal, a disciple of the Jaipur-Atrauli gharana, renders this timeless raga with a command that balances rigour and spontaneity.

The concert begins with an unhurried alap — a meditative unfolding of the raga's notes without rhythmic accompaniment — before transitioning through jod, jhala, and finally the composed bandish set to Teentaal.

Accompanied by Pandit Suresh Talwalkar on tabla and Rajeev Devasthali on harmonium, this evening promises to be an experience of rare musical depth.`,
    artist: 'Ritu Agarwal',
    artistBio: 'Ritu Agarwal is a senior vocalist of the Jaipur-Atrauli gharana, having trained under Padma Bhushan Kishori Amonkar for over two decades. She has performed at prestigious venues including the Sawai Gandharva Bhimsen Mahotsav and the Dover Lane Music Conference.',
    tags: ['Hindustani', 'Vocal', 'Gharana', 'Evening Raga'],
    isFeatured: true,
    isPromoted: true,
    seatsLeft: 34,
  },
  {
    id: '2',
    slug: 'between-two-worlds-theatre',
    title: 'Between Two Worlds',
    subtitle: 'A Play in Two Acts',
    category: 'Theatre',
    date: '4 Jul 2025',
    time: '8:00 PM',
    venue: 'Prithvi Theatre',
    city: 'Mumbai',
    price: 500,
    priceLabel: '₹500 – ₹1,200',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1400&q=90',
    duration: '1 hr 45 min',
    language: 'English',
    ageRating: '14+',
    description: 'A razor-sharp play about identity, belonging, and the quiet violence of assimilation.',
    longDescription: `Between Two Worlds dissects the immigrant experience with surgical precision. Written by Ananya Krishnamurthy and directed by Arjun Menon, this two-act play follows the Sharma family across three generations — from a small town in Rajasthan to the suburbs of London and back.

The writing resists sentimentality at every turn. Instead, it finds dark comedy in contradiction: in the child who forgets her mother tongue, the father who insists on customs he himself no longer believes in, the grandmother who watches from a distance and says very little.

The production design uses negative space boldly — bare wooden floors, a single rotating platform, and light doing the work that furniture might otherwise do.`,
    artist: 'Ananya Krishnamurthy (Writer) · Arjun Menon (Director)',
    artistBio: 'Ananya Krishnamurthy won the META Award for Best Original Script in 2023. Arjun Menon\'s previous production, The Interior, ran for 47 shows across six Indian cities.',
    tags: ['Original Play', 'Drama', 'English', 'Award-Winning'],
    seatsLeft: 12,
    isNew: true,
  },
  {
    id: '3',
    slug: 'bharatanatyam-margam-divya-nair',
    title: 'Margam',
    subtitle: 'A Bharatanatyam Arangetram',
    category: 'Dance',
    date: '12 Jul 2025',
    time: '6:30 PM',
    venue: 'Chowdiah Memorial Hall',
    city: 'Bengaluru',
    price: 300,
    priceLabel: '₹300 – ₹800',
    image: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=1400&q=90',
    duration: '3 hrs',
    language: 'Tamil / Sanskrit',
    ageRating: 'All ages',
    description: 'The formal debut of Divya Nair, tracing the complete Bharatanatyam margam under Guru Leela Samson.',
    longDescription: `The margam — the traditional Bharatanatyam concert format — is among the most demanding structures in Indian classical art. It is a journey through technical forms, devotional poetry, and expressive narrative.

Divya Nair, a student of Guru Leela Samson for eleven years, presents her arangetram — the formal stage debut — with an uncompromising commitment to the Pandanallur style.

The programme includes Alarippu, Jatiswaram, Shabdam, Varnam (the centrepiece), Padam, and Tillana. Live music is provided by an ensemble featuring vocalist Sudha Raghunathan, mridangam by T.K. Murthy, and nattuvangam by Guru Leela Samson herself.`,
    artist: 'Divya Nair',
    artistBio: 'Divya Nair trained under Guru Leela Samson at the Spanda Dance Company in New Delhi. She holds a postgraduate degree in Performing Arts from Sangit Natak Akademi.',
    tags: ['Bharatanatyam', 'Arangetram', 'Classical', 'Debut'],
    isPromoted: true,
    seatsLeft: 67,
  },
  {
    id: '4',
    slug: 'the-city-never-sleeps-jazz',
    title: 'The City Never Sleeps',
    subtitle: 'Late-Night Jazz Sessions',
    category: 'Jazz & Blues',
    date: '19 Jul 2025',
    time: '9:30 PM',
    venue: 'Blue Frog',
    city: 'Mumbai',
    price: 1200,
    priceLabel: '₹1,200',
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=1400&q=90',
    duration: '2 hrs',
    language: 'Instrumental',
    ageRating: '18+',
    description: 'Late-night jazz with the Rahul Sharma Quartet — standards, originals, and pure improvisation.',
    longDescription: `Blue Frog's signature late-night series returns with the Rahul Sharma Quartet. Expect Coltrane standards, a handful of originals from their debut album The Monsoon Sessions, and the kind of extended improvisation that only a late-night room allows.

Rahul Sharma (tenor saxophone), Kartik Raman (piano), Siddharth Patel (double bass), and Ashish Koul (drums) have been playing together for six years. That familiarity shows — in the way they leave space for each other, in the risks they take.

Doors open at 9:00 PM. Support act Mia Costa (vocals) plays at 9:30 PM. Quartet goes on at 10:15 PM.`,
    artist: 'Rahul Sharma Quartet',
    artistBio: 'The Rahul Sharma Quartet released their debut album The Monsoon Sessions in 2024, which was shortlisted for the ICF Jazz Award. They have toured France, Germany, and Japan.',
    tags: ['Jazz', 'Quartet', 'Late Night', 'Improvisation'],
    seatsLeft: 28,
  },
  {
    id: '5',
    slug: 'unfiltered-stand-up-aditi-mittal',
    title: 'Unfiltered',
    subtitle: 'Stand-Up Comedy Special',
    category: 'Comedy',
    date: '5 Jul 2025',
    time: '8:00 PM',
    venue: 'Canvas Laugh Club',
    city: 'Delhi',
    price: 699,
    priceLabel: '₹699 – ₹1,499',
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1400&q=90',
    duration: '1 hr 30 min',
    language: 'Hindi / English',
    ageRating: '18+',
    description: 'Aditi Mittal returns with a new hour on modern anxiety, terrible dates, and why everyone is lying.',
    longDescription: `After a sold-out run in Bengaluru and Pune, Aditi Mittal brings Unfiltered to Delhi. An hour of material built over 14 months, this show marks a shift from her earlier work — sharper, more personal, and considerably angrier.

The special covers modern anxiety with clinical precision, dating in the age of apps with anthropological detachment, and family dynamics with the kind of honesty that makes audiences simultaneously cringe and nod.

Content advisory: Strong language throughout. The show contains material on mental health, relationships, and social media addiction. Recommended for ages 18 and above.`,
    artist: 'Aditi Mittal',
    artistBio: 'Aditi Mittal is one of India\'s most acclaimed stand-up comedians, with three specials on Netflix and Amazon Prime. She was named in Forbes India\'s 30 Under 30 list and has performed at festivals in Edinburgh, Melbourne, and New York.',
    tags: ['Stand-Up', 'Comedy Special', 'Sold Out Tour', 'Hinglish'],
    isFeatured: true,
    isPromoted: true,
    seatsLeft: 41,
  },
  {
    id: '6',
    slug: 'manipuri-ras-leela-ensemble',
    title: 'Ras Leela',
    subtitle: 'Manipuri Classical Dance Theatre',
    category: 'Dance',
    date: '26 Jul 2025',
    time: '7:00 PM',
    venue: 'Kamani Auditorium',
    city: 'Delhi',
    price: 400,
    priceLabel: '₹400 – ₹900',
    image: 'https://images.unsplash.com/photo-1574701148212-8518049e70c9?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1574701148212-8518049e70c9?w=1400&q=90',
    duration: '2 hrs 15 min',
    language: 'Manipuri / Sanskrit',
    ageRating: 'All ages',
    description: 'A luminous rendering of Ras Leela — the divine romance of Radha and Krishna — in the Manipuri tradition.',
    longDescription: `Ras Leela, in the Manipuri tradition, is considered among the most sacred and aesthetically refined of all Indian dance forms. The Manipur Nartanalaya ensemble, founded in 1972, is among the few companies maintaining the full ceremonial protocols of the form.

This performance presents all three sections of the Maha Ras Leela: the invocation, the central narrative of divine love, and the final dissolution. The choreography has been passed down through twelve generations of hereditary performers from Manipur's Vaishnavite community.

Costumes are hand-woven in Imphal using traditional Manipuri silk techniques. The performance uses no amplification — only the natural resonance of the pung (barrel drum), kartal, and harmonium.`,
    artist: 'Manipur Nartanalaya Ensemble',
    artistBio: 'Manipur Nartanalaya was established in 1972 by Guru Bipin Singh. The company has performed in 34 countries and is the recipient of the Sangit Natak Akademi Award for Group Performance.',
    tags: ['Manipuri', 'Classical', 'Sacred', 'Ensemble'],
    seatsLeft: 89,
  },
  {
    id: '7',
    slug: 'carnatic-violin-lalgudi-vijayalakshmi',
    title: 'Kalyani Kalyanam',
    subtitle: 'Carnatic Violin Recital',
    category: 'Classical Music',
    date: '3 Aug 2025',
    time: '6:00 PM',
    venue: 'Krishna Gana Sabha',
    city: 'Chennai',
    price: 600,
    priceLabel: '₹600 onwards',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1400&q=90',
    duration: '2 hrs',
    language: 'Tamil / Sanskrit',
    ageRating: 'All ages',
    description: 'Lalgudi Vijayalakshmi explores Raag Kalyani in a solo violin recital of extraordinary sensitivity.',
    longDescription: `The violin in Carnatic music occupies a unique position — it can mimic the voice, argue with the rhythm, and carry a raga's full emotional arc without a single word. Lalgudi Vijayalakshmi, daughter of the legendary Lalgudi G. Jayaraman, has spent four decades refining precisely this skill.

This recital centres on Raag Kalyani — the Carnatic equivalent of Hindustani's Yaman — presenting it through a full-length alapana, niraval, and kalpana swaras before concluding with a tillana composed by her father.

The programme also includes shorter pieces in Bhairavi, Todi, and Saveri.`,
    artist: 'Lalgudi Vijayalakshmi',
    artistBio: 'Lalgudi Vijayalakshmi is a senior Carnatic violin artist, vocalist, and composer. A recipient of the Isai Peraringar title from the Tamil Nadu government, she has performed at the Music Academy\'s December Season for over 30 consecutive years.',
    tags: ['Carnatic', 'Violin', 'Recital', 'South Indian Classical'],
    seatsLeft: 55,
  },
  {
    id: '8',
    slug: 'baul-songs-of-bengal-paban-das',
    title: 'Songs of the Mad River',
    subtitle: 'Baul Music from Bengal',
    category: 'Folk',
    date: '9 Aug 2025',
    time: '7:30 PM',
    venue: 'Siri Fort Auditorium',
    city: 'Delhi',
    price: 350,
    priceLabel: '₹350 – ₹700',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1400&q=90',
    duration: '1 hr 45 min',
    language: 'Bengali',
    ageRating: 'All ages',
    description: 'Paban Das Baul performs songs of the divine madness — wandering, searching, surrendering.',
    longDescription: `The Bauls of Bengal are a community of mystic musicians who travel, sing, and refuse to be categorised. Their songs are about longing — for God, for truth, for the inexplicable inner music they call maner manush (the person of the heart).

Paban Das Baul, one of the last bearers of this tradition in its unmodified form, performs an evening of songs drawn from the 18th and 19th century Baul songbooks. His only accompaniment is the ektara (one-stringed instrument) and the duggi (small drum strapped to the waist), both played simultaneously while dancing.

This is music that resists notation, resists reproduction, and can only exist in the room where it is being made.`,
    artist: 'Paban Das Baul',
    artistBio: 'Paban Das Baul is a Padma Shri awardee and is widely considered the foremost living practitioner of Baul music. He has collaborated with Peter Gabriel and performed at WOMAD festivals across Europe.',
    tags: ['Baul', 'Folk', 'Bengali', 'Mystic', 'World Music'],
    seatsLeft: 102,
  },
];

export const FEATURED_EVENT = EVENTS[0];

export function getEventBySlug(slug: string): Event | undefined {
  return EVENTS.find(e => e.slug === slug);
}

export function getRelatedEvents(currentSlug: string, category: string): Event[] {
  return EVENTS.filter(e => e.slug !== currentSlug && e.category === category).slice(0, 4);
}
