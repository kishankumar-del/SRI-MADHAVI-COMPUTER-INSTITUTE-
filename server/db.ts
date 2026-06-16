import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DB_FILE = path.join(process.cwd(), 'database.json');

// Interface types matching our Database Structure
export interface Admin {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string; // 'Beginner' | 'Intermediate' | 'Advanced'
  image: string;
  syllabus: string; // Newline separated topics
  learningOutcomes: string; // Newline separated outcomes
  prerequisites: string;
}

export interface Application {
  applicationId: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: string;
  mobile: string;
  altMobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  qualification: string;
  collegeName: string;
  percentage: string;
  course: string; // Title or ID
  studentPhoto: string; // base64 or URL
  idProof: string; // base64 or URL
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface Certificate {
  certificateId: string;
  rollNumber: string;
  studentName: string;
  course: string;
  dob: string;
  completionDate: string;
  certificateFile?: string; // Optional custom cert details
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'Unread' | 'Resolved';
  createdAt: string;
}

export interface DatabaseSchema {
  admins: Admin[];
  courses: Course[];
  applications: Application[];
  certificates: Certificate[];
  inquiries: Inquiry[];
}

// Password hashing helper using Node's native crypto
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Initial seed data representing Sri Madhavi Computer Institute
const INITIAL_COURSES: Course[] = [
  {
    id: 'c-prog',
    title: 'C Programming',
    description: 'Master the fundamentals of C, the foundation of modern languages. Learn memory management, pointers, and key algorithmic elements.',
    duration: '6 Weeks',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1627390491438-2c81773099cd?w=600&auto=format&fit=crop&q=80',
    syllabus: 'Introduction to C\nVariables & Data Types\nOperators & Expressions\nControl Flow (If-Else, Loops)\nArrays & Strings\nFunctions & Recursion\nPointers & Memory Allocation\nStructures & Unions\nFile Handling in C',
    learningOutcomes: 'Write efficient standalone computer programs from scratch\nUnderstand complete computer memory alignment, stack and heap allocation\nDevelop solid program debugging skills with GDB',
    prerequisites: 'No prior computer science or coding background required.'
  },
  {
    id: 'cpp-prog',
    title: 'C++',
    description: 'Dive deep into Object-Oriented Programming (OOP) with robust memory administration, template systems, and the STL library.',
    duration: '8 Weeks',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=80',
    syllabus: 'C++ Basics & Syntax\nOOP Principles: Classes & Objects\nInheritance & Polymorphism\nEncapsulation & Abstraction\nPointers & References\nMemory Allocation & Deconstructors\nTemplates & Operator Overloading\nStandard Template Library (STL)\nException Handling',
    learningOutcomes: 'Build modular, highly components-oriented software designs\nLeverage C++ Standard Template Library for advanced collections\nManage object-oriented architectures and multi-class design patterns',
    prerequisites: 'Basic knowledge of C Programming is beneficial but not mandatory.'
  },
  {
    id: 'java-prog',
    title: 'Java',
    description: 'Build robust, cross-platform enterprise software. Master core Java, multithreading, OOP, and foundational collections.',
    duration: '10 Weeks',
    level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    syllabus: 'Core Java Fundamentals\nObject-Oriented Programming in Java\nException Handling & Assertions\nJava Collections Framework (List, Set, Map)\nMultithreading & Concurrency\nJava I/O & Serialization\nDatabase Connection using JDBC\nLambda Expressions & Streams API',
    learningOutcomes: 'Develop platform-independent consumer and enterprise software\nUnderstand real-world application threading and concurrency mechanisms\nBuild powerful datastore integrations via JDBC pipeline',
    prerequisites: 'Familiarity with basic programming logic.'
  },
  {
    id: 'python-prog',
    title: 'Python',
    description: 'Learn the most versatile programming language. Go from foundational syntax to object-oriented concepts and automated tooling.',
    duration: '8 Weeks',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    syllabus: 'Python Introduction & Syntax\nData Structures (Lists, Tuples, Sets, Dicts)\nFunctions & Modules\nFile I/O Operations\nObject-Oriented Python\nError & Exception Handling\nRegular Expressions\nStandard Libraries overview\nIntroduction to Data Processing',
    learningOutcomes: 'Write legible, standard Python code for automation, scripting, and web\nWork comfortably with dynamic structural data pipelines\nExecute complex file manipulations, scraping, and automation scripts',
    prerequisites: 'No specific math or coding prerequisite.'
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    description: 'The premier technical syllabus for cracking standard competitive challenges and engineering interviews. Arrays, Lists, Trees, and dynamic solutions.',
    duration: '12 Weeks',
    level: 'Advanced',
    image: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=600&auto=format&fit=crop&q=80',
    syllabus: 'Asymptotic Notation (Time & Space Complexity)\nArrays, Linked Lists & Doubly Linked Lists\nStacks & Queues\nTrees: Binary Trees, BSTs, AVL Trees, Heaps\nGraphs & Traversal Algorithms (BFS, DFS)\nSorting & Searching Algorithms\nRecursion & Backtracking\nDivide & Conquer Algorithms\nDynamic Programming & Greedy Algorithms',
    learningOutcomes: 'Evaluate complex runtime behaviors with Big O notations confidently\nSolve complex storage structure problems under minimal CPU bounds\nMaster advanced programming patterns for large technical interviews',
    prerequisites: 'Strong proficiency in at least one key programming language (C++, Java, or Python).'
  },
  {
    id: 'sql',
    title: 'SQL',
    description: 'Design database systems, run multi-table logical queries, and organize transactions with relational database engineering.',
    duration: '6 Weeks',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    syllabus: 'Introduction to Relational Databases\nSQL Syntax and SELECT Statement\nFiltering and Sorting Data\nJoins (Inner, Left, Right, Full)\nAggregate Functions & GROUP BY\nSubqueries & Common Table Expressions (CTEs)\nData Manipulation (INSERT, UPDATE, DELETE)\nDDL Commands (CREATE, ALTER, DROP tables)\nIndexes & Query Optimization',
    learningOutcomes: 'Construct complex queries to extract deep analytics from relational databases\nDesign normalized database models conforming to standard business cases\nOptimize slow database access speeds via structural indexes',
    prerequisites: 'None. Perfect for business analysts and programmers alike.'
  },
  {
    id: 'html',
    title: 'HTML',
    description: 'Learn structural document development for the global web. Build accessible, semantic page layouts from scratch.',
    duration: '3 Weeks',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1627390491438-2c81773099cd?w=600&auto=format&fit=crop&q=80',
    syllabus: 'Introduction to the World Wide Web\nHTML Document Anatomy\nSemantic Structural Tags\nWorking with Text, Lists & Links\nMultimedia integration (Images, Video, Audio)\nTables & Structuring Data\nHTML Forms & Input Controls\nWeb Accessibility (a11y) basics\nGlobal HTML Validations',
    learningOutcomes: 'Create accessible, screen-readable semantic web page systems\nConnect layouts across pages with solid reference links and menus\nUtilize fully compliant web form grids with dynamic parameter captures',
    prerequisites: 'None.'
  },
  {
    id: 'css',
    title: 'CSS',
    description: 'Convert plain web layouts into visually spectacular interfaces. Learn positioning, responsive layouts, Flexbox, and Grid styling.',
    duration: '4 Weeks',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    syllabus: 'CSS Rules and Cascade Rules\nSelectors and Specifity\nCSS Box Model (Margins, Borders, Padding)\nColor Theory and Custom Typography\nStandard Floats and Positioning Models\nFlexbox Layout Architecture\nCSS Grid Layout Architecture\nMedia Queries and Responsive Web Design\nTransitions, Transforms, and Custom Keyframe Animations',
    learningOutcomes: 'Transform unstyled layouts into gorgeous pixel-perfect mockups\nBuild responsive websites that scale cleanly across mobile, tablets, and wide screens\nUnderstand cross-browser alignments, modern Flex grid positioning, and transitions',
    prerequisites: 'Basic capability with HTML structures.'
  },
  {
    id: 'javascript',
    title: 'JavaScript',
    description: 'Implement logical operations, responsive actions, browser controls, and asynchronous API actions on client-facing applications.',
    duration: '6 Weeks',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=80',
    syllabus: 'JS Basics: Variables, Loops, Conditionals\nFunctions and Lexical Closures\nManipulating the DOM (Document Object Model)\nBrowser Event Handling\nAsynchronous Core: Callbacks, Promises, Async/Await\nFetching API Data using JSON\nES6+ Modern Syntax features\nPrototypes and Object-Oriented JS\nLocal Storage and Session Storage configurations',
    learningOutcomes: 'Program responsive interactive features on standard browser files\nQuery remote servers on-the-fly via async requests safely\nArchitect lightweight, modern client-side software states',
    prerequisites: 'Basic HTML and CSS understanding.'
  },
  {
    id: 'react-js',
    title: 'React',
    description: 'Build powerful modern visual interfaces with Virtual DOM mechanics, reusable component state pipelines, and declarative programming.',
    duration: '8 Weeks',
    level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    syllabus: 'React Core Philosophy and SPA Concepts\nJSX Syntax and Component Composition\nProps and Component State Management (useState)\nComponent Lifecycle & Hooks (useEffect, useRef)\nHandling Events and Form State\nConditional Rendering and Lists rendering\nShared State and Context API (useContext)\nIntroduction to React Routing\nCustom State Hooks and API Fetch architectures',
    learningOutcomes: 'Build complex, reactive single-page components using Hooks\nMaintain organized shared variables dynamically throughout user nodes\nIntegrate modular components to accelerate product workflows',
    prerequisites: 'Excellent command over JavaScript (ES6+).'
  },
  {
    id: 'node-js',
    title: 'Node.js',
    description: 'Implement back-end servers, build custom request routes, and administer fast I/O file controllers with server-side JavaScript.',
    duration: '8 Weeks',
    level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    syllabus: 'Node.js Event Loop Architecture\nCore Modules: Path, FS, OS, HTTP\nNPM (Node Package Manager) and Dependency Control\nCreating Servers with Express.js Node\nRouting & Middleware pipeline integration\nAPI JSON Responses & Status Headers\nError Handling and Logging structures\nFile Streaming and buffer integrations',
    learningOutcomes: 'Launch fast backend systems executing RESTful API designs\nIncorporate local database controllers and user parsing securely\nOptimize asynchronous requests utilizing native non-blocking loops',
    prerequisites: 'Strong JavaScript foundations, including Promises.'
  },
  {
    id: 'fullstack',
    title: 'Full Stack Development',
    description: 'The ultimate path. Build major front-to-back programs. Master database integration, user validation, and responsive frontends.',
    duration: '16 Weeks',
    level: 'Advanced',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80',
    syllabus: 'Software Architecture & System Design overview\nReact Frontend + Express Node.js Backend pipeline\nDatabase Design: Relational vs Non-Relational models\nAPI Endpoints creation and integration controllers\nJWT Session validation & Roles security\nDeployment strategies and DevOps pipelines\nWorking on major Capstone business projects',
    learningOutcomes: 'Deploy live full-stack, authenticated consumer database applications\nArchitect robust security features guarding user sessions\nConfigure continuous Integration and production servers autonomously',
    prerequisites: 'Proficiency in basic JavaScript or HTML/CSS/Node frameworks.'
  },
  {
    id: 'interview-prep',
    title: 'Interview Preparation',
    description: 'Refine computer science reasoning, solve live coding puzzles, and review standard scenario evaluations for key enterprise interviews.',
    duration: '4 Weeks',
    level: 'Advanced',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
    syllabus: 'Resume Building & GitHub Portfolios crafting\nLive algorithmic sessions and whiteboard challenges\nSystem Design fundamentals & Scalability concepts\nCommon System Behavioral evaluations & HR expectations\nSimulated mock interviews under strict time limits\nAnswering tricky technical concepts (OOP, DBMS, OS, Networking)',
    learningOutcomes: 'Formulate fast responses to advanced coding problems under pressure\nCraft professional engineering portfolios highlighting capabilities\nCommunicate software design choices and performance trade-offs effectively',
    prerequisites: 'Familiar with at least one software language and basic DSA.'
  },
  {
    id: 'aptitude',
    title: 'Aptitude Training',
    description: 'Develop rapid numerical solvers, logical trackers, and analytical processors crucial for premier competitive exams and campus selections.',
    duration: '4 Weeks',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    syllabus: 'Quantitative Ability: Percentages, Profit/Loss, Interest, Averages\nTime, Speed, Distance and Ratio proportions\nLogical Reasoning: Blood Relations, Coding-Decoding, Seating Arrangements\nData Interpretation: Tables, Bar Charts, Pie Charts, Line Graphs\nVerbal Ability: Grammar concepts, Reading Comprehension, Sentence Corrections\nExam-taking methodologies and mental calculation shortcuts',
    learningOutcomes: 'Solve quantitative reasoning equations with high speed and accuracy\nAce standard screening rounds for MNC recruitment processes\nIdentify logical pathways and data relationships efficiently',
    prerequisites: 'None.'
  }
];

const INITIAL_CERTIFICATES: Certificate[] = [
  {
    certificateId: 'NCC-CERT-2026001',
    rollNumber: 'ROLL-26101',
    studentName: 'Amit Sharma',
    course: 'Full Stack Development',
    dob: '2001-05-15',
    completionDate: '2026-03-30'
  },
  {
    certificateId: 'NCC-CERT-2026002',
    rollNumber: 'ROLL-26102',
    studentName: 'Priya Patel',
    course: 'Python Programming',
    dob: '2002-08-22',
    completionDate: '2026-01-15'
  }
];

const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    name: 'Suresh Kumar',
    email: 'suresh.k@gmail.com',
    phone: '9876543210',
    message: 'Hello, I want to join the Python and DSA masterclasses. Can you share the fee layout and morning slot availability details?',
    status: 'Unread',
    createdAt: '2026-06-15T09:30:00Z'
  }
];

