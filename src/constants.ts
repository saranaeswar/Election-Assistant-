import {
  UserPlus,
  Megaphone,
  FileCheck,
  Mic2,
  Vote,
  BarChart3,
} from "lucide-react";

export const STEPS = [
  {
    id: "registration",
    title: "Voter Registration",
    icon: UserPlus,
    emoji: "📋",
    color: "#FF6B00",
    description:
      "Every Indian citizen aged 18+ can register. Apply online at NVSP or offline at your local BLO office.",
    details:
      "Fill Form 6 on the NVSP portal. You need age proof (birth certificate / Class 10 mark sheet) and address proof. The BLO verifies your details within 30 days.",
    funFact: "India has 945M+ eligible voters — the largest electorate in the world!",
  },
  {
    id: "notification",
    title: "Notification",
    icon: Megaphone,
    emoji: "📢",
    color: "#0057A8",
    description:
      "The President (for Lok Sabha) or Governor (for State Assembly) issues an official notification announcing the election schedule.",
    details:
      "This triggers the Model Code of Conduct (MCC), which restricts parties and government from making populist announcements that could influence voters.",
    funFact:
      "The Model Code of Conduct has been in place since 1960 and is enforced by the ECI.",
  },
  {
    id: "nomination",
    title: "Nomination",
    icon: FileCheck,
    emoji: "📝",
    color: "#138808",
    description:
      "Any eligible citizen can file a nomination to contest elections. Candidates submit affidavits declaring assets, liabilities, and criminal record.",
    details:
      "A security deposit of ₹25,000 (Lok Sabha) or ₹10,000 (State Assembly) must be paid. Deposits are forfeited if the candidate gets less than 1/6th of valid votes.",
    funFact: "In 2024, over 8,000 candidates contested across 543 Lok Sabha seats.",
  },
  {
    id: "campaigning",
    title: "Campaigning",
    icon: Mic2,
    emoji: "🎤",
    color: "#FF6B00",
    description:
      "Parties and candidates hold rallies, door-to-door visits, and media campaigns to communicate their manifesto.",
    details:
      "Campaigning must stop 48 hours before polling ends. Expenses are capped — ₹95 lakh per candidate for Lok Sabha. The ECI deploys flying squads to monitor violations.",
    funFact: "The 'Silent Period' of 48 hours before polling is strictly enforced.",
  },
  {
    id: "voting",
    title: "Voting Day",
    icon: Vote,
    emoji: "🗳️",
    color: "#0057A8",
    description:
      "Voters visit their assigned polling booth and cast their vote using an Electronic Voting Machine (EVM).",
    details:
      "Carry your EPIC (Voter ID) or any ECI-approved photo ID. The VVPAT machine prints a paper slip visible for 7 seconds so you can verify your vote.",
    funFact:
      "India's 5.5 million EVMs are the world's largest democracy-in-a-box system.",
  },
  {
    id: "counting",
    title: "Vote Counting",
    icon: BarChart3,
    emoji: "📊",
    color: "#138808",
    description:
      "Votes are counted under tight security at Returning Officer centres. Results are declared after all rounds are complete.",
    details:
      "A mandatory VVPAT verification is done for 5 random EVMs per constituency. The winning candidate must secure a simple majority. Election Commission certifies results.",
    funFact: "Counting is typically completed within 24 hours of polls closing.",
  },
];

export const RESOURCES = [
  {
    name: "NVSP Portal",
    url: "https://www.nvsp.in/",
    description: "National Voter Service Portal — Register, check, update your voter details.",
    icon: "🗂️",
    badge: "Official",
  },
  {
    name: "Voters ECI",
    url: "https://voters.eci.gov.in/",
    description: "Election Commission of India — Complete voter services and information.",
    icon: "🏛️",
    badge: "Official",
  },
  {
    name: "Voter Helpline App",
    url: "https://play.google.com/store/apps/details?id=com.eci.citizen",
    description: "Official ECI Android app for voter registration, BLO contact, and polling info.",
    icon: "📱",
    badge: "App",
  },
  {
    name: "cVIGIL App",
    url: "https://cvigil.eci.gov.in/",
    description: "Report election violations to the ECI in real-time with geo-tagged photos.",
    icon: "🚨",
    badge: "Report",
  },
];

export const STATS = [
  { value: "945M+", label: "Eligible Voters", color: "#FF6B00" },
  { value: "1M+", label: "Polling Stations", color: "#0057A8" },
  { value: "543", label: "Lok Sabha Seats", color: "#138808" },
  { value: "100%", label: "Secret Ballot", color: "#FF6B00" },
];

export const FAQ_PROMPTS = [
  "How do I register to vote in India?",
  "What is an EVM and how does it work?",
  "What documents do I need at the polling booth?",
  "What is the Model Code of Conduct?",
  "How does vote counting work in India?",
  "What is VVPAT and how does it ensure transparency?",
];
