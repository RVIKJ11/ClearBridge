import type { ProcessedResults } from '@/types';

export const DEMO_TRANSCRIPT = `Good morning everyone. Welcome to Introduction to Biology, Section 4. My name is Professor Chen. Before we start today's lecture on cellular respiration, I need to go over a few administrative items.

First, your lab report from last week is due this Friday, November 15th, by 11:59 PM. No late submissions will be accepted. Make sure you include your data tables, your analysis, and a conclusion section. That's three separate sections.

Second, we will have a midterm exam on November 22nd. The exam will cover chapters 4 through 8. I will post a study guide on the course website by Monday. I strongly recommend reviewing the diagrams in chapter 6 because those will definitely appear on the exam.

Third, office hours have changed. Starting next week, my office hours will be Tuesdays and Thursdays from 2 to 4 PM instead of Mondays. Dr. Park's office hours are still Wednesdays from 1 to 3 PM.

Now, let's get into cellular respiration. Cellular respiration is the process by which cells break down glucose and other organic molecules to produce ATP, which is the cell's main energy currency. Without ATP, cells cannot perform any of their basic functions.

There are three main stages of cellular respiration. The first is glycolysis, which happens in the cytoplasm. During glycolysis, one molecule of glucose is broken down into two molecules of pyruvate. This process produces a net gain of 2 ATP molecules. Glycolysis does not require oxygen, so it can occur in both aerobic and anaerobic conditions.

The second stage is the Krebs cycle, also called the citric acid cycle. This takes place in the mitochondrial matrix. The pyruvate from glycolysis is converted to acetyl CoA, which then enters the Krebs cycle. The main outputs of the Krebs cycle are NADH and FADH2, which are electron carriers that will be used in the next stage.

The third and most important stage is the electron transport chain, which is located in the inner mitochondrial membrane. This is where most of the ATP is produced. NADH and FADH2 donate their electrons to the chain, and as electrons pass through, protons are pumped across the membrane. This creates a concentration gradient that drives ATP synthesis through a protein called ATP synthase. In total, cellular respiration can produce approximately 36 to 38 ATP molecules per glucose molecule.

For next class, please read chapter 7 on photosynthesis. There will be a short quiz at the beginning of class on Thursday covering today's material. The quiz will be 10 multiple choice questions. Make sure you know the three stages and their locations in the cell.

Any questions? No? Okay, we will pick up with photosynthesis on Thursday. See everyone then.`;

