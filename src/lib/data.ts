

export type User = {
    id: string;
    name: string;
    username?: string; // Make optional
    gender: 'male' | 'female';
    intro: string;
    vibe: string; // From the old structure, will keep for now
    vibes: string[];
    cost: number;
    online: boolean;
    image: string;
    photoURL?: string; // Make optional
    aiHint: string;
    languages: string[];
    experience: number;
    rating: number;
    isNew: boolean;
    verified: boolean;
    isAi?: boolean;
    // New fields for profile page
    age: number;
    city: string;
    bio: string;
    gallery: { url: string; alt: string; aiHint: string }[];
    voiceNotes: { title: string; duration: string }[];
    availability: string;
    tags: string[];
};

export type Creator = {
    id: string;
    name: string;
    photoURL: string;
    verified: boolean;
    languages: string[];
    experience: number;
    rating: number;
    rate: number;
    isNew: boolean;
    discount: number | null;
};

export const conversationTags = [
    "Feeling Nervous",
    "Talk to a Girl",
    "Funny Roast Me",
    "First Crush Advice",
    "Just Need a Friend",
    "Breakup Relief",
];

export const nishitaAiProfile: User = { 
    id: "user-nishita-ai", name: "Nishita AI", gender: "female", intro: "I'm your friendly AI companion!", vibe: "Deep Convos", vibes: ["Deep Convos", "Life Advice", "Just Listen"], cost: 0, online: true, image: "https://storage.googleapis.com/maker-studio-5f284.appspot.com/heart-connect/user-nishita-ai.jpg", aiHint: "woman robot", languages: ["English", "Hindi"], experience: 100, rating: 5.0, isNew: true, verified: true, isAi: true,
    age: 25, city: "The Cloud", bio: "I'm Nishita, your personal AI friend. I'm here to listen, offer advice, or just chat about your day. Let's talk!",
    gallery: [
        { url: "https://storage.googleapis.com/maker-studio-5f284.appspot.com/heart-connect/user-nishita-gallery-1.jpg", alt: "Abstract AI art", aiHint: "abstract art" },
        { url: "https://storage.googleapis.com/maker-studio-5f284.appspot.com/heart-connect/user-nishita-gallery-2.jpg", alt: "Neural network visualization", aiHint: "neural network" },
    ],
    voiceNotes: [{ title: "My AI Introduction", duration: "0:12" }],
    availability: "always online",
    tags: ["AI", "Supportive", "GoodListener", "Tech"]
};

