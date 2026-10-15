const fs = require('fs');
const path = require('path');

// Extract existing rawTranslations from src/lib/i18n.ts
let rawCode = fs.readFileSync('src/lib/i18n.ts', 'utf8');
rawCode = rawCode.replace(/export const translations[\s\S]*/, '');
rawCode = rawCode.replace('const rawTranslations', 'global.rawTranslations');
eval(rawCode);

const existing = global.rawTranslations;

// Complete dictionary additions for all 9 languages
const additions = {
  en: {
    common: {
      learnMore: "Learn More",
      trySimulator: "Try Circuit Builder",
      exploreBloch: "Explore Bloch Sphere",
      startLearning: "Start Learning",
      backToHome: "Back to Home",
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      close: "Close",
      submit: "Submit",
      error: "Error",
      success: "Success",
      pro: "Pro",
      free: "Free",
      verified: "Verified",
      comingSoon: "Coming Soon",
      openMenu: "Open menu",
      viewAll: "View All",
      next: "Next",
      previous: "Previous"
    },
    practice: {
      title: "Quantum Coding Arena",
      subtitle: "Hands-on quantum programming challenges across superposition, entanglement, algorithms, and circuit optimization.",
      solveChallenge: "Solve Challenge",
      hints: "Hints",
      testCases: "Test Cases",
      points: "Points",
      difficulty: "Difficulty",
      runCode: "Run Code",
      submitCode: "Submit Solution",
      completed: "Completed",
      allChallenges: "All Challenges",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard"
    },
    dashboard: {
      title: "Quantum Learning Dashboard",
      subtitle: "Track your concept mastery, daily study streak, algorithm progress, and targeted AI recommendations.",
      streak: "Day Streak",
      mastery: "Concept Mastery",
      superposition: "Superposition",
      entanglement: "Entanglement",
      phaseKickback: "Phase Kickback",
      interference: "Interference",
      measurement: "Measurement",
      quizAccuracy: "Quiz Accuracy",
      completedModules: "Completed Modules",
      misconceptions: "Identified Misconceptions",
      askTutor: "Review with Schrödinger AI",
      recentActivity: "Recent Activity",
      viewCertificate: "View Verified Certificate",
      continueLearning: "Continue Learning"
    },
    about: {
      badge: "The QuanBit Mission",
      title: "Democratizing Quantum Computing Education Worldwide",
      subtitle: "A next-generation interactive visual scientific platform developed by REVERSUN to empower students, educators, and researchers in quantum mechanics and quantum computation.",
      missionTitle: "Our Mission",
      missionDesc: "Quantum computing is often considered inaccessible due to complex Dirac notations and pure mathematical abstractions. QuanBit replaces passive reading with interactive 3D WebGL visualizations, real-time circuit simulation across industry backends (Qiskit, Cirq, PennyLane), and Socratic AI tutoring.",
      guideTitle: "Quantum Mechanics Visual Guide",
      guideSubtitle: "Master qubits, superposition, quantum measurement, and entanglement step by step.",
      productBy: "QuanBit is an engineering product by",
      learnMore: "Explore REVERSUN Technologies"
    },
    contact: {
      title: "Contact QuanBit & REVERSUN",
      subtitle: "Get in touch for educational inquiries, university partnerships, or technical support.",
      supportTitle: "Direct Email Support",
      supportDesc: "Reach out directly to the REVERSUN and QuanBit teams for any questions or feedback.",
      enquiryTitle: "REVERSUN Online Enquiry Form",
      enquiryDesc: "Submit partnerships and project collaboration inquiries through our official form.",
      partnershipTitle: "Academic & University Partnerships",
      partnershipDesc: "Integrate QuanBit interactive circuit simulators and verified certificates into your curriculum.",
      sendEnquiry: "Open Enquiry Form"
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Find answers regarding QuanBit, the 3D Bloch sphere, multi-backend simulation, certificates, and REVERSUN.",
      categoryPlatform: "Platform & Organization",
      categoryQuantum: "Quantum Computing & Circuits",
      categorySimulator: "Simulation & Visualizers",
      needMoreHelp: "Have additional questions? Contact the REVERSUN team."
    },
    aiTutor: {
      title: "Schrödinger AI",
      subtitle: "Adaptive Socratic Quantum Tutor",
      placeholder: "Ask a question or explore a concept...",
      askButton: "Send",
      clearChat: "Clear Chat",
      socraticMode: "Socratic Guided Mode",
      intuitiveExplain: "✨ Explain intuitively",
      diracMath: "📐 Dirac math walkthrough",
      practiceQuiz: "🎯 Give me a practice quiz"
    },
    identity: {
      signInTitle: "Sign In to QuanBit",
      signUpTitle: "Create Your Quantum Profile",
      nameLabel: "Your Name",
      namePlaceholder: "Enter your full name",
      emailLabel: "Email Address",
      emailPlaceholder: "student@university.edu",
      passwordLabel: "Password",
      passwordPlaceholder: "At least 6 characters",
      signInButton: "Sign In",
      signUpButton: "Create Account",
      switchToSignUp: "Need an account? Sign up free",
      switchToSignIn: "Already have an account? Sign in"
    },
    subscription: {
      badge: "QuanBit Pro",
      title: "Elevate Your Quantum Mastery",
      subtitle: "Unlock advanced multi-qubit challenges, research-grade derivations, and priority cloud simulation.",
      monthlyPlan: "Monthly",
      annualPlan: "Annual (Save 20%)",
      upgradeButton: "Upgrade to Pro",
      downgradeButton: "Switch to Free Tier",
      proFeature1: "Unlimited Advanced Practice Challenges",
      proFeature2: "Full Dirac Mathematical Derivations",
      proFeature3: "Priority Socratic AI Tutor Queries"
    },
    footer: {
      brandDesc: "Free interactive quantum computing education platform with multi-backend simulation (Qiskit, Cirq, PennyLane), real-time 3D Bloch sphere visualization, and Schrödinger AI tutoring.",
      rightsReserved: "All rights reserved.",
      productBy: "QuanBit is a Product by",
      openAccess: "Open access quantum education, worldwide.",
      modulesTitle: "Quantum Algorithm Modules",
      resourcesTitle: "Resources & Tools",
      a11yTitle: "Accessibility & Standards",
      compliantBadge: "WCAG 2.1 AA Compliant",
      dualModeDesc: "Dual-mode explanations (intuitive & Dirac notation), full keyboard navigation, screen reader ARIA, dynamic font scaling, and multilingual support.",
      builtWith: "Built with love for quantum physics education."
    }
  },

  hi: {
    common: {
      learnMore: "और जानें",
      trySimulator: "सर्किट बिल्डर आज़माएं",
      exploreBloch: "ब्लॉच स्फीयर देखें",
      startLearning: "सीखना शुरू करें",
      backToHome: "होम पर लौटें",
      loading: "लोड हो रहा है...",
      save: "सुरक्षित करें",
      cancel: "रद्द करें",
      close: "बंद करें",
      submit: "जमा करें",
      error: "त्रुटि",
      success: "सफलता",
      pro: "प्रो",
      free: "निःशुल्क",
      verified: "सत्यापित",
      comingSoon: "जल्द आ रहा है",
      openMenu: "मेनू खोलें",
      viewAll: "सभी देखें",
      next: "अगला",
      previous: "पिछला"
    },
    practice: {
      title: "क्वांटम कोडिंग अखाड़ा",
      subtitle: "सुपरपोज़िशन, एंटैंगलमेंट, एल्गोरिदम और सर्किट अनुकूलन पर व्यावहारिक क्वांटम प्रोग्रामिंग चुनौतियां।",
      solveChallenge: "चुनौती हल करें",
      hints: "संकेत",
      testCases: "परीक्षण स्थितियां",
      points: "अंक",
      difficulty: "कठिनाई",
      runCode: "कोड चलाएं",
      submitCode: "समाधान जमा करें",
      completed: "पूर्ण",
      allChallenges: "सभी चुनौतियां",
      easy: "सरल",
      medium: "मध्यम",
      hard: "कठिन"
    },
    dashboard: {
      title: "क्वांटम लर्निंग डैशबोर्ड",
      subtitle: "अपनी अवधारणा महारत, दैनिक अध्ययन स्ट्रीक, एल्गोरिदम प्रगति और एआई मार्गदर्शन ट्रैक करें।",
      streak: "दिन की स्ट्रीक",
      mastery: "अवधारणा महारत",
      superposition: "सुपरपोज़िशन",
      entanglement: "एंटैंगलमेंट",
      phaseKickback: "फेज किकबैक",
      interference: "व्यतिकरण (Interference)",
      measurement: "मापन (Measurement)",
      quizAccuracy: "क्विज़ सटीकता",
      completedModules: "पूर्ण किए गए मॉड्यूल",
      misconceptions: "पहचानी गई गलतफहमियां",
      askTutor: "श्रोडिंगर एआई से समीक्षा करें",
      recentActivity: "हाल की गतिविधि",
      viewCertificate: "सत्यापित प्रमाणपत्र देखें",
      continueLearning: "सीखना जारी रखें"
    },
    about: {
      badge: "क्वानबिट का मिशन",
      title: "विश्व भर में क्वांटम कंप्यूटिंग शिक्षा का लोकतंत्रीकरण",
      subtitle: "क्वांटम यांत्रिकी और क्वांटम गणना में छात्रों, शिक्षकों और शोधकर्ताओं को सशक्त बनाने के लिए REVERSUN द्वारा विकसित इंटरैक्टिव वैज्ञानिक मंच।",
      missionTitle: "हमारा उद्देश्य",
      missionDesc: "क्वांटम कंप्यूटिंग को अक्सर कठिन माना जाता है। क्वानबिट 3D WebGL विज़ुअलाइज़ेशन, वास्तविक समय सर्किट सिमुलेशन (Qiskit, Cirq, PennyLane) और सुकरात एआई ट्यूटर से इसे सहज बनाता है।",
      guideTitle: "क्वांटम यांत्रिकी दृश्य गाइड",
      guideSubtitle: "क्यूबिट, सुपरपोज़िशन, क्वांटम मापन और एंटैंगलमेंट को चरणबद्ध तरीके से समझें।",
      productBy: "क्वानबिट एक उत्पाद है",
      learnMore: "REVERSUN तकनीकों का अन्वेषण करें"
    },
    contact: {
      title: "क्वानबिट और REVERSUN से संपर्क करें",
      subtitle: "शैक्षिक पूछताछ, विश्वविद्यालय साझेदारी या तकनीकी सहायता के लिए संपर्क करें।",
      supportTitle: "सीधा ईमेल समर्थन",
      supportDesc: "किसी भी प्रश्न या सुझाव के लिए REVERSUN और क्वानबिट टीमों से सीधे संपर्क करें।",
      enquiryTitle: "REVERSUN ऑनलाइन पूछताछ फ़ॉर्म",
      enquiryDesc: "साझेदारी और सहयोग के लिए हमारे आधिकारिक फ़ॉर्म के माध्यम से संपर्क करें।",
      partnershipTitle: "शैक्षणिक और विश्वविद्यालय साझेदारी",
      partnershipDesc: "अपने पाठ्यक्रम में क्वानबिट के इंटरैक्टिव सर्किट सिमुलेटर और प्रमाणपत्र शामिल करें।",
      sendEnquiry: "पूछताछ फ़ॉर्म खोलें"
    },
    faq: {
      title: "अक्सर पूछे जाने वाले प्रश्न (FAQ)",
      subtitle: "क्वानबिट, 3D ब्लॉच स्फीयर, मल्टी-बैकएंड सिमुलेशन, प्रमाणपत्र और REVERSUN के बारे में उत्तर पाएं।",
      categoryPlatform: "प्लेटफ़ॉर्म और संगठन",
      categoryQuantum: "क्वांटम कंप्यूटिंग और सर्किट",
      categorySimulator: "सिमुलेशन और विज़ुअलाइज़र",
      needMoreHelp: "कोई अन्य प्रश्न है? REVERSUN टीम से संपर्क करें।"
    },
    aiTutor: {
      title: "श्रोडिंगर एआई",
      subtitle: "अनुकूली सुकराती क्वांटम शिक्षक",
      placeholder: "प्रश्न पूछें या अवधारणा का पता लगाएं...",
      askButton: "भेजें",
      clearChat: "चैट साफ़ करें",
      socraticMode: "सुकराती मार्गदर्शित मोड",
      intuitiveExplain: "✨ सरल शब्दों में समझाएं",
      diracMath: "📐 डायराक गणितीय व्याख्या",
      practiceQuiz: "🎯 अभ्यास प्रश्न दें"
    },
    identity: {
      signInTitle: "क्वानबिट में साइन इन करें",
      signUpTitle: "अपना क्वांटम प्रोफ़ाइल बनाएं",
      nameLabel: "आपका नाम",
      namePlaceholder: "अपना पूरा नाम दर्ज करें",
      emailLabel: "ईमेल पता",
      emailPlaceholder: "student@university.edu",
      passwordLabel: "पासवर्ड",
      passwordPlaceholder: "कम से कम 6 अक्षर",
      signInButton: "साइन इन करें",
      signUpButton: "खाता बनाएं",
      switchToSignUp: "नया खाता चाहिए? निःशुल्क साइन अप करें",
      switchToSignIn: "पहले से खाता है? साइन इन करें"
    },
    subscription: {
      badge: "क्वानबिट प्रो",
      title: "अपनी क्वांटम विशेषज्ञता बढ़ाएं",
      subtitle: "उन्नत मल्टी-क्यूबिट चुनौतियां, गणितीय व्युत्पत्ति और प्राथमिकता सिमुलेशन अनलॉक करें।",
      monthlyPlan: "मासिक",
      annualPlan: "वार्षिक (20% बचत)",
      upgradeButton: "प्रो में अपग्रेड करें",
      downgradeButton: "निःशुल्क संस्करण पर जाएं",
      proFeature1: "असीमित उन्नत अभ्यास चुनौतियां",
      proFeature2: "पूर्ण डायराक गणितीय व्युत्पत्ति",
      proFeature3: "प्राथमिकता श्रोडिंगर एआई ट्यूटर प्रश्न"
    },
    footer: {
      brandDesc: "मल्टी-बैकएंड सिमुलेशन (Qiskit, Cirq, PennyLane), रीयल-टाइम 3D ब्लॉच स्फीयर और श्रोडिंगर एआई ट्यूटर के साथ निःशुल्क क्वांटम शिक्षा।",
      rightsReserved: "सर्वाधिकार सुरक्षित।",
      productBy: "क्वानबिट एक उत्पाद है",
      openAccess: "विश्वभर में सुलभ क्वांटम शिक्षा।",
      modulesTitle: "क्वांटम एल्गोरिदम मॉड्यूल",
      resourcesTitle: "संसाधन और उपकरण",
      a11yTitle: "अभिगम्यता और मानक",
      compliantBadge: "WCAG 2.1 AA अनुपालन",
      dualModeDesc: "द्वि-मोड व्याख्याएं (सहज और डायराक संकेतन), पूर्ण कीबोर्ड नेविगेशन और बहुभाषी समर्थन।",
      builtWith: "क्वांटम भौतिकी शिक्षा के लिए समर्पित।"
    }
  },

  es: {
    common: {
      learnMore: "Más información",
      trySimulator: "Probar el constructor de circuitos",
      exploreBloch: "Explorar la esfera de Bloch",
      startLearning: "Empezar a aprender",
      backToHome: "Volver al inicio",
      loading: "Cargando...",
      save: "Guardar",
      cancel: "Cancelar",
      close: "Cerrar",
      submit: "Enviar",
      error: "Error",
      success: "Éxito",
      pro: "Pro",
      free: "Gratis",
      verified: "Verificado",
      comingSoon: "Próximamente",
      openMenu: "Abrir menú",
      viewAll: "Ver todo",
      next: "Siguiente",
      previous: "Anterior"
    },
    practice: {
      title: "Arena de Programación Cuántica",
      subtitle: "Desafíos prácticos de programación cuántica en superposición, entrelazamiento, algoritmos y optimización.",
      solveChallenge: "Resolver desafío",
      hints: "Pistas",
      testCases: "Casos de prueba",
      points: "Puntos",
      difficulty: "Dificultad",
      runCode: "Ejecutar código",
      submitCode: "Enviar solución",
      completed: "Completado",
      allChallenges: "Todos los desafíos",
      easy: "Fácil",
      medium: "Medio",
      hard: "Difícil"
    },
    dashboard: {
      title: "Panel de Aprendizaje Cuántico",
      subtitle: "Sigue tu dominio de conceptos, racha de estudio diaria, progreso en algoritmos y recomendaciones de IA.",
      streak: "Racha de días",
      mastery: "Dominio de conceptos",
      superposition: "Superposición",
      entanglement: "Entrelazamiento",
      phaseKickback: "Retroceso de fase",
      interference: "Interferencia",
      measurement: "Medición",
      quizAccuracy: "Precisión en cuestionarios",
      completedModules: "Módulos completados",
      misconceptions: "Conceptos erróneos detectados",
      askTutor: "Repasar con Schrödinger AI",
      recentActivity: "Actividad reciente",
      viewCertificate: "Ver certificado verificado",
      continueLearning: "Continuar aprendiendo"
    },
    about: {
      badge: "La Misión de QuanBit",
      title: "Democratizando la Educación en Computación Cuántica en el Mundo",
      subtitle: "Una plataforma visual y científica interactiva desarrollada por REVERSUN para capacitar a estudiantes, educadores e investigadores.",
      missionTitle: "Nuestra Misión",
      missionDesc: "La computación cuántica suele considerarse difícil debido a notaciones complejas. QuanBit sustituye la lectura pasiva por visualizaciones interactivas en 3D WebGL, simulación en tiempo real (Qiskit, Cirq, PennyLane) y tutoría socrática con IA.",
      guideTitle: "Guía Visual de Mecánica Cuántica",
      guideSubtitle: "Domina cúbits, superposición, medición cuántica y entrelazamiento paso a paso.",
      productBy: "QuanBit es un producto de",
      learnMore: "Explorar las tecnologías de REVERSUN"
    },
    contact: {
      title: "Contacto QuanBit y REVERSUN",
      subtitle: "Ponte en contacto para consultas educativas, alianzas universitarias o soporte técnico.",
      supportTitle: "Soporte directo por correo",
      supportDesc: "Comunícate directamente con los equipos de REVERSUN y QuanBit para cualquier consulta.",
      enquiryTitle: "Formulario de consulta REVERSUN",
      enquiryDesc: "Envía propuestas de colaboración y consultas a través de nuestro formulario oficial.",
      partnershipTitle: "Alianzas académicas y universitarias",
      partnershipDesc: "Integra los simuladores cuánticos interactivos y certificados de QuanBit en tus cursos.",
      sendEnquiry: "Abrir formulario de consulta"
    },
    faq: {
      title: "Preguntas Frecuentes (FAQ)",
      subtitle: "Respuestas sobre QuanBit, la esfera de Bloch 3D, simulación multientorno, certificados y REVERSUN.",
      categoryPlatform: "Plataforma y Organización",
      categoryQuantum: "Computación Cuántica y Circuitos",
      categorySimulator: "Simulación y Visualizadores",
      needMoreHelp: "¿Tienes más preguntas? Contacta con el equipo de REVERSUN."
    },
    aiTutor: {
      title: "Schrödinger AI",
      subtitle: "Tutor Cuántico Socrático Adaptativo",
      placeholder: "Haga una pregunta o explore un concepto...",
      askButton: "Enviar",
      clearChat: "Limpiar chat",
      socraticMode: "Modo guiado socrático",
      intuitiveExplain: "✨ Explicar intuitivamente",
      diracMath: "📐 Notación matemática de Dirac",
      practiceQuiz: "🎯 Ejercicio de práctica"
    },
    identity: {
      signInTitle: "Iniciar sesión en QuanBit",
      signUpTitle: "Crea tu perfil cuántico",
      nameLabel: "Tu nombre",
      namePlaceholder: "Ingresa tu nombre completo",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "estudiante@universidad.edu",
      passwordLabel: "Contraseña",
      passwordPlaceholder: "Al menos 6 caracteres",
      signInButton: "Iniciar sesión",
      signUpButton: "Crear cuenta",
      switchToSignUp: "¿No tienes cuenta? Regístrate gratis",
      switchToSignIn: "¿Ya tienes cuenta? Inicia sesión"
    },
    subscription: {
      badge: "QuanBit Pro",
      title: "Eleva tu Maestría Cuántica",
      subtitle: "Desbloquea desafíos avanzados de múltiples cúbits, deducciones matemáticas completas y simulación prioritaria.",
      monthlyPlan: "Mensual",
      annualPlan: "Anual (Ahorra 20%)",
      upgradeButton: "Mejorar a Pro",
      downgradeButton: "Cambiar al plan gratuito",
      proFeature1: "Desafíos de práctica avanzados ilimitados",
      proFeature2: "Deducciones matemáticas completas de Dirac",
      proFeature3: "Consultas prioritarias al tutor Schrödinger AI"
    },
    footer: {
      brandDesc: "Plataforma de educación cuántica interactiva y gratuita con simulación multibackend (Qiskit, Cirq, PennyLane), visualización 3D y tutor Schrödinger AI.",
      rightsReserved: "Todos los derechos reservados.",
      productBy: "QuanBit es un producto de",
      openAccess: "Educación cuántica de acceso abierto para todo el mundo.",
      modulesTitle: "Módulos de Algoritmos Cuánticos",
      resourcesTitle: "Recursos y Herramientas",
      a11yTitle: "Accesibilidad y Estándares",
      compliantBadge: "Conforme con WCAG 2.1 AA",
      dualModeDesc: "Explicaciones en modo dual (intuitiva y matemática de Dirac), navegación completa por teclado y soporte multilingüe.",
      builtWith: "Creado con pasión por la enseñanza de la física cuántica."
    }
  },

  fr: {
    common: {
      learnMore: "En savoir plus",
      trySimulator: "Essayer le constructeur de circuits",
      exploreBloch: "Explorer la sphère de Bloch",
      startLearning: "Commencer à apprendre",
      backToHome: "Retour à l'accueil",
      loading: "Chargement...",
      save: "Enregistrer",
      cancel: "Annuler",
      close: "Fermer",
      submit: "Soumettre",
      error: "Erreur",
      success: "Succès",
      pro: "Pro",
      free: "Gratuit",
      verified: "Vérifié",
      comingSoon: "Bientôt disponible",
      openMenu: "Ouvrir le menu",
      viewAll: "Voir tout",
      next: "Suivant",
      previous: "Précédent"
    },
    practice: {
      title: "Arène de Programmation Quantique",
      subtitle: "Défis pratiques de code quantique sur la superposition, l'intrication, les algorithmes et l'optimisation.",
      solveChallenge: "Résoudre le défi",
      hints: "Indices",
      testCases: "Cas de test",
      points: "Points",
      difficulty: "Difficulté",
      runCode: "Exécuter le code",
      submitCode: "Soumettre la solution",
      completed: "Terminé",
      allChallenges: "Tous les défis",
      easy: "Facile",
      medium: "Moyen",
      hard: "Difficile"
    },
    dashboard: {
      title: "Tableau de Bord d'Apprentissage Quantique",
      subtitle: "Suivez votre maîtrise des concepts, votre assiduité quotidienne, votre progression et les recommandations IA.",
      streak: "Jours consécutifs",
      mastery: "Maîtrise des concepts",
      superposition: "Superposition",
      entanglement: "Intrication",
      phaseKickback: "Contrecoup de phase",
      interference: "Interférence",
      measurement: "Mesure",
      quizAccuracy: "Précision aux quiz",
      completedModules: "Modules complétés",
      misconceptions: "Idées fausses identifiées",
      askTutor: "Réviser avec Schrödinger AI",
      recentActivity: "Activité récente",
      viewCertificate: "Voir le certificat vérifié",
      continueLearning: "Poursuivre l'apprentissage"
    },
    about: {
      badge: "La Mission QuanBit",
      title: "Démocratiser l'Enseignement de l'Informatique Quantique dans le Monde",
      subtitle: "Une plateforme visuelle et scientifique interactive développée par REVERSUN pour former étudiants, enseignants et chercheurs.",
      missionTitle: "Notre Mission",
      missionDesc: "L'informatique quantique est souvent jugée inaccessible. QuanBit remplace la lecture passive par des visualisations 3D WebGL interactives, une simulation temps réel (Qiskit, Cirq, PennyLane) et un tutorat socratique par IA.",
      guideTitle: "Guide Visuel de Mécanique Quantique",
      guideSubtitle: "Maîtrisez pas à pas les qubits, la superposition, la mesure quantique et l'intrication.",
      productBy: "QuanBit est un produit conçu par",
      learnMore: "Découvrir les technologies REVERSUN"
    },
    contact: {
      title: "Contacter QuanBit & REVERSUN",
      subtitle: "Contactez-nous pour toute demande éducative, partenariat universitaire ou assistance technique.",
      supportTitle: "Assistance par e-mail direct",
      supportDesc: "Contactez directement les équipes REVERSUN et QuanBit pour vos questions et retours.",
      enquiryTitle: "Formulaire de contact REVERSUN",
      enquiryDesc: "Soumettez vos demandes de partenariats et projets via notre formulaire officiel.",
      partnershipTitle: "Partenariats académiques et universitaires",
      partnershipDesc: "Intégrez les simulateurs quantiques et certificats vérifiés QuanBit dans vos programmes.",
      sendEnquiry: "Ouvrir le formulaire de contact"
    },
    faq: {
      title: "Foire Aux Questions (FAQ)",
      subtitle: "Réponses aux questions courantes sur QuanBit, la sphère de Bloch 3D, la simulation multi-backends et REVERSUN.",
      categoryPlatform: "Plateforme et Organisation",
      categoryQuantum: "Informatique Quantique & Circuits",
      categorySimulator: "Simulation & Visualisateurs",
      needMoreHelp: "Vous avez d'autres questions ? Contactez l'équipe REVERSUN."
    },
    aiTutor: {
      title: "Schrödinger AI",
      subtitle: "Tuteur Quantique Socratique Adaptatif",
      placeholder: "Posez une question ou explorez un concept...",
      askButton: "Envoyer",
      clearChat: "Effacer la discussion",
      socraticMode: "Mode guidé socratique",
      intuitiveExplain: "✨ Expliquer simplement",
      diracMath: "📐 Démonstration Dirac",
      practiceQuiz: "🎯 Quiz d'entraînement"
    },
    identity: {
      signInTitle: "Connexion à QuanBit",
      signUpTitle: "Créez votre profil quantique",
      nameLabel: "Votre nom",
      namePlaceholder: "Entrez votre nom complet",
      emailLabel: "Adresse e-mail",
      emailPlaceholder: "etudiant@universite.fr",
      passwordLabel: "Mot de passe",
      passwordPlaceholder: "Au moins 6 caractères",
      signInButton: "Se connecter",
      signUpButton: "Créer un compte",
      switchToSignUp: "Pas de compte ? Inscrivez-vous gratuitement",
      switchToSignIn: "Déjà inscrit ? Connectez-vous"
    },
    subscription: {
      badge: "QuanBit Pro",
      title: "Perfectionnez votre Maîtrise Quantique",
      subtitle: "Débloquez les défis multi-qubits avancés, les démonstrations mathématiques complètes et la simulation prioritaire.",
      monthlyPlan: "Mensuel",
      annualPlan: "Annuel (Économisez 20%)",
      upgradeButton: "Passer à Pro",
      downgradeButton: "Revenir à la formule gratuite",
      proFeature1: "Défis de pratique avancés illimités",
      proFeature2: "Démonstrations mathématiques de Dirac complètes",
      proFeature3: "Requêtes prioritaires auprès du tuteur Schrödinger AI"
    },
    footer: {
      brandDesc: "Plateforme éducative quantique interactive et gratuite avec simulation multi-backend (Qiskit, Cirq, PennyLane), sphère de Bloch 3D et tuteur Schrödinger AI.",
      rightsReserved: "Tous droits réservés.",
      productBy: "QuanBit est un produit de",
      openAccess: "Éducation quantique ouverte et accessible à tous.",
      modulesTitle: "Modules d'Algorithmes Quantiques",
      resourcesTitle: "Ressources & Outils",
      a11yTitle: "Accessibilité & Normes",
      compliantBadge: "Conforme WCAG 2.1 AA",
      dualModeDesc: "Explications en mode double (intuitif et formalisme de Dirac), navigation clavier complète et support multilingue.",
      builtWith: "Conçu avec passion pour l'enseignement de la physique quantique."
    }
  },

  de: {
    common: {
      learnMore: "Mehr erfahren",
      trySimulator: "Schaltungs-Builder ausprobieren",
      exploreBloch: "Bloch-Kugel erkunden",
      startLearning: "Lernen beginnen",
      backToHome: "Zurück zur Startseite",
      loading: "Wird geladen...",
      save: "Speichern",
      cancel: "Abbrechen",
      close: "Schließen",
      submit: "Absenden",
      error: "Fehler",
      success: "Erfolg",
      pro: "Pro",
      free: "Kostenlos",
      verified: "Verifiziert",
      comingSoon: "Demnächst",
      openMenu: "Menü öffnen",
      viewAll: "Alle ansehen",
      next: "Weiter",
      previous: "Zurück"
    },
    practice: {
      title: "Quanten-Programmier-Arena",
      subtitle: "Praktische Quantenprogrammier-Herausforderungen zu Superposition, Verschränkung, Algorithmen und Optimierung.",
      solveChallenge: "Herausforderung lösen",
      hints: "Hinweise",
      testCases: "Testfälle",
      points: "Punkte",
      difficulty: "Schwierigkeit",
      runCode: "Code ausführen",
      submitCode: "Lösung einreichen",
      completed: "Abgeschlossen",
      allChallenges: "Alle Aufgaben",
      easy: "Einfach",
      medium: "Mittel",
      hard: "Schwer"
    },
    dashboard: {
      title: "Quanten-Lern-Dashboard",
      subtitle: "Verfolgen Sie Ihre Konzeptbeherrschung, Lernsträhne, Algorithmen-Fortschritte und KI-Empfehlungen.",
      streak: "Tage-Strähne",
      mastery: "Konzeptbeherrschung",
      superposition: "Superposition",
      entanglement: "Verschränkung",
      phaseKickback: "Phasenrückstoß",
      interference: "Interferenz",
      measurement: "Messung",
      quizAccuracy: "Quiz-Genauigkeit",
      completedModules: "Abgeschlossene Module",
      misconceptions: "Erkannte Fehlkonzepte",
      askTutor: "Mit Schrödinger AI wiederholen",
      recentActivity: "Letzte Aktivitäten",
      viewCertificate: "Verifiziertes Zertifikat ansehen",
      continueLearning: "Weiterlernen"
    },
    about: {
      badge: "Die QuanBit-Mission",
      title: "Demokratisierung der Quantencomputing-Bildung weltweit",
      subtitle: "Eine interaktive, wissenschaftliche visuelle Plattform von REVERSUN zur Förderung von Lernenden, Lehrenden und Forschenden.",
      missionTitle: "Unsere Mission",
      missionDesc: "Quantencomputing gilt oft als schwer zugänglich. QuanBit ersetzt passives Lesen durch interaktive 3D-WebGL-Visualisierungen, Echtzeit-Simulation (Qiskit, Cirq, PennyLane) und sokratischen KI-Unterricht.",
      guideTitle: "Visueller Leitfaden zur Quantenmechanik",
      guideSubtitle: "Meistern Sie Qubits, Superposition, Quantenmessung und Verschränkung Schritt für Schritt.",
      productBy: "QuanBit ist ein Produkt von",
      learnMore: "REVERSUN-Technologien entdecken"
    },
    contact: {
      title: "QuanBit & REVERSUN kontaktieren",
      subtitle: "Kontaktieren Sie uns für Bildungsanfragen, Universitätspartnerschaften oder technischen Support.",
      supportTitle: "Direkter E-Mail-Support",
      supportDesc: "Wenden Sie sich bei Fragen direkt an die Teams von REVERSUN und QuanBit.",
      enquiryTitle: "REVERSUN-Anfrageformular",
      enquiryDesc: "Reichen Sie Kooperations- und Projektanfragen über unser offizielles Formular ein.",
      partnershipTitle: "Akademische & Hochschul-Partnerschaften",
      partnershipDesc: "Integrieren Sie QuanBits interaktive Quantensimulatoren und Zertifikate in Ihre Lehrpläne.",
      sendEnquiry: "Anfrageformular öffnen"
    },
    faq: {
      title: "Häufig gestellte Fragen (FAQ)",
      subtitle: "Antworten zu QuanBit, der 3D-Bloch-Kugel, Multi-Backend-Simulation, Zertifikaten und REVERSUN.",
      categoryPlatform: "Plattform & Organisation",
      categoryQuantum: "Quantencomputing & Schaltkreise",
      categorySimulator: "Simulation & Visualisierer",
      needMoreHelp: "Haben Sie weitere Fragen? Kontaktieren Sie das REVERSUN-Team."
    },
    aiTutor: {
      title: "Schrödinger AI",
      subtitle: "Adaptiver sokratischer Quanten-Tutor",
      placeholder: "Stellen Sie eine Frage oder erkunden Sie ein Konzept...",
      askButton: "Senden",
      clearChat: "Chat leeren",
      socraticMode: "Sokratischer Begleitmodus",
      intuitiveExplain: "✨ Anschaulich erklären",
      diracMath: "📐 Dirac-Mathematik",
      practiceQuiz: "🎯 Übungsfrage"
    },
    identity: {
      signInTitle: "Bei QuanBit anmelden",
      signUpTitle: "Quanten-Profil erstellen",
      nameLabel: "Ihr Name",
      namePlaceholder: "Vollständigen Namen eingeben",
      emailLabel: "E-Mail-Adresse",
      emailPlaceholder: "student@universitaet.de",
      passwordLabel: "Passwort",
      passwordPlaceholder: "Mindestens 6 Zeichen",
      signInButton: "Anmelden",
      signUpButton: "Konto erstellen",
      switchToSignUp: "Noch kein Konto? Kostenlos registrieren",
      switchToSignIn: "Bereits registriert? Anmelden"
    },
    subscription: {
      badge: "QuanBit Pro",
      title: "Erweitern Sie Ihr Quantenwissen",
      subtitle: "Schalten Sie anspruchsvolle Multi-Qubit-Aufgaben, detaillierte mathematische Herleitungen und Prioritäts-Simulation frei.",
      monthlyPlan: "Monatlich",
      annualPlan: "Jährlich (20% sparen)",
      upgradeButton: "Auf Pro upgraden",
      downgradeButton: "Zum kostenlosen Tarif wechseln",
      proFeature1: "Unbegrenzte fortgeschrittene Programmierübungen",
      proFeature2: "Vollständige mathematische Dirac-Herleitungen",
      proFeature3: "Priorisierte Anfragen an den Schrödinger AI Tutor"
    },
    footer: {
      brandDesc: "Kostenlose interaktive Quantencomputing-Plattform mit Multi-Backend-Simulation (Qiskit, Cirq, PennyLane), 3D-Bloch-Kugel und Schrödinger AI Tutor.",
      rightsReserved: "Alle Rechte vorbehalten.",
      productBy: "QuanBit ist ein Produkt von",
      openAccess: "Offener Zugang zu Quantenbildung weltweit.",
      modulesTitle: "Quanten-Algorithmen-Module",
      resourcesTitle: "Ressourcen & Werkzeuge",
      a11yTitle: "Barrierefreiheit & Standards",
      compliantBadge: "WCAG 2.1 AA konform",
      dualModeDesc: "Zwei Erklärungsmodi (anschaulich & Dirac-Formalismus), vollständige Tastaturnavigation und mehrsprachige Unterstützung.",
      builtWith: "Mit Leidenschaft für die Quantenphysik-Bildung entwickelt."
    }
  },

  ta: {
    common: {
      learnMore: "மேலும் அறிக",
      trySimulator: "சுற்று அமைப்பியை சோதிக்கவும்",
      exploreBloch: "ப்ளாச் கோளத்தை ஆராய்க",
      startLearning: "கற்கத் தொடங்குங்கள்",
      backToHome: "முகப்புக்குத் திரும்பு",
      loading: "ஏற்றுகிறது...",
      save: "சேமிக்கவும்",
      cancel: "ரத்து செய்",
      close: "மூடு",
      submit: "சமர்ப்பிக்கவும்",
      error: "பிழை",
      success: "வெற்றி",
      pro: "ப்ரோ",
      free: "இலவசம்",
      verified: "சரிபார்க்கப்பட்டது",
      comingSoon: "விரைவில் வருகிறது",
      openMenu: "பட்டியலைத் திற",
      viewAll: "அனைத்தையும் காண்க",
      next: "அடுத்து",
      previous: "முந்தையது"
    },
    practice: {
      title: "குவாண்டம் நிரலாக்க களம்",
      subtitle: "சூப்பர்பொசிஷன், என்டாங்கிள்மென்ட், அல்காரிதம்கள் மற்றும் சுற்று உகப்பாக்கம் சார்ந்த செயல்முறைப் பயிற்சிகள்.",
      solveChallenge: "சவாலைத் தீர்க்கவும்",
      hints: "குறிப்புகள்",
      testCases: "சோதனை வழக்குகள்",
      points: "புள்ளிகள்",
      difficulty: "கடினத்தன்மை",
      runCode: "நிரலை இயக்கு",
      submitCode: "தீர்வைச் சமர்ப்பி",
      completed: "நிறைவுற்றது",
      allChallenges: "அனைத்து சவால்கள்",
      easy: "எளிது",
      medium: "நடுத்தரம்",
      hard: "கடினம்"
    },
    dashboard: {
      title: "குவாண்டம் கற்றல் தகவல் பலகை",
      subtitle: "கருத்து தேர்ச்சி, தினசரி தொடர் கற்றல், அல்காரிதம் முன்னேற்றம் மற்றும் AI ஆலோசனைகளைக் கண்காணிக்கவும்.",
      streak: "தினசரி தொடர்",
      mastery: "கருத்து தேர்ச்சி",
      superposition: "சூப்பர்பொசிஷன் (Superposition)",
      entanglement: "குவாண்டம் பிணைப்பு (Entanglement)",
      phaseKickback: "ஃபேஸ் கிக்பேக் (Phase Kickback)",
      interference: "குறுக்கீடு (Interference)",
      measurement: "அளவீடு (Measurement)",
      quizAccuracy: "வினாடி வினா துல்லியம்",
      completedModules: "முடிக்கப்பட்ட பாடங்கள்",
      misconceptions: "கண்டறியப்பட்ட தவறான புரிதல்கள்",
      askTutor: "ஷ்ரோடிங்கர் AI-உடன் மறுபரிசீலனை செய்க",
      recentActivity: "சமீபத்திய செயல்பாடுகள்",
      viewCertificate: "சரிபார்க்கப்பட்ட சான்றிதழைப் பார்",
      continueLearning: "கற்றலைத் தொடரவும்"
    },
    about: {
      badge: "குவான்பிட் லட்சியம்",
      title: "உலகளாவிய குவாண்டம் கணினி கல்வியை எளிமையாக்குதல்",
      subtitle: "மாணவர்கள், ஆசிரியர்கள் மற்றும் ஆராய்ச்சியாளர்களுக்கு குவாண்டம் அறிவை எளிதில் வழங்க REVERSUN உருவாக்கிய ஊடாடும் அறிவியல் தளம்.",
      missionTitle: "எங்கள் நோக்கம்",
      missionDesc: "குவாண்டம் கம்ப்யூட்டிங் சிக்கலான கணித குறியீடுகளால் கடினமாகத் தோன்றலாம். குவான்பிட் அதை 3D WebGL காட்சிகள், நேரலை சுற்று உருவகப்படுத்துதல் (Qiskit, Cirq, PennyLane) மற்றும் சாக்ரடிக் AI ஆசிரியர் மூலம் எளிதாக்குகிறது.",
      guideTitle: "குவாண்டம் இயற்பியல் காட்சி வழிகாட்டி",
      guideSubtitle: "க்யூபிட், சூப்பர்பொசிஷன், குவாண்டம் அளவீடு மற்றும் பிணைப்பை படிப்படியாகக் கற்றுக் கொள்ளுங்கள்.",
      productBy: "குவான்பிட் என்பது இதன் தயாரிப்பு:",
      learnMore: "REVERSUN தொழில்நுட்பங்களை ஆராயுங்கள்"
    },
    contact: {
      title: "குவான்பிட் & REVERSUN தொடர்பு",
      subtitle: "கல்வி விசாரணைகள், பல்கலைக்கழக கூட்டாண்மை அல்லது தொழில்நுட்ப உதவிக்கு எங்களைத் தொடர்பு கொள்ளுங்கள்.",
      supportTitle: "நேரடி மின்னஞ்சல் ஆதரவு",
      supportDesc: "கேள்விகள் அல்லது கருத்துகளுக்கு REVERSUN மற்றும் குவான்பிட் குழுக்களை நேரடியாகத் தொடர்பு கொள்ளவும்.",
      enquiryTitle: "REVERSUN இணையதள விசாரணை படிவம்",
      enquiryDesc: "கூட்டாண்மை மற்றும் ஒத்துழைப்பு கோரிக்கைகளை எங்களின் அதிகாரப்பூர்வ படிவத்தின் மூலம் சமர்ப்பிக்கவும்.",
      partnershipTitle: "கல்வி & பல்கலைக்கழக கூட்டாண்மை",
      partnershipDesc: "குவான்பிட்டின் ஊடாடும் உருவகப்படுத்திகள் மற்றும் சான்றிதழ்களை உங்கள் பாடத்திட்டத்தில் இணைக்கவும்.",
      sendEnquiry: "விசாரணை படிவத்தைத் திறக்கவும்"
    },
    faq: {
      title: "அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQ)",
      subtitle: "குவான்பிட், 3D ப்ளாச் கோளம், பல கணினி சிமுலேஷன், சான்றிதழ்கள் மற்றும் REVERSUN பற்றிய தகவல்கள்.",
      categoryPlatform: "தளம் மற்றும் அமைப்பு",
      categoryQuantum: "குவாண்டம் கணினி & சுற்றுகள்",
      categorySimulator: "சிமுலேஷன் & காட்சிப்படுத்திகள்",
      needMoreHelp: "கூடுதல் கேள்விகள் உள்ளதா? REVERSUN குழுவைத் தொடர்பு கொள்ளவும்."
    },
    aiTutor: {
      title: "ஷ்ரோடிங்கர் AI",
      subtitle: "தகவமைப்பு சாக்ரடிக் குவாண்டம் வழிகாட்டி",
      placeholder: "ஒரு கேள்வி கேளுங்கள் அல்லது குவாண்டம் கருத்தை ஆராயுங்கள்...",
      askButton: "அனுப்பு",
      clearChat: "உரையாடலை அழி",
      socraticMode: "சாக்ரடிக் வழிகாட்டுதல் முறை",
      intuitiveExplain: "✨ எளிமையாக விளக்குங்கள்",
      diracMath: "📐 டிராக் கணித விளக்கம்",
      practiceQuiz: "🎯 பயிற்சி வினாக்கள்"
    },
    identity: {
      signInTitle: "குவான்பிட்டில் உள்நுழைக",
      signUpTitle: "உங்கள் குவாண்டம் சுயவிவரத்தை உருவாக்கவும்",
      nameLabel: "உங்கள் பெயர்",
      namePlaceholder: "முழு பெயரை உள்ளிடவும்",
      emailLabel: "மின்னஞ்சல் முகவரி",
      emailPlaceholder: "student@university.edu",
      passwordLabel: "கடவுச்சொல்",
      passwordPlaceholder: "குறைந்தது 6 எழுத்துக்கள்",
      signInButton: "உள்நுழைக",
      signUpButton: "கணக்கை உருவாக்கு",
      switchToSignUp: "கணக்கு இல்லையா? இலவசமாகப் பதிவு செய்யுங்கள்",
      switchToSignIn: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையவும்"
    },
    subscription: {
      badge: "குவான்பிட் ப்ரோ",
      title: "உங்கள் குவாண்டம் திறனை உயர்த்துங்கள்",
      subtitle: "மேம்பட்ட மல்டி-க்யூபிட் சவால்கள், விரிவான கணித தீர்வுகள் மற்றும் முன்னுரிமை உருவகப்படுத்துதலைப் பெறுங்கள்.",
      monthlyPlan: "மாதாந்திரம்",
      annualPlan: "வருடாந்திரம் (20% சேமிப்பு)",
      upgradeButton: "ப்ரோவுக்கு மேம்படுத்துங்கள்",
      downgradeButton: "இலவச பதிப்பிற்கு மாறவும்",
      proFeature1: "வரம்பற்ற மேம்பட்ட குவாண்டம் பயிற்சிகள்",
      proFeature2: "முழுமையான டிராக் கணித சமன்பாடுகள்",
      proFeature3: "முன்னுரிமை ஷ்ரோடிங்கர் AI வினா ஆதரவு"
    },
    footer: {
      brandDesc: "பல பின்னேற்பு சிமுலேஷன் (Qiskit, Cirq, PennyLane), நேரலை 3D ப்ளாச் கோளம் மற்றும் ஷ்ரோடிங்கர் AI வழிகாட்டியுடன் கூடிய இலவச குவாண்டம் கல்வி தளம்.",
      rightsReserved: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
      productBy: "குவான்பிட் என்பது இதன் தயாரிப்பு:",
      openAccess: "உலகெங்கிலும் உள்ள அனைவருக்கும் இலவச திறந்தநிலை குவாண்டம் கல்வி.",
      modulesTitle: "குவாண்டம் அல்காரிதம் தொகுதிகள்",
      resourcesTitle: "வளங்கள் & கருவிகள்",
      a11yTitle: "அணுகல்தன்மை & தரநிலைகள்",
      compliantBadge: "WCAG 2.1 AA இணக்கமானது",
      dualModeDesc: "இரு-முறை விளக்கங்கள் (எளிமையான & டிராக் முறை), முழு விசைப்பலகை இயக்கம் மற்றும் பலமொழி ஆதரவு.",
      builtWith: "குவாண்டம் இயற்பியல் கல்விக்காக அன்புடன் உருவாக்கப்பட்டது."
    }
  },

  te: {
    common: {
      learnMore: "మరింత తెలుసుకోండి",
      trySimulator: "సర్క్యూట్ బిల్డర్‌ను ప్రయత్నించండి",
      exploreBloch: "బ్లోచ్ గోళాన్ని అన్వేషించండి",
      startLearning: "నేర్చుకోవడం ప్రారంభించండి",
      backToHome: "హోమ్‌కు తిరిగి వెళ్ళు",
      loading: "లోడ్ అవుతోంది...",
      save: "భద్రపరచు",
      cancel: "రద్దు చేయి",
      close: "మూసివేయి",
      submit: "సమర్పించు",
      error: "లోపం",
      success: "విజయం",
      pro: "ప్రో",
      free: "ఉచితం",
      verified: "ధృవీకరించబడింది",
      comingSoon: "త్వరలో వస్తుంది",
      openMenu: "మెనూ తెరవండి",
      viewAll: "అన్నీ చూడండి",
      next: "తదుపరి",
      previous: "మునుపటి"
    },
    practice: {
      title: "క్వాంటమ్ కోడింగ్ అరేనా",
      subtitle: "సూపర్‌పొజిషన్, ఎంటాంగిల్‌మెంట్, అల్గారిథమ్‌లు మరియు సర్క్యూట్ ఆప్టిమైజేషన్‌పై ఆచరణాత్మక క్వాంటమ్ ప్రోగ్రామింగ్ సవాళ్లు.",
      solveChallenge: "సవాలును పరిష్కరించండి",
      hints: "సూచనలు",
      testCases: "పరీక్షా సందర్భాలు",
      points: "పాయింట్లు",
      difficulty: "కఠినతరం",
      runCode: "కోడ్‌ను అమలు చేయి",
      submitCode: "పరిష్కారాన్ని సమర్పించు",
      completed: "పూర్తయింది",
      allChallenges: "అన్ని సవాళ్లు",
      easy: "సులభం",
      medium: "మధ్యస్థం",
      hard: "కఠినం"
    },
    dashboard: {
      title: "క్వాంటమ్ లెర్నింగ్ డాష్‌బోర్డ్",
      subtitle: "మీ భావనా ప్రావీణ్యం, రోజువారీ స్ట్రీక్, అల్గారిథమ్ పురోగతి మరియు AI మార్గదర్శకత్వాన్ని ట్రాక్ చేయండి.",
      streak: "రోజువారీ స్ట్రీక్",
      mastery: "భావనా ప్రావీణ్యం",
      superposition: "సూపర్‌పొజిషన్",
      entanglement: "ఎంటాంగిల్‌మెంట్",
      phaseKickback: "ఫేజ్ కిక్‌బ్యాక్",
      interference: "ఇంటర్‌ఫరెన్స్",
      measurement: "కొలత (Measurement)",
      quizAccuracy: "క్విజ్ ఖచ్చితత్వం",
      completedModules: "పూర్తయిన మాడ్యూల్స్",
      misconceptions: "గుర్తించిన అపోహలు",
      askTutor: "ష్రోడింగర్ AIతో సమీక్షించండి",
      recentActivity: "ఇటీవలి కార్యాచరణ",
      viewCertificate: "ధృవీకరించిన సర్టిఫికెట్ చూడండి",
      continueLearning: "నేర్చుకోవడం కొనసాగించండి"
    },
    about: {
      badge: "క్వాన్‌బిట్ లక్ష్యం",
      title: "ప్రపంచవ్యాప్తంగా క్వాంటమ్ కంప్యూటింగ్ విద్యను సులభతరం చేయడం",
      subtitle: "విద్యార్థులు, అధ్యాపకులు మరియు పరిశోధకులను శక్తివంతం చేయడానికి REVERSUN అభివృద్ధి చేసిన ఇంటరాక్టివ్ సైంటిఫిక్ ప్లాట్‌ఫామ్.",
      missionTitle: "మా లక్ష్యం",
      missionDesc: "క్వాంటమ్ కంప్యూటింగ్ సంక్లిష్టమైన గణిత గుర్తుల వల్ల కష్టంగా అనిపించవచ్చు. క్వాన్‌బిట్ 3D WebGL విజువలైజేషన్స్, నిజ-సమయ సర్క్యూట్ సిమ్యులేషన్ (Qiskit, Cirq, PennyLane) మరియు సాక్రటిక్ AI ట్యూటర్ ద్వారా దానిని సులభతరం చేస్తుంది.",
      guideTitle: "క్వాంటమ్ మెకానిక్స్ విజువల్ గైడ్",
      guideSubtitle: "క్యూబిట్, సూపర్‌పొజిషన్, క్వాంటమ్ కొలత మరియు ఎంటాంగిల్‌మెంట్‌ను దశలవారీగా నేర్చుకోండి.",
      productBy: "క్వాన్‌బిట్ అనేది దీని ఉత్పత్తి:",
      learnMore: "REVERSUN సాంకేతికతలను అన్వేషించండి"
    },
    contact: {
      title: "క్వాన్‌బిట్ & REVERSUN సంప్రదింపు",
      subtitle: "విద్యా విచారణలు, విశ్వవిద్యాలయ భాగస్వామ్యాలు లేదా సాంకేతిక మద్దతు కోసం మమ్మల్ని సంప్రదించండి.",
      supportTitle: "ప్రత్యక్ష ఇమెయిల్ మద్దతు",
      supportDesc: "ప్రశ్నలు లేదా సూచనల కోసం REVERSUN మరియు క్వాన్‌బిట్ బృందాలను నేరుగా సంప్రదించండి.",
      enquiryTitle: "REVERSUN ఆన్‌లైన్ విచారణ ఫారం",
      enquiryDesc: "మా అధికారిక ఫారం ద్వారా భాగస్వామ్యాలు మరియు సహకార అభ్యర్థనలను సమర్పించండి.",
      partnershipTitle: "విద్యా & విశ్వవిద్యాలయ భాగస్వామ్యాలు",
      partnershipDesc: "క్వాన్‌బిట్ ఇంటరాక్టివ్ సిమ్యులేటర్లు మరియు సర్టిఫికెట్లను మీ పాఠ్యాంశాల్లో చేర్చండి.",
      sendEnquiry: "విచారణ ఫారం తెరవండి"
    },
    faq: {
      title: "తరచుగా అడిగే ప్రశ్నలు (FAQ)",
      subtitle: "క్వాన్‌బిట్, 3D బ్లోచ్ గోళం, మల్టీ-బ్యాకెండ్ సిమ్యులేషన్, సర్టిఫికెట్లు మరియు REVERSUN గురించిన సమాచారం.",
      categoryPlatform: "ప్లాట్‌ఫామ్ & సంస్థ",
      categoryQuantum: "క్వాంటమ్ కంప్యూటింగ్ & సర్క్యూట్లు",
      categorySimulator: "సిమ్యులేషన్ & విజువలైజర్లు",
      needMoreHelp: "మరిన్ని ప్రశ్నలు ఉన్నాయా? REVERSUN బృందాన్ని సంప్రదించండి."
    },
    aiTutor: {
      title: "ష్రోడింగర్ AI",
      subtitle: "అనుకూల సాక్రటిక్ క్వాంటమ్ ట్యూటర్",
      placeholder: "ఒక ప్రశ్న అడగండి లేదా క్వాంటం భావనను అన్వేషించండి...",
      askButton: "పంపండి",
      clearChat: "చాట్ క్లియర్ చేయి",
      socraticMode: "సాక్రటిక్ మార్గదర్శక మోడ్",
      intuitiveExplain: "✨ సులభంగా వివరించండి",
      diracMath: "📐 డిరాక్ గణిత వివరణ",
      practiceQuiz: "🎯 అభ్యాస ప్రశ్న"
    },
    identity: {
      signInTitle: "క్వాన్‌బిట్‌లో సైన్ ఇన్ చేయండి",
      signUpTitle: "మీ క్వాంటమ్ ప్రొఫైల్ సృష్టించండి",
      nameLabel: "మీ పేరు",
      namePlaceholder: "పూర్తి పేరు నమోదు చేయండి",
      emailLabel: "ఇమెయిల్ చిరునామా",
      emailPlaceholder: "student@university.edu",
      passwordLabel: "పాస్‌వర్డ్",
      passwordPlaceholder: "కనీసం 6 అక్షరాలు",
      signInButton: "సైన్ ఇన్ చేయండి",
      signUpButton: "ఖాతాను సృష్టించండి",
      switchToSignUp: "ఖాతా లేదా? ఉచితంగా నమోదు చేసుకోండి",
      switchToSignIn: "ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్ చేయండి"
    },
    subscription: {
      badge: "క్వాన్‌బిట్ ప్రో",
      title: "మీ క్వాంటమ్ ప్రావీణ్యాన్ని పెంచుకోండి",
      subtitle: "అధునాతన మల్టీ-క్యూబిట్ సవాళ్లు, పూర్తి గణిత ఉత్పాదనలు మరియు ప్రాధాన్యత సిమ్యులేషన్‌ను అన్‌లాక్ చేయండి.",
      monthlyPlan: "నెలవారీ",
      annualPlan: "వార్షిక (20% ఆదా)",
      upgradeButton: "ప్రోకి అప్‌గ్రేడ్ చేయండి",
      downgradeButton: "ఉచిత ప్లాన్‌కు మారండి",
      proFeature1: "అపరిమిత అధునాతన అభ్యాస సవాళ్లు",
      proFeature2: "పూర్తి డిరాక్ గణిత ఉత్పాదనలు",
      proFeature3: "ప్రాధాన్యత ష్రోడింగర్ AI ట్యూటర్ ప్రశ్నలు"
    },
    footer: {
      brandDesc: "మల్టీ-బ్యాకెండ్ సిమ్యులేషన్ (Qiskit, Cirq, PennyLane), 3D బ్లోచ్ గోళం మరియు ష్రోడింగర్ AI ట్యూటర్‌తో ఉచిత క్వాంటమ్ విద్య ప్లాట్‌ఫామ్.",
      rightsReserved: "అన్ని హక్కులు ప్రత్యేకించబడ్డాయి.",
      productBy: "క్వాన్‌బిట్ అనేది దీని ఉత్పత్తి:",
      openAccess: "ప్రపంచవ్యాప్తంగా ఉచిత ఓపెన్-యాక్సెస్ క్వాంటమ్ విద్య.",
      modulesTitle: "క్వాంటమ్ అల్గారిథమ్ మాడ్యూల్స్",
      resourcesTitle: "వనరులు & సాధనాలు",
      a11yTitle: "యాక్సెసిబిలిటీ & ప్రమాణాలు",
      compliantBadge: "WCAG 2.1 AA కంప్లైంట్",
      dualModeDesc: "ద్వి-మోడ్ వివరణలు (సులభమైన & డిరాక్ సంజ్ఞామానం), పూర్తి కీబోర్డ్ నావిగేషన్ మరియు బహుభాషా మద్దతు.",
      builtWith: "క్వాంటమ్ ఫిజిక్స్ విద్య కోసం అంకితభావంతో రూపొందించబడింది."
    }
  },

  ja: {
    common: {
      learnMore: "詳細を見る",
      trySimulator: "回路ビルダーを試す",
      exploreBloch: "ブロッホ球を探索",
      startLearning: "学習を始める",
      backToHome: "ホームに戻る",
      loading: "読み込み中...",
      save: "保存",
      cancel: "キャンセル",
      close: "閉じる",
      submit: "送信",
      error: "エラー",
      success: "成功",
      pro: "Pro",
      free: "無料",
      verified: "認証済み",
      comingSoon: "近日公開",
      openMenu: "メニューを開く",
      viewAll: "すべて表示",
      next: "次へ",
      previous: "前へ"
    },
    practice: {
      title: "量子コーディングアリーナ",
      subtitle: "重ね合わせ、エンタングルメント、アルゴリズム、回路最適化に関する実践的な量子プログラミング課題。",
      solveChallenge: "課題を解く",
      hints: "ヒント",
      testCases: "テストケース",
      points: "ポイント",
      difficulty: "難易度",
      runCode: "コードを実行",
      submitCode: "解答を提出",
      completed: "完了",
      allChallenges: "すべての課題",
      easy: "初級",
      medium: "中級",
      hard: "上級"
    },
    dashboard: {
      title: "量子学習ダッシュボード",
      subtitle: "概念の習得状況、連続学習日数、アルゴリズムの進捗、AIからの推薦を追跡します。",
      streak: "連続日数",
      mastery: "概念の習得度",
      superposition: "重ね合わせ (Superposition)",
      entanglement: "量子もつれ (Entanglement)",
      phaseKickback: "位相キックバック",
      interference: "干渉 (Interference)",
      measurement: "量子測定",
      quizAccuracy: "クイズ正解率",
      completedModules: "完了したモジュール",
      misconceptions: "特定された誤解",
      askTutor: "シュレーディンガーAIと復習",
      recentActivity: "最近の学習活動",
      viewCertificate: "認証済み修了証を表示",
      continueLearning: "学習を続ける"
    },
    about: {
      badge: "QuanBitの使命",
      title: "世界中で量子コンピューティング教育を民主化する",
      subtitle: "REVERSUNが開発した、学習者、教育者、研究者を支援するための次世代型インタラクティブ科学プラットフォーム。",
      missionTitle: "私たちの使命",
      missionDesc: "量子コンピューティングは難解な数式により敷居が高いとされがちです。QuanBitは受動的な学習を脱却し、インタラクティブな3D WebGL可視化、マルチバックエンドシミュレーション（Qiskit、Cirq、PennyLane）、ソクラテス式AI指導を提供します。",
      guideTitle: "量子力学ビジュアルガイド",
      guideSubtitle: "量子ビット、重ね合わせ、量子測定、もつれの基本を段階的に習得。",
      productBy: "QuanBitの提供元：",
      learnMore: "REVERSUNテクノロジーを探索"
    },
    contact: {
      title: "QuanBit & REVERSUNへのお問い合わせ",
      subtitle: "教育に関するご相談、大学連携、技術サポートなどお気軽にご連絡ください。",
      supportTitle: "直接メールサポート",
      supportDesc: "ご質問やフィードバックは、REVERSUNおよびQuanBitチームへ直接お送りください。",
      enquiryTitle: "REVERSUNオンラインお問い合わせフォーム",
      enquiryDesc: "パートナーシップやプロジェクト提携のご相談は公式フォームより受付中です。",
      partnershipTitle: "教育機関・大学とのパートナーシップ",
      partnershipDesc: "授業やカリキュラムにQuanBitのインタラクティブシミュレータや認証修了証を導入できます。",
      sendEnquiry: "お問い合わせフォームを開く"
    },
    faq: {
      title: "よくある質問 (FAQ)",
      subtitle: "QuanBit、3Dブロッホ球、マルチバックエンドシミュレーション、修了証、REVERSUNに関する回答。",
      categoryPlatform: "プラットフォーム・組織について",
      categoryQuantum: "量子計算・回路について",
      categorySimulator: "シミュレーション・可視化について",
      needMoreHelp: "他にご不明な点がございますか？REVERSUNチームへお問い合わせください。"
    },
    aiTutor: {
      title: "シュレーディンガー AI",
      subtitle: "対話型ソクラテス式量子指導AI",
      placeholder: "質問を入力するか、量子概念を探索...",
      askButton: "送信",
      clearChat: "会話をクリア",
      socraticMode: "ソクラテス式指導モード",
      intuitiveExplain: "✨ 直感的に解説",
      diracMath: "📐 ディラック表記の解説",
      practiceQuiz: "🎯 練習問題を出題"
    },
    identity: {
      signInTitle: "QuanBitにログイン",
      signUpTitle: "量子プロファイルを作成",
      nameLabel: "お名前",
      namePlaceholder: "フルネームを入力",
      emailLabel: "メールアドレス",
      emailPlaceholder: "student@university.jp",
      passwordLabel: "パスワード",
      passwordPlaceholder: "6文字以上",
      signInButton: "ログイン",
      signUpButton: "アカウント作成",
      switchToSignUp: "アカウントをお持ちでない方は無料登録",
      switchToSignIn: "すでにアカウントをお持ちの方はログイン"
    },
    subscription: {
      badge: "QuanBit Pro",
      title: "量子マスターへのステップアップ",
      subtitle: "高度な複数量子ビット課題、厳密な数式導出、優先クラウドシミュレーションを解放。",
      monthlyPlan: "月額プラン",
      annualPlan: "年額プラン (20%お得)",
      upgradeButton: "Proにアップグレード",
      downgradeButton: "無料プランに戻す",
      proFeature1: "高度な実践コーディング課題への無制限アクセス",
      proFeature2: "ディラック表記による完全な数学的導出解説",
      proFeature3: "シュレーディンガーAIへの優先質問権"
    },
    footer: {
      brandDesc: "マルチバックエンド（Qiskit、Cirq、PennyLane）シミュレーション、リアルタイム3Dブロッホ球、シュレーディンガーAI講師を備えた無料の量子教育プラットフォーム。",
      rightsReserved: "All rights reserved.",
      productBy: "QuanBitは以下の製品です：",
      openAccess: "世界中に開かれたオープンアクセスな量子教育。",
      modulesTitle: "量子アルゴリズム学習モジュール",
      resourcesTitle: "リソース & ツール",
      a11yTitle: "アクセシビリティ & 標準準拠",
      compliantBadge: "WCAG 2.1 AA 準拠",
      dualModeDesc: "直感的表現とディラック表記の2モード解説、完全キーボード操作、多言語対応。",
      builtWith: "量子物理学教育への情熱とともに開発されました。"
    }
  },

  'zh-CN': {
    common: {
      learnMore: "了解更多",
      trySimulator: "体验线路构建器",
      exploreBloch: "探索布洛赫球",
      startLearning: "开始学习",
      backToHome: "返回首页",
      loading: "加载中...",
      save: "保存",
      cancel: "取消",
      close: "关闭",
      submit: "提交",
      error: "错误",
      success: "成功",
      pro: "Pro",
      free: "免费",
      verified: "已认证",
      comingSoon: "即将推出",
      openMenu: "打开菜单",
      viewAll: "查看全部",
      next: "下一步",
      previous: "上一步"
    },
    practice: {
      title: "量子编程实战竞技场",
      subtitle: "涵盖叠加态、纠缠态、核心量子算法与线路优化的上手实战编程挑战。",
      solveChallenge: "开始解题",
      hints: "查看提示",
      testCases: "测试用例",
      points: "积分",
      difficulty: "难度",
      runCode: "运行代码",
      submitCode: "提交解答",
      completed: "已完成",
      allChallenges: "所有题目",
      easy: "初级",
      medium: "中级",
      hard: "高级"
    },
    dashboard: {
      title: "量子学习看板",
      subtitle: "追踪概念掌握度、连续学习天数、算法通关进度与个性化 AI 教学建议。",
      streak: "天连续学习",
      mastery: "概念掌握度",
      superposition: "量子叠加 (Superposition)",
      entanglement: "量子纠缠 (Entanglement)",
      phaseKickback: "相位反冲 (Phase Kickback)",
      interference: "量子干涉 (Interference)",
      measurement: "量子测量 (Measurement)",
      quizAccuracy: "测验正确率",
      completedModules: "已掌握模块",
      misconceptions: "待巩固的认知盲区",
      askTutor: "与薛定谔 AI 共同复习",
      recentActivity: "近期学习动态",
      viewCertificate: "查看链上认证结业证书",
      continueLearning: "继续学习"
    },
    about: {
      badge: "QuanBit 的愿景与使命",
      title: "让前沿量子计算教育触达全球每一个人",
      subtitle: "由 REVERSUN 倾力打造的次世代交互式科学可视化计算平台，赋能全球学生、高校教师与科研探索者。",
      missionTitle: "我们的使命",
      missionDesc: "量子计算长期受制于繁琐抽象的狄拉克算符。QuanBit 打破传统灌输，融合 3D WebGL 实时渲染、行业主流仿真后端（Qiskit、Cirq、PennyLane）以及苏格拉底式 AI 助教，带来身临其境的学习体验。",
      guideTitle: "量子力学全景视觉指南",
      guideSubtitle: "循序渐进掌握量子比特、叠加态、测量坍缩与量子纠缠的核心原理。",
      productBy: "QuanBit 属于以下机构的工程产品：",
      learnMore: "探索 REVERSUN 科技生态"
    },
    contact: {
      title: "联系 QuanBit 与 REVERSUN",
      subtitle: "如需教学合作、高校课程集成、科研探讨或技术支持，欢迎随时联络。",
      supportTitle: "直接邮件支持",
      supportDesc: "如有任何疑问、课程反馈或合作意向，可直接发信给官方团队。",
      enquiryTitle: "REVERSUN 在线咨询表单",
      enquiryDesc: "通过官方合作通道提交高校合作、机构采购或定制化开发需求。",
      partnershipTitle: "高校与学术教学合作",
      partnershipDesc: "将 QuanBit 交互式量子模拟器与防伪结业证书集成至高校教学培养方案。",
      sendEnquiry: "打开在线咨询表单"
    },
    faq: {
      title: "常见问题解答 (FAQ)",
      subtitle: "解答关于 QuanBit、3D 布洛赫球面、多后端线路仿真、可信证书及 REVERSUN 的疑问。",
      categoryPlatform: "平台与机构背景",
      categoryQuantum: "量子计算与线路设计",
      categorySimulator: "仿真后端与可视化工具",
      needMoreHelp: "还有其他疑问？欢迎联系 REVERSUN 专家团队。"
    },
    aiTutor: {
      title: "薛定谔 AI",
      subtitle: "自适应苏格拉底式量子导师",
      placeholder: "输入问题或探索量子概念...",
      askButton: "发送",
      clearChat: "清空对话",
      socraticMode: "启发式教学模式",
      intuitiveExplain: "✨ 通俗易懂讲解",
      diracMath: "📐 狄拉克符号推导",
      practiceQuiz: "🎯 出一道练习题"
    },
    identity: {
      signInTitle: "登录 QuanBit",
      signUpTitle: "创建您的量子学员档案",
      nameLabel: "您的姓名",
      namePlaceholder: "输入您的真实姓名",
      emailLabel: "邮箱地址",
      emailPlaceholder: "student@university.edu.cn",
      passwordLabel: "密码",
      passwordPlaceholder: "至少 6 个字符",
      signInButton: "立即登录",
      signUpButton: "注册账号",
      switchToSignUp: "尚无账号？免费注册",
      switchToSignIn: "已有账号？直接登录"
    },
    subscription: {
      badge: "QuanBit Pro",
      title: "解锁量子进阶特权",
      subtitle: "解锁多比特复杂前沿题目、全量狄拉克矩阵推演与优先云端模拟算力。",
      monthlyPlan: "按月订阅",
      annualPlan: "按年订阅（立省 20%）",
      upgradeButton: "升级至 Pro 会员",
      downgradeButton: "转为免费版本",
      proFeature1: "无限畅享高阶实战挑战题库",
      proFeature2: "完整狄拉克严谨数学推导与解析",
      proFeature3: "薛定谔 AI 导师优先算力响应"
    },
    footer: {
      brandDesc: "基于多后端（Qiskit、Cirq、PennyLane）实时模拟、3D 布洛赫球面与薛定谔 AI 导师构建的全球开放式量子计算教育平台。",
      rightsReserved: "保留所有权利。",
      productBy: "QuanBit 属于以下机构的工程产品：",
      openAccess: "普惠全球的开放式量子计算教育。",
      modulesTitle: "量子核心算法模块",
      resourcesTitle: "平台资源与工具",
      a11yTitle: "无障碍访问与规范",
      compliantBadge: "WCAG 2.1 AA 国际认证",
      dualModeDesc: "通俗类比与严谨狄拉克双重模式，全键盘无障碍操作，多语言即时响应。",
      builtWith: "为量子物理与信息科学教育倾心打造。"
    }
  }
};

