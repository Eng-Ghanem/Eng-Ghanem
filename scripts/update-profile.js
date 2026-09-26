/**
 * Dynamic GitHub Profile Updater for Eng-Ghanem
 * Fetches all public repositories and dynamically generates categorized project tables.
 */

const fs = require('fs');
const path = require('path');

const GITHUB_USERNAME = 'Eng-Ghanem';
const README_PATH = path.resolve(__dirname, '..', 'README.md');

// Curated metadata for established repositories to preserve verified technical documentation
const CURATED_PROJECTS = {
  'Secure-IOT-Network-Design': {
    title: 'Secure IoT Network Design',
    category: 'cybersecurity',
    focus: '3-Layer Defense-in-Depth Architecture, Threat Modeling, Incident Response',
    stack: 'mTLS, TPM 2.0, Secure Boot, VLANs, Cryptographic OTA'
  },
  'Network-Security_5GCOM-project': {
    title: 'Enterprise Network & CyberOps (5GCOM)',
    category: 'cybersecurity',
    focus: 'Multi-Building Campus Network, Enterprise ACLs & Threat Hardening',
    stack: 'Cisco Packet Tracer, OSPF, VLANs, Syslog, NTP, Port Security'
  },
  'Navigation_and_Positioning_Systems_Autonomous_Vehicles_Project': {
    title: 'Autonomous Vehicle Navigation Security',
    category: 'cybersecurity',
    focus: 'Cyber-Physical Threat Analysis on GNSS, GPS Spoofing & V2X Channels',
    stack: 'GNSS L1/E1, Galileo OSNMA, Sensor Fusion EKF, CAN Bus Security'
  },
  'Face-Anti-Spoofing': {
    title: 'Face Liveness & Biometric Anti-Spoofing',
    category: 'cybersecurity',
    focus: 'Real-Time Biometric Defense against Screen & Print Replay Attacks',
    stack: 'Python, OpenCV, Local Binary Patterns (LBP), RBF-SVM'
  },
  'Facial-Emotion-Recognition': {
    title: 'Facial Emotion Recognition Pipeline',
    category: 'ai_ml',
    focus: 'Deep Learning Emotion Classification with EfficientNet, TTA & Class Weighting',
    stack: 'Deep Learning, EfficientNet, Transfer Learning, Flask API, Jupyter'
  },
  'EKF-UKF-kalman-filter-using-python-radar-measurments-nonlinear-system-Virtualization': {
    title: 'EKF vs. UKF Radar State Estimation',
    category: 'ai_ml',
    focus: 'Nonlinear 2D Target Tracking from Noisy Polar Radar Signals',
    stack: 'Extended Kalman Filter (Taylor Jacobians), Unscented Kalman Filter (Merwe Sigma Points), NumPy'
  },
  'Maze-Solver-using-Reinforcement-Learning-Q-Learning-AI': {
    title: 'Autonomous Maze Solver Agent',
    category: 'ai_ml',
    focus: 'Tabular Reinforcement Learning Navigation in Dynamic GridWorld',
    stack: 'Q-Learning (Temporal Difference Control), $\\epsilon$-Greedy Policy, Pygame'
  },
  'Machine-Learning-Codes-in-Python': {
    title: 'Foundational ML from Scratch',
    category: 'ai_ml',
    focus: 'Mathematical Implementation of Core Algorithms without High-Level ML Frameworks',
    stack: 'Backpropagation, Multi-Layer Perceptrons, K-Means Clustering, SVM Margins, OLS'
  },
  'PID-Tuning-with-Bayesian-Optimization-method-Good_gain_method_GUI': {
    title: 'PID Tuning via Bayesian Optimization',
    category: 'ai_ml',
    focus: 'Gaussian Process Surrogate Modeling & Industrial Good Gain GUI',
    stack: 'MATLAB, Simulink, Gaussian Process Regression, ITAE Objective Optimization'
  },
  'AlMajd-Air-Platform': {
    title: 'AlMajd Air HVAC Platform',
    category: 'fullstack',
    focus: 'Service Booking, Video Diagnosis Uploads, Stripe Payments & Admin Analytics',
    stack: 'React 19, Vite, Tailwind CSS, Express 5, Supabase PostgreSQL, Stripe'
  },
  'Manarat_Al_Daad_Platform': {
    title: 'Manarat Al-Daad Platform',
    category: 'fullstack',
    focus: 'Gamified Arabic E-Learning Platform with Quizzes & Real-Time Community Chat',
    stack: 'React 19, Tailwind v4, Express 5, Supabase Row Level Security (RLS), i18next'
  },
  'Restaurant_App': {
    title: 'RESTO Management Ecosystem',
    category: 'fullstack',
    focus: 'Multi-Tier Restaurant Operations (Customer, Admin & Delivery Personnel)',
    stack: 'Node.js, Express, MySQL Workbench EER, JWT Auth, Joi Validation, Flutter'
  },
  'Admin_Interfce_in_Resturant_app': {
    title: 'Admin Restaurant Interface',
    category: 'fullstack',
    focus: 'Cross-Platform Flutter Dashboard for Live Orders, Bookings & Couriers',
    stack: 'Flutter 3, Dart, Material 3 Design, REST API Integration'
  },
  'Searching-Sorting-Algorithm': {
    title: 'Search & Sort Algorithm Benchmarker',
    category: 'fullstack',
    focus: 'Empirical Execution Time Profiling ($O(n \\log n)$ vs $O(n^2)$) on Utility Billing Data',
    stack: 'Flutter, Dart, Stopwatch Diagnostics, Merge/Quick/Heap/Binary Search'
  },
  'Industrial-Robotic-Arm': {
    title: 'Vision-Guided Robotic Sorting Cell',
    category: 'autonomous_systems',
    focus: 'Optical Classification & Pick-and-Place Manipulation',
    stack: 'Universal Robots UR5e, Robotiq 3-Finger Adaptive Gripper, Webots Simulator, C'
  },
  'Auto-Guided-Veical': {
    title: 'Autonomous Guided Vehicle (AGV)',
    category: 'autonomous_systems',
    focus: 'Grid Line Following & Wireless Teleoperation',
    stack: 'Arduino Uno, ATmega328P, MPU6050 6-DOF IMU, L298N, JavaFX BlueCove RFCOMM'
  },
  'Distance-Control-vehicle': {
    title: 'Distance Control Vehicle',
    category: 'autonomous_systems',
    focus: 'Closed-Loop Obstacle Distance Regulation ($25\\text{ cm}$ Setpoint)',
    stack: 'ATmega32 AVR, FreeRTOS Multitasking Kernel, Ultrasonic Sensor, PID Controller'
  },
  'DoodleJump_Game': {
    title: 'DoodleJump PC & Physical Controller',
    category: 'autonomous_systems',
    focus: 'Arcade Game Engine with Tilt-Based Physical Steering Controller',
    stack: 'Java, JavaFX 17, Arduino Uno, MPU6050 IMU, jSerialComm'
  }
};