const INITIAL_DB: DatabaseSchema = {
  admins: [
    {
      id: 'admin-1',
      name: 'Sri Madhavi Admin',
      email: 'admin@srimadhavi.com',
      passwordHash: hashPassword('admin123'),
      role: 'SuperAdmin'
    }
  ],
  courses: INITIAL_COURSES,
  applications: [
    {
      applicationId: 'NCC-2026-0001',
      studentName: 'Rohan Deshmukh',
      fatherName: 'Sanjay Deshmukh',
      motherName: 'Lata Deshmukh',
      dob: '2003-12-10',
      gender: 'Male',
      mobile: '9890123456',
      altMobile: '9890123457',
      email: 'rohan.desh@gmail.com',
      address: 'Sector 5, Hiranandani Complex',
      city: 'Pune',
      state: 'Maharashtra',
      pinCode: '411001',
      qualification: 'B.E. Computer Science',
      collegeName: 'Pune Engineering College',
      percentage: '84.5%',
      course: 'Data Structures & Algorithms',
      studentPhoto: '',
      idProof: '',
      status: 'Pending',
      createdAt: '2026-06-14T14:20:00.000Z'
    }
  ],
  certificates: INITIAL_CERTIFICATES,
  inquiries: INITIAL_INQUIRIES
};

