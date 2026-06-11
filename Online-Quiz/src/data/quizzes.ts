/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Quiz, Badge } from '../types';

export const BADGES: Badge[] = [
  {
    id: 'beginner',
    title: 'Beginner Badge',
    description: 'Awarded for completing your first quiz challenge!',
    icon: 'Award',
    color: 'from-emerald-500 to-green-600',
    requirement: 'Complete 1 Quiz'
  },
  {
    id: 'silver',
    title: 'Silver Master',
    description: 'Reach a milestone of 1,500 total points.',
    icon: 'Shield',
    color: 'from-slate-400 to-slate-600',
    requirement: 'Score 1500+ Points'
  },
  {
    id: 'gold',
    title: 'Gold Champion',
    description: 'Complete a Medium or Hard quiz with 100% accuracy!',
    icon: 'Trophy',
    color: 'from-amber-400 to-yellow-600',
    requirement: '100% Accuracy on Med/Hard Quiz'
  },
  {
    id: 'quiz_king',
    title: 'Quiz King',
    description: 'Maintain a total accuracy of 90% or higher after completing at least 5 quizzes.',
    icon: 'Crown',
    color: 'from-violet-500 to-purple-700',
    requirement: '90%+ Avg Accuracy & 5 Quizzes'
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Submit an entire quiz with at least 50% of the duration remaining.',
    icon: 'Zap',
    color: 'from-orange-500 to-red-600',
    requirement: 'Finish in < 50% Time'
  },
  {
    id: 'streak_warrior',
    title: 'Streak Warrior',
    description: 'Keep your knowledge fire burning with a daily streak of 10 days or more!',
    icon: 'Flame',
    color: 'from-pink-500 to-rose-600',
    requirement: '10+ Day Streak'
  }
];