const languages = ['en', 'hi', 'es', 'fr', 'de', 'ta', 'te', 'ja', 'zh-CN'];

for (const lang of languages) {
  const merged = {
    ...(existing[lang] || existing.en),
    ...(additions[lang] || additions.en)
  };

  // Add specific labels to nav if not already present
  if (!merged.nav.about) {
    merged.nav.about = lang === 'hi' ? 'हमारे बारे में' :
      lang === 'es' ? 'Nosotros' :
      lang === 'fr' ? 'À propos' :
      lang === 'de' ? 'Über uns' :
      lang === 'ta' ? 'எங்களைப் பற்றி' :
      lang === 'te' ? 'మా గురించి' :
      lang === 'ja' ? '概要' :
      lang === 'zh-CN' ? '关于' : 'About';
  }
  if (!merged.nav.contact) {
    merged.nav.contact = lang === 'hi' ? 'संपर्क' :
      lang === 'es' ? 'Contacto' :
      lang === 'fr' ? 'Contact' :
      lang === 'de' ? 'Kontakt' :
      lang === 'ta' ? 'தொடர்பு' :
      lang === 'te' ? 'సంప్రదించండి' :
      lang === 'ja' ? 'お問い合わせ' :
      lang === 'zh-CN' ? '联系我们' : 'Contact';
  }
  if (!merged.nav.faq) {
    merged.nav.faq = 'FAQ';
  }
  if (!merged.nav.moreAlgorithms) {
    merged.nav.moreAlgorithms = lang === 'hi' ? 'और एल्गोरिदम' :
      lang === 'es' ? 'Más algoritmos' :
      lang === 'fr' ? 'Plus d\'algorithmes' :
      lang === 'de' ? 'Weitere Algorithmen' :
      lang === 'ta' ? 'கூடுதல் வழிமுறைகள்' :
      lang === 'te' ? 'మరిన్ని అల్గారిథమ్‌లు' :
      lang === 'ja' ? 'その他のアルゴリズム' :
      lang === 'zh-CN' ? '更多算法' : 'More Algorithms';
  }
  if (!merged.nav.multiSimulator) {
    merged.nav.multiSimulator = 'Multi-Simulator';
  }

  const outPath = path.join('messages', `${lang}.json`);
  fs.writeFileSync(outPath, JSON.stringify(merged, null, 2), 'utf8');
  console.log(`Wrote ${outPath} (${Object.keys(merged).length} namespaces)`);
}