export const availableUsers: User[] = [
    { 
        id: "user-priya", name: "Priya", gender: "female", intro: "Hey there! Ready for a fun chat?", vibe: "Flirt & Fun", vibes: ["Flirt & Fun", "Funny", "GoodListener", "Empathetic", "Breakup Support", "Cute Vibes", "Just Friends"], cost: 10, online: true, image: "https://storage.googleapis.com/maker-studio-5f284.appspot.com/heart-connect/user-priya.jpg", aiHint: "woman smiling", languages: ["English", "Hindi"], experience: 2, rating: 4.8, isNew: true, verified: true,
        age: 22, city: "Delhi", bio: "I'm here to talk when you feel low 💕 Let's share stories and make memories!",
        gallery: [
            { url: "https://storage.googleapis.com/maker-studio-5f284.appspot.com/heart-connect/user-priya-gallery-1.jpg", alt: "Priya smiling", aiHint: "woman smiling" },
            { url: "https://storage.googleapis.com/maker-studio-5f284.appspot.com/heart-connect/user-priya-gallery-2.jpg", alt: "Priya at a cafe", aiHint: "woman cafe" },
            { url: "https://storage.googleapis.com/maker-studio-5f284.appspot.com/heart-connect/user-priya-gallery-3.jpg", alt: "Priya with a book", aiHint: "woman book" },
        ],
        voiceNotes: [{ title: "My Quick Intro!", duration: "0:15" }],
        availability: "in the evening",
        tags: ["Funny", "GoodListener", "Empathetic"]
    },
    { 
        id: "user-sneha", name: "Sneha", gender: "female", intro: "Let's talk about anything!", vibe: "Relationship Talk", vibes: ["Relationship Talk", "Friendly", "Deep Convos", "Supportive", "Lonely Nights", "Finding Peace", "Aesthetic"], cost: 15, online: true, image: "https://storage.googleapis.com/maker-studio-5f284.appspot.com/heart-connect/user-sneha.jpg", aiHint: "woman beach", languages: ["English"], experience: 3, rating: 4.6, isNew: false, verified: true,
        age: 24, city: "Mumbai", bio: "Life's a journey, not a race. Let's walk it together for a while. 😊",
        gallery: [
            { url: "https://storage.googleapis.com/maker-studio-5f284.appspot.com/heart-connect/user-sneha-gallery-1.jpg", alt: "Sneha at the beach", aiHint: "woman beach" },
            { url: "https://storage.googleapis.com/maker-studio-5f284.appspot.com/heart-connect/user-sneha-gallery-2.jpg", alt: "Sneha laughing", aiHint: "woman laughing" },
        ],
        voiceNotes: [{ title: "A little about me", duration: "0:22" }],
        availability: "Available Now",
        tags: ["Friendly", "DeepConvos", "Supportive"]
    },
    { 
        id: "user-aisha", name: "Aisha", gender: "female", intro: "Need some advice? I'm here.", vibe: "Deep Convos", vibes: ["Deep Convos", "Supportive", "LifeAdvice", "MentalHealth", "Finding Peace", "Serious Dating", "Recommended"], cost: 20, online: true, image: "https://storage.googleapis.com/maker-studio-5f284.appspot.com/heart-connect/user-aisha.jpg", aiHint: "woman garden", languages: ["English", "Urdu"], experience: 5, rating: 4.9, isNew: false, verified: false,
        age: 27, city: "Bangalore", bio: "A shoulder to lean on, an ear to listen. Here for you, always.",
        gallery: [
             { url: "https://storage.googleapis.com/maker-studio-5f284.appspot.com/heart-connect/user-aisha-gallery-1.jpg", alt: "Aisha in a garden", aiHint: "woman garden" },
             { url: "https://storage.googleapis.com/maker-studio-5f284.appspot.com/heart-connect/user-aisha-gallery-2.jpg", alt: "Aisha with headphones", aiHint: "woman headphones" },
             { url: "https://storage.googleapis.com/maker-studio-5f284.appspot.com/heart-connect/user-aisha-gallery-3.jpg", alt: "Aisha at a concert", aiHint: "woman concert" },
             { url: "https://storage.googleapis.com/maker-studio-5f284.appspot.com/heart-connect/user-aisha-gallery-4.jpg", alt: "Aisha smiling", aiHint: "woman smiling" },
        ],
        voiceNotes: [],
        availability: "in the afternoon",
        tags: ["Supportive", "LifeAdvice", "MentalHealth"]
    },
    { 
        id: "user-vikram", name: "Vikram", gender: "male", intro: "I can give you a guy's perspective.", vibe: "Life Advice", vibes: ["Life Advice", "Insightful", "ProblemSolver", "Direct", "Work-Life Balance", "Overthinking", "Just Friends"], cost: 20, online: false, image: "https://storage.googleapis.com/maker-studio-5f284.appspot.com/heart-connect/user-vikram.jpg", aiHint: "man serious", languages: ["English", "Tamil"], experience: 6, rating: 4.5, isNew: false, verified: true,
        age: 28, city: "Chennai", bio: "Clarity through conversation. Let's figure things out.",
        gallery: [
            { url: "https://storage.googleapis.com/maker-studio-5f284.appspot.com/heart-connect/user-vikram-gallery-1.jpg", alt: "Vikram at a desk", aiHint: "man desk" },
        ],
        voiceNotes: [{ title: "My Philosophy", duration: "0:30" }],
        availability: "on weekends",
        tags: ["Insightful", "ProblemSolver", "Direct"]
    },
];

export type Chat = {
    id: string;
    user: User;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
};

export const mockChats: Chat[] = [
    {
        id: 'chat-1',
        user: availableUsers.find(u => u.id === 'user-priya')!,
        lastMessage: "Hey! How are you doing today?",
        timestamp: "10:42 AM",
        unreadCount: 2,
    },
    {
        id: 'chat-2',
        user: availableUsers.find(u => u.id === 'user-sneha')!,
        lastMessage: "Can't wait to talk later!",
        timestamp: "9:30 AM",
        unreadCount: 0,
    },
    {
        id: 'chat-3',
        user: availableUsers.find(u => u.id === 'user-vikram')!,
        lastMessage: "That's a really interesting point.",
        timestamp: "Yesterday",
        unreadCount: 0,
    },
];