/**
 * Intelligent categorization for newly added repositories
 */
function categorizeRepo(repo) {
  const name = (repo.name || '').toLowerCase();
  const desc = (repo.description || '').toLowerCase();
  const topics = (repo.topics || []).map(t => t.toLowerCase());
  const allText = `${name} ${desc} ${topics.join(' ')}`;

  // Cybersecurity & SOC keywords
  const cyberKeywords = [
    'cyber', 'security', 'soc', 'network', 'threat', 'packet', 'vulnerability',
    'wireshark', 'cisco', 'iot', 'crypto', 'firewall', 'defense', 'attack',
    'spoofing', 'siem', 'ids', 'ips', 'incident', 'penetration', 'forensic', 'malware'
  ];
  if (cyberKeywords.some(k => allText.includes(k))) {
    return 'cybersecurity';
  }

  // AI & Machine Learning keywords
  const aiKeywords = [
    'ai', 'ml', 'machine-learning', 'deep-learning', 'reinforcement', 'q-learning',
    'kalman', 'neural', 'vision', 'opencv', 'detection', 'prediction', 'model',
    'data-science', 'nlp', 'llm', 'emotion', 'facial', 'face', 'recognition',
    'classification', 'efficientnet', 'transfer-learning', 'cnn', 'rnn', 'lstm', 'transformer'
  ];
  if (aiKeywords.some(k => allText.includes(k))) {
    return 'ai_ml';
  }

  // Autonomous / Embedded Systems keywords
  const autoKeywords = [
    'robot', 'robotic', 'vehicle', 'veical', 'arduino', 'avr', 'freertos',
    'embedded', 'hardware', 'arm', 'controller', 'simulation', 'webots'
  ];
  if (autoKeywords.some(k => allText.includes(k))) {
    return 'autonomous_systems';
  }

  // Default to Full-Stack / Software
  return 'fullstack';
}

