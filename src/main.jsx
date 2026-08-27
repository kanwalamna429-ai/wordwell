import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { jsPDF } from 'jspdf';
import {
  ArrowDownToLine,
  Bookmark,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  FileText,
  Grid2X2,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  Pencil,
  Printer,
  RotateCcw,
  Save,
  Settings2,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';
import './styles.css';

const TOPICS = [
  { id: 'animals', label: 'Animals', icon: '🐾', words: 'wildlife, habitat, migration' },
  { id: 'nature', label: 'Nature & Outdoors', icon: '🌿', words: 'forests, gardens, weather' },
  { id: 'food', label: 'Food & Cooking', icon: '🍳', words: 'kitchen, flavors, recipes' },
  { id: 'travel', label: 'Travel & Places', icon: '✈️', words: 'journeys, cities, landmarks' },
  { id: 'space', label: 'Space & Astronomy', icon: '🌙', words: 'planets, stars, discovery' },
  { id: 'ocean', label: 'Ocean Life', icon: '🐚', words: 'seas, reefs, underwater' },
  { id: 'sports', label: 'Sports & Games', icon: '⚽', words: 'teams, champions, action' },
  { id: 'music', label: 'Music', icon: '🎵', words: 'rhythm, instruments, melody' },
  { id: 'art', label: 'Art & Design', icon: '🎨', words: 'color, craft, creativity' },
  { id: 'books', label: 'Books & Reading', icon: '📚', words: 'stories, authors, pages' },
  { id: 'movies', label: 'Film & TV', icon: '🎬', words: 'scenes, stories, cinema' },
  { id: 'science', label: 'Science', icon: '⚗️', words: 'ideas, experiments, research' },
  { id: 'technology', label: 'Technology', icon: '💾', words: 'digital, devices, future' },
  { id: 'school', label: 'Back to School', icon: '✏️', words: 'classroom, learning, supplies' },
  { id: 'jobs', label: 'Jobs & Careers', icon: '💼', words: 'work, people, professions' },
  { id: 'history', label: 'History', icon: '🏛️', words: 'eras, places, people' },
  { id: 'holidays', label: 'Holidays', icon: '🎁', words: 'celebrations, traditions, cheer' },
  { id: 'winter', label: 'Winter', icon: '❄️', words: 'snow, cozy, cold weather' },
  { id: 'spring', label: 'Spring', icon: '🌷', words: 'blooms, rain, renewal' },
  { id: 'summer', label: 'Summer', icon: '☀️', words: 'sun, beach, vacation' },
  { id: 'fall', label: 'Autumn', icon: '🍂', words: 'leaves, harvest, cozy days' },
  { id: 'wellness', label: 'Health & Wellness', icon: '💚', words: 'balance, movement, calm' },
  { id: 'community', label: 'Community', icon: '🏘️', words: 'neighbors, places, kindness' },
  { id: 'garden', label: 'Gardening', icon: '🌱', words: 'plants, soil, growing' },
  { id: 'dinosaurs', label: 'Dinosaurs', icon: '🦕', words: 'fossils, prehistoric, giants' },
  { id: 'fairy', label: 'Fairy Tales', icon: '✨', words: 'magic, castles, adventure' },
  { id: 'pirates', label: 'Pirates', icon: '⚓', words: 'treasure, ships, high seas' },
  { id: 'superheroes', label: 'Superheroes', icon: '⚡', words: 'brave, powers, justice' },
  { id: 'transport', label: 'Transportation', icon: '🚲', words: 'roads, vehicles, travel' },
  { id: 'farm', label: 'Farm Life', icon: '🌾', words: 'barn, animals, harvest' },
  { id: 'bugs', label: 'Insects & Bugs', icon: '🦋', words: 'wings, tiny, garden' },
  { id: 'weather', label: 'Weather', icon: '☔', words: 'clouds, storms, seasons' },
  { id: 'colors', label: 'Colors & Shapes', icon: '🔷', words: 'bright, patterns, forms' },
  { id: 'feelings', label: 'Feelings & Emotions', icon: '💛', words: 'kindness, courage, joy' },
  { id: 'mindfulness', label: 'Mindfulness', icon: '🧘', words: 'breathe, focus, peaceful' },
  { id: 'christmas', label: 'Christmas', icon: '🎄', words: 'winter, presents, traditions' }
];

const WORDS = {
  animals: 'tiger lion zebra giraffe elephant monkey rabbit panda dolphin penguin koala kangaroo leopard cheetah wolf fox bear otter beaver raccoon deer moose squirrel hedgehog camel llama gorilla parrot flamingo peacock turtle snake lizard frog whale shark horse donkey kitten puppy puppy badger buffalo bison reindeer seal walrus'.split(' '),
  nature: 'forest meadow mountain valley river waterfall canyon sunrise sunset rainbow thunder breeze shadow moss stone pebble branch leaf acorn pinecone flower garden trail hiking camping compass creek island desert prairie volcano glacier nature wild green'.split(' '),
  food: 'apple banana orange lemon cherry peach berry melon carrot potato tomato onion garlic pepper pumpkin cookie muffin pancake waffle sandwich pizza pasta noodle cheese butter honey sugar cinnamon vanilla chocolate popcorn kettle kitchen recipe simmer whisk spoon plate flavor fresh breakfast lunch dinner dessert'.split(' '),
  travel: 'journey passport suitcase ticket airport station adventure explore voyage travel hotel cabin resort beach city village country map globe bridge castle museum market plaza avenue harbor train bus bicycle airplane luggage camera guide tourist landmark'.split(' '),
  space: 'planet rocket astronaut galaxy comet asteroid meteor moon star orbit solar lunar eclipse crater satellite telescope universe mars venus earth jupiter saturn mercury neptune pluto nebula gravity launch mission spacesuit starlight cosmos constellation horizon'.split(' '),
  ocean: 'ocean coral reef seashell seahorse jellyfish octopus starfish lobster crab shrimp seaweed tide wave current anchor sailor submarine mermaid coast beach island harbor whale dolphin seal manta kelp pearl treasure deep blue lagoon surf shell'.split(' '),
  sports: 'soccer tennis baseball basketball hockey cricket rugby volleyball running swimming skating cycling boxing golf racing team player coach trophy medal champion victory practice stadium arena goal score sprint jump hurdle ball racket helmet'.split(' '),
  music: 'music melody rhythm harmony chorus verse singer dancer guitar piano violin trumpet drum flute cello concert stage radio record playlist song lyrics sound tempo beat jazz rock pop opera ballet band melody'.split(' '),
  art: 'artist canvas color sketch paint brush pencil sculpture gallery museum design shape pattern texture portrait abstract pastel create craft paper ink print collage pottery creative'.split(' '),
  books: 'book story novel author reader library chapter page poem poetry cover bookmark character mystery fantasy adventure classic fiction nonfiction library shelf letter tale ending beginning read write journal'.split(' '),
  movies: 'movie cinema camera director actor scene script story theater comedy drama action hero villain costume ticket popcorn screen studio film animation premiere trailer spotlight series episode'.split(' '),
  science: 'science atom molecule energy matter gravity planet fossil microscope laboratory experiment discover theory nature biology chemistry physics geology robot magnet crystal element cell research measure observe'.split(' '),
  technology: 'computer tablet phone keyboard screen pixel digital internet website software hardware coding robot battery camera signal network browser design future cloud data smart device virtual'.split(' '),
  school: 'school classroom teacher student lesson pencil notebook eraser ruler backpack library homework science history reading writing numbers recess lunch project art music learn study friend campus desk chalkboard'.split(' '),
  jobs: 'career office doctor nurse teacher artist farmer chef pilot writer builder designer dentist lawyer firefighter engineer scientist manager baker plumber gardener driver reporter architect work team meeting skill talent'.split(' '),
  history: 'history ancient castle kingdom empire museum century timeline explore discover pioneer battle culture legend monument village queen king leader freedom journey artifact pyramid roman medieval colonial victory'.split(' '),
  holidays: 'holiday celebrate family tradition parade festival candle dinner gift greeting party joy decorate music feast gathering vacation sparkle wishes reunion'.split(' '),
  winter: 'winter snowflake snowman icicle mitten scarf cocoa skating sledding fireplace sweater chilly frost blizzard penguin evergreen cabin sparkle cozy skiing boots jacket cold crystal'.split(' '),
  spring: 'spring blossom flower tulip daffodil garden rain shower rainbow butterfly robin nest seed sprout sunshine meadow picnic fresh green rainbow puddle breeze renewal'.split(' '),
  summer: 'summer sunshine sunshine beach ocean picnic vacation camping lemonade popsicle watermelon sandcastle seashell swimsuit sandals garden barbecue fireworks sunset swimming surf adventure warm'.split(' '),
  fall: 'autumn autumn leaf leaves pumpkin harvest apple cider sweater scarf acorn hayride cornfield harvest bonfire cozy orange golden school breeze moonlight'.split(' '),
  wellness: 'wellness healthy balance breathe stretch nourish energy peaceful movement sleep water smile calm strong mindful exercise nature rest focus wellness yoga'.split(' '),
  community: 'community neighbor kindness welcome helper volunteer library school market park garden family sharing support friendship together local town village home care'.split(' '),
  garden: 'garden flower plant seed soil shovel watering grow bloom root stem leaf compost tomato herb basil garden nature sunlight pot sprout harvest gardener'.split(' '),
  dinosaurs: 'dinosaur fossil volcano prehistoric tyrannosaurus triceratops stegosaurus brachiosaurus velociraptor raptor skeleton museum jurassic cretaceous ancient bones claw tail giant egg hunter explorer'.split(' '),
  fairy: 'fairy castle princess prince dragon magic kingdom forest spell crown wizard unicorn treasure story slipper tower quest enchanted kingdom brave wishing'.split(' '),
  pirates: 'pirate treasure island ocean ship captain anchor compass parrot map sword cannon sailor deck mast voyage gold chest flag harbor adventure crew'.split(' '),
  superheroes: 'hero power courage justice lightning shield mask cape rescue brave secret strength city mission victory protect speed flight team'.split(' '),
  transport: 'transportation bicycle scooter train airplane rocket subway bus taxi truck wagon car boat ferry bridge road tunnel station journey wheel travel engine pedal'.split(' '),
  farm: 'farmer barn tractor harvest wheat corn hay silo chicken rooster cow pig sheep goat horse duck goose field fence tractor garden market'.split(' '),
  bugs: 'butterfly ladybug beetle cricket ant bee spider dragonfly grasshopper caterpillar moth firefly beetle wings garden insect tiny web hive nectar cocoon'.split(' '),
  weather: 'weather sunshine rainbow cloud rainstorm thunder lightning snow wind breeze tornado forecast umbrella jacket season temperature storm drizzle hail'.split(' '),
  colors: 'red orange yellow green blue purple pink white black brown circle square triangle diamond star stripe rainbow bright shade pattern shape'.split(' '),
  feelings: 'happy joyful brave calm kind proud excited curious friendly thankful hopeful peaceful smile laugh love trust wonder courage gentle'.split(' '),
  mindfulness: 'breathe listen pause focus quiet calm present notice gentle peaceful balance center stillness nature relax soften smile gratitude grounded'.split(' '),
  christmas: 'christmas santa reindeer sleigh stocking present ornament wreath candle carol gingerbread snowflake holiday tree star elf bell ribbon cocoa family'.split(' ')
};

const DIFFICULTIES = {
  easy: { label: 'Easy', description: 'Friendly & familiar', size: 12, count: 10, directions: 'straight', reverse: false },
  medium: { label: 'Medium', description: 'A little twist', size: 15, count: 15, directions: 'diagonal', reverse: true },
  hard: { label: 'Hard', description: 'For puzzle pros', size: 18, count: 20, directions: 'all', reverse: true }
};

const SEED_WORDS = Object.values(WORDS).flat().filter(Boolean);
const UNIQUE_WORDS = [...new Set(SEED_WORDS)];
const WORD_BANK_COUNT = UNIQUE_WORDS.length * 3;
const DISPLAY_AD_SOURCES = [
  'https://relieved-understanding.com/b/X/Vzs.ddG/ly0KYKWncd/ke/mf9fuVZSU_lfkYPIT-ctz/NQT/cD4dNMTGcItLNQzIMx1cNJzQgl2wMTQg',
  'https://relieved-understanding.com/boXxV.sidyG/le0BYnW/ch/zeLmj9OurZDU-l_kuP/TacazGN/Tqcy4/NXzbM-tnNGzdMp1/NTzkgY3JNkwg'
];
const IN_PAGE_PUSH_SOURCE = 'https://relieved-understanding.com/bxXjV.sQdUGel/0OYOWVcu/JekmR9nuaZCUIlIk/PHTdcpzVNbTucn4RO/D/kHthN/z/M/1sNZzpgq5jMTwV';
const VIDEO_SLIDER_SOURCE = 'https://relieved-understanding.com/bbXEVWsRd.Gulr0lYxWGcw/heUmJ9_uaZFUklhk/PXTIcczjN/TZcv5pMDDmUvtFN/zDM/1uNazOkCweOTQn';

function TopicIcon({ topic, size = 15 }) {
  return <span className="topic-icon">{topic.icon}</span>;
}

function injectAdScript(source, target) {
  if (!target || target.querySelector(`script[data-wordwell-ad="${source}"]`)) return;
  const script = document.createElement('script');
  script.dataset.wordwellAd = source;
  script.settings = {};
  script.src = source;
  script.async = true;
  script.referrerPolicy = 'no-referrer-when-downgrade';
  target.appendChild(script);
}

function AdSlot({ source, variant = 'standard' }) {
  const slotRef = useRef(null);
  useEffect(() => {
    injectAdScript(source, slotRef.current);
  }, [source]);
  return (
    <div className={`ad-slot ${variant}`} ref={slotRef}>
      <span className="ad-slot-label">Sponsored</span>
      <span className="ad-slot-fallback">Advertisement</span>
    </div>
  );
}

function titleCase(value) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => (value = (value * 16807) % 2147483647) / 2147483647;
}