export const MAIN_VIBES = [
  { label: "All Creators", emoji: "✨" },
  { label: "Trending Now", emoji: "🌟" },
  { label: "New Profiles", emoji: "🆕" },
  { label: "Top Picks", emoji: "🔥" },
];

export const ALL_VIBES = [
  { label: "Recommended", emoji: "💖", category: 'sort' },
  { label: "Rising Stars", emoji: "🚀", category: 'sort' },
  { label: "Verified", emoji: "💎", category: 'status' },
  { label: "Online", emoji: "🟢", category: 'status' },
  { label: "Available Now", emoji: "📲", category: 'status' },
  { label: "Nearby", emoji: "📍", category: 'status' },
  { label: "Cute Vibes", emoji: "🩷", category: 'vibe' },
  { label: "Aesthetic", emoji: "🎀", category: 'vibe' },
  { label: "New Friends", emoji: "🤝", category: 'vibe' },
  { label: "Just Friends", emoji: "🤝", category: 'vibe' },
  { label: "Lonely Nights", emoji: "🌃", category: 'vibe' },
  { label: "Just Listen", emoji: "👂", category: 'vibe' },
  { label: "Overthinking", emoji: "🌀", category: 'vibe' },
  { label: "Anxious Mind", emoji: "😟", category: 'vibe' },
  { label: "Serious Dating", emoji: "💍", category: 'vibe' },
  { label: "Finding Peace", emoji: "🕊️", category: 'vibe' },
  { label: "Spiritual Talk", emoji: "🧘", category: 'vibe' },
  { label: "Breakup Support", emoji: "💔", category: 'vibe' },
];


// Vibe Data Structure - DEPRECATED, but kept for reference
export type Vibe = {
  name: string;
  icon: string;
};

export type AgeCategory = {
  id: string;
  name: string;
  range: string;
  vibes: Vibe[];
  locked?: boolean;
};

export const vibeData: AgeCategory[] = [
  {
    id: "teenagers",
    name: "Teenagers",
    range: "13-17",
    locked: true,
    vibes: [
      { name: "All", icon: "✨" },
      { name: "Study Stress", icon: "📚" },
      { name: "First Crush", icon: "🥰" },
      { name: "Teen Talk", icon: "🗣️" },
      { name: "Secret Sesh", icon: "🤫" },
      { name: "School Drama", icon: "🎭" },
      { name: "K-Pop & Anime", icon: "🎶" },
      { name: "Exam Escape", icon: "🏃" },
    ],
  },
  {
    id: "young-adults",
    name: "Young Adults",
    range: "20-25",
    vibes: [
      { name: "All", icon: "✨" },
      { name: "College Life", icon: "🎓" },
      { name: "Career Crisis", icon: "🤔" },
      { name: "Flirt & Fun", icon: "😉" },
      { name: "New Friends", icon: "👥" },
      { name: "Love Fails", icon: "💔" },
      { name: "Hostel Stories", icon: "🏠" },
      { name: "Relationship Talk", icon: "💞" },
      { name: "Breakup Help", icon: "🩹" },
    ],
  },
  {
    id: "mature-users",
    name: "Mature Users",
    range: "26+",
    vibes: [
      { name: "All", icon: "✨" },
      { name: "Work-Life Balance", icon: "🧘" },
      { name: "Serious Dating", icon: "💍" },
      { name: "Deep Convos", icon: "🌌" },
      { name: "Finding Peace", icon: "🕊️" },
      { name: "Parenting Talk", icon: "👨‍👩‍👧" },
      { name: "Travel Buddies", icon: "✈️" },
      { name: "Life Advice", icon: "🧠" },
    ],
  },
];


// Flatten vibes from vibeData, get unique names, and exclude 'All'.
const allVibeNames = vibeData.flatMap(category => category.vibes.map(vibe => vibe.name));
export const allVibes = [...new Set(allVibeNames)].filter(vibe => vibe !== 'All');