// Database state
let dbState: DatabaseSchema = { ...INITIAL_DB };

// Initialize database (loads from file if exists, else creates standard seeds)
export function initDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const loaded = JSON.parse(content) as DatabaseSchema;
      // Ensure all fields are initialized
      dbState = {
        admins: loaded.admins || INITIAL_DB.admins,
        courses: loaded.courses || INITIAL_DB.courses,
        applications: loaded.applications || INITIAL_DB.applications,
        certificates: loaded.certificates || INITIAL_DB.certificates,
        inquiries: loaded.inquiries || INITIAL_DB.inquiries,
      };
      console.log('Database loaded successfully from file.');
    } else {
      saveDbState(INITIAL_DB);
      dbState = { ...INITIAL_DB };
      console.log('Database file not found. Pre-populated initialized seed content.');
    }
  } catch (err) {
    console.error('Error reading database file, using fallback state: ', err);
    dbState = { ...INITIAL_DB };
  }
}

function saveDbState(data: DatabaseSchema) {
  try {
    const parentDir = path.dirname(DB_FILE);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database metadata file: ', err);
  }
}

// Global actions
export function getDb(): DatabaseSchema {
  return dbState;
}

export function updateDb(updater: (db: DatabaseSchema) => void) {
  updater(dbState);
  saveDbState(dbState);
}