export const DEMO_RESULTS: ProcessedResults = {
  originalText: DEMO_TRANSCRIPT,
  cleanedTranscript: `Good morning everyone. Welcome to Introduction to Biology, Section 4. My name is Professor Chen. Before we start today's lecture on cellular respiration, I need to go over a few administrative items.

First, your lab report from last week is due this Friday, November 15th, by 11:59 PM. No late submissions will be accepted. Make sure you include your data tables, your analysis, and a conclusion section. That's three separate sections.

Second, we will have a midterm exam on November 22nd. The exam will cover chapters 4 through 8. I will post a study guide on the course website by Monday. I strongly recommend reviewing the diagrams in chapter 6 because those will definitely appear on the exam.

Third, office hours have changed. Starting next week, my office hours will be Tuesdays and Thursdays from 2 to 4 PM instead of Mondays. Dr. Park's office hours are still Wednesdays from 1 to 3 PM.

Cellular respiration is the process by which cells break down glucose and other organic molecules to produce ATP, which is the cell's main energy currency. Without ATP, cells cannot perform any of their basic functions.

There are three main stages of cellular respiration:

Stage 1 - Glycolysis occurs in the cytoplasm. One molecule of glucose is broken down into two molecules of pyruvate, producing a net gain of 2 ATP molecules. Glycolysis does not require oxygen, so it can occur in both aerobic and anaerobic conditions.

Stage 2 - The Krebs cycle (citric acid cycle) takes place in the mitochondrial matrix. Pyruvate is converted to acetyl CoA, which enters the Krebs cycle. The main outputs are NADH and FADH2, which are electron carriers used in the next stage.

Stage 3 - The electron transport chain is located in the inner mitochondrial membrane. This is where most ATP is produced. NADH and FADH2 donate electrons to the chain, protons are pumped across the membrane creating a concentration gradient that drives ATP synthesis through ATP synthase. Total output is approximately 36 to 38 ATP molecules per glucose molecule.

For next class, read chapter 7 on photosynthesis. There will be a 10-question multiple choice quiz on Thursday covering today's material on the three stages and their cell locations.`,

  summary:
    'Professor Chen covered cellular respiration in a Biology lecture, explaining the three main stages: glycolysis, the Krebs cycle, and the electron transport chain. The lecture also included important administrative updates about upcoming deadlines, a midterm exam, and office hour changes.',

  detailedSummary:
    `This Introduction to Biology lecture by Professor Chen covered two major areas: administrative announcements and the core science content on cellular respiration.

On the administrative side, three important items were discussed. First, the lab report from last week is due Friday, November 15th by 11:59 PM with no late submissions accepted. The report must include data tables, analysis, and a conclusion section. Second, a midterm exam is scheduled for November 22nd covering chapters 4 through 8, with a study guide to be posted on the course website by Monday. Professor Chen specifically recommended reviewing the diagrams in chapter 6. Third, office hours are changing to Tuesdays and Thursdays from 2 to 4 PM, while Dr. Park's hours remain on Wednesdays from 1 to 3 PM.

The main lecture content focused on cellular respiration, the process by which cells break down glucose to produce ATP (the cell's energy currency). Three stages were explained in detail: glycolysis (occurs in the cytoplasm, produces 2 ATP, does not require oxygen), the Krebs cycle (occurs in the mitochondrial matrix, produces electron carriers NADH and FADH2), and the electron transport chain (located in the inner mitochondrial membrane, produces most of the ATP through a concentration gradient driving ATP synthase). The total yield is approximately 36 to 38 ATP molecules per glucose molecule.

Students were assigned to read chapter 7 on photosynthesis and prepare for a 10-question multiple choice quiz on Thursday covering today's material.`,

  simplifiedExplanation: `In this Biology class, Professor Chen explained how cells make energy.

Every cell in your body needs energy to work. Cells get that energy through a process called cellular respiration. Here is how it works:

Step 1 - Glycolysis: The cell breaks down one sugar molecule (glucose) in the cytoplasm. This makes 2 energy packets (ATP). No oxygen is needed for this step.

Step 2 - Krebs Cycle: The broken-down sugar goes into the mitochondria (the cell's power center). Here it goes through a cycle that creates special electron-carrying molecules (NADH and FADH2).

Step 3 - Electron Transport Chain: The electron carriers from Step 2 are used to make a lot more energy. This is the biggest energy-making step. It happens in the membrane of the mitochondria. The final output is 36 to 38 ATP molecules total.

Think of it this way: one sugar molecule goes in, and about 36 to 38 units of usable energy come out.`,

  keyPoints: [
    'Cellular respiration converts glucose into ATP, the cell\'s main energy currency.',
    'Glycolysis occurs in the cytoplasm, produces 2 ATP, and does not require oxygen.',
    'The Krebs cycle occurs in the mitochondrial matrix and produces electron carriers (NADH, FADH2).',
    'The electron transport chain in the inner mitochondrial membrane produces most of the ATP (36 to 38 total per glucose).',
    'ATP synthase is the protein that drives ATP production using the proton concentration gradient.',
  ],

  actionItems: [
    'Submit lab report by Friday, November 15th at 11:59 PM (include data tables, analysis, and conclusion).',
    'Review chapters 4 through 8 for the midterm exam on November 22nd.',
    'Check the course website for the study guide by Monday.',
    'Read Chapter 7 on photosynthesis before Thursday\'s class.',
    'Study the three stages of cellular respiration and their cell locations for the Thursday quiz.',
  ],

  dates: [
    'Lab report due: Friday, November 15th at 11:59 PM',
    'Midterm exam: November 22nd, covers chapters 4 through 8',
    'Study guide posted: by Monday on the course website',
    'Short quiz: Thursday at the beginning of class (10 multiple choice questions)',
    'Office hours change: starting next week, Tuesdays and Thursdays 2 to 4 PM (instead of Mondays)',
    'Dr. Park\'s office hours: Wednesdays 1 to 3 PM (unchanged)',
  ],

  questions: [
    'Any questions about today\'s material on cellular respiration?',
  ],

  steps: [
    'Step 1: Glycolysis - glucose is broken down into two pyruvate molecules in the cytoplasm, producing 2 ATP.',
    'Step 2: Krebs Cycle - pyruvate is converted to acetyl CoA in the mitochondrial matrix, producing NADH and FADH2.',
    'Step 3: Electron Transport Chain - NADH and FADH2 donate electrons in the inner mitochondrial membrane, driving ATP synthase to produce most of the ATP.',
  ],

  namesAndTerms: [
    'Professor Chen - Biology lecturer',
    'Dr. Park - Has office hours Wednesdays 1-3 PM',
    'ATP (Adenosine Triphosphate) - Cell\'s energy currency',
    'Glycolysis - First stage of cellular respiration',
    'Krebs Cycle / Citric Acid Cycle - Second stage',
    'Electron Transport Chain - Third stage',
    'ATP Synthase - Protein that produces ATP',
    'NADH and FADH2 - Electron carriers',
    'Pyruvate - Product of glycolysis',
    'Acetyl CoA - Enters the Krebs cycle',
  ],

  glossary: [
    { term: 'Cellular Respiration', definition: 'The process by which cells break down glucose and other organic molecules to produce ATP (energy). Occurs in three main stages.' },
    { term: 'ATP', definition: 'Adenosine triphosphate. The main energy currency used by all cells to perform their basic functions.' },
    { term: 'Glycolysis', definition: 'The first stage of cellular respiration, occurring in the cytoplasm. Breaks glucose into pyruvate, producing 2 ATP. Does not require oxygen.' },
    { term: 'Krebs Cycle', definition: 'The second stage of cellular respiration (also called the citric acid cycle). Takes place in the mitochondrial matrix. Produces electron carriers NADH and FADH2.' },
    { term: 'Electron Transport Chain', definition: 'The third and most productive stage of cellular respiration. Located in the inner mitochondrial membrane. Produces most of the ATP through chemiosmosis.' },
    { term: 'ATP Synthase', definition: 'A protein in the mitochondrial membrane that uses the proton gradient to synthesize ATP from ADP.' },
    { term: 'NADH / FADH2', definition: 'Electron carrier molecules produced during glycolysis and the Krebs cycle. They donate electrons to the electron transport chain.' },
    { term: 'Pyruvate', definition: 'A three-carbon molecule produced from glucose during glycolysis. Gets converted to acetyl CoA before entering the Krebs cycle.' },
    { term: 'Mitochondria', definition: 'The organelle where most of cellular respiration takes place (the Krebs cycle and electron transport chain). Often called the cell\'s powerhouse.' },
    { term: 'Aerobic', definition: 'Processes that require oxygen. The Krebs cycle and electron transport chain are aerobic.' },
    { term: 'Anaerobic', definition: 'Processes that do not require oxygen. Glycolysis is anaerobic and can occur without oxygen.' },
  ],

  topicBreakdown: [
    { topic: 'Administrative Announcements', summary: 'Lab report due November 15th, midterm on November 22nd covering chapters 4-8, office hour changes starting next week.', startIndex: 0 },
    { topic: 'Introduction to Cellular Respiration', summary: 'Overview of cellular respiration as the process of breaking down glucose to produce ATP, the cell\'s energy currency.', startIndex: 1 },
    { topic: 'Glycolysis', summary: 'First stage occurring in the cytoplasm. Glucose is broken into pyruvate, producing 2 ATP. Does not require oxygen.', startIndex: 2 },
    { topic: 'Krebs Cycle', summary: 'Second stage in the mitochondrial matrix. Pyruvate becomes acetyl CoA and goes through the cycle, producing NADH and FADH2 electron carriers.', startIndex: 3 },
    { topic: 'Electron Transport Chain', summary: 'Third and most important stage in the inner mitochondrial membrane. Uses electron carriers to produce most ATP via ATP synthase. Total yield: 36-38 ATP per glucose.', startIndex: 4 },
    { topic: 'Upcoming Assignments', summary: 'Read chapter 7 on photosynthesis. 10-question quiz on Thursday covering the three stages and their locations.', startIndex: 5 },
  ],

  whatMatters: [
    'Lab report is due Friday November 15th at 11:59 PM with three required sections (data tables, analysis, conclusion). No late submissions.',
    'Midterm exam on November 22nd covers chapters 4 through 8. Review diagrams in chapter 6 specifically.',
    'Cellular respiration has three stages: glycolysis (cytoplasm), Krebs cycle (mitochondrial matrix), electron transport chain (inner mitochondrial membrane).',
    'Total ATP output from one glucose molecule is 36-38 ATP. Most comes from the electron transport chain.',
    'Quiz on Thursday: 10 multiple choice questions on the three stages and their cell locations.',
  ],

  studyGuide: `CELLULAR RESPIRATION STUDY GUIDE

Key Concept: Cellular respiration converts glucose into ATP (energy) through three stages.

STAGE 1: GLYCOLYSIS
- Location: Cytoplasm
- Input: 1 glucose molecule
- Output: 2 pyruvate molecules + 2 ATP (net)
- Oxygen required? No (anaerobic)
- Key fact: This is the only stage that does not need oxygen

STAGE 2: KREBS CYCLE (Citric Acid Cycle)
- Location: Mitochondrial matrix
- Input: Acetyl CoA (from pyruvate)
- Output: NADH and FADH2 (electron carriers)
- Oxygen required? Yes (aerobic)
- Key fact: The main purpose is to produce electron carriers for Stage 3

STAGE 3: ELECTRON TRANSPORT CHAIN
- Location: Inner mitochondrial membrane
- Input: NADH and FADH2
- Output: Most of the ATP (34-36 of the total 36-38)
- Oxygen required? Yes
- Key mechanism: Proton gradient drives ATP synthase

REVIEW QUESTIONS:
1. What is the total ATP yield from one glucose molecule?
2. Which stage does not require oxygen?
3. Where does each stage take place in the cell?
4. What is the role of NADH and FADH2?
5. How does ATP synthase work?

REMEMBER FOR THE QUIZ:
- Three stages and their locations
- Total ATP yield
- Which stages are aerobic vs anaerobic
- The role of ATP synthase and the proton gradient`,

  nextSteps: [
    'Complete and submit lab report by Friday November 15th with all three sections.',
    'Download the study guide from the course website after Monday.',
    'Read Chapter 7 on photosynthesis before Thursday.',
    'Review Chapter 6 diagrams for the midterm.',
    'Practice identifying the three stages and their locations for the quiz.',
  ],

  learnMore: [
    'Photosynthesis - the reverse process that creates glucose from sunlight (next lecture topic)',
    'Fermentation - what happens when cells respire without oxygen (anaerobic respiration)',
    'Mitochondrial diseases - conditions caused by dysfunctional cellular respiration',
    'Exercise physiology - how cellular respiration affects athletic performance',
    'Evolution of mitochondria - the endosymbiotic theory of how cells acquired mitochondria',
  ],

  funFacts: [
    'Mitochondria have their own DNA, separate from the cell nucleus, supporting the theory that they were once independent bacteria.',
    'The human body produces roughly its own weight in ATP every single day through cellular respiration.',
    'Some organisms, like certain deep-sea bacteria, can perform cellular respiration using sulfur instead of oxygen.',
    'The Krebs cycle was discovered by Hans Krebs in 1937, and he won the Nobel Prize for it in 1953.',
  ],

  imageDescriptions: [],

  insights: [
    { type: 'key_points', message: '5 key points identified', count: 5 },
    { type: 'action_items', message: '5 action items found', count: 5 },
    { type: 'dates', message: '6 dates or deadlines detected', count: 6 },
    { type: 'questions', message: '1 question detected', count: 1 },
    { type: 'steps', message: '3 steps found', count: 3 },
    { type: 'glossary', message: '11 terms defined', count: 11 },
    { type: 'simplified', message: 'Simplified version ready' },
  ],
};