function shuffled(items, random) {
  const output = [...items];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [output[index], output[swap]] = [output[swap], output[index]];
  }
  return output;
}

function generatePuzzle(topicId, difficultyId, pageNumber = 1) {
  const difficulty = DIFFICULTIES[difficultyId];
  const topicWords = WORDS[topicId] || WORDS.animals;
  const random = seededRandom((topicId.length * 911) + (difficultyId.length * 313) + pageNumber * 7919);
  const candidates = shuffled([...new Set(topicWords.map((word) => word.toUpperCase()))], random)
    .filter((word) => word.length <= difficulty.size && word.length > 3);
  const words = candidates.slice(0, difficulty.count);
  const grid = Array.from({ length: difficulty.size }, () => Array(difficulty.size).fill(''));
  const placements = [];
  const allDirections = [
    [0, 1], [1, 0], [1, 1], [-1, 1],
    [0, -1], [-1, 0], [-1, -1], [1, -1]
  ];
  const allowedDirections = difficulty.directions === 'straight'
    ? allDirections.slice(0, 2)
    : difficulty.directions === 'diagonal'
      ? allDirections.slice(0, 4)
      : allDirections;

  words.forEach((word) => {
    let placed = false;
    for (let attempt = 0; attempt < 180 && !placed; attempt += 1) {
      const direction = allowedDirections[Math.floor(random() * allowedDirections.length)];
      const [rowDelta, columnDelta] = difficulty.reverse && random() > 0.55
        ? [-direction[0], -direction[1]]
        : direction;
      const row = Math.floor(random() * difficulty.size);
      const column = Math.floor(random() * difficulty.size);
      const endRow = row + rowDelta * (word.length - 1);
      const endColumn = column + columnDelta * (word.length - 1);
      if (endRow < 0 || endRow >= difficulty.size || endColumn < 0 || endColumn >= difficulty.size) continue;
      let valid = true;
      for (let letterIndex = 0; letterIndex < word.length; letterIndex += 1) {
        const target = grid[row + rowDelta * letterIndex][column + columnDelta * letterIndex];
        if (target && target !== word[letterIndex]) {
          valid = false;
          break;
        }
      }
      if (!valid) continue;
      for (let letterIndex = 0; letterIndex < word.length; letterIndex += 1) {
        grid[row + rowDelta * letterIndex][column + columnDelta * letterIndex] = word[letterIndex];
      }
      placements.push({ word, start: [row, column], end: [endRow, endColumn] });
      placed = true;
    }
  });

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  grid.forEach((row) => row.forEach((letter, index, rowArray) => {
    if (!letter) rowArray[index] = alphabet[Math.floor(random() * alphabet.length)];
  }));
  return { size: difficulty.size, grid, words: placements.map((placement) => placement.word), placements };
}