export const QUIZZES: Quiz[] = [
  {
    id: 'ultimate-tech',
    title: 'Ultimate Tech Challenge',
    description: 'Push your computer science and computing trivia to the limit with this custom challenge!',
    category: 'Technology',
    difficulty: 'hard',
    points: 500,
    durationMinutes: 4,
    icon: 'Cpu',
    questions: [
      {
        id: 'tech-1',
        text: 'What does CPU stand for?',
        options: [
          'Central Processing Unit',
          'Computer Program Utility',
          'Central Program Unit',
          'Control Processing Utility'
        ],
        correctIndex: 0,
        explanation: 'The CPU (Central Processing Unit) is the primary component of a computer that performs most of the processing inside the computer.'
      },
      {
        id: 'tech-2',
        text: 'Which internet protocol is used to securely browse the web by encrypting communications?',
        options: [
          'FTP',
          'HTTPS',
          'HTTP',
          'SMTP'
        ],
        correctIndex: 1,
        explanation: 'HTTPS (Hypertext Transfer Protocol Secure) encrypts the communication between the browser and web server using TLS/SSL.'
      },
      {
        id: 'tech-3',
        text: 'Who is often credited with being the first computer programmer for writing an algorithm intended for Babbage\'s Analytical Engine?',
        options: [
          'Ada Lovelace',
          'Alan Turing',
          'Grace Hopper',
          'Charles Babbage'
        ],
        correctIndex: 0,
        explanation: 'Ada Lovelace, an English mathematician, created the first algorithm intended to be executed by a machine.'
      },
      {
        id: 'tech-4',
        text: 'What does CSS stand for in web development?',
        options: [
          'Computer Style Sheets',
          'Creative Style Systems',
          'Cascading Style Sheets',
          'Complex Styled Syntax'
        ],
        correctIndex: 2,
        explanation: 'Cascading Style Sheets (CSS) is used to specify the layout, colors, typography, and styling of a document written in HTML.'
      },
      {
        id: 'tech-5',
        text: 'In database systems, what does the acronym ACID stand for?',
        options: [
          'Advanced Code Integration Design',
          'Atomicity, Consistency, Isolation, Durability',
          'Automatic Client Interoperability Database',
          'Application Component Interface Distribution'
        ],
        correctIndex: 1,
        explanation: 'ACID stands for Atomicity, Consistency, Isolation, and Durability, which are key properties that guarantee reliable database transaction processing.'
      }
    ]
  },
  {
    id: 'intro-python',
    title: 'Python Coding Basics',
    category: 'Technology',
    description: 'Learn and test your basic syntax, lists, and loops knowledge in Python!',
    difficulty: 'easy',
    points: 150,
    durationMinutes: 3,
    icon: 'Code2',
    questions: [
      {
        id: 'py-1',
        text: 'How do you insert comments in Python code?',
        options: [
          '// this is a comment',
          '/* this is a comment */',
          '# this is a comment',
          '<!-- this is a comment -->'
        ],
        correctIndex: 2,
        explanation: 'Python uses the hash character (#) to write single-line comments.'
      },
      {
        id: 'py-2',
        text: 'What is the correct way to create a list in Python?',
        options: [
          'myList = (1, 2, 3)',
          'myList = {1, 2, 3}',
          'myList = [1, 2, 3]',
          'myList = <1, 2, 3>'
        ],
        correctIndex: 2,
        explanation: 'Lists are declared with square brackets `[]`, while tuples use parenthesis `()` and sets use curly braces `{}`.'
      },
      {
        id: 'py-3',
        text: 'Which function is used to get the number of items in a list/string in Python?',
        options: [
          'length()',
          'len()',
          'count()',
          'size()'
        ],
        correctIndex: 1,
        explanation: 'The `len()` function returns the length of an object, such as a string, list, tuple, dictionary, etc.'
      }
    ]
  },
  {
    id: 'space-science',
    title: 'Cosmic Journey: Space Science',
    category: 'Science',
    description: 'Blast off on a celestial voyage through stars, planets, galaxies, and black holes!',
    difficulty: 'medium',
    points: 250,
    durationMinutes: 4,
    icon: 'Telescope',
    questions: [
      {
        id: 'space-1',
        text: 'Which planet in our solar system is known for its spectacular ring system?',
        options: [
          'Mars',
          'Jupiter',
          'Saturn',
          'Neptune'
        ],
        correctIndex: 2,
        explanation: 'While other gas giants have faint rings, Saturn\'s extensive and highly visible ring system is the most famous and spectacular.'
      },
      {
        id: 'space-2',
        text: 'Approximately how long does it take for light from the Sun to reach Earth?',
        options: [
          '8 seconds',
          '8 minutes',
          '8 hours',
          '24 hours'
        ],
        correctIndex: 1,
        explanation: 'Light travels at about 300,000 km/s. Given Earth is 150 million km away from the Sun, it takes light about 8 minutes and 20 seconds to reach us.'
      },
      {
        id: 'space-3',
        text: 'What is the absolute boundary around a black hole beyond which nothing, not even light, can escape called?',
        options: [
          'Singularity Point',
          'Dark Nebula',
          'Event Horizon',
          'Apparent Horizon'
        ],
        correctIndex: 2,
        explanation: 'The event horizon is a theoretical boundary around a black hole beyond which the gravitational pull is so strong that escape is impossible.'
      },
      {
        id: 'space-4',
        text: 'Which galaxy is the closest large spiral galaxy to our own Milkey Way?',
        options: [
          'Andromeda',
          'Triangulum',
          'Sombrero',
          'Large Magellanic Cloud'
        ],
        correctIndex: 0,
        explanation: 'The Andromeda Galaxy (M31) is the nearest major spiral galaxy to the Milky Way, located about 2.5 million light-years away.'
      }
    ]
  },
  {
    id: 'world-capitals',
    title: 'Global Wonders & Capital Cities',
    category: 'Geography',
    description: 'Travel around the globe and test your knowledge of international capitals and borders!',
    difficulty: 'medium',
    points: 200,
    durationMinutes: 3,
    icon: 'Globe',
    questions: [
      {
        id: 'geo-1',
        text: 'What is the capital city of Australia?',
        options: [
          'Sydney',
          'Melbourne',
          'Canberra',
          'Brisbane'
        ],
        correctIndex: 2,
        explanation: 'Canberra was selected as Australia\'s capital in 1908 as a compromise between rivals Sydney and Melbourne.'
      },
      {
        id: 'geo-2',
        text: 'Which river is officially recognized as the longest in the entire world?',
        options: [
          'Amazon River',
          'Nile River',
          'Yangtze River',
          'Mississippi River'
        ],
        correctIndex: 1,
        explanation: 'The Nile is traditionally considered the longest river in the world, stretching 6,650 kilometers (4,132 miles), though Brazil claims Amazon is longer.'
      },
      {
        id: 'geo-3',
        text: 'In which European country would you find the stunning mountainous region of Transylvania?',
        options: [
          'Hungary',
          'Romania',
          'Bulgaria',
          'Slovakia'
        ],
        correctIndex: 1,
        explanation: 'Transylvania is a historical region in central Romania, famous for its picturesque Carpathian mountain scenery and associations with Dracula.'
      }
    ]
  },
  {
    id: 'history-clash',
    title: 'Ancient Empires & Battles',
    category: 'History',
    description: 'Step back in time to study the rise and fall of historical civilizations and historic conflicts.',
    difficulty: 'hard',
    points: 350,
    durationMinutes: 4,
    icon: 'BookOpen',
    questions: [
      {
        id: 'hist-1',
        text: 'Who was the first formal Emperor of the Roman Empire, ruling from 27 BC until his death in 14 AD?',
        options: [
          'Julius Caesar',
          'Marcus Aurelius',
          'Augustus Caesar',
          'Nero'
        ],
        correctIndex: 2,
        explanation: 'Born Octavian, Augustus Caesar became the first official Emperor of Rome, marking the transition from the Roman Republic.'
      },
      {
        id: 'hist-2',
        text: 'In what year did the historic fall of Constantinople take place, bringing an end to the Byzantine Empire?',
        options: [
          '1066',
          '1453',
          '1517',
          '1789'
        ],
        correctIndex: 1,
        explanation: 'Constantinople fell on May 29, 1453, to the Ottoman Empire under Sultan Mehmed II, ending the thousand-year Byzantine Empire.'
      },
      {
        id: 'hist-3',
        text: 'Which system of writing did ancient Egyptians use, characterized by pictorial symbols?',
        options: [
          'Cuneiform',
          'Hieroglyphics',
          'Sanskrit',
          'Phoenician Alphabet'
        ],
        correctIndex: 1,
        explanation: 'Hieroglyphics was a formal writing system used by ancient Egyptians that combined logographic, syllabic, and alphabetic elements.'
      }
    ]
  },
  {
    id: 'world-sports',
    title: 'World Cup & Olympics Trivia',
    category: 'Sports',
    description: 'Are you a true athlete or a spectator? Prove your sports memory here!',
    difficulty: 'easy',
    points: 150,
    durationMinutes: 2,
    icon: 'FlameKindling',
    questions: [
      {
        id: 'sport-1',
        text: 'How often are the traditional Summer Olympic Games held?',
        options: [
          'Every 2 years',
          'Every 4 years',
          'Every 5 years',
          'Every year'
        ],
        correctIndex: 1,
        explanation: 'The modern Olympic games are held every 4 years, alternating between summer and winter schedules.'
      },
      {
        id: 'sport-2',
        text: 'Which nation has won the most FIFA World Cup titles in football history?',
        options: [
          'Germany',
          'Argentina',
          'Brazil',
          'Italy'
        ],
        correctIndex: 2,
        explanation: 'Brazil has secured 5 World Cup titles (1958, 1962, 1970, 1994, 2002), the most of any country.'
      },
      {
        id: 'sport-3',
        text: 'In tennis, what word is used to describe a score of zero?',
        options: [
          'Nil',
          'Love',
          'Blank',
          'Void'
        ],
        correctIndex: 1,
        explanation: '"Love" is used to signify a score of zero in tennis, believed to originate from the French word "l\'oeuf" meaning egg.'
      }
    ]
  },
  {
    id: 'cinema-classics',
    title: 'Hollywood & Cinema History',
    category: 'Entertainment',
    description: 'Popcorn ready! Let\'s test your knowledge of legendary blockbusters and award-winning actors.',
    difficulty: 'medium',
    points: 200,
    durationMinutes: 3,
    icon: 'Film',
    questions: [
      {
        id: 'ent-1',
        text: 'Which film became the highest-grossing movie of all time when adjusted for inflation?',
        options: [
          'Avengers: Endgame',
          'Avatar',
          'Gone with the Wind',
          'Titanic'
        ],
        correctIndex: 2,
        explanation: 'Adjusted for monetary inflation, the 1939 classic drama "Gone with the Wind" remains the highest-grossing film in cinema history.'
      },
      {
        id: 'ent-2',
        text: 'How many Academy Awards (Oscars) did the record-breaking fantasy adaptation "The Lord of the Rings: The Return of the King" win?',
        options: [
          '8 Awards',
          '11 Awards',
          '14 Awards',
          '5 Awards'
        ],
        correctIndex: 1,
        explanation: 'In 2004, "The Return of the King" won all 11 Academy Awards for which it was nominated, tying the sweep records of Ben-Hur and Titanic.'
      }
    ]
  }
];