function cleanTitle(repoName) {
  return repoName
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

async function fetchRepos() {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Eng-Ghanem-Profile-Updater'
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&type=public&sort=updated`, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch repositories: ${res.status} ${res.statusText}`);
  }
  const repos = await res.json();
  return repos.filter(r => r.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase() && !r.fork);
}

function buildTable(items) {
  let table = '| Project | Core Domain / Focus | Key Technologies | Repository |\n';
  table += '|:---|:---|:---|:---:|\n';

  for (const item of items) {
    table += `| **${item.title}** | ${item.focus} | ${item.stack} | [**Explore**](${item.url}) |\n`;
  }
  return table;
}

async function main() {
  console.log(`Fetching repositories for ${GITHUB_USERNAME}...`);
  const repos = await fetchRepos();
  console.log(`Discovered ${repos.length} public repositories.`);

  const categories = {
    cybersecurity: [],
    ai_ml: [],
    fullstack: [],
    autonomous_systems: []
  };

  for (const repo of repos) {
    const curated = CURATED_PROJECTS[repo.name];
    if (curated) {
      categories[curated.category].push({
        title: curated.title,
        focus: curated.focus,
        stack: curated.stack,
        url: repo.html_url
      });
    } else {
      const cat = categorizeRepo(repo);
      const title = cleanTitle(repo.name);
      const focus = repo.description || 'Engineered software repository and system implementation';
      const stack = repo.language ? `${repo.language}${repo.topics && repo.topics.length ? ', ' + repo.topics.slice(0, 3).join(', ') : ''}` : 'Software';

      categories[cat].push({
        title,
        focus,
        stack,
        url: repo.html_url
      });
      console.log(`Auto-categorized new repository "${repo.name}" -> ${cat}`);
    }
  }

  let dynamicSection = `<!-- DYNAMIC_PROJECTS_START -->
<div align="center">

### 🛡️ Cybersecurity, SOC & Network Defense

${buildTable(categories.cybersecurity)}
---

### 🧠 Artificial Intelligence, Machine Learning & Intelligent Systems

${buildTable(categories.ai_ml)}
---

### 💻 Full-Stack Web & Software Platforms

${buildTable(categories.fullstack)}
---

<details>
<summary><b>⚙️ Additional Engineering & Autonomous Systems Projects (Click to expand)</b></summary>
<br/>

${buildTable(categories.autonomous_systems)}
</details>

</div>
<!-- DYNAMIC_PROJECTS_END -->`;

  if (!fs.existsSync(README_PATH)) {
    console.error(`README not found at ${README_PATH}`);
    process.exit(1);
  }

  const currentReadme = fs.readFileSync(README_PATH, 'utf8');
  const regex = /<!-- DYNAMIC_PROJECTS_START -->[\s\S]*?<!-- DYNAMIC_PROJECTS_END -->/;

  if (!regex.test(currentReadme)) {
    console.error('Marker <!-- DYNAMIC_PROJECTS_START --> not found in README.md');
    process.exit(1);
  }

  const updatedReadme = currentReadme.replace(regex, dynamicSection);

  if (updatedReadme === currentReadme) {
    console.log('README.md is already up to date. No changes needed.');
  } else {
    fs.writeFileSync(README_PATH, updatedReadme, 'utf8');
    console.log('Successfully updated README.md with dynamic project tables.');
  }
}

main().catch(err => {
  console.error('Error updating profile:', err);
  process.exit(1);
});