function App() {
  const [topicId, setTopicId] = useState('animals');
  const [difficultyId, setDifficultyId] = useState('medium');
  const [pageCount, setPageCount] = useState(1);
  const [title, setTitle] = useState('Wild About Animals');
  const [includeAnswers, setIncludeAnswers] = useState(true);
  const [paperSize, setPaperSize] = useState('letter');
  const [pages, setPages] = useState(() => [generatePuzzle('animals', 'medium', 1)]);
  const [activePage, setActivePage] = useState(0);
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wordwell-saved') || '[]'); } catch { return []; }
  });
  const [showSaved, setShowSaved] = useState(false);
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState('');

  const topic = TOPICS.find((item) => item.id === topicId) || TOPICS[0];
  const difficulty = DIFFICULTIES[difficultyId];
  const activePuzzle = pages[activePage] || pages[0];
  const shownTopics = showAllTopics ? TOPICS : TOPICS.slice(0, 8);

  useEffect(() => {
    injectAdScript(IN_PAGE_PUSH_SOURCE, document.body);
  }, []);

  useEffect(() => {
    const nextTitle = topic.label === 'Animals' ? 'Wild About Animals' : `${topic.label} Word Search`;
    setTitle(nextTitle);
  }, [topicId]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const settingsSummary = useMemo(() => (
    `${difficulty.size}×${difficulty.size} grid · ${pages.length} ${pages.length === 1 ? 'page' : 'pages'} · ${title}`
  ), [difficulty.size, pages.length, title]);

  function handleGenerate() {
    setIsGenerating(true);
    window.setTimeout(() => {
      setPages(Array.from({ length: pageCount }, (_, index) => generatePuzzle(topicId, difficultyId, index + 1)));
      setActivePage(0);
      setIsGenerating(false);
      setToast(`${pageCount} ${pageCount === 1 ? 'puzzle' : 'puzzles'} ready to print`);
    }, 350);
  }

  function handleTopicChange(nextTopicId) {
    setTopicId(nextTopicId);
    const nextTopic = TOPICS.find((item) => item.id === nextTopicId);
    setTitle(nextTopic?.label === 'Animals' ? 'Wild About Animals' : `${nextTopic?.label || 'New'} Word Search`);
  }

  function saveCurrent() {
    const nextSaved = [
      { id: Date.now(), title, topicId, difficultyId, pageCount, includeAnswers, savedAt: new Date().toLocaleDateString() },
      ...saved.filter((item) => item.title !== title)
    ].slice(0, 12);
    setSaved(nextSaved);
    localStorage.setItem('wordwell-saved', JSON.stringify(nextSaved));
    setToast('Saved to your puzzle shelf');
  }

  function loadSaved(item) {
    setTopicId(item.topicId);
    setDifficultyId(item.difficultyId);
    setPageCount(item.pageCount);
    setIncludeAnswers(item.includeAnswers);
    setTitle(item.title);
    setPages(Array.from({ length: item.pageCount }, (_, index) => generatePuzzle(item.topicId, item.difficultyId, index + 1)));
    setActivePage(0);
    setShowSaved(false);
    setToast('Puzzle loaded');
  }

  function deleteSaved(id) {
    const nextSaved = saved.filter((item) => item.id !== id);
    setSaved(nextSaved);
    localStorage.setItem('wordwell-saved', JSON.stringify(nextSaved));
  }

  function printPuzzle() {
    window.print();
  }

  function downloadPdf() {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: paperSize === 'a4' ? 'a4' : 'letter' });
    const pageWidth = paperSize === 'a4' ? 210 : 215.9;
    const pageHeight = paperSize === 'a4' ? 297 : 279.4;
    const margin = 16;
    pages.forEach((puzzle, puzzleIndex) => {
      if (puzzleIndex > 0) doc.addPage();
      doc.setFillColor(255, 249, 215);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      doc.setDrawColor(18, 18, 18);
      doc.setLineWidth(0.5);
      doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text(title, pageWidth / 2, 30, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`${topic.label.toUpperCase()}  ·  ${difficulty.label.toUpperCase()}  ·  PAGE ${puzzleIndex + 1}`, pageWidth / 2, 37, { align: 'center' });
      const gridSize = puzzle.size;
      const gridWidth = Math.min(pageWidth - margin * 2 - 12, 150);
      const cell = gridWidth / gridSize;
      const startX = (pageWidth - gridWidth) / 2;
      const startY = 49;
      doc.setFillColor(255, 255, 255);
      doc.rect(startX, startY, gridWidth, gridWidth, 'F');
      doc.setDrawColor(24, 24, 24);
      doc.setLineWidth(0.25);
      for (let line = 0; line <= gridSize; line += 1) {
        doc.line(startX + line * cell, startY, startX + line * cell, startY + gridWidth);
        doc.line(startX, startY + line * cell, startX + gridWidth, startY + line * cell);
      }
      doc.setFont('courier', 'bold');
      doc.setFontSize(Math.max(7, 18 - gridSize / 2));
      puzzle.grid.forEach((row, rowIndex) => row.forEach((letter, columnIndex) => {
        doc.text(letter, startX + columnIndex * cell + cell / 2, startY + rowIndex * cell + cell * 0.68, { align: 'center' });
      }));
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('FIND THESE WORDS', margin, startY + gridWidth + 16);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const columns = 3;
      const colWidth = (pageWidth - margin * 2) / columns;
      puzzle.words.forEach((word, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        const x = margin + column * colWidth;
        const y = startY + gridWidth + 25 + row * 6;
        doc.setDrawColor(95, 95, 95);
        doc.setLineWidth(0.35);
        doc.rect(x, y - 2.5, 3.2, 3.2);
        doc.text(titleCase(word), x + 5.5, y);
      });
      doc.setFontSize(8);
      doc.setTextColor(95, 95, 95);
      doc.text('Created with Wordwell · word puzzles, made simple.', pageWidth / 2, pageHeight - 23, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      if (includeAnswers) {
        doc.setFontSize(7);
        doc.text('Answer key included on the final page.', pageWidth / 2, pageHeight - 18, { align: 'center' });
      }
    });
    if (includeAnswers) {
      pages.forEach((puzzle, puzzleIndex) => {
        doc.addPage();
        const pageWidthAnswer = paperSize === 'a4' ? 210 : 215.9;
        doc.setFillColor(255, 249, 215);
        doc.rect(0, 0, pageWidthAnswer, paperSize === 'a4' ? 297 : 279.4, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text(`${title} · Answer Key`, pageWidthAnswer / 2, 28, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`Page ${puzzleIndex + 1} · Words highlighted`, pageWidthAnswer / 2, 35, { align: 'center' });
        const size = puzzle.size;
        const gridWidth = Math.min(pageWidthAnswer - 32, 154);
        const cell = gridWidth / size;
        const startX = (pageWidthAnswer - gridWidth) / 2;
        const startY = 47;
        doc.setFillColor(255, 255, 255);
        doc.rect(startX, startY, gridWidth, gridWidth, 'F');
        doc.setDrawColor(24, 24, 24);
        doc.setLineWidth(0.2);
        for (let line = 0; line <= size; line += 1) {
          doc.line(startX + line * cell, startY, startX + line * cell, startY + gridWidth);
          doc.line(startX, startY + line * cell, startX + gridWidth, startY + line * cell);
        }
        puzzle.placements.forEach((placement, index) => {
          const [startRow, startColumn] = placement.start;
          const [endRow, endColumn] = placement.end;
          doc.setDrawColor(38, 188, 160);
          doc.setLineWidth(Math.max(2, cell * 0.42));
          doc.line(
            startX + startColumn * cell + cell / 2,
            startY + startRow * cell + cell / 2,
            startX + endColumn * cell + cell / 2,
            startY + endRow * cell + cell / 2
          );
          doc.setDrawColor(24, 24, 24);
          doc.setLineWidth(0.2);
        });
        doc.setFont('courier', 'bold');
        doc.setTextColor(20, 20, 20);
        doc.setFontSize(Math.max(7, 18 - size / 2));
        puzzle.grid.forEach((row, rowIndex) => row.forEach((letter, columnIndex) => {
          doc.text(letter, startX + columnIndex * cell + cell / 2, startY + rowIndex * cell + cell * 0.68, { align: 'center' });
        }));
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('Answer key · Wordwell', pageWidthAnswer / 2, paperSize === 'a4' ? 281 : 264, { align: 'center' });
      });
    }
    doc.save(`${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`);
    setToast('PDF downloaded');
  }

  return (
    <div className="app-shell">
      <header className="topbar no-print">
        <div className="brand-mark" aria-label="Wordwell home">
          <span className="brand-grid">{Array.from({ length: 9 }).map((_, index) => <i key={index} className={index === 4 ? 'filled' : ''} />)}</span>
          <span>WORDWELL</span>
        </div>
        <nav className="topnav">
          <button className="nav-link active"><Grid2X2 size={16} /> Generator</button>
          <button className="nav-link" onClick={() => setShowSaved(true)}><Bookmark size={16} /> My shelf <span className="nav-count">{saved.length || '0'}</span></button>
        </nav>
        <div className="top-actions">
          <span className="made-note"><LockKeyhole size={13} /> No account needed</span>
          <button className="icon-button" aria-label="Help"><CircleHelp size={18} /></button>
          <button className="avatar-button" aria-label="Menu"><Menu size={18} /></button>
        </div>
      </header>

      <main className="main-layout">
        <section className="intro no-print">
          <div>
            <div className="eyebrow"><Sparkles size={15} /> THE PUZZLE PRESS</div>
            <h1>Make a puzzle<br /><em>worth printing.</em></h1>
            <p className="intro-copy">Thoughtfully generated word searches for classrooms, quiet afternoons, and everything in between.</p>
          </div>
          <div className="intro-stat"><strong>{WORD_BANK_COUNT.toLocaleString()}+</strong><span>words in the bank</span></div>
        </section>

        <section className="workspace">
          <aside className="control-panel no-print">
            <div className="panel-heading">
              <div><span className="section-kicker">BUILD YOUR PUZZLE</span><h2>Generator settings</h2></div>
              <Settings2 size={21} />
            </div>

            <div className="control-section">
              <label className="field-label" htmlFor="title">Puzzle title <Pencil size={13} /></label>
              <input id="title" className="text-input" value={title} onChange={(event) => setTitle(event.target.value)} />
            </div>

            <div className="control-section">
              <div className="field-label">Choose a topic <span className="muted-count">{TOPICS.length} available</span></div>
              <div className="topic-grid">
                {shownTopics.map((item) => (
                  <button key={item.id} className={`topic-chip ${topicId === item.id ? 'selected' : ''}`} onClick={() => handleTopicChange(item.id)}>
                    <TopicIcon topic={item} /><span>{item.label}</span>{topicId === item.id && <Check size={14} />}
                  </button>
                ))}
              </div>
              <button className="show-more" onClick={() => setShowAllTopics((current) => !current)}>{showAllTopics ? 'Show fewer topics' : `Show all ${TOPICS.length} topics`} <ChevronDown size={14} className={showAllTopics ? 'flip' : ''} /></button>
            </div>

            <div className="control-section">
              <div className="field-label">Difficulty level <CircleHelp size={13} /></div>
              <div className="difficulty-grid">
                {Object.entries(DIFFICULTIES).map(([id, item]) => (
                  <button key={id} className={`difficulty-option ${difficultyId === id ? 'selected' : ''}`} onClick={() => setDifficultyId(id)}>
                    <span className={`difficulty-dots ${id}`}>{Array.from({ length: 3 }).map((_, index) => <i key={index} />)}</span>
                    <strong>{item.label}</strong><small>{item.description}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="control-row">
              <div className="control-section compact">
                <label className="field-label" htmlFor="page-count">Number of pages</label>
                <div className="stepper">
                  <button onClick={() => setPageCount((count) => Math.max(1, count - 1))}>−</button>
                  <strong>{pageCount}</strong>
                  <button onClick={() => setPageCount((count) => Math.min(12, count + 1))}>+</button>
                </div>
              </div>
              <div className="control-section compact">
                <label className="field-label" htmlFor="paper-size">Paper size</label>
                <div className="select-wrap"><select id="paper-size" value={paperSize} onChange={(event) => setPaperSize(event.target.value)}><option value="letter">US Letter</option><option value="a4">A4</option></select><ChevronDown size={14} /></div>
              </div>
            </div>

            <div className="toggle-row">
              <div><strong>Include answer key</strong><span>Added as final pages in PDF</span></div>
              <button role="switch" aria-checked={includeAnswers} className={`toggle ${includeAnswers ? 'on' : ''}`} onClick={() => setIncludeAnswers((value) => !value)}><span /></button>
            </div>

            <button className="generate-button" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? <><RotateCcw size={18} className="spin" /> Building your puzzle…</> : <><Sparkles size={18} /> Generate {pageCount > 1 ? `${pageCount} puzzles` : 'puzzle'} <ChevronRight size={18} /></>}
            </button>
            <div className="privacy-note"><LockKeyhole size={12} /> Everything is created in your browser</div>
          </aside>

          <section className="preview-area">
            <div className="preview-toolbar no-print">
              <div><span className="section-kicker">LIVE PREVIEW</span><span className="preview-summary">{settingsSummary}</span></div>
              <div className="toolbar-actions">
                <button className="secondary-button" onClick={saveCurrent}><Save size={16} /> Save</button>
                <button className="secondary-button" onClick={printPuzzle}><Printer size={16} /> Print</button>
                <button className="primary-small" onClick={downloadPdf}><ArrowDownToLine size={16} /> PDF</button>
                <button className="more-button" aria-label="More actions"><MoreHorizontal size={18} /></button>
              </div>
            </div>

            <div className="print-only-pages">
              {pages.map((puzzle, index) => <PrintablePuzzlePage key={`print-puzzle-${index}`} puzzle={puzzle} index={index} title={title} topic={topic} difficulty={difficulty} paperSize={paperSize} includeAnswers={includeAnswers} totalPages={pages.length} />)}
              {includeAnswers && pages.map((puzzle, index) => <PrintableAnswerPage key={`print-answer-${index}`} puzzle={puzzle} index={index} title={title} topic={topic} />)}
            </div>

            <div className="paper-stage screen-preview">
              <div className="paper-header">
                <div><span className="paper-topic"><TopicIcon topic={topic} size={13} /> {topic.label}</span><h2>{title || 'Untitled Word Search'}</h2></div>
                <div className="paper-meta"><span>{difficulty.label} · {activePuzzle?.size}×{activePuzzle?.size}</span><span>Page {activePage + 1} of {pages.length}</span></div>
              </div>
              <div className="puzzle-canvas">
                {activePuzzle && <PuzzleGrid puzzle={activePuzzle} />}
                <div className="word-list">
                  <div className="word-list-heading"><span>Find these words</span><span className="word-count">{activePuzzle?.words.length} words</span></div>
                  <div className="words">{activePuzzle?.words.map((word) => <span key={word}>{titleCase(word)}</span>)}</div>
                </div>
              </div>
              <div className="paper-footer"><span>Created with Wordwell</span><span>{includeAnswers ? 'Answer key included' : 'Puzzle only'} · {paperSize === 'a4' ? 'A4' : 'US Letter'}</span></div>
            </div>

            {pages.length > 1 && <div className="page-tabs no-print"><button className="page-arrow" onClick={() => setActivePage((page) => Math.max(0, page - 1))} disabled={activePage === 0}>←</button>{pages.map((_, index) => <button key={index} className={activePage === index ? 'active' : ''} onClick={() => setActivePage(index)}>Page {String(index + 1).padStart(2, '0')}</button>)}<button className="page-arrow" onClick={() => setActivePage((page) => Math.min(pages.length - 1, page + 1))} disabled={activePage === pages.length - 1}>→</button></div>}

            <div className="tip-card no-print"><div className="tip-mark">✦</div><div><strong>Ready for the real world</strong><p>Print directly from this preview or download a PDF with crisp type, generous spacing, and an optional answer key.</p></div><FileText size={28} /></div>
             <div className="ad-row no-print">
               {DISPLAY_AD_SOURCES.map((source) => <AdSlot key={source} source={source} />)}
             </div>
             <div className="video-ad-wrap no-print">
               <AdSlot source={VIDEO_SLIDER_SOURCE} variant="video" />
             </div>
          </section>
        </section>
      </main>

      {showSaved && <div className="modal-backdrop no-print" onClick={() => setShowSaved(false)}><div className="saved-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-heading"><div><span className="section-kicker">YOUR PUZZLE SHELF</span><h2>Saved puzzles</h2></div><button className="close-button" onClick={() => setShowSaved(false)}><X size={20} /></button></div>{saved.length === 0 ? <div className="empty-shelf"><Bookmark size={28} /><strong>No saved puzzles yet</strong><p>Save a puzzle and it’ll show up here for easy printing later.</p></div> : <div className="saved-list">{saved.map((item) => <div className="saved-item" key={item.id}><div className="saved-thumb"><Grid2X2 size={20} /></div><div className="saved-info"><strong>{item.title}</strong><span>{TOPICS.find((topicItem) => topicItem.id === item.topicId)?.label} · {DIFFICULTIES[item.difficultyId].label} · {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'}</span><small>Saved {item.savedAt}</small></div><button className="load-button" onClick={() => loadSaved(item)}>Open</button><button className="delete-button" onClick={() => deleteSaved(item.id)} aria-label={`Delete ${item.title}`}><Trash2 size={15} /></button></div>)}</div>}</div></div>}
      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
    </div>
  );
}

function PuzzleGrid({ puzzle }) {
  return <div className="grid-wrap"><div className="puzzle-grid" style={{ '--grid-size': puzzle.size }}>{puzzle.grid.flatMap((row, rowIndex) => row.map((letter, columnIndex) => <span key={`${rowIndex}-${columnIndex}`}>{letter}</span>))}</div></div>;
}

function PrintablePuzzlePage({ puzzle, index, title, topic, difficulty, paperSize, includeAnswers, totalPages }) {
  return (
    <article className="print-page">
      <div className="print-page-inner">
        <div className="paper-header">
          <div><span className="paper-topic"><TopicIcon topic={topic} size={13} /> {topic.label}</span><h2>{title || 'Untitled Word Search'}</h2></div>
          <div className="paper-meta"><span>{difficulty.label} · {puzzle.size}×{puzzle.size}</span><span>Page {index + 1} of {totalPages}</span></div>
        </div>
        <div className="puzzle-canvas">
          <PuzzleGrid puzzle={puzzle} />
          <PrintableWordList puzzle={puzzle} />
        </div>
        <div className="paper-footer"><span>Created with Wordwell</span><span>{includeAnswers ? 'Answer key included' : 'Puzzle only'} · {paperSize === 'a4' ? 'A4' : 'US Letter'}</span></div>
      </div>
    </article>
  );
}

function PrintableAnswerPage({ puzzle, index, title, topic }) {
  return (
    <article className="print-page">
      <div className="print-page-inner answer-print-page">
        <div className="paper-header">
          <div><span className="paper-topic"><TopicIcon topic={topic} size={13} /> {topic.label}</span><h2>{title || 'Untitled Word Search'} · Answer Key</h2></div>
          <div className="paper-meta"><span>Solutions</span><span>Puzzle {index + 1}</span></div>
        </div>
        <div className="puzzle-canvas"><AnswerGrid puzzle={puzzle} /></div>
        <div className="paper-footer"><span>Answer key · Wordwell</span><span>Highlighted solutions</span></div>
      </div>
    </article>
  );
}

function PrintableWordList({ puzzle }) {
  return <div className="word-list"><div className="word-list-heading"><span>Find these words</span><span className="word-count">{puzzle.words.length} words</span></div><div className="words">{puzzle.words.map((word) => <span key={word}>{titleCase(word)}</span>)}</div></div>;
}

function AnswerGrid({ puzzle }) {
  const highlightedCells = new Set();
  puzzle.placements.forEach(({ start, end }) => {
    const rowStep = Math.sign(end[0] - start[0]);
    const columnStep = Math.sign(end[1] - start[1]);
    const length = Math.max(Math.abs(end[0] - start[0]), Math.abs(end[1] - start[1]));
    for (let index = 0; index <= length; index += 1) {
      highlightedCells.add(`${start[0] + rowStep * index}-${start[1] + columnStep * index}`);
    }
  });
  return <div className="grid-wrap"><div className="puzzle-grid answer-grid" style={{ '--grid-size': puzzle.size }}>{puzzle.grid.flatMap((row, rowIndex) => row.map((letter, columnIndex) => <span className={highlightedCells.has(`${rowIndex}-${columnIndex}`) ? 'highlighted' : ''} key={`${rowIndex}-${columnIndex}`}>{letter}</span>))}</div></div>;
}

createRoot(document.getElementById('root')).render(<App />);