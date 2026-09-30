import {
  AlertTriangle,
  Ban,
  BarChart3,
  Banknote,
  Bell,
  Bookmark,
  BookOpen,
  Bot,
  Calculator,
  Camera,
  CalendarDays,
  CheckCircle2,
  CloudSun,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock3,
  Download,
  Droplets,
  FlaskConical,
  Gauge,
  Globe,
  HandCoins,
  ChevronDown,
  Image as ImageIcon,
  KeyRound,
  Leaf,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Moon,
  Newspaper,
  RefreshCw,
  Ruler,
  Search,
  ShieldCheck,
  ShoppingCart,
  Shuffle,
  Sparkles,
  Sprout,
  Sun,
  Target,
  Trash2,
  Tractor,
  TrendingUp,
  Upload,
  UserX,
  UserPlus,
  Wallet,
  Users,
  Wheat
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";

const SESSION_KEY = "cropura-session";
const THEME_KEY = "cropura-theme";
const LANG_KEY = "krishsense-lang";
const LEGACY_LANG_KEY = "cropura-lang";

const LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "hi", label: "HI", name: "Hindi" },
  { code: "pa", label: "PA", name: "Punjabi" },
  { code: "bn", label: "BN", name: "Bengali" },
  { code: "ta", label: "TA", name: "Tamil" },
  { code: "te", label: "TE", name: "Telugu" },
  { code: "mr", label: "MR", name: "Marathi" },
  { code: "gu", label: "GU", name: "Gujarati" },
  { code: "kn", label: "KN", name: "Kannada" },
  { code: "ml", label: "ML", name: "Malayalam" },
  { code: "ur", label: "UR", name: "Urdu" },
  { code: "ne", label: "NE", name: "Nepali" },
  { code: "or", label: "OR", name: "Odia" },
  { code: "as", label: "AS", name: "Assamese" },
  { code: "es", label: "ES", name: "Spanish" }
];
const UI_COPY_KEYS = [
  "changeLanguage", "adminConsole", "farmerDesk", "logOut", "secureAccess", "welcomeBack",
  "createFarmerAccount", "login", "register", "email", "password", "name", "farmName",
  "phone", "signIn", "signingIn", "createAccount", "creating", "soilAnalysis", "soilIdentifier",
  "history", "diseaseDetection", "insights", "farmTools", "cropPlanner", "market", "loans",
  "insurance", "account", "activeFarm", "analyses", "pendingReview", "latestSoil", "diseaseChecks",
  "loanRequests", "averageHealth", "balance", "recommendedNextSteps", "planTask", "mainFarm"
];
const UI_COPY_ROWS = {
  en: ["Change language", "Admin console", "Farmer desk", "Log out", "Secure access", "Welcome back", "Create farmer account", "Login", "Register", "Email", "Password", "Name", "Farm name", "Phone", "Sign in", "Signing in…", "Create account", "Creating…", "Soil analysis", "Soil identifier", "History", "Disease detection", "Insights", "Farm tools", "Crop planner", "Market", "Loans", "Insurance", "Account", "Active farm", "Analyses", "Pending review", "Latest soil", "Disease checks", "Loan requests", "Average health", "Balance", "Recommended next steps", "Plan a task", "Main farm"],
  hi: ["भाषा बदलें", "प्रशासक पैनल", "किसान डेस्क", "लॉग आउट", "सुरक्षित प्रवेश", "वापसी पर स्वागत है", "किसान खाता बनाएँ", "लॉगिन", "पंजीकरण", "ईमेल", "पासवर्ड", "नाम", "खेत का नाम", "फ़ोन", "साइन इन करें", "साइन इन हो रहा है…", "खाता बनाएँ", "बनाया जा रहा है…", "मिट्टी विश्लेषण", "मिट्टी पहचान", "इतिहास", "फसल रोग पहचान", "जानकारी", "खेती के उपकरण", "फसल योजना", "बाज़ार", "ऋण", "बीमा", "खाता", "सक्रिय खेत", "विश्लेषण", "समीक्षा लंबित", "नवीनतम मिट्टी", "रोग जाँच", "ऋण अनुरोध", "औसत स्वास्थ्य", "शेष राशि", "अगले सुझाए गए कदम", "काम की योजना बनाएँ", "मुख्य खेत"],
  pa: ["ਭਾਸ਼ਾ ਬਦਲੋ", "ਐਡਮਿਨ ਪੈਨਲ", "ਕਿਸਾਨ ਡੈਸਕ", "ਲੌਗ ਆਉਟ", "ਸੁਰੱਖਿਅਤ ਦਾਖਲਾ", "ਜੀ ਆਇਆਂ ਨੂੰ", "ਕਿਸਾਨ ਖਾਤਾ ਬਣਾਓ", "ਲੌਗਇਨ", "ਰਜਿਸਟਰ", "ਈਮੇਲ", "ਪਾਸਵਰਡ", "ਨਾਮ", "ਖੇਤ ਦਾ ਨਾਮ", "ਫ਼ੋਨ", "ਸਾਈਨ ਇਨ", "ਸਾਈਨ ਇਨ ਹੋ ਰਿਹਾ ਹੈ…", "ਖਾਤਾ ਬਣਾਓ", "ਬਣਾਇਆ ਜਾ ਰਿਹਾ ਹੈ…", "ਮਿੱਟੀ ਵਿਸ਼ਲੇਸ਼ਣ", "ਮਿੱਟੀ ਦੀ ਪਛਾਣ", "ਇਤਿਹਾਸ", "ਫ਼ਸਲ ਰੋਗ ਦੀ ਪਛਾਣ", "ਝਲਕ", "ਖੇਤੀ ਸੰਦ", "ਫ਼ਸਲ ਯੋਜਨਾ", "ਬਾਜ਼ਾਰ", "ਕਰਜ਼ੇ", "ਬੀਮਾ", "ਖਾਤਾ", "ਚੱਲ ਰਿਹਾ ਖੇਤ", "ਵਿਸ਼ਲੇਸ਼ਣ", "ਸਮੀਖਿਆ ਬਾਕੀ", "ਤਾਜ਼ਾ ਮਿੱਟੀ", "ਰੋਗ ਜਾਂਚਾਂ", "ਕਰਜ਼ਾ ਅਰਜ਼ੀਆਂ", "ਔਸਤ ਸਿਹਤ", "ਬਕਾਇਆ", "ਅਗਲੇ ਸੁਝਾਏ ਕਦਮ", "ਕੰਮ ਦੀ ਯੋਜਨਾ ਬਣਾਓ", "ਮੁੱਖ ਖੇਤ"],
  bn: ["ভাষা পরিবর্তন করুন", "অ্যাডমিন প্যানেল", "কৃষক ড্যাশবোর্ড", "লগ আউট", "নিরাপদ প্রবেশ", "ফিরে আসায় স্বাগতম", "কৃষক অ্যাকাউন্ট তৈরি করুন", "লগইন", "নিবন্ধন", "ইমেল", "পাসওয়ার্ড", "নাম", "খামারের নাম", "ফোন", "সাইন ইন", "সাইন ইন হচ্ছে…", "অ্যাকাউন্ট তৈরি করুন", "তৈরি হচ্ছে…", "মাটির বিশ্লেষণ", "মাটি শনাক্তকরণ", "ইতিহাস", "রোগ শনাক্তকরণ", "অন্তর্দৃষ্টি", "খামারের সরঞ্জাম", "ফসল পরিকল্পনা", "বাজার", "ঋণ", "বীমা", "অ্যাকাউন্ট", "সক্রিয় খামার", "বিশ্লেষণ", "পর্যালোচনা বাকি", "সর্বশেষ মাটি", "রোগ পরীক্ষা", "ঋণের আবেদন", "গড় স্বাস্থ্য", "ব্যালেন্স", "পরবর্তী প্রস্তাবিত কাজ", "কাজের পরিকল্পনা করুন", "প্রধান খামার"],
  ta: ["மொழியை மாற்று", "நிர்வாகப் பலகம்", "விவசாயி முகப்பு", "வெளியேறு", "பாதுகாப்பான அணுகல்", "மீண்டும் வரவேற்கிறோம்", "விவசாயி கணக்கை உருவாக்கு", "உள்நுழை", "பதிவு செய்", "மின்னஞ்சல்", "கடவுச்சொல்", "பெயர்", "பண்ணையின் பெயர்", "தொலைபேசி", "உள்நுழை", "உள்நுழைகிறது…", "கணக்கை உருவாக்கு", "உருவாக்குகிறது…", "மண் பகுப்பாய்வு", "மண் அடையாளம்", "வரலாறு", "பயிர் நோய் கண்டறிதல்", "நுண்ணறிவுகள்", "பண்ணைக் கருவிகள்", "பயிர் திட்டம்", "சந்தை", "கடன்கள்", "காப்பீடு", "கணக்கு", "செயலில் உள்ள பண்ணை", "பகுப்பாய்வுகள்", "மதிப்பாய்வு நிலுவை", "சமீபத்திய மண்", "நோய் சோதனைகள்", "கடன் கோரிக்கைகள்", "சராசரி நிலம்", "இருப்பு", "அடுத்த பரிந்துரைகள்", "பணியைத் திட்டமிடு", "முதன்மைப் பண்ணை"],
  te: ["భాషను మార్చండి", "అడ్మిన్ ప్యానెల్", "రైతు డ్యాష్‌బోర్డ్", "లాగ్ అవుట్", "సురక్షిత ప్రవేశం", "తిరిగి స్వాగతం", "రైతు ఖాతా సృష్టించండి", "లాగిన్", "నమోదు", "ఈమెయిల్", "పాస్‌వర్డ్", "పేరు", "పొలం పేరు", "ఫోన్", "సైన్ ఇన్", "సైన్ ఇన్ అవుతోంది…", "ఖాతా సృష్టించండి", "సృష్టిస్తోంది…", "మట్టి విశ్లేషణ", "మట్టి గుర్తింపు", "చరిత్ర", "పంట వ్యాధి గుర్తింపు", "విశ్లేషణలు", "వ్యవసాయ పరికరాలు", "పంట ప్రణాళిక", "మార్కెట్", "రుణాలు", "బీమా", "ఖాతా", "ప్రస్తుత పొలం", "విశ్లేషణలు", "సమీక్ష పెండింగ్", "తాజా మట్టి", "వ్యాధి తనిఖీలు", "రుణ అభ్యర్థనలు", "సగటు ఆరోగ్యం", "నిల్వ", "తదుపరి సూచనలు", "పని ప్రణాళిక", "ప్రధాన పొలం"],
  mr: ["भाषा बदला", "प्रशासक पॅनेल", "शेतकरी डॅशबोर्ड", "बाहेर पडा", "सुरक्षित प्रवेश", "पुन्हा स्वागत आहे", "शेतकरी खाते तयार करा", "लॉगिन", "नोंदणी", "ईमेल", "पासवर्ड", "नाव", "शेताचे नाव", "फोन", "साइन इन", "साइन इन होत आहे…", "खाते तयार करा", "तयार होत आहे…", "मातीचे विश्लेषण", "मातीची ओळख", "इतिहास", "पीक रोग ओळख", "आढावा", "शेतीची साधने", "पीक नियोजन", "बाजार", "कर्ज", "विमा", "खाते", "सक्रिय शेत", "विश्लेषणे", "पुनरावलोकन प्रलंबित", "नवीनतम माती", "रोग तपासणी", "कर्ज विनंत्या", "सरासरी आरोग्य", "शिल्लक", "पुढील शिफारसी", "कामाचे नियोजन करा", "मुख्य शेत"],
  gu: ["ભાષા બદલો", "એડમિન પેનલ", "ખેડૂત ડેશબોર્ડ", "લૉગ આઉટ", "સુરક્ષિત પ્રવેશ", "ફરી સ્વાગત છે", "ખેડૂત ખાતું બનાવો", "લૉગિન", "નોંધણી", "ઇમેઇલ", "પાસવર્ડ", "નામ", "ખેતરનું નામ", "ફોન", "સાઇન ઇન", "સાઇન ઇન થઈ રહ્યું છે…", "ખાતું બનાવો", "બનાવવામાં આવી રહ્યું છે…", "માટીનું વિશ્લેષણ", "માટી ઓળખ", "ઇતિહાસ", "પાક રોગ ઓળખ", "માહિતી", "ખેતીનાં સાધનો", "પાક આયોજન", "બજાર", "લોન", "વીમો", "ખાતું", "સક્રિય ખેતર", "વિશ્લેષણ", "સમીક્ષા બાકી", "નવીનતમ માટી", "રોગ તપાસ", "લોન વિનંતીઓ", "સરેરાશ આરોગ્ય", "બેલેન્સ", "આગળનાં સૂચિત પગલાં", "કામનું આયોજન કરો", "મુખ્ય ખેતર"],
  kn: ["ಭಾಷೆ ಬದಲಿಸಿ", "ನಿರ್ವಾಹಕ ಫಲಕ", "ರೈತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", "ಲಾಗ್ ಔಟ್", "ಸುರಕ್ಷಿತ ಪ್ರವೇಶ", "ಮತ್ತೆ ಸ್ವಾಗತ", "ರೈತರ ಖಾತೆ ರಚಿಸಿ", "ಲಾಗಿನ್", "ನೋಂದಣಿ", "ಇಮೇಲ್", "ಪಾಸ್‌ವರ್ಡ್", "ಹೆಸರು", "ಜಮೀನಿನ ಹೆಸರು", "ದೂರವಾಣಿ", "ಸೈನ್ ಇನ್", "ಸೈನ್ ಇನ್ ಆಗುತ್ತಿದೆ…", "ಖಾತೆ ರಚಿಸಿ", "ರಚಿಸಲಾಗುತ್ತಿದೆ…", "ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ", "ಮಣ್ಣಿನ ಗುರುತು", "ಇತಿಹಾಸ", "ಬೆಳೆ ರೋಗ ಪತ್ತೆ", "ಒಳನೋಟಗಳು", "ಕೃಷಿ ಉಪಕರಣಗಳು", "ಬೆಳೆ ಯೋಜನೆ", "ಮಾರುಕಟ್ಟೆ", "ಸಾಲಗಳು", "ವಿಮೆ", "ಖಾತೆ", "ಸಕ್ರಿಯ ಜಮೀನು", "ವಿಶ್ಲೇಷಣೆಗಳು", "ಪರಿಶೀಲನೆ ಬಾಕಿ", "ಇತ್ತೀಚಿನ ಮಣ್ಣು", "ರೋಗ ಪರಿಶೀಲನೆ", "ಸಾಲದ ವಿನಂತಿಗಳು", "ಸರಾಸರಿ ಆರೋಗ್ಯ", "ಬಾಕಿ ಮೊತ್ತ", "ಮುಂದಿನ ಶಿಫಾರಸುಗಳು", "ಕೆಲಸ ಯೋಜಿಸಿ", "ಮುಖ್ಯ ಜಮೀನು"],
  ml: ["ഭാഷ മാറ്റുക", "അഡ്മിൻ പാനൽ", "കർഷക ഡാഷ്ബോർഡ്", "ലോഗ് ഔട്ട്", "സുരക്ഷിത പ്രവേശനം", "വീണ്ടും സ്വാഗതം", "കർഷക അക്കൗണ്ട് സൃഷ്ടിക്കുക", "ലോഗിൻ", "രജിസ്റ്റർ", "ഇമെയിൽ", "പാസ്‌വേഡ്", "പേര്", "കൃഷിയിടത്തിന്റെ പേര്", "ഫോൺ", "സൈൻ ഇൻ", "സൈൻ ഇൻ ചെയ്യുന്നു…", "അക്കൗണ്ട് സൃഷ്ടിക്കുക", "സൃഷ്ടിക്കുന്നു…", "മണ്ണ് വിശകലനം", "മണ്ണ് തിരിച്ചറിയൽ", "ചരിത്രം", "വിള രോഗ നിർണയം", "അവലോകനങ്ങൾ", "കൃഷി ഉപകരണങ്ങൾ", "വിള ആസൂത്രണം", "വിപണി", "വായ്പകൾ", "ഇൻഷുറൻസ്", "അക്കൗണ്ട്", "സജീവ കൃഷിയിടം", "വിശകലനങ്ങൾ", "പരിശോധന കാത്തിരിക്കുന്നു", "ഏറ്റവും പുതിയ മണ്ണ്", "രോഗ പരിശോധനകൾ", "വായ്പ അപേക്ഷകൾ", "ശരാശരി ആരോഗ്യം", "ബാക്കി", "അടുത്ത നിർദേശങ്ങൾ", "ഒരു ജോലി ആസൂത്രണം ചെയ്യുക", "പ്രധാന കൃഷിയിടം"],
  ur: ["زبان تبدیل کریں", "منتظم پینل", "کسان ڈیش بورڈ", "لاگ آؤٹ", "محفوظ رسائی", "واپسی پر خوش آمدید", "کسان کا اکاؤنٹ بنائیں", "لاگ اِن", "رجسٹر", "ای میل", "پاس ورڈ", "نام", "کھیت کا نام", "فون", "سائن اِن", "سائن اِن ہو رہا ہے…", "اکاؤنٹ بنائیں", "بنایا جا رہا ہے…", "مٹی کا تجزیہ", "مٹی کی شناخت", "تاریخ", "فصل کی بیماری کی شناخت", "معلومات", "زرعی آلات", "فصل کی منصوبہ بندی", "بازار", "قرضے", "انشورنس", "اکاؤنٹ", "فعال کھیت", "تجزیے", "جائزہ باقی", "تازہ ترین مٹی", "بیماری کی جانچ", "قرض کی درخواستیں", "اوسط صحت", "بیلنس", "اگلے تجویز کردہ اقدامات", "کام کی منصوبہ بندی کریں", "اہم کھیت"],
  ne: ["भाषा परिवर्तन गर्नुहोस्", "प्रशासक प्यानल", "किसान ड्यासबोर्ड", "लगआउट", "सुरक्षित पहुँच", "फेरि स्वागत छ", "किसान खाता बनाउनुहोस्", "लगइन", "दर्ता", "इमेल", "पासवर्ड", "नाम", "खेतको नाम", "फोन", "साइन इन", "साइन इन हुँदैछ…", "खाता बनाउनुहोस्", "बनाउँदै…", "माटो विश्लेषण", "माटो पहिचान", "इतिहास", "बाली रोग पहिचान", "जानकारी", "खेतीका उपकरण", "बाली योजना", "बजार", "ऋण", "बीमा", "खाता", "सक्रिय खेत", "विश्लेषण", "समीक्षा बाँकी", "पछिल्लो माटो", "रोग जाँच", "ऋण अनुरोध", "औसत स्वास्थ्य", "ब्यालेन्स", "अर्का सिफारिस गरिएका काम", "कामको योजना बनाउनुहोस्", "मुख्य खेत"],
  or: ["ଭାଷା ବଦଳାନ୍ତୁ", "ଆଡମିନ୍ ପ୍ୟାନେଲ୍", "ଚାଷୀ ଡ୍ୟାସବୋର୍ଡ", "ଲଗ୍ ଆଉଟ୍", "ସୁରକ୍ଷିତ ପ୍ରବେଶ", "ପୁଣି ସ୍ୱାଗତ", "ଚାଷୀ ଖାତା ତିଆରି କରନ୍ତୁ", "ଲଗଇନ୍", "ପଞ୍ଜୀକରଣ", "ଇମେଲ୍", "ପାସୱାର୍ଡ", "ନାମ", "ଖେତର ନାମ", "ଫୋନ୍", "ସାଇନ୍ ଇନ୍", "ସାଇନ୍ ଇନ୍ ହେଉଛି…", "ଖାତା ତିଆରି କରନ୍ତୁ", "ତିଆରି ହେଉଛି…", "ମାଟି ବିଶ୍ଳେଷଣ", "ମାଟି ଚିହ୍ନଟ", "ଇତିହାସ", "ଫସଲ ରୋଗ ଚିହ୍ନଟ", "ସୂଚନା", "ଚାଷ ଉପକରଣ", "ଫସଲ ଯୋଜନା", "ବଜାର", "ଋଣ", "ବୀମା", "ଖାତା", "ସକ୍ରିୟ ଖେତ", "ବିଶ୍ଳେଷଣ", "ସମୀକ୍ଷା ବାକି", "ସର୍ବଶେଷ ମାଟି", "ରୋଗ ଯାଞ୍ଚ", "ଋଣ ଅନୁରୋଧ", "ହାରାହାରି ସ୍ୱାସ୍ଥ୍ୟ", "ବାଲାନ୍ସ", "ପରବର୍ତ୍ତୀ ପରାମର୍ଶ", "କାମ ଯୋଜନା କରନ୍ତୁ", "ମୁଖ୍ୟ ଖେତ"],
  as: ["ভাষা সলনি কৰক", "এডমিন পেনেল", "কৃষক ডেশ্বব’ৰ্ড", "লগ আউট", "সুৰক্ষিত প্ৰৱেশ", "পুনৰ স্বাগতম", "কৃষকৰ একাউণ্ট সৃষ্টি কৰক", "লগইন", "পঞ্জীয়ন", "ইমেইল", "পাছৱৰ্ড", "নাম", "পথাৰৰ নাম", "ফোন", "ছাইন ইন", "ছাইন ইন হৈ আছে…", "একাউণ্ট সৃষ্টি কৰক", "সৃষ্টি হৈ আছে…", "মাটিৰ বিশ্লেষণ", "মাটি চিনাক্তকৰণ", "ইতিহাস", "শস্যৰ ৰোগ চিনাক্তকৰণ", "অন্তৰ্দৃষ্টি", "কৃষি সঁজুলি", "শস্য পৰিকল্পনা", "বজাৰ", "ঋণ", "বীমা", "একাউণ্ট", "সক্ৰিয় পথাৰ", "বিশ্লেষণ", "পৰ্যালোচনা বাকী", "শেহতীয়া মাটি", "ৰোগ পৰীক্ষা", "ঋণৰ অনুৰোধ", "গড় স্বাস্থ্য", "বেলেঞ্চ", "পৰৱৰ্তী পৰামৰ্শ", "কামৰ পৰিকল্পনা কৰক", "মুখ্য পথাৰ"],
  es: ["Cambiar idioma", "Panel de administración", "Panel del agricultor", "Cerrar sesión", "Acceso seguro", "Te damos la bienvenida", "Crear cuenta de agricultor", "Iniciar sesión", "Registrarse", "Correo electrónico", "Contraseña", "Nombre", "Nombre de la granja", "Teléfono", "Entrar", "Iniciando sesión…", "Crear cuenta", "Creando…", "Análisis del suelo", "Identificador de suelo", "Historial", "Detección de enfermedades", "Información", "Herramientas agrícolas", "Planificador de cultivos", "Mercado", "Préstamos", "Seguro", "Cuenta", "Granja activa", "Análisis", "Revisión pendiente", "Suelo más reciente", "Revisiones de enfermedades", "Solicitudes de préstamo", "Salud media", "Saldo", "Próximos pasos recomendados", "Planificar una tarea", "Granja principal"]
};
const MANUAL_LABELS = {
  en: "User manual", hi: "उपयोगकर्ता मार्गदर्शिका", pa: "ਵਰਤੋਂਕਾਰ ਮੈਨੂਅਲ", bn: "ব্যবহারকারী নির্দেশিকা",
  ta: "பயனர் வழிகாட்டி", te: "వినియోగదారు మార్గదర్శి", mr: "वापरकर्ता मार्गदर्शिका", gu: "વપરાશકર્તા માર્ગદર્શિકા",
  kn: "ಬಳಕೆದಾರರ ಮಾರ್ಗದರ್ಶಿ", ml: "ഉപയോക്തൃ മാർഗ്ഗദർശി", ur: "صارف کی رہنمائی", ne: "प्रयोगकर्ता मार्गदर्शिका",
  or: "ବ୍ୟବହାରକାରୀ ମାର୍ଗଦର୍ଶିକା", as: "ব্যৱহাৰকাৰীৰ নিৰ্দেশিকা", es: "Manual de usuario"
};
const fieldImage =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80";

const emptyAnalysisForm = {
  landArea: "",
  landUnit: "acre",
  landType: "irrigated",
  crop: "",
  location: "",
  soilColor: "brown",
  texture: "loam",
  drainage: "moderate",
  ph: "",
  notes: ""
};

const landTypes = [
  ["irrigated", "Irrigated"],
  ["dryland", "Dryland"],
  ["lowland", "Lowland"],
  ["hilly", "Hilly"],
  ["river_belt", "River belt"],
  ["plain", "Plain"]
];

const soilColors = [
  ["brown", "Brown"],
  ["dark", "Dark"],
  ["black", "Black"],
  ["reddish", "Reddish"],
  ["pale", "Pale"],
  ["grey", "Grey"]
];

const textures = [
  ["loam", "Loam"],
  ["sandy", "Sandy"],
  ["clay", "Clay"],
  ["silt", "Silt"]
];

const drainageOptions = [
  ["good", "Good"],
  ["moderate", "Moderate"],
  ["poor", "Poor"]
];

const mandiPrices = [
  { crop: "Wheat", market: "Delhi", price: 2425, unit: "quintal", trend: "+1.8%" },
  { crop: "Paddy", market: "Karnal", price: 2310, unit: "quintal", trend: "+0.7%" },
  { crop: "Maize", market: "Indore", price: 2180, unit: "quintal", trend: "-0.4%" },
  { crop: "Onion", market: "Nashik", price: 1850, unit: "quintal", trend: "+2.2%" },
  { crop: "Tomato", market: "Azadpur", price: 1650, unit: "quintal", trend: "-1.1%" },
  { crop: "Cotton", market: "Rajkot", price: 7020, unit: "quintal", trend: "+0.5%" }
];

const fertilizerRates = {
  wheat: { urea: 45, dap: 50, npk: 25 },
  paddy: { urea: 55, dap: 45, npk: 30 },
  maize: { urea: 50, dap: 35, npk: 35 },
  sugarcane: { urea: 75, dap: 55, npk: 55 },
  cotton: { urea: 40, dap: 35, npk: 45 },
  default: { urea: 35, dap: 30, npk: 25 }
};

const cropRecommendationMap = {
  Clay: ["Paddy", "Wheat", "Sugarcane", "Mustard"],
  Sandy: ["Groundnut", "Millet", "Watermelon", "Potato"],
  Loamy: ["Wheat", "Maize", "Vegetables", "Pulses"],
  Silty: ["Wheat", "Paddy", "Sugarcane", "Lentils"],
  Peaty: ["Vegetables", "Paddy", "Fodder crops", "Potato"],
  Chalky: ["Barley", "Mustard", "Gram", "Millet"],
  Laterite: ["Cashew", "Tea", "Coffee", "Groundnut"],
  Alluvial: ["Wheat", "Paddy", "Maize", "Sugarcane"],
  Unknown: ["Upload a soil photo", "Add crop and location", "Ask assistant"]
};

const loginClientSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
  turnstileToken: z.string().max(2048).optional().default("")
});

const registerClientSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Use at least 8 characters."),
  farmName: z.string().optional(),
  phone: z.string().optional(),
  turnstileToken: z.string().max(2048).optional().default("")
});

const fieldReportClientSchema = z.object({
  landArea: z.string().min(1, "Land area is required."),
  crop: z.string().trim().min(1, "Crop grown is required."),
  photo: z.instanceof(File, { message: "Upload a soil photo." })
});

const identifierClientSchema = z.object({
  photo: z.instanceof(File, { message: "Upload a soil photo to identify." })
});

const passwordClientSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm the new password.")
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"]
  });

const adminPasswordClientSchema = z.object({
  password: z.string().min(8, "Use at least 8 characters.")
});

const loanClientSchema = z.object({
  amount: z.coerce.number().min(1000, "Enter at least 1000."),
  purpose: z.string().trim().min(3, "Loan purpose is required."),
  tenureMonths: z.coerce.number().int().min(1, "Tenure is required.").max(120, "Maximum tenure is 120 months.")
});

const marketPurchaseClientSchema = z.object({
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1.").max(100, "Quantity is too high.")
});

const farmTaskClientSchema = z.object({
  title: z.string().trim().min(3, "Add a clear task name.").max(160),
  crop: z.string().trim().max(120),
  category: z.enum(["sowing", "irrigation", "fertilizer", "scouting", "harvest", "other"]),
  dueDate: z.string().min(1, "Choose a due date."),
  notes: z.string().trim().max(500)
});

function tomorrowDateInput() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
}

const loanRepaymentClientSchema = z.object({
  loanId: z.string().min(1, "Select a loan."),
  amount: z.coerce.number().min(1, "Enter repayment amount."),
  bankName: z.string().trim().min(2, "Bank name is required."),
  accountName: z.string().trim().min(2, "Account holder name is required."),
  accountNumber: z.string().trim().regex(/^\d{6,18}$/, "Use 6 to 18 bank account digits."),
  ifsc: z.string().trim().min(4, "IFSC or bank code is required.")
});

const diseaseClientSchema = z.object({
  crop: z.string().trim().min(1, "Crop is required."),
  photo: z.instanceof(File, { message: "Upload a crop photo." })
});

const insuranceClientSchema = z.object({
  crop: z.string().trim().min(1, "Crop is required."),
  coverageAmount: z.coerce.number().min(1000, "Enter at least 1000."),
  damageType: z.string().min(1, "Select damage type.")
});

const farmClientSchema = z.object({
  name: z.string().trim().min(2, "Farm name is required."),
  location: z.string().trim().optional(),
  landArea: z.string().trim().optional(),
  landUnit: z.enum(["acre", "hectare", "bigha"]),
  primaryCrop: z.string().trim().optional()
});

function firstValidationMessage(result) {
  return result.success ? "" : result.error.issues[0]?.message || "Please check the form.";
}

async function apiRequest(path, { token, method = "GET", body, headers = {} } = {}) {
  const requestHeaders = { ...headers };
  const options = { method, headers: requestHeaders };

  if (token) requestHeaders.Authorization = `Bearer ${token}`;
  if (body instanceof FormData) {
    options.body = body;
  } else if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(path, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

let turnstileScriptPromise;

function loadTurnstileScript() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (turnstileScriptPromise) return turnstileScriptPromise;

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.turnstile) resolve(window.turnstile);
      else {
        turnstileScriptPromise = undefined;
        reject(new Error("Human verification loaded without its API."));
      }
    };
    script.onerror = () => {
      turnstileScriptPromise = undefined;
      reject(new Error("Human verification could not load."));
    };
    document.head.appendChild(script);
  });

  return turnstileScriptPromise;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatDay(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function titleCase(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function getInitialLanguage() {
  try {
    const savedLanguage = localStorage.getItem(LANG_KEY);
    const legacyLanguage = localStorage.getItem(LEGACY_LANG_KEY);
    if (LANGUAGES.some((lang) => lang.code === savedLanguage)) return savedLanguage;
    if (LANGUAGES.some((lang) => lang.code === legacyLanguage)) return legacyLanguage;
  } catch {
    return "en";
  }
  return "en";
}

function getLanguageName(language) {
  return LANGUAGES.find((lang) => lang.code === language)?.name || "English";
}

const UI_COPY = Object.fromEntries(UI_COPY_KEYS.map((key, index) => [
  key,
  Object.fromEntries(Object.entries(UI_COPY_ROWS).map(([code, row]) => [code, row[index]]))
]));

function text(language, key) {
  if (key === "userManual") return MANUAL_LABELS[language] || MANUAL_LABELS.en;
  return UI_COPY[key]?.[language] || UI_COPY[key]?.en || key;
}

function withFarm(path, farmId) {
  if (!farmId) return path;
  const joiner = path.includes("?") ? "&" : "?";
  return `${path}${joiner}farmId=${encodeURIComponent(farmId)}`;
}

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  } catch {
    return "dark";
  }

  return "dark";
}

function csvValue(value) {
  const clean = String(value ?? "").replaceAll('"', '""');
  return `"${clean}"`;
}

function downloadTextFile(filename, content, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function exportAnalysesCsv(analyses) {
  const header = ["Date", "Soil", "Confidence", "Health", "Risk", "Crop", "Land", "Status", "Summary"];
  const rows = analyses.map((analysis) => [
    formatDate(analysis.createdAt),
    analysis.result?.soilType,
    analysis.result?.confidence,
    analysis.result?.healthScore,
    analysis.result?.riskLevel,
    analysis.input?.crop,
    `${analysis.input?.landArea || ""} ${analysis.input?.landUnit || ""}`.trim(),
    titleCase(analysis.status),
    analysis.result?.summary
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvValue).join(",")).join("\n");
  downloadTextFile(`krishsense-reports-${Date.now()}.csv`, csv, "text/csv;charset=utf-8");
}

function exportUsersCsv(users) {
  const header = ["Name", "Email", "Role", "Status", "Farm", "Reports", "Diseases", "Loans", "Insurance", "Orders", "Wallet"];
  const rows = users.map((user) => [
    user.name,
    user.email,
    titleCase(user.role),
    user.isActive ? "Active" : "Banned",
    user.farmName || "",
    user.analysisCount || 0,
    user.diseaseCount || 0,
    user.loanCount || 0,
    user.insuranceCount || 0,
    user.orderCount || 0,
    user.walletBalance || 0
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvValue).join(",")).join("\n");
  downloadTextFile(`krishsense-users-${Date.now()}.csv`, csv, "text/csv;charset=utf-8");
}

function exportOrdersCsv(orders) {
  const header = ["Date", "Farmer", "Email", "Item", "Category", "Quantity", "Unit", "Unit Price", "Total", "Status"];
  const rows = orders.map((order) => [
    formatDate(order.createdAt),
    order.farmerName || "",
    order.farmerEmail || "",
    order.itemName,
    order.category,
    order.quantity,
    order.unit,
    order.unitPrice,
    order.totalPrice,
    titleCase(order.status)
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvValue).join(",")).join("\n");
  downloadTextFile(`krishsense-orders-${Date.now()}.csv`, csv, "text/csv;charset=utf-8");
}

function assistantAnswerLines(answer) {
  return String(answer || "")
    .replace(/\r/g, "\n")
    .split(/\n+/)
    .map((line) => line.trim().replace(/^(?:[-*•]|\d+[.)])\s*/, ""))
    .filter(Boolean);
}

function printAnalysisReport(analysis) {
  const rows = [
    ["Soil type", analysis.result?.soilType],
    ["Confidence", `${analysis.result?.confidence || 0}%`],
    ["Health score", analysis.result?.healthScore],
    ["Risk", analysis.result?.riskLevel],
    ["Crop", analysis.input?.crop || "Not set"],
    ["Location", analysis.input?.location || "Not set"],
    ["Land", `${analysis.input?.landArea || ""} ${analysis.input?.landUnit || ""}`.trim() || "Not set"],
    ["Status", titleCase(analysis.status)]
  ];
  const recommendations = (analysis.result?.recommendations || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const nutrients = (analysis.result?.nutrients || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const html = `<!doctype html>
<html>
  <head>
    <title>Krishisense Soil Report</title>
    <style>
      body { font-family: Arial, sans-serif; color: #17231b; padding: 28px; line-height: 1.45; }
      h1 { margin: 0 0 4px; color: #21663a; }
      .muted { color: #667268; margin-top: 0; }
      table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      td { border: 1px solid #d9e2d8; padding: 10px; }
      td:first-child { font-weight: 700; width: 32%; background: #f6f9f4; }
      section { margin-top: 18px; }
      li { margin-bottom: 6px; }
    </style>
  </head>
  <body>
    <h1>Krishisense Soil Report</h1>
    <p class="muted">${escapeHtml(formatDate(analysis.createdAt))}</p>
    ${analysis.photoUrl ? `<img src="${escapeHtml(analysis.photoUrl)}" alt="Soil" style="width:180px;height:130px;object-fit:cover;border-radius:8px" />` : ""}
    <table>${rows.map(([label, value]) => `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value ?? "Not available")}</td></tr>`).join("")}</table>
    <section><h2>Summary</h2><p>${escapeHtml(analysis.result?.summary || "No summary available.")}</p></section>
    <section><h2>Recommendations</h2><ul>${recommendations || "<li>No recommendations available.</li>"}</ul></section>
    <section><h2>Nutrients</h2><ul>${nutrients || "<li>No nutrient details available.</li>"}</ul></section>
    <section><h2>Irrigation</h2><p>${escapeHtml(analysis.result?.irrigation || "No irrigation note available.")}</p></section>
    <p class="muted">This report is guidance only. Confirm fertilizer and pH decisions with a lab soil test.</p>
  </body>
</html>`;
  const reportWindow = window.open("", "_blank");
  if (!reportWindow) {
    downloadTextFile(`krishsense-report-${analysis.id}.html`, html, "text/html;charset=utf-8");
    return;
  }
  reportWindow.document.write(html);
  reportWindow.document.close();
  reportWindow.focus();
  reportWindow.print();
}

function getCropRecommendations(analysis) {
  const aiCrops = analysis?.result?.bestCrops || [];
  if (aiCrops.length) return aiCrops.slice(0, 5);
  return cropRecommendationMap[analysis?.result?.soilType] || cropRecommendationMap.Unknown;
}

function getFertilizerPlan(crop, landArea) {
  const key = String(crop || "").toLowerCase().trim();
  const rates = fertilizerRates[key] || fertilizerRates.default;
  const area = Math.max(0, Number(landArea || 0));
  return {
    urea: Math.round(rates.urea * area),
    dap: Math.round(rates.dap * area),
    npk: Math.round(rates.npk * area)
  };
}

function calculateEmi(amount, annualRate, months) {
  const principal = Number(amount || 0);
  const rate = Number(annualRate || 0) / 12 / 100;
  const tenure = Math.max(1, Number(months || 1));
  if (!principal) return 0;
  if (!rate) return Math.round(principal / tenure);
  const multiplier = (principal * rate * (1 + rate) ** tenure) / ((1 + rate) ** tenure - 1);
  return Math.round(multiplier);
}

function topEntries(values, limit = 3) {
  const counts = new Map();
  values.filter(Boolean).forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function buildFarmerInsights(analyses, loans) {
  const latest = analyses[0];
  const healthScores = analyses.map((analysis) => Number(analysis.result?.healthScore)).filter(Number.isFinite);
  const averageHealth = healthScores.length
    ? Math.round(healthScores.reduce((total, score) => total + score, 0) / healthScores.length)
    : null;
  const soilMix = topEntries(analyses.map((analysis) => analysis.result?.soilType), 4);
  const cropCandidates = topEntries(analyses.flatMap((analysis) => analysis.result?.bestCrops || []), 4);
  const highRiskCount = analyses.filter((analysis) => analysis.result?.riskLevel === "High").length;
  const pendingLoans = loans.filter((loan) => loan.status === "pending").length;
  const approvedLoans = loans.filter((loan) => loan.status === "approved").length;
  const rejectedLoans = loans.filter((loan) => loan.status === "rejected").length;
  const actions = [];

  if (!analyses.length) actions.push("Start with one soil analysis to unlock field-specific guidance.");
  if (latest?.result?.alerts?.length) actions.push(...latest.result.alerts.slice(0, 2));
  if (latest?.result?.recommendations?.length) actions.push(...latest.result.recommendations.slice(0, 3));
  if (highRiskCount) actions.push(`${highRiskCount} report${highRiskCount === 1 ? "" : "s"} marked high risk need review.`);
  if (pendingLoans) actions.push(`${pendingLoans} loan request${pendingLoans === 1 ? "" : "s"} still awaiting admin decision.`);
  if (!actions.length) actions.push("Fields look stable based on saved reports.");

  return {
    averageHealth,
    dominantSoil: soilMix[0]?.[0] || "No data",
    suggestedCrop: cropCandidates[0]?.[0] || latest?.input?.crop || "No data",
    highRiskCount,
    pendingLoans,
    approvedLoans,
    rejectedLoans,
    soilMix,
    cropCandidates,
    actions: actions.slice(0, 5)
  };
}

function buildFarmRecommendations(analyses, diseases, tasks, farm) {
  const recommendations = [];
  const latest = analyses[0];
  const pendingTasks = tasks.filter((task) => task.status === "planned");
  const overdueTasks = pendingTasks.filter((task) => new Date(task.dueDate) < new Date(new Date().toDateString()));
  const highSeverity = diseases.find((report) => report.result?.severity === "High");

  if (overdueTasks.length) recommendations.push(`Review ${overdueTasks.length} overdue farm task${overdueTasks.length === 1 ? "" : "s"} and reschedule what is still needed.`);
  if (highSeverity) recommendations.push(`Check the ${highSeverity.input?.crop || farm?.primaryCrop || "affected"} crop for the high-risk issue found in your latest photo report.`);
  if (latest?.result?.riskLevel === "High") recommendations.push("Your latest soil report flags high risk. Confirm its advice with a local soil test before changing fertilizer doses.");
  if (latest && Number(latest.result?.healthScore) < 60) recommendations.push("Soil health is below 60 in the latest report. Check the report's nutrient and drainage notes, then compare with a lab test.");
  if (!latest) recommendations.push("Upload a soil photo and add your crop and field details to get farm-specific guidance.");
  if (!pendingTasks.length && farm?.primaryCrop) recommendations.push(`Add a scouting or irrigation task for ${farm.primaryCrop} so this farm's next action is easy to track.`);
  if (farm?.location && latest?.input?.location && farm.location !== latest.input.location) recommendations.push("Update the report location to match this farm profile for more relevant local weather checks.");

  return [...new Set(recommendations)].slice(0, 4);
}

function buildNotifications(analyses, loans, market, tasks) {
  const notifications = [];
  const latest = analyses[0];
  if (latest) {
    notifications.push({
      title: `${latest.result?.soilType || "Soil"} report saved`,
      detail: `${latest.result?.healthScore || 0} health score for ${latest.input?.crop || "your field"}.`
    });
  }
  loans
    .filter((loan) => loan.status !== "pending")
    .slice(0, 2)
    .forEach((loan) => {
      notifications.push({
        title: `Loan ${loan.status}`,
        detail: `${formatMoney(loan.amount)} for ${loan.purpose}.`
      });
    });
  (market.orders || []).slice(0, 2).forEach((order) => {
    notifications.push({
      title: "Market order confirmed",
      detail: `${order.quantity} x ${order.itemName} for ${formatMoney(order.totalPrice)}.`
    });
  });
  tasks
    .filter((task) => task.status === "planned")
    .slice(0, 2)
    .forEach((task) => {
      notifications.push({
        title: `Farm task: ${task.title}`,
        detail: `Due ${formatDay(task.dueDate)} · ${task.farmName}`
      });
    });
  if (!notifications.length) {
    notifications.push({
      title: "Welcome to Krishisense",
      detail: "Upload soil photos, apply for loans, and track farm tools here."
    });
  }
  return notifications.slice(0, 5);
}

const emptyMarketState = {
  account: { walletBalance: 0 },
  catalog: [],
  orders: [],
  loans: []
};

function App() {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch {
      return null;
    }
  });
  const [theme, setTheme] = useState(getInitialTheme);
  const [language, setLanguage] = useState(getInitialLanguage);
  const [booting, setBooting] = useState(Boolean(session?.token));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ur" ? "rtl" : "ltr";
    try {
      localStorage.setItem(LANG_KEY, language);
      localStorage.removeItem(LEGACY_LANG_KEY);
    } catch {
      // The language still works for this session if storage is unavailable.
    }
  }, [language]);

  useEffect(() => {
    if (!session?.token) {
      setBooting(false);
      return;
    }

    apiRequest("/api/auth/me", { token: session.token })
      .then(({ user }) => setSession((current) => ({ ...current, user })))
      .catch(() => {
        localStorage.removeItem(SESSION_KEY);
        setSession(null);
      })
      .finally(() => setBooting(false));
  }, []);

  function handleLogin(nextSession) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }

  if (booting) {
    return (
      <main className="loading-screen">
        <Sprout size={34} />
        <span>Opening Krishisense</span>
      </main>
    );
  }

  if (!session) {
    return (
      <>
        <LoginView
          onLogin={handleLogin}
          theme={theme}
          onThemeToggle={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
          language={language}
          onLanguageChange={setLanguage}
        />
        <AppFooter />
      </>
    );
  }

  return (
    <>
      <Dashboard
        session={session}
        onLogout={handleLogout}
        theme={theme}
        onThemeToggle={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        language={language}
        onLanguageChange={setLanguage}
      />
      <AppFooter />
    </>
  );
}

function AppFooter() {
  return (
    <footer className="site-footer">
      <span>Developed by Aksh Rawat</span>
      <span>{"<3"}</span>
    </footer>
  );
}

function ThemeSwitch({ theme, onToggle }) {
  const dark = theme === "dark";
  return (
    <button
      className="theme-switch"
      type="button"
      role="switch"
      aria-checked={dark}
      onClick={onToggle}
      title={dark ? "Use light background" : "Use dark background"}
    >
      <span className="theme-switch-track">
        <span />
      </span>
      {dark ? <Moon size={17} /> : <Sun size={17} />}
      <span className="theme-switch-label">{dark ? "Dark" : "Light"}</span>
    </button>
  );
}

function LanguageSwitcher({ language, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = LANGUAGES.find((lang) => lang.code === language) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    }
    function handleKeyDown(event) {
      if (event.key === "Escape" && open) {
        setOpen(false);
        rootRef.current?.querySelector(".lang-switch-trigger")?.focus();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="lang-switch" ref={rootRef}>
      <button
        className="lang-switch-trigger"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${text(language, "changeLanguage")}: ${current.name}`}
        title={text(language, "changeLanguage")}
      >
        <Globe size={16} />
        <span>{current.label}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <ul className="lang-switch-menu" role="listbox">
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                lang={lang.code}
                role="option"
                aria-selected={lang.code === language}
                className={lang.code === language ? "active" : ""}
                onClick={() => {
                  onChange(lang.code);
                  setOpen(false);
                  rootRef.current?.querySelector(".lang-switch-trigger")?.focus();
                }}
              >
                {lang.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TurnstileWidget({ siteKey, action, theme, onToken, onError }) {
  const mountRef = useRef(null);
  const callbacksRef = useRef({ onToken, onError });
  callbacksRef.current = { onToken, onError };

  useEffect(() => {
    let active = true;
    let widgetId;

    loadTurnstileScript()
      .then((turnstile) => {
        if (!active || !mountRef.current || !turnstile) return;
        widgetId = turnstile.render(mountRef.current, {
          sitekey: siteKey,
          action,
          theme: theme === "dark" ? "dark" : "light",
          size: window.innerWidth <= 420 ? "compact" : "normal",
          callback: (token) => {
            callbacksRef.current.onError("");
            callbacksRef.current.onToken(token);
          },
          "expired-callback": () => {
            callbacksRef.current.onToken("");
            callbacksRef.current.onError("The security check expired. Complete it again.");
          },
          "error-callback": () => {
            callbacksRef.current.onToken("");
            callbacksRef.current.onError("The security check could not be verified. Please retry.");
          }
        });
      })
      .catch(() => {
        if (active) callbacksRef.current.onError("Human verification could not load. Check your connection and retry.");
      });

    return () => {
      active = false;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [siteKey, action, theme]);

  return <div className="turnstile-widget" ref={mountRef} />;
}

function LoginView({ onLogin, theme, onThemeToggle, language, onLanguageChange }) {
  const [mode, setMode] = useState("login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [captchaConfig, setCaptchaConfig] = useState({ loading: true, required: true, siteKey: "", error: "" });
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaCycle, setCaptchaCycle] = useState(0);
  const [captchaWidgetError, setCaptchaWidgetError] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    farmName: "",
    phone: ""
  });

  useEffect(() => {
    let active = true;
    apiRequest("/api/auth/captcha-config")
      .then((config) => {
        if (active) setCaptchaConfig({ loading: false, required: Boolean(config.required), siteKey: config.siteKey || "", error: "" });
      })
      .catch(() => {
        if (active) setCaptchaConfig({ loading: false, required: true, siteKey: "", error: "Could not reach security settings. Refresh the page and try again." });
      });
    return () => { active = false; };
  }, []);

  const captchaReady = !captchaConfig.loading
    && !captchaConfig.error
    && (!captchaConfig.required || Boolean(captchaConfig.siteKey && captchaToken));

  function changeMode(nextMode) {
    setMode(nextMode);
    setError("");
    setCaptchaToken("");
    setCaptchaWidgetError("");
    setCaptchaCycle((cycle) => cycle + 1);
  }

  async function submitLogin(event, quickCredentials) {
    event?.preventDefault();
    if (!captchaReady) {
      setError("Complete the security check before signing in.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const credentials = { ...(quickCredentials || loginForm), turnstileToken: captchaToken };
      const validation = loginClientSchema.safeParse(credentials);
      if (!validation.success) throw new Error(firstValidationMessage(validation));
      const nextSession = await apiRequest("/api/auth/login", {
        method: "POST",
        body: validation.data
      });
      onLogin(nextSession);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      if (captchaConfig.required) {
        setCaptchaToken("");
        setCaptchaWidgetError("");
        setCaptchaCycle((cycle) => cycle + 1);
      }
    }
  }

  async function submitRegister(event) {
    event.preventDefault();
    if (!captchaReady) {
      setError("Complete the security check before creating your account.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const validation = registerClientSchema.safeParse({ ...registerForm, turnstileToken: captchaToken });
      if (!validation.success) throw new Error(firstValidationMessage(validation));
      const nextSession = await apiRequest("/api/auth/register", {
        method: "POST",
        body: validation.data
      });
      onLogin(nextSession);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      if (captchaConfig.required) {
        setCaptchaToken("");
        setCaptchaWidgetError("");
        setCaptchaCycle((cycle) => cycle + 1);
      }
    }
  }

  const captchaControl = captchaConfig.loading ? (
    <p className="turnstile-status">Loading security check…</p>
  ) : captchaConfig.required && captchaConfig.siteKey ? (
    <div className="auth-captcha">
      <span className="auth-captcha-label"><ShieldCheck size={15} /> Quick security check</span>
      <TurnstileWidget
        key={`${mode}-${captchaCycle}`}
        siteKey={captchaConfig.siteKey}
        action={mode}
        theme={theme}
        onToken={setCaptchaToken}
        onError={setCaptchaWidgetError}
      />
      {captchaWidgetError && (
        <div className="turnstile-error-row" role="status">
          <p className="turnstile-status error">{captchaWidgetError}</p>
          <button className="small-button" type="button" onClick={() => {
            setCaptchaWidgetError("");
            setCaptchaToken("");
            setCaptchaCycle((cycle) => cycle + 1);
          }}>Retry</button>
        </div>
      )}
    </div>
  ) : captchaConfig.required ? (
    <p className="turnstile-status error" role="status">
      {captchaConfig.error || "CAPTCHA is not configured yet. Add the Cloudflare Turnstile keys to the server environment."}
    </p>
  ) : null;

  return (
    <main className="auth-shell">
      <section className="auth-visual" aria-label="Farm field">
        <img src={fieldImage} alt="Farm field at sunrise" />
        <div className="brand-lockup">
          <span className="brand-mark">
            <Sprout size={24} />
          </span>
          <div>
            <p>Krishisense</p>
            <h1>Soil decisions for every field</h1>
          </div>
        </div>
        <div className="auth-metrics">
          <span>
            <FlaskConical size={18} />
            Photo analysis
          </span>
          <span>
            <ShieldCheck size={18} />
            Admin review
          </span>
          <span>
            <Leaf size={18} />
            Crop guidance
          </span>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-panel-actions">
          <LanguageSwitcher language={language} onChange={onLanguageChange} />
          <ThemeSwitch theme={theme} onToggle={onThemeToggle} />
        </div>

        <div className="panel-heading">
          <span className="eyebrow">{text(language, "secureAccess")}</span>
          <h2>{text(language, mode === "login" ? "welcomeBack" : "createFarmerAccount")}</h2>
        </div>

        <div className="segmented-control" role="tablist" aria-label="Authentication mode">
          <button type="button" className={mode === "login" ? "active" : ""} onClick={() => changeMode("login")}>
            <Lock size={16} />
            {text(language, "login")}
          </button>
          <button type="button" className={mode === "register" ? "active" : ""} onClick={() => changeMode("register")}>
            <UserPlus size={16} />
            {text(language, "register")}
          </button>
        </div>

        {error && <p className="error-banner">{error}</p>}

        {mode === "login" ? (
          <form className="stack-form" onSubmit={submitLogin}>
            <label>
              {text(language, "email")}
              <span className="input-shell">
                <Mail size={17} />
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                  required
                />
              </span>
            </label>
            <label>
              {text(language, "password")}
              <span className="input-shell">
                <Lock size={17} />
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                  required
                />
              </span>
            </label>
            {captchaControl}
            <button className="primary-button" disabled={busy || !captchaReady}>
              <ShieldCheck size={18} />
              {busy ? text(language, "signingIn") : text(language, "signIn")}
            </button>
          </form>
        ) : (
          <form className="stack-form" onSubmit={submitRegister}>
            <label>
              {text(language, "name")}
              <input
                value={registerForm.name}
                onChange={(event) => setRegisterForm({ ...registerForm, name: event.target.value })}
                required
              />
            </label>
            <label>
              {text(language, "email")}
              <input
                type="email"
                value={registerForm.email}
                onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
                required
              />
            </label>
            <label>
              {text(language, "password")}
              <input
                type="password"
                minLength={8}
                value={registerForm.password}
                onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
                required
              />
            </label>
            <label>
              {text(language, "farmName")}
              <input
                value={registerForm.farmName}
                onChange={(event) => setRegisterForm({ ...registerForm, farmName: event.target.value })}
              />
            </label>
            <label>
              {text(language, "phone")}
              <input
                value={registerForm.phone}
                onChange={(event) => setRegisterForm({ ...registerForm, phone: event.target.value })}
              />
            </label>
            {captchaControl}
            <button className="primary-button" disabled={busy || !captchaReady}>
              <UserPlus size={18} />
              {busy ? text(language, "creating") : text(language, "createAccount")}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

function Dashboard({ session, onLogout, theme, onThemeToggle, language, onLanguageChange }) {
  const [farmName, setFarmName] = useState(session.user.farmName);
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="app-brand">
          <span className="brand-mark">
            <Sprout size={23} />
          </span>
          <div>
            <strong>Krishisense</strong>
            <span>{session.user.role === "admin" ? text(language, "adminConsole") : farmName || text(language, "farmerDesk")}</span>
          </div>
        </div>
        <div className="topbar-actions">
          <LanguageSwitcher language={language} onChange={onLanguageChange} />
          <ThemeSwitch theme={theme} onToggle={onThemeToggle} />
          <span className="user-pill">
            {session.user.role === "admin" ? <ShieldCheck size={16} /> : <Wheat size={16} />}
            {session.user.name}
          </span>
          <button className="icon-button" onClick={onLogout} title={text(language, "logOut")} aria-label={text(language, "logOut")}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <FloatingNewsBanner />

      {session.user.role === "admin" ? (
        <AdminDashboard token={session.token} />
      ) : (
        <FarmerDashboard token={session.token} user={session.user} language={language} onFarmChange={setFarmName} />
      )}
    </main>
  );
}

function FloatingNewsBanner() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stale, setStale] = useState(false);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState(() => {
    try {
      const value = JSON.parse(window.localStorage.getItem("krishsense-saved-news") || "[]");
      return Array.isArray(value) ? value.filter((item) => item && typeof item === "object" && typeof item.url === "string") : [];
    } catch { return []; }
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [surprise, setSurprise] = useState(false);
  const [seedUnlocked, setSeedUnlocked] = useState(() => {
    try { return window.localStorage.getItem("krishsense-golden-seed") === "found"; } catch { return false; }
  });
  const [seedMessage, setSeedMessage] = useState(false);
  const labelClicks = useRef([]);
  const seedTimer = useRef(null);

  useEffect(() => {
    let active = true;
    async function loadNews() {
      try {
        const data = await apiRequest("/api/news");
        if (!active) return;
        setItems(data.items || []);
        setStale(Boolean(data.stale));
        setError(false);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadNews();
    const refreshTimer = window.setInterval(loadNews, 10 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(refreshTimer);
    };
  }, [refreshKey]);

  useEffect(() => () => window.clearTimeout(seedTimer.current), []);

  const dateLabel = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" }).format(date);
  };

  const selectedItem = items.length ? items[selectedIndex % items.length] : null;
  const visibleItems = savedOnly ? saved : items;
  const isStorySaved = (item) => saved.some((story) => story.url === item.url);
  const categoryFor = (title = "") => {
    if (/price|market|mandi|trade|export|import|crop rate/i.test(title)) return "Markets";
    if (/scheme|fund|loan|policy|government|minister|subsidy|msp/i.test(title)) return "Policy";
    if (/disease|pest|rust|blight|virus|health/i.test(title)) return "Crop health";
    if (/study|research|science|technology|ai |innovation/i.test(title)) return "Research";
    if (/rain|monsoon|drought|flood|weather|temperature/i.test(title)) return "Weather";
    return "Field report";
  };

  function toggleSaved(item) {
    setSaved((current) => {
      const isSaved = current.some((story) => story.url === item.url);
      const next = isSaved ? current.filter((story) => story.url !== item.url) : [item, ...current].slice(0, 30);
      try { window.localStorage.setItem("krishsense-saved-news", JSON.stringify(next)); } catch { /* Keep this session's bookmarks usable if storage is blocked. */ }
      return next;
    });
  }

  function moveHeadline(direction) {
    if (items.length < 2) return;
    setSelectedIndex((current) => (current + direction + items.length) % items.length);
  }

  function surpriseMe() {
    if (!items.length) return;
    const next = items.length === 1 ? 0 : (selectedIndex + 1 + Math.floor(Math.random() * (items.length - 1))) % items.length;
    setSelectedIndex(next);
    setSurprise(true);
    window.setTimeout(() => setSurprise(false), 1100);
  }

  function handleNewsLabel() {
    setExpanded((value) => !value);
    const now = Date.now();
    labelClicks.current = [...labelClicks.current.filter((time) => now - time < 1800), now];
    if (labelClicks.current.length >= 5 && !seedUnlocked) {
      setSeedUnlocked(true);
      setSeedMessage(true);
      try { window.localStorage.setItem("krishsense-golden-seed", "found"); } catch { /* The discovery still works for this visit. */ }
      window.clearTimeout(seedTimer.current);
      seedTimer.current = window.setTimeout(() => setSeedMessage(false), 5200);
      labelClicks.current = [];
    }
  }

  return (
    <aside className={`floating-news${expanded ? " is-expanded" : ""}`} aria-label="Latest agriculture news">
      <div className="news-topline">
        <button className="floating-news-label" type="button" onClick={handleNewsLabel} aria-expanded={expanded} title="Open the farm news desk">
          <span className="news-label-icon"><Newspaper size={17} /></span>
          <span>Farm news</span>
          <span className="news-live-dot" aria-label="Live feed" />
        </button>
        <div className="news-desk-mark"><span>FIELD DISPATCH</span><i /> INDIA AGRICULTURE</div>
        <div className="news-feature-controls">
          <button className="news-control-button news-surprise-button" type="button" onClick={surpriseMe} disabled={!items.length} title="Surprise me with a headline" aria-label="Surprise me with a headline"><Shuffle size={16} /><span>Surprise me</span></button>
          {selectedItem && <button className={`news-control-button news-save-button${isStorySaved(selectedItem) ? " is-saved" : ""}`} type="button" onClick={() => toggleSaved(selectedItem)} title={isStorySaved(selectedItem) ? "Remove saved headline" : "Save this headline"} aria-label={isStorySaved(selectedItem) ? "Remove saved headline" : "Save this headline"}><Bookmark size={17} fill={isStorySaved(selectedItem) ? "currentColor" : "none"} /></button>}
          <button className="news-control-button news-expand-button" type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} title={expanded ? "Close news desk" : "Explore all headlines"} aria-label={expanded ? "Close news desk" : "Explore all headlines"}>{expanded ? <ChevronUp size={17} /> : <span>Explore <ChevronRight size={15} /></span>}</button>
        </div>
      </div>

      <div className={`news-featured${surprise ? " is-surprise" : ""}`} aria-live="polite">
        <div className="news-feature-copy">
          {loading && <span className="news-feed-state"><span className="news-loading-pulse" /> Gathering field dispatches…</span>}
          {!loading && error && <span className="news-feed-state">Headlines unavailable. <a href="https://news.google.com/search?q=agriculture+India&hl=en-IN&gl=IN&ceid=IN%3Aen" target="_blank" rel="noreferrer">Open agriculture news</a></span>}
          {!loading && !error && !selectedItem && <span className="news-feed-state">No recent agriculture headlines found.</span>}
          {selectedItem && <>
            <span className="news-topic"><Sparkles size={12} /> {categoryFor(selectedItem.title)}</span>
            <a className="news-feature-title" href={selectedItem.url} target="_blank" rel="noreferrer">{selectedItem.title}</a>
            <span className="news-feature-meta">{selectedItem.source} <i /> {dateLabel(selectedItem.publishedAt)}{stale ? " · cached" : ""}</span>
          </>}
        </div>
        {items.length > 1 && <div className="news-pager">
          <span>{String((selectedIndex % items.length) + 1).padStart(2, "0")} <i>/</i> {String(items.length).padStart(2, "0")}</span>
          <button className="news-control-button" type="button" onClick={() => moveHeadline(-1)} title="Previous headline" aria-label="Previous headline"><ChevronLeft size={17} /></button>
          <button className="news-control-button" type="button" onClick={() => moveHeadline(1)} title="Next headline" aria-label="Next headline"><ChevronRight size={17} /></button>
        </div>}
      </div>

      {seedMessage && <div className="news-seed-toast" role="status"><span className="news-seed-sprout"><Sprout size={22} /></span><span><strong>Golden seed found!</strong><small>May your next season be a good one.</small></span><Sparkles size={17} /></div>}

      {expanded && <section className="news-library" aria-label="Agriculture headlines">
        <div className="news-library-heading">
          <div><span className="eyebrow">The field dispatch</span><h3>Stories shaping the season</h3></div>
          <div className="news-library-actions">
            <div className="news-filter-toggle" role="group" aria-label="Filter headlines">
              <button type="button" className={!savedOnly ? "active" : ""} onClick={() => setSavedOnly(false)}>Latest <span>{items.length}</span></button>
              <button type="button" className={savedOnly ? "active" : ""} onClick={() => setSavedOnly(true)}>Saved <span>{saved.length}</span></button>
            </div>
            <button className="news-control-button" type="button" onClick={() => { setLoading(true); setError(false); setRefreshKey((key) => key + 1); }} title="Refresh headlines" aria-label="Refresh headlines"><RefreshCw size={16} className={loading ? "news-refreshing" : ""} /></button>
          </div>
        </div>
        {visibleItems.length ? <div className="news-library-grid">
          {visibleItems.map((item, index) => <article className="news-library-card" key={item.url} style={{ "--story-index": index }}>
            <div className="news-library-card-top"><span className="news-topic">{categoryFor(item.title)}</span><button className={`news-card-save${isStorySaved(item) ? " is-saved" : ""}`} type="button" onClick={() => toggleSaved(item)} aria-label={isStorySaved(item) ? "Remove saved headline" : "Save headline"} title={isStorySaved(item) ? "Remove saved headline" : "Save headline"}><Bookmark size={16} fill={isStorySaved(item) ? "currentColor" : "none"} /></button></div>
            <a className="news-library-title" href={item.url} target="_blank" rel="noreferrer">{item.title}<span aria-hidden="true">↗</span></a>
            <div className="news-library-meta"><span>{item.source}</span><time dateTime={item.publishedAt}>{dateLabel(item.publishedAt)}</time></div>
          </article>)}
        </div> : <div className="news-saved-empty"><Bookmark size={20} /><span>{savedOnly ? "No saved stories yet. Bookmark a headline to keep it here." : "No recent headlines to show."}</span></div>}
        {seedUnlocked && <div className="news-seed-footer"><Sprout size={16} /> Golden seed club member <span>✦</span></div>}
      </section>}
    </aside>
  );
}

function FarmerDashboard({ token, user, language, onFarmChange }) {
  const [activeView, setActiveView] = useState("analysis");
  const [accountUser, setAccountUser] = useState(user);
  const [analyses, setAnalyses] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [insurance, setInsurance] = useState([]);
  const [loans, setLoans] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [market, setMarket] = useState(emptyMarketState);
  const [loading, setLoading] = useState(true);
  const farms = accountUser.farms?.length ? accountUser.farms : [{ id: "", name: accountUser.farmName || text(language, "mainFarm") }];
  const activeFarmId = accountUser.activeFarmId || farms[0]?.id || "";
  const activeFarm = farms.find((farm) => farm.id === activeFarmId) || farms[0];

  async function loadAnalyses() {
    setLoading(true);
    const data = await apiRequest(withFarm("/api/analyses", activeFarmId), { token });
    setAnalyses(data.analyses);
    setLoading(false);
  }

  async function loadLoans() {
    const data = await apiRequest(withFarm("/api/loans", activeFarmId), { token });
    setLoans(data.loans);
  }

  async function loadMarket() {
    const data = await apiRequest(withFarm("/api/market", activeFarmId), { token });
    setMarket(data);
  }

  async function loadDiseases() {
    const data = await apiRequest(withFarm("/api/diseases", activeFarmId), { token });
    setDiseases(data.diseases);
  }

  async function loadInsurance() {
    const data = await apiRequest(withFarm("/api/insurance", activeFarmId), { token });
    setInsurance(data.insurance);
  }

  async function loadTasks() {
    const data = await apiRequest(withFarm("/api/tasks", activeFarmId), { token });
    setTasks(data.tasks);
  }

  useEffect(() => {
    Promise.all([loadAnalyses(), loadLoans(), loadMarket(), loadDiseases(), loadInsurance(), loadTasks()]).catch(() => setLoading(false));
  }, [activeFarmId]);

  const latest = analyses[0];
  const pending = analyses.filter((analysis) => analysis.status === "pending").length;
  const pendingLoans = loans.filter((loan) => loan.status === "pending").length;
  const insights = useMemo(() => buildFarmerInsights(analyses, loans), [analyses, loans]);
  const recommendations = useMemo(
    () => buildFarmRecommendations(analyses, diseases, tasks, activeFarm),
    [analyses, diseases, tasks, activeFarm]
  );
  const notifications = useMemo(() => buildNotifications(analyses, loans, market, tasks), [analyses, loans, market, tasks]);

  return (
    <div className="dashboard-grid">
      <aside className="side-panel">
        <div className="profile-block">
          <img src={fieldImage} alt="Farm rows" />
          <div>
            <span>{activeFarm?.name || text(language, "farmProfile")}</span>
            <strong>{accountUser.name}</strong>
          </div>
        </div>
        <FarmSwitcher
          token={token}
          farms={farms}
          activeFarmId={activeFarmId}
          onUserChange={(nextUser) => {
            setAccountUser(nextUser);
            onFarmChange(nextUser.farmName);
          }}
        />
        <nav className="side-nav" aria-label={text(language, "farmerDesk")}>
          <button className={activeView === "analysis" ? "active" : ""} onClick={() => setActiveView("analysis")}>
            <Camera size={18} />
            {text(language, "soilAnalysis")}
          </button>
          <button className={activeView === "identify" ? "active" : ""} onClick={() => setActiveView("identify")}>
            <Search size={18} />
            {text(language, "soilIdentifier")}
          </button>
          <button className={activeView === "history" ? "active" : ""} onClick={() => setActiveView("history")}>
            <ClipboardList size={18} />
            {text(language, "history")}
          </button>
          <button className={activeView === "disease" ? "active" : ""} onClick={() => setActiveView("disease")}>
            <AlertTriangle size={18} />
            {text(language, "diseaseDetection")}
          </button>
          <button className={activeView === "insights" ? "active" : ""} onClick={() => setActiveView("insights")}>
            <TrendingUp size={18} />
            {text(language, "insights")}
          </button>
          <button className={activeView === "tools" ? "active" : ""} onClick={() => setActiveView("tools")}>
            <Calculator size={18} />
            {text(language, "farmTools")}
          </button>
          <button className={activeView === "planner" ? "active" : ""} onClick={() => setActiveView("planner")}>
            <CalendarDays size={18} />
            {text(language, "cropPlanner")}
          </button>
          <button className={activeView === "market" ? "active" : ""} onClick={() => setActiveView("market")}>
            <ShoppingCart size={18} />
            {text(language, "market")}
          </button>
          <button className={activeView === "loans" ? "active" : ""} onClick={() => setActiveView("loans")}>
            <HandCoins size={18} />
            {text(language, "loans")}
          </button>
          <button className={activeView === "insurance" ? "active" : ""} onClick={() => setActiveView("insurance")}>
            <ShieldCheck size={18} />
            {text(language, "insurance")}
          </button>
          <button className={activeView === "account" ? "active" : ""} onClick={() => setActiveView("account")}>
            <KeyRound size={18} />
            {text(language, "account")}
          </button>
          <button className={activeView === "manual" ? "active" : ""} onClick={() => setActiveView("manual")}>
            <BookOpen size={18} />
            {text(language, "userManual")}
          </button>
        </nav>
      </aside>

      <section className="content-area">
        <div className="metric-row">
          <Metric icon={<Sprout size={19} />} label={text(language, "activeFarm")} value={activeFarm?.name || text(language, "mainFarm")} />
          <Metric icon={<FlaskConical size={19} />} label={text(language, "analyses")} value={analyses.length} />
          <Metric icon={<Clock3 size={19} />} label={text(language, "pendingReview")} value={pending} />
          <Metric icon={<Leaf size={19} />} label={text(language, "latestSoil")} value={latest?.result.soilType || "None"} />
          <Metric icon={<AlertTriangle size={19} />} label={text(language, "diseaseChecks")} value={diseases.length} />
          <Metric icon={<HandCoins size={19} />} label={text(language, "loanRequests")} value={pendingLoans ? `${pendingLoans} pending` : loans.length} />
          <Metric icon={<TrendingUp size={19} />} label={text(language, "averageHealth")} value={insights.averageHealth ?? "None"} />
          <Metric icon={<Wallet size={19} />} label={text(language, "balance")} value={formatMoney(market.account?.walletBalance || 0)} />
        </div>

        {recommendations.length > 0 && (
          <section className="recommendation-strip" aria-label="Recommendations for this farm">
            <div>
              <span className="eyebrow">For {activeFarm?.name || "this farm"}</span>
              <strong>{text(language, "recommendedNextSteps")}</strong>
            </div>
            <ul>
              {recommendations.slice(0, 2).map((item) => <li key={item}>{item}</li>)}
            </ul>
            <small>Based on this farm's profile, saved reports, and open tasks.</small>
            <button className="small-button" onClick={() => setActiveView("planner")}>
              <CalendarDays size={15} />
              {text(language, "planTask")}
            </button>
          </section>
        )}

        {activeView === "analysis" && <SoilAnalysisForm key={activeFarmId} token={token} farmId={activeFarmId} activeFarm={activeFarm} onCreated={loadAnalyses} />}
        {activeView === "identify" && <SoilIdentifierUpload key={activeFarmId} token={token} farmId={activeFarmId} onCreated={loadAnalyses} />}
        {activeView === "history" && <AnalysisHistory analyses={analyses} loading={loading} />}
        {activeView === "planner" && <CropTaskPlanner key={activeFarmId} token={token} farm={activeFarm} farmId={activeFarmId} tasks={tasks} onChanged={loadTasks} />}
        {activeView === "disease" && <DiseaseDetectionPanel key={activeFarmId} token={token} farmId={activeFarmId} diseases={diseases} onChanged={loadDiseases} />}
        {activeView === "insights" && <FarmerInsightCenter insights={insights} analyses={analyses} />}
        {activeView === "tools" && (
          <FarmerToolsPanel token={token} analyses={analyses} diseases={diseases} tasks={tasks} activeFarm={activeFarm} loans={loans} market={market} notifications={notifications} language={language} />
        )}
        {activeView === "market" && <MarketPanel key={activeFarmId} token={token} farmId={activeFarmId} market={market} onChanged={() => Promise.all([loadMarket(), loadLoans()])} />}
        {activeView === "loans" && <FarmerLoanPanel key={activeFarmId} token={token} farmId={activeFarmId} loans={loans} onChanged={loadLoans} />}
        {activeView === "insurance" && <InsurancePanel key={activeFarmId} token={token} farmId={activeFarmId} insurance={insurance} onChanged={loadInsurance} />}
        {activeView === "account" && <PasswordPanel token={token} />}
        {activeView === "manual" && <UserManualPanel language={language} onNavigate={setActiveView} />}
      </section>
    </div>
  );
}

function UserManualPanel({ language, onNavigate }) {
  const manualSections = [
    {
      title: "Set up your farms",
      steps: [
        "Use the farm selector in the left sidebar to switch farms or add another one.",
        "Choose the farm you want before opening reports, tasks, loans, or market activity; each farm keeps its own records."
      ],
      action: "",
      view: ""
    },
    {
      title: "Create a soil report",
      steps: [
        "Open Soil analysis and enter the field area, location, crop, and the soil details you know.",
        "Submit the form and review the returned report. Add a laboratory soil test for reliable pH and nutrient decisions."
      ],
      action: "Open soil analysis",
      view: "analysis"
    },
    {
      title: "Identify soil from a photo",
      steps: [
        "Open Soil identifier and upload a clear, close photo of the soil in natural light.",
        "Read the predicted soil type and confidence score as a visual estimate, not a lab measurement."
      ],
      action: "Identify soil",
      view: "identify"
    },
    {
      title: "Check a crop for disease",
      steps: [
        "Open Disease detection, select the crop, describe the symptoms, and upload a sharp photo of the affected plant.",
        "Use the result to guide inspection. Confirm uncertain or severe cases with a local agriculture officer before treatment."
      ],
      action: "Open disease detection",
      view: "disease"
    },
    {
      title: "Plan work and ask for guidance",
      steps: [
        "Use Crop planner to record field tasks and due dates; check Farm tools for saved reports, weather, market information, and the assistant.",
        "AI suggestions are general guidance. Check local conditions and product labels before irrigation, fertilizer, or pesticide decisions."
      ],
      action: "Open crop planner",
      view: "planner"
    },
    {
      title: "Use market, loans, and insurance",
      steps: [
        "Market orders, loan requests, and insurance applications are submitted from their respective sections and may require admin review.",
        "The displayed wallet and approval workflow are in-app records; they do not transfer real money or create a real bank loan or insurance policy."
      ],
      action: "Open market",
      view: "market"
    },
    {
      title: "Review records and protect your account",
      steps: [
        "Use History to revisit soil reports. Open Account to change your password, and log out when you finish on a shared device.",
        "If sign-in or registration asks for a security check, complete the CAPTCHA before submitting the form."
      ],
      action: "Open history",
      view: "history"
    }
  ];

  return (
    <section className="user-manual" aria-labelledby="user-manual-title">
      <div className="tool-heading">
        <BookOpen size={22} />
        <div>
          <span className="eyebrow">{text(language, "userManual")}</span>
          <h2 id="user-manual-title">Krishisense quick guide</h2>
        </div>
      </div>
      <p className="user-manual-intro">Follow these steps to set up a farm, understand your reports, and use the main tools.</p>
      <div className="user-manual-topics">
        {manualSections.map((section, index) => (
          <article className="user-manual-topic" key={section.title}>
            <span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
            <h3>{section.title}</h3>
            <ol>
              {section.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
            {section.action && (
              <button className="small-button" type="button" onClick={() => onNavigate(section.view)}>
                {section.action}<ChevronRight size={15} />
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function Metric({ icon, label, value }) {
  return (
    <div className="metric-card">
      <span>{icon}</span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function CropTaskPlanner({ token, farm, farmId, tasks, onChanged }) {
  const [form, setForm] = useState({
    title: "",
    crop: farm?.primaryCrop || "",
    category: "scouting",
    dueDate: tomorrowDateInput(),
    notes: ""
  });
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const todayStart = new Date(new Date().toDateString());
  const pending = tasks.filter((task) => task.status === "planned");
  const overdueCount = pending.filter((task) => new Date(task.dueDate) < todayStart).length;

  useEffect(() => {
    setForm((current) => ({ ...current, crop: current.crop || farm?.primaryCrop || "" }));
  }, [farmId]);

  async function addTask(event) {
    event.preventDefault();
    const parsed = farmTaskClientSchema.safeParse(form);
    if (!parsed.success) {
      setError(firstValidationMessage(parsed));
      return;
    }
    setBusy("add");
    setError("");
    setMessage("");
    try {
      await apiRequest("/api/tasks", {
        token,
        method: "POST",
        body: {
          ...parsed.data,
          farmId,
          dueDate: new Date(`${parsed.data.dueDate}T12:00:00`).toISOString()
        }
      });
      setForm((current) => ({ ...current, title: "", notes: "" }));
      setMessage("Task added to this farm's plan.");
      await onChanged();
    } catch (err) {
      setError(err.message || "Could not add task.");
    } finally {
      setBusy("");
    }
  }

  async function updateTask(task, status) {
    setBusy(task.id);
    setError("");
    try {
      await apiRequest(`/api/tasks/${task.id}/status`, { token, method: "PATCH", body: { status } });
      await onChanged();
    } catch (err) {
      setError(err.message || "Could not update task.");
    } finally {
      setBusy("");
    }
  }

  async function removeTask(task) {
    setBusy(task.id);
    setError("");
    try {
      await apiRequest(`/api/tasks/${task.id}`, { token, method: "DELETE" });
      await onChanged();
    } catch (err) {
      setError(err.message || "Could not remove task.");
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="planner-layout">
      <section className="form-card planner-form-card">
        <div className="section-heading">
          <span className="eyebrow">Farm activity plan</span>
          <h2>{farm?.name || "Crop planner"}</h2>
          <p>Keep upcoming crop work in one place for this farm.</p>
        </div>
        {error && <p className="error-banner">{error}</p>}
        {message && <p className="success-banner">{message}</p>}
        <form className="stack-form" onSubmit={addTask}>
          <label>
            Task
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. Inspect lower leaves for pests" required />
          </label>
          <div className="form-grid">
            <label>
              Crop
              <input value={form.crop} onChange={(event) => setForm({ ...form, crop: event.target.value })} placeholder="Crop name" />
            </label>
            <label>
              Activity
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                <option value="sowing">Sowing</option>
                <option value="irrigation">Irrigation</option>
                <option value="fertilizer">Fertilizer</option>
                <option value="scouting">Crop scouting</option>
                <option value="harvest">Harvest</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label>
              Due date
              <input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} required />
            </label>
          </div>
          <label>
            Notes
            <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} rows={3} placeholder="Optional details" />
          </label>
          <button className="primary-button" disabled={busy === "add"}>
            <CalendarDays size={17} />
            {busy === "add" ? "Adding task" : "Add to farm plan"}
          </button>
        </form>
      </section>

      <section className="planner-tasks">
        <div className="planner-summary">
          <div>
            <span className="eyebrow">{farm?.primaryCrop || "Farm tasks"}</span>
            <h2>Upcoming work</h2>
          </div>
          <span>{pending.length} open{overdueCount ? ` · ${overdueCount} overdue` : ""}</span>
        </div>
        {!tasks.length ? (
          <div className="empty-state planner-empty">
            <CalendarDays size={32} />
            <h3>No tasks planned</h3>
            <p>Start with a crop scouting check or schedule the next irrigation.</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => {
              const overdue = task.status === "planned" && new Date(task.dueDate) < todayStart;
              return (
                <article className={`task-row ${task.status}`} key={task.id}>
                  <span className="task-icon"><CalendarDays size={18} /></span>
                  <div className="task-copy">
                    <div className="task-title-row">
                      <h3>{task.title}</h3>
                      <span className={`status-badge ${overdue ? "overdue" : task.status}`}>{overdue ? "Overdue" : titleCase(task.status)}</span>
                    </div>
                    <p>{titleCase(task.category)}{task.crop ? ` · ${task.crop}` : ""} · {formatDay(task.dueDate)}</p>
                    {task.notes && <p className="task-notes">{task.notes}</p>}
                  </div>
                  <div className="task-actions">
                    <button className="icon-button" type="button" disabled={busy === task.id} onClick={() => updateTask(task, task.status === "completed" ? "planned" : "completed")} title={task.status === "completed" ? "Reopen task" : "Mark complete"} aria-label={task.status === "completed" ? "Reopen task" : "Mark complete"}>
                      <CheckCircle2 size={17} />
                    </button>
                    <button className="icon-button" type="button" disabled={busy === task.id} onClick={() => removeTask(task)} title="Delete task" aria-label="Delete task">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function FarmSwitcher({ token, farms, activeFarmId, onUserChange }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", landArea: "", landUnit: "acre", primaryCrop: "" });
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function switchFarm(farmId) {
    if (!farmId || farmId === activeFarmId) return;
    setBusy(`switch-${farmId}`);
    setError("");
    try {
      const data = await apiRequest("/api/auth/active-farm", {
        token,
        method: "PATCH",
        body: { farmId }
      });
      onUserChange(data.user);
    } catch (err) {
      setError(err.message || "Farm switch failed.");
    } finally {
      setBusy("");
    }
  }

  async function addFarm(event) {
    event.preventDefault();
    setBusy("add");
    setError("");
    try {
      const validation = farmClientSchema.safeParse(form);
      if (!validation.success) throw new Error(firstValidationMessage(validation));
      const data = await apiRequest("/api/auth/farms", {
        token,
        method: "POST",
        body: validation.data
      });
      onUserChange(data.user);
      setForm({ name: "", location: "", landArea: "", landUnit: "acre", primaryCrop: "" });
      setOpen(false);
    } catch (err) {
      setError(err.message || "Could not add farm.");
    } finally {
      setBusy("");
    }
  }

  return (
    <section className="farm-switcher" aria-label="Farm switcher">
      <div className="farm-switcher-head">
        <span className="eyebrow">Farm workspace</span>
        <button className="small-button" type="button" onClick={() => setOpen((current) => !current)}>
          <UserPlus size={15} />
          Add
        </button>
      </div>
      <select value={activeFarmId} onChange={(event) => switchFarm(event.target.value)}>
        {farms.map((farm) => (
          <option key={farm.id || farm.name} value={farm.id}>
            {farm.name}
          </option>
        ))}
      </select>
      {error && <p className="row-error">{error}</p>}
      {open && (
        <form className="farm-add-form" onSubmit={addFarm}>
          <input value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Farm name" required />
          <input value={form.location} onChange={(event) => updateField("location", event.target.value)} placeholder="Location" />
          <div className="split-input input-shell">
            <Ruler size={16} />
            <input type="number" min="0" step="0.01" value={form.landArea} onChange={(event) => updateField("landArea", event.target.value)} placeholder="Area" />
            <select value={form.landUnit} onChange={(event) => updateField("landUnit", event.target.value)}>
              <option value="acre">Acre</option>
              <option value="hectare">Hectare</option>
              <option value="bigha">Bigha</option>
            </select>
          </div>
          <input value={form.primaryCrop} onChange={(event) => updateField("primaryCrop", event.target.value)} placeholder="Primary crop" />
          <button className="secondary-button" disabled={busy === "add"}>
            <Sprout size={16} />
            {busy === "add" ? "Adding" : "Save farm"}
          </button>
        </form>
      )}
    </section>
  );
}

function SoilAnalysisForm({ token, farmId, activeFarm, onCreated }) {
  const [form, setForm] = useState(emptyAnalysisForm);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm((current) => ({
      ...current,
      crop: current.crop || activeFarm?.primaryCrop || "",
      location: current.location || activeFarm?.location || "",
      landArea: current.landArea || activeFarm?.landArea || "",
      landUnit: activeFarm?.landUnit || current.landUnit
    }));
  }, [farmId]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handlePhoto(file) {
    setPhoto(file || null);
    setPreview(file ? URL.createObjectURL(file) : "");
  }

  async function submitAnalysis(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const validation = fieldReportClientSchema.safeParse({
        landArea: form.landArea,
        crop: form.crop,
        photo
      });
      if (!validation.success) throw new Error(firstValidationMessage(validation));

      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      body.append("farmId", farmId || "");
      body.append("photo", photo);

      const data = await apiRequest("/api/analyses", {
        token,
        method: "POST",
        body
      });

      setResult(data.analysis.result);
      setForm({
        ...emptyAnalysisForm,
        crop: activeFarm?.primaryCrop || "",
        location: activeFarm?.location || "",
        landArea: activeFarm?.landArea || "",
        landUnit: activeFarm?.landUnit || "acre"
      });
      setPhoto(null);
      setPreview("");
      await onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="work-surface">
      <section className="form-card">
        <div className="section-heading">
          <span className="eyebrow">New field report</span>
          <h2>{activeFarm?.name ? `${activeFarm.name}: soil report` : "Upload soil photo and crop details"}</h2>
        </div>
        {error && <p className="error-banner">{error}</p>}
        <form className="analysis-form" onSubmit={submitAnalysis}>
          <label className="upload-zone">
            <input type="file" accept="image/*" onChange={(event) => handlePhoto(event.target.files?.[0])} />
            {preview ? (
              <img src={preview} alt="Uploaded soil preview" />
            ) : (
              <span>
                <Upload size={24} />
                Soil photo
              </span>
            )}
          </label>

          <div className="form-grid">
            <label>
              Crop grown
              <span className="input-shell">
                <Wheat size={17} />
                <input value={form.crop} onChange={(event) => updateField("crop", event.target.value)} required />
              </span>
            </label>
            <label>
              Location
              <span className="input-shell">
                <MapPin size={17} />
                <input value={form.location} onChange={(event) => updateField("location", event.target.value)} />
              </span>
            </label>
            <label>
              Land area
              <span className="input-shell split-input">
                <Ruler size={17} />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.landArea}
                  onChange={(event) => updateField("landArea", event.target.value)}
                  required
                />
                <select value={form.landUnit} onChange={(event) => updateField("landUnit", event.target.value)}>
                  <option value="acre">Acre</option>
                  <option value="hectare">Hectare</option>
                  <option value="bigha">Bigha</option>
                </select>
              </span>
            </label>
            <SelectField label="Land type" value={form.landType} options={landTypes} onChange={(value) => updateField("landType", value)} />
            <SelectField label="Soil color" value={form.soilColor} options={soilColors} onChange={(value) => updateField("soilColor", value)} />
            <SelectField label="Texture" value={form.texture} options={textures} onChange={(value) => updateField("texture", value)} />
            <SelectField label="Drainage" value={form.drainage} options={drainageOptions} onChange={(value) => updateField("drainage", value)} />
            <label>
              pH
              <span className="input-shell">
                <Gauge size={17} />
                <input
                  type="number"
                  min="3"
                  max="10"
                  step="0.1"
                  value={form.ph}
                  onChange={(event) => updateField("ph", event.target.value)}
                />
              </span>
            </label>
          </div>

          <label>
            Field notes
            <textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} rows={3} />
          </label>

          <button className="primary-button" disabled={busy}>
            <FlaskConical size={18} />
            {busy ? "Analyzing" : "Get analysis"}
          </button>
        </form>
      </section>

      <section className="result-column">
        {result ? (
          <ResultCard result={result} />
        ) : (
          <div className="empty-state">
            <ImageIcon size={36} />
            <h3>Analysis result</h3>
            <p>Saved reports appear in History after submission.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function ResultCard({ result }) {
  return (
    <article className="result-card">
      <div className="soil-chip" style={{ "--soil-color": result.soilColor }}>
        <span />
        <div>
          <p>Identified soil</p>
          <h3>{result.soilType}</h3>
        </div>
      </div>

      <div className="score-grid">
        <div>
          <span>{result.confidence}%</span>
          <p>Confidence</p>
        </div>
        <div>
          <span>{result.healthScore}</span>
          <p>Soil health</p>
        </div>
        <div>
          <span>{result.riskLevel}</span>
          <p>Risk</p>
        </div>
      </div>

      <p className="summary-copy">{result.summary}</p>

      {result.alerts?.length > 0 && (
        <div className="alert-list">
          {result.alerts.map((alert) => (
            <p key={alert}>
              <AlertTriangle size={16} />
              {alert}
            </p>
          ))}
        </div>
      )}

      <div className="detail-list">
        <h4>Recommendations</h4>
        {result.recommendations.map((item) => (
          <p key={item}>
            <CheckCircle2 size={16} />
            {item}
          </p>
        ))}
      </div>

      <div className="detail-list">
        <h4>Likely nutrients</h4>
        {result.nutrients.map((item) => (
          <p key={item}>
            <Leaf size={16} />
            {item}
          </p>
        ))}
      </div>

      <div className="irrigation-note">
        <Droplets size={18} />
        <span>{result.irrigation}</span>
      </div>
      <p className="lab-note">{result.note}</p>
    </article>
  );
}

function SoilIdentifierUpload({ token, farmId, onCreated }) {
  const [form, setForm] = useState({
    landType: "unknown",
    location: "",
    crop: "",
    notes: ""
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handlePhoto(file) {
    setPhoto(file || null);
    setPreview(file ? URL.createObjectURL(file) : "");
    setResult(null);
  }

  async function identifySample(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const validation = identifierClientSchema.safeParse({ photo });
      if (!validation.success) throw new Error(firstValidationMessage(validation));

      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      body.append("farmId", farmId || "");
      body.append("photo", photo);

      const data = await apiRequest("/api/analyses/identify-soil", {
        token,
        method: "POST",
        body
      });
      setResult(data.result);
      await onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="identifier-grid">
      <section className="form-card">
        <div className="section-heading">
          <span className="eyebrow">AI soil identifier</span>
          <h2>Upload a soil photo</h2>
        </div>
        {error && <p className="error-banner">{error}</p>}

        <form className="analysis-form" onSubmit={identifySample}>
          <label className="upload-zone">
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => handlePhoto(event.target.files?.[0])} />
            {preview ? (
              <img src={preview} alt="Uploaded soil sample preview" />
            ) : (
              <span>
                <Camera size={24} />
                Soil sample photo
              </span>
            )}
          </label>

          <div className="form-grid">
            <SelectField
              label="Land type"
              value={form.landType}
              options={[["unknown", "Unknown"], ...landTypes]}
              onChange={(value) => updateField("landType", value)}
            />
            <label>
              Location
              <span className="input-shell">
                <MapPin size={17} />
                <input value={form.location} onChange={(event) => updateField("location", event.target.value)} />
              </span>
            </label>
            <label>
              Crop nearby
              <span className="input-shell">
                <Wheat size={17} />
                <input value={form.crop} onChange={(event) => updateField("crop", event.target.value)} />
              </span>
            </label>
          </div>

          <label>
            Notes
            <textarea
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              rows={3}
              placeholder="Optional: moisture, smell, stickiness, field condition"
            />
          </label>

          <button className="primary-button" disabled={busy}>
            <Search size={18} />
            {busy ? "Analyzing photo" : "Identify soil"}
          </button>
        </form>
      </section>

      <section>
        {result ? (
          <ResultCard result={result} />
        ) : (
          <div className="empty-state">
            <Search size={36} />
            <h3>Soil identity</h3>
            <p>Gemini will classify the uploaded photo and return a confidence score.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function FarmerInsightCenter({ insights, analyses }) {
  return (
    <div className="insight-layout">
      <section className="insight-hero">
        <div>
          <span className="eyebrow">Farm intelligence</span>
          <h2>Field health snapshot</h2>
        </div>
        <div className="insight-summary">
          <InsightTile icon={<TrendingUp size={18} />} label="Average health" value={insights.averageHealth ?? "No data"} />
          <InsightTile icon={<Leaf size={18} />} label="Dominant soil" value={insights.dominantSoil} />
          <InsightTile icon={<Wheat size={18} />} label="Crop candidate" value={insights.suggestedCrop} />
          <InsightTile icon={<AlertTriangle size={18} />} label="High risk" value={insights.highRiskCount} />
        </div>
      </section>

      <div className="insight-columns">
        <section className="form-card">
          <div className="section-heading compact-heading">
            <span className="eyebrow">Action plan</span>
            <h2>Next moves</h2>
          </div>
          <div className="action-plan">
            {insights.actions.map((action) => (
              <p key={action}>
                <Target size={16} />
                {action}
              </p>
            ))}
          </div>
        </section>

        <section className="form-card">
          <div className="section-heading compact-heading">
            <span className="eyebrow">Crop signals</span>
            <h2>Best matches</h2>
          </div>
          <SignalBars entries={insights.cropCandidates} emptyLabel={analyses.length ? "No crop candidates yet" : "No reports yet"} />
        </section>

        <section className="form-card">
          <div className="section-heading compact-heading">
            <span className="eyebrow">Soil profile</span>
            <h2>Report mix</h2>
          </div>
          <SignalBars entries={insights.soilMix} emptyLabel={analyses.length ? "No soil mix yet" : "No reports yet"} />
        </section>

        <section className="form-card">
          <div className="section-heading compact-heading">
            <span className="eyebrow">Loan status</span>
            <h2>Finance pulse</h2>
          </div>
          <div className="finance-pulse">
            <span><Clock3 size={16} /> {insights.pendingLoans} pending</span>
            <span><CheckCircle2 size={16} /> {insights.approvedLoans} approved</span>
            <span><UserX size={16} /> {insights.rejectedLoans} rejected</span>
          </div>
        </section>
      </div>
    </div>
  );
}

function InsightTile({ icon, label, value }) {
  return (
    <div className="insight-tile">
      <span>{icon}</span>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}

function SignalBars({ entries, emptyLabel }) {
  if (!entries.length) return <p className="muted-note">{emptyLabel}</p>;
  const max = Math.max(...entries.map(([, count]) => count), 1);

  return (
    <div className="signal-bars">
      {entries.map(([label, count]) => (
        <div className="signal-row" key={label}>
          <div>
            <strong>{label}</strong>
            <span>{count}</span>
          </div>
          <span className="signal-track">
            <span style={{ width: `${Math.max(18, (count / max) * 100)}%` }} />
          </span>
        </div>
      ))}
    </div>
  );
}

function FarmerToolsPanel({ token, analyses, diseases, tasks, activeFarm, loans, market, notifications, language }) {
  const latest = analyses[0];

  return (
    <div className="tools-layout">
      <section className="tools-hero">
        <div>
          <span className="eyebrow">Farm command center</span>
          <h2>Weather, prices, calculators, reports, and assistant</h2>
        </div>
        <div className="tools-hero-stats">
          <InsightTile icon={<Bell size={18} />} label="Notifications" value={notifications.length} />
          <InsightTile icon={<ShoppingCart size={18} />} label="Orders" value={market.orders?.length || 0} />
          <InsightTile icon={<HandCoins size={18} />} label="Approved loans" value={loans.filter((loan) => loan.status === "approved").length} />
        </div>
      </section>

      <div className="tools-grid">
        <WeatherTool latest={latest} />
        <MandiPricePanel />
        <FertilizerCalculator latest={latest} />
        <CropRecommendationPanel latest={latest} />
        <EmiCalculator />
        <NotificationPanel notifications={notifications} />
        <AiAssistantPanel key={activeFarm?.id || activeFarm?.name || "farm"} token={token} latest={latest} latestDisease={diseases[0]} tasks={tasks} farm={activeFarm} language={language} />
      </div>
    </div>
  );
}

function WeatherTool({ latest }) {
  const [location, setLocation] = useState(latest?.input?.location || "Delhi");
  const [weather, setWeather] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function loadWeather(event) {
    event?.preventDefault();
    setBusy(true);
    setError("");
    try {
      const place = encodeURIComponent(location.trim() || "Delhi");
      const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${place}&count=1&language=en&format=json`);
      const geoData = await geoResponse.json();
      const match = geoData.results?.[0];
      if (!match) throw new Error("Location not found.");

      const forecastResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${match.latitude}&longitude=${match.longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=precipitation_probability_max&forecast_days=1`
      );
      const forecast = await forecastResponse.json();
      setWeather({
        name: `${match.name}${match.admin1 ? `, ${match.admin1}` : ""}`,
        temp: Math.round(forecast.current?.temperature_2m || 0),
        humidity: Math.round(forecast.current?.relative_humidity_2m || 0),
        rain: Math.round(forecast.daily?.precipitation_probability_max?.[0] || forecast.current?.precipitation || 0),
        wind: Math.round(forecast.current?.wind_speed_10m || 0)
      });
    } catch (err) {
      setError(err.message || "Weather lookup failed.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    loadWeather();
  }, []);

  return (
    <section className="tool-card weather-card">
      <div className="tool-heading">
        <CloudSun size={22} />
        <div>
          <span className="eyebrow">Weather</span>
          <h3>Field forecast</h3>
        </div>
      </div>
      <form className="inline-tool-form" onSubmit={loadWeather}>
        <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Village or city" />
        <button className="small-button" disabled={busy}>
          <RefreshCw size={15} />
          {busy ? "Checking" : "Check"}
        </button>
      </form>
      {error && <p className="error-banner">{error}</p>}
      {weather && (
        <div className="weather-grid">
          <strong>{weather.name}</strong>
          <span>{weather.temp}°C</span>
          <p>{weather.humidity}% humidity</p>
          <p>{weather.rain}% rain chance</p>
          <p>{weather.wind} km/h wind</p>
        </div>
      )}
    </section>
  );
}

function MandiPricePanel() {
  return (
    <section className="tool-card">
      <div className="tool-heading">
        <TrendingUp size={22} />
        <div>
          <span className="eyebrow">Mandi prices</span>
          <h3>Crop price tracker</h3>
        </div>
      </div>
      <div className="mandi-list">
        {mandiPrices.map((item) => (
          <div className="mandi-row" key={`${item.crop}-${item.market}`}>
            <div>
              <strong>{item.crop}</strong>
              <span>{item.market}</span>
            </div>
            <div>
              <strong>{formatMoney(item.price)}</strong>
              <span>per {item.unit} · {item.trend}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="muted-note">Demo benchmark prices for presentation use.</p>
    </section>
  );
}

function FertilizerCalculator({ latest }) {
  const [crop, setCrop] = useState(latest?.input?.crop || "wheat");
  const [area, setArea] = useState(latest?.input?.landArea || "1");
  const plan = getFertilizerPlan(crop, area);

  return (
    <section className="tool-card">
      <div className="tool-heading">
        <FlaskConical size={22} />
        <div>
          <span className="eyebrow">Calculator</span>
          <h3>Fertilizer estimate</h3>
        </div>
      </div>
      <div className="mini-form-grid">
        <label>
          Crop
          <input value={crop} onChange={(event) => setCrop(event.target.value)} />
        </label>
        <label>
          Area acres
          <input type="number" min="0" step="0.1" value={area} onChange={(event) => setArea(event.target.value)} />
        </label>
      </div>
      <div className="calc-result-grid">
        <span><strong>{plan.urea} kg</strong> Urea</span>
        <span><strong>{plan.dap} kg</strong> DAP</span>
        <span><strong>{plan.npk} kg</strong> NPK</span>
      </div>
      <p className="muted-note">Indicative estimate only. Match final dose with local soil test.</p>
    </section>
  );
}

function CropRecommendationPanel({ latest }) {
  const crops = getCropRecommendations(latest);
  return (
    <section className="tool-card">
      <div className="tool-heading">
        <Wheat size={22} />
        <div>
          <span className="eyebrow">Crop recommendation</span>
          <h3>{latest?.result?.soilType || "No soil report yet"}</h3>
        </div>
      </div>
      <div className="recommendation-chips">
        {crops.map((crop) => (
          <span key={crop}>{crop}</span>
        ))}
      </div>
      <p className="muted-note">Based on latest soil report and built-in soil rules.</p>
    </section>
  );
}

function EmiCalculator() {
  const [amount, setAmount] = useState("50000");
  const [rate, setRate] = useState("8");
  const [months, setMonths] = useState("12");
  const emi = calculateEmi(amount, rate, months);

  return (
    <section className="tool-card">
      <div className="tool-heading">
        <Calculator size={22} />
        <div>
          <span className="eyebrow">Loan calculator</span>
          <h3>EMI estimate</h3>
        </div>
      </div>
      <div className="mini-form-grid">
        <label>
          Amount
          <input type="number" min="0" step="500" value={amount} onChange={(event) => setAmount(event.target.value)} />
        </label>
        <label>
          Interest %
          <input type="number" min="0" step="0.1" value={rate} onChange={(event) => setRate(event.target.value)} />
        </label>
        <label>
          Months
          <input type="number" min="1" value={months} onChange={(event) => setMonths(event.target.value)} />
        </label>
      </div>
      <div className="emi-result">
        <span>Estimated monthly repayment</span>
        <strong>{formatMoney(emi)}</strong>
      </div>
    </section>
  );
}

function NotificationPanel({ notifications }) {
  return (
    <section className="tool-card">
      <div className="tool-heading">
        <Bell size={22} />
        <div>
          <span className="eyebrow">Notifications</span>
          <h3>Recent activity</h3>
        </div>
      </div>
      <div className="notification-list">
        {notifications.map((item) => (
          <p key={`${item.title}-${item.detail}`}>
            <CheckCircle2 size={16} />
            <span><strong>{item.title}</strong>{item.detail}</span>
          </p>
        ))}
      </div>
    </section>
  );
}

function AiAssistantPanel({ token, latest, latestDisease, tasks, farm, language }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const crop = farm?.primaryCrop || latest?.input?.crop;
  const quickQuestions = [
    "What should I do next this week?",
    crop ? `How should I care for ${crop} at this stage?` : "How should I care for my crop this week?",
    "How can I check whether my crop has a disease?",
    "How do I use a battery sprayer safely?"
  ];

  async function askAssistant(event) {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (trimmedQuestion.length < 3) {
      setError("Ask a farming question with at least 3 characters.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const history = messages.slice(-8).map(({ role, content }) => ({ role, content }));
      const data = await apiRequest("/api/assistant/chat", {
        token,
        method: "POST",
        body: {
          question: trimmedQuestion,
          history,
          context: {
            soilType: latest?.result?.soilType || "",
            crop: crop || "",
            location: farm?.location || latest?.input?.location || "",
            healthScore: latest?.result?.healthScore || "",
            farmName: farm?.name || "",
            farmArea: farm?.landArea ? `${farm.landArea} ${farm.landUnit || ""}`.trim() : "",
            latestDisease: latestDisease?.diseaseName || "",
            upcomingTasks: tasks
              .filter((task) => task.status === "planned")
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .slice(0, 3)
              .map((task) => `${task.title} (${task.category}${task.dueDate ? `, due ${formatDay(task.dueDate)}` : ""})`),
            language,
            languageName: getLanguageName(language)
          }
        }
      });
      setMessages((current) => [
        ...current,
        { role: "user", content: trimmedQuestion },
        { role: "assistant", content: data.answer, source: data.source || "unknown" }
      ]);
      setQuestion("");
    } catch (err) {
      setError(err.message || "Assistant failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="tool-card assistant-card">
      <div className="tool-heading">
        <Bot size={22} />
        <div>
          <span className="eyebrow">AI farming assistant{farm?.name ? ` · ${farm.name}` : ""}</span>
          <h3>Get practical next steps</h3>
        </div>
      </div>
      <p className="assistant-context-note">
        Answers use this farm’s crop, saved reports and upcoming tasks. Check local weather, product labels and soil-test results before acting.
      </p>
      <div className="assistant-thread" aria-live="polite" aria-label="Assistant conversation">
        {messages.length === 0 ? (
          <p className="assistant-welcome">Ask about crop care, soil, irrigation, pests or planning. You can ask follow-up questions too.</p>
        ) : messages.map((message, index) => (
          <article className={`assistant-message ${message.role}`} key={`${message.role}-${index}`}>
            <span>{message.role === "assistant" ? (message.source === "fallback" ? "General guidance · AI unavailable" : "Krishisense") : "You"}</span>
            <div>{assistantAnswerLines(message.content).map((line, lineIndex) => <p key={`${line}-${lineIndex}`}>{line}</p>)}</div>
          </article>
        ))}
        {busy && <p className="assistant-thinking"><span className="loading-dot" /> Preparing farm-specific guidance…</p>}
      </div>
      <form className="assistant-form" onSubmit={askAssistant}>
        <textarea
          rows={3}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={crop ? `Ask a follow-up about ${crop} or this farm…` : "Ask a farming question or a follow-up…"}
          required
        />
        <div className="assistant-quick-row">
          {quickQuestions.map((item) => (
            <button className="chip-button" type="button" key={item} disabled={busy} onClick={() => setQuestion(item)}>
              {item}
            </button>
          ))}
        </div>
        <div className="assistant-actions">
          <button className="primary-button" disabled={busy || question.trim().length < 3}>
            <Bot size={17} />
            {busy ? "Thinking" : "Ask assistant"}
          </button>
          {messages.length > 0 && <button className="small-button" type="button" disabled={busy} onClick={() => setMessages([])}>Clear chat</button>}
        </div>
      </form>
      {error && <p className="error-banner">{error}</p>}
    </section>
  );
}

function DiseaseDetectionPanel({ token, farmId, diseases, onChanged }) {
  const [form, setForm] = useState({ crop: "", location: "", symptoms: "", notes: "", photo: null });
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handlePhoto(file) {
    updateField("photo", file);
    setPreview(file ? URL.createObjectURL(file) : "");
  }

  async function submitDisease(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const validation = diseaseClientSchema.safeParse(form);
      if (!validation.success) throw new Error(firstValidationMessage(validation));

      const payload = new FormData();
      payload.append("farmId", farmId || "");
      payload.append("crop", form.crop);
      payload.append("location", form.location);
      payload.append("symptoms", form.symptoms);
      payload.append("notes", form.notes);
      payload.append("photo", form.photo);

      const data = await apiRequest("/api/diseases", { token, method: "POST", body: payload });
      setResult(data.result);
      setMessage("Disease detection completed and saved.");
      setForm({ crop: "", location: "", symptoms: "", notes: "", photo: null });
      setPreview("");
      await onChanged();
    } catch (err) {
      setError(err.message || "Disease detection failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="work-surface">
      <section className="form-card">
        <div className="section-heading">
          <span className="eyebrow">Crop health</span>
          <h2>AI disease detection</h2>
        </div>
        {error && <p className="error-banner">{error}</p>}
        {message && <p className="success-banner">{message}</p>}

        <form className="analysis-form" onSubmit={submitDisease}>
          <div className="upload-zone">
            {preview ? <img src={preview} alt="Crop preview" /> : <ImageIcon size={42} />}
            <label className="upload-button">
              <Upload size={18} />
              Upload crop photo
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => handlePhoto(event.target.files?.[0] || null)} hidden />
            </label>
          </div>
          <div className="form-grid">
            <label>
              Crop
              <span className="input-shell">
                <Wheat size={17} />
                <input value={form.crop} onChange={(event) => updateField("crop", event.target.value)} placeholder="Tomato, wheat, cotton" required />
              </span>
            </label>
            <label>
              Location
              <span className="input-shell">
                <MapPin size={17} />
                <input value={form.location} onChange={(event) => updateField("location", event.target.value)} placeholder="Village or district" />
              </span>
            </label>
          </div>
          <label>
            Visible symptoms
            <textarea value={form.symptoms} onChange={(event) => updateField("symptoms", event.target.value)} rows={3} placeholder="Yellow spots, wilting, curled leaves..." />
          </label>
          <label>
            Notes
            <textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} rows={2} placeholder="When it started, recent spray, rainfall, etc." />
          </label>
          <button className="primary-button" disabled={busy}>
            <AlertTriangle size={18} />
            {busy ? "Analyzing" : "Detect disease"}
          </button>
        </form>
      </section>

      {result && <DiseaseResultCard disease={{ result, createdAt: new Date().toISOString() }} />}
      <DiseaseList diseases={diseases} />
    </div>
  );
}

function DiseaseList({ diseases }) {
  if (!diseases.length) {
    return (
      <div className="empty-state">
        <AlertTriangle size={36} />
        <h3>No disease reports yet</h3>
        <p>Upload a crop photo to detect possible disease or pest stress.</p>
      </div>
    );
  }

  return (
    <section className="loan-list" aria-label="Disease reports">
      {diseases.map((disease) => (
        <DiseaseResultCard key={disease.id} disease={disease} />
      ))}
    </section>
  );
}

function DiseaseResultCard({ disease }) {
  const result = disease.result || {};
  return (
    <article className="loan-card">
      <div className="loan-card-header">
        <div>
          <span>{formatDate(disease.createdAt)}</span>
          <h3>{result.diseaseName || "Unknown disease"}</h3>
        </div>
        <span className={`status-badge ${String(result.severity || "medium").toLowerCase()}`}>{result.severity || "Medium"} risk</span>
      </div>
      {disease.photoUrl && <img className="analysis-photo" src={disease.photoUrl} alt="Crop disease report" />}
      <p>{result.summary || "No summary available."}</p>
      <div className="analysis-tags">
        <span>{result.crop || disease.input?.crop || "Crop"}</span>
        <span>{Number(result.confidence || 0).toFixed(0)}% confidence</span>
        {disease.farmerName && <span>{disease.farmerName}</span>}
        {!disease.farmerName && disease.farmName && <span>{disease.farmName}</span>}
      </div>
      <RecommendationList title="Urgent actions" items={result.urgentActions} />
      <RecommendationList title="Treatment" items={result.treatments} />
      <RecommendationList title="Prevention" items={result.prevention} />
      {result.note && <p className="muted-note">{result.note}</p>}
    </article>
  );
}

function RecommendationList({ title, items = [] }) {
  if (!items?.length) return null;
  return (
    <div className="recommendation-block">
      <strong>{title}</strong>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function MarketPanel({ token, farmId, market, onChanged }) {
  const [quantities, setQuantities] = useState({});
  const [repayment, setRepayment] = useState({
    loanId: "",
    amount: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    ifsc: ""
  });
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const groupedCatalog = useMemo(() => {
    return market.catalog.reduce((groups, item) => {
      groups[item.category] = groups[item.category] || [];
      groups[item.category].push(item);
      return groups;
    }, {});
  }, [market.catalog]);
  const repayableLoans = (market.loans || []).filter((loan) => Number(loan.remainingAmount || 0) > 0);

  function setQuantity(itemId, value) {
    setQuantities((current) => ({ ...current, [itemId]: value }));
  }

  function updateRepayment(field, value) {
    setRepayment((current) => ({ ...current, [field]: value }));
  }

  async function buyItem(item) {
    setBusy(`buy-${item.id}`);
    setError("");
    setMessage("");
    try {
      const quantity = quantities[item.id] || 1;
      const validation = marketPurchaseClientSchema.safeParse({ quantity });
      if (!validation.success) throw new Error(firstValidationMessage(validation));

      await apiRequest("/api/market/orders", {
        token,
        method: "POST",
        body: { itemId: item.id, quantity: validation.data.quantity, farmId }
      });

      setQuantity(item.id, 1);
      setMessage(`${item.name} order confirmed.`);
      await onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  }

  async function repayLoan(event) {
    event.preventDefault();
    setBusy("repay");
    setError("");
    setMessage("");
    try {
      const validation = loanRepaymentClientSchema.safeParse(repayment);
      if (!validation.success) throw new Error(firstValidationMessage(validation));

      await apiRequest("/api/market/repayments", {
        token,
        method: "POST",
        body: validation.data
      });

      setRepayment({
        loanId: "",
        amount: "",
        bankName: "",
        accountName: "",
        accountNumber: "",
        ifsc: ""
      });
      setMessage("Loan repayment recorded from bank account.");
      await onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="market-layout">
      <section className="market-wallet">
        <div>
          <span className="eyebrow">Farmer account</span>
          <h2>{formatMoney(market.account?.walletBalance || 0)}</h2>
          <p>Approved loan money is added here. Market purchases reduce this balance.</p>
        </div>
        <Wallet size={42} />
      </section>

      {(error || message) && (
        <p className={error ? "error-banner" : "success-banner"}>{error || message}</p>
      )}

      <section className="market-catalog">
        {Object.entries(groupedCatalog).map(([category, items]) => (
          <div className="market-category" key={category}>
            <div className="section-heading compact-heading">
              <span className="eyebrow">{category}</span>
              <h2>{category === "Tractor" ? "Tractor and heavy equipment" : `Buy ${category.toLowerCase()}`}</h2>
            </div>
            <div className="product-grid">
              {items.map((item) => (
                <article className="product-card" key={item.id}>
                  <div className="product-art" style={{ "--product-tone": item.imageTone }}>
                    {item.category === "Tractor" ? <Tractor size={30} /> : item.category === "Fertiliser" ? <FlaskConical size={30} /> : <Wheat size={30} />}
                  </div>
                  <div className="product-copy">
                    <h3>{item.name}</h3>
                    <p>{item.unit}</p>
                    <strong>{formatMoney(item.price)}</strong>
                    <span>{item.sourceNote}</span>
                  </div>
                  <div className="product-actions">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={quantities[item.id] || 1}
                      onChange={(event) => setQuantity(item.id, event.target.value)}
                      aria-label={`${item.name} quantity`}
                    />
                    <button className="primary-button" disabled={busy === `buy-${item.id}`} onClick={() => buyItem(item)}>
                      <ShoppingCart size={17} />
                      Buy
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <div className="market-bottom-grid">
        <section className="form-card">
          <div className="section-heading compact-heading">
            <span className="eyebrow">Repayment</span>
            <h2>Pay loan from bank</h2>
          </div>
          <form className="stack-form" onSubmit={repayLoan}>
            <label>
              Approved loan
              <select value={repayment.loanId} onChange={(event) => updateRepayment("loanId", event.target.value)} required>
                <option value="">Select loan</option>
                {repayableLoans.map((loan) => (
                  <option key={loan.id} value={loan.id}>
                    {formatMoney(loan.remainingAmount)} remaining - {loan.purpose}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-grid">
              <label>
                Amount
                <span className="input-shell">
                  <Banknote size={17} />
                  <input
                    type="number"
                    min="1"
                    value={repayment.amount}
                    onChange={(event) => updateRepayment("amount", event.target.value)}
                    required
                  />
                </span>
              </label>
              <label>
                Bank name
                <input value={repayment.bankName} onChange={(event) => updateRepayment("bankName", event.target.value)} required />
              </label>
              <label>
                Account holder
                <input value={repayment.accountName} onChange={(event) => updateRepayment("accountName", event.target.value)} required />
              </label>
              <label>
                Account number
                <input
                  inputMode="numeric"
                  value={repayment.accountNumber}
                  onChange={(event) => updateRepayment("accountNumber", event.target.value)}
                  required
                />
              </label>
              <label>
                IFSC / bank code
                <input value={repayment.ifsc} onChange={(event) => updateRepayment("ifsc", event.target.value)} required />
              </label>
            </div>
            <button className="secondary-button" disabled={busy === "repay" || !repayableLoans.length}>
              <Banknote size={18} />
              {busy === "repay" ? "Recording" : "Repay loan"}
            </button>
          </form>
        </section>

        <section className="form-card">
          <div className="section-heading compact-heading">
            <span className="eyebrow">Orders</span>
            <h2>Purchase history</h2>
          </div>
          {market.orders?.length ? (
            <div className="order-list">
              {market.orders.map((order) => (
                <article className="order-row" key={order.id}>
                  <div>
                    <strong>{order.itemName}</strong>
                    <span>{order.quantity} x {order.unit}</span>
                  </div>
                  <div>
                    <strong>{formatMoney(order.totalPrice)}</strong>
                    <span>{titleCase(order.status)}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="muted-note">No market orders yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}

function FarmerLoanPanel({ token, farmId, loans, onChanged }) {
  const [form, setForm] = useState({
    amount: "",
    purpose: "",
    crop: "",
    landArea: "",
    landUnit: "acre",
    tenureMonths: "12",
    farmerNote: ""
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submitLoan(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const validation = loanClientSchema.safeParse(form);
      if (!validation.success) throw new Error(firstValidationMessage(validation));

      await apiRequest("/api/loans", {
        token,
        method: "POST",
        body: { ...form, farmId }
      });

      setForm({
        amount: "",
        purpose: "",
        crop: "",
        landArea: "",
        landUnit: "acre",
        tenureMonths: "12",
        farmerNote: ""
      });
      setMessage("Loan application submitted for admin review.");
      await onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="work-surface">
      <section className="form-card">
        <div className="section-heading">
          <span className="eyebrow">Loan support</span>
          <h2>Apply for a crop loan</h2>
        </div>
        {error && <p className="error-banner">{error}</p>}
        {message && <p className="success-banner">{message}</p>}

        <form className="analysis-form" onSubmit={submitLoan}>
          <div className="form-grid">
            <label>
              Amount
              <span className="input-shell">
                <HandCoins size={17} />
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={form.amount}
                  onChange={(event) => updateField("amount", event.target.value)}
                  required
                />
              </span>
            </label>
            <label>
              Tenure
              <span className="input-shell">
                <Clock3 size={17} />
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={form.tenureMonths}
                  onChange={(event) => updateField("tenureMonths", event.target.value)}
                  required
                />
              </span>
            </label>
            <label>
              Purpose
              <input
                value={form.purpose}
                onChange={(event) => updateField("purpose", event.target.value)}
                placeholder="Seeds, fertilizer, equipment"
                required
              />
            </label>
            <label>
              Crop
              <span className="input-shell">
                <Wheat size={17} />
                <input value={form.crop} onChange={(event) => updateField("crop", event.target.value)} />
              </span>
            </label>
            <label>
              Land area
              <span className="input-shell split-input">
                <Ruler size={17} />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.landArea}
                  onChange={(event) => updateField("landArea", event.target.value)}
                />
                <select value={form.landUnit} onChange={(event) => updateField("landUnit", event.target.value)}>
                  <option value="acre">Acre</option>
                  <option value="hectare">Hectare</option>
                  <option value="bigha">Bigha</option>
                </select>
              </span>
            </label>
          </div>

          <label>
            Farmer note
            <textarea
              value={form.farmerNote}
              onChange={(event) => updateField("farmerNote", event.target.value)}
              rows={3}
              placeholder="Optional repayment context or requested support"
            />
          </label>

          <button className="primary-button" disabled={busy}>
            <HandCoins size={18} />
            {busy ? "Submitting" : "Submit loan request"}
          </button>
        </form>
      </section>

      <LoanList loans={loans} />
    </div>
  );
}

function LoanList({ loans }) {
  if (!loans.length) {
    return (
      <div className="empty-state">
        <HandCoins size={36} />
        <h3>No loan requests</h3>
        <p>Submitted loan applications will appear here with admin decisions.</p>
      </div>
    );
  }

  return (
    <section className="loan-list" aria-label="Loan applications">
      {loans.map((loan) => (
        <LoanCard key={loan.id} loan={loan} />
      ))}
    </section>
  );
}

function LoanCard({ loan, adminMode = false, onDecision }) {
  const [adminNote, setAdminNote] = useState(loan.adminNote || "");
  const [busy, setBusy] = useState(false);

  async function decide(status) {
    if (!onDecision) return;
    setBusy(true);
    try {
      await onDecision(loan.id, status, adminNote);
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="loan-card">
      <div className="loan-card-header">
        <div>
          <span>{formatDate(loan.createdAt)}</span>
          <h3>{formatMoney(loan.amount)}</h3>
        </div>
        <span className={`status-badge ${loan.status}`}>{titleCase(loan.status)}</span>
      </div>

      <p>{loan.purpose}</p>
      <div className="analysis-tags">
        <span>{loan.tenureMonths} months</span>
        <span>{loan.crop || "Crop not set"}</span>
        <span>{loan.landArea ? `${loan.landArea} ${loan.landUnit}` : "Land not set"}</span>
        {adminMode && <span>{loan.farmerName}</span>}
        {!adminMode && loan.farmName && <span>{loan.farmName}</span>}
      </div>

      {loan.farmerNote && <p className="loan-note">{loan.farmerNote}</p>}
      {loan.adminNote && <p className="loan-note admin-note">{loan.adminNote}</p>}

      {adminMode && (
        <div className="loan-actions">
          <textarea
            value={adminNote}
            onChange={(event) => setAdminNote(event.target.value)}
            rows={2}
            placeholder="Admin note"
          />
          <div className="action-row">
            <button className="secondary-button" disabled={busy} onClick={() => decide("approved")}>
              <CheckCircle2 size={16} />
              Approve
            </button>
            <button className="danger-button" disabled={busy} onClick={() => decide("rejected")}>
              <UserX size={16} />
              Reject
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

function InsurancePanel({ token, farmId, insurance, onChanged }) {
  const [form, setForm] = useState({
    crop: "",
    landArea: "",
    landUnit: "acre",
    season: "",
    location: "",
    coverageAmount: "",
    damageType: "drought",
    farmerNote: ""
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submitInsurance(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const validation = insuranceClientSchema.safeParse(form);
      if (!validation.success) throw new Error(firstValidationMessage(validation));

      await apiRequest("/api/insurance", {
        token,
        method: "POST",
        body: { ...form, farmId }
      });

      setForm({
        crop: "",
        landArea: "",
        landUnit: "acre",
        season: "",
        location: "",
        coverageAmount: "",
        damageType: "drought",
        farmerNote: ""
      });
      setMessage("Insurance application submitted for admin review.");
      await onChanged();
    } catch (err) {
      setError(err.message || "Insurance application failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="work-surface">
      <section className="form-card">
        <div className="section-heading">
          <span className="eyebrow">Crop insurance</span>
          <h2>Apply for crop cover</h2>
        </div>
        {error && <p className="error-banner">{error}</p>}
        {message && <p className="success-banner">{message}</p>}

        <form className="analysis-form" onSubmit={submitInsurance}>
          <div className="form-grid">
            <label>
              Crop
              <input value={form.crop} onChange={(event) => updateField("crop", event.target.value)} required />
            </label>
            <label>
              Coverage amount
              <span className="input-shell">
                <ShieldCheck size={17} />
                <input type="number" min="1000" step="500" value={form.coverageAmount} onChange={(event) => updateField("coverageAmount", event.target.value)} required />
              </span>
            </label>
            <label>
              Damage type
              <select value={form.damageType} onChange={(event) => updateField("damageType", event.target.value)}>
                <option value="drought">Drought</option>
                <option value="flood">Flood</option>
                <option value="pest">Pest</option>
                <option value="disease">Disease</option>
                <option value="hail">Hail</option>
                <option value="fire">Fire</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label>
              Season
              <input value={form.season} onChange={(event) => updateField("season", event.target.value)} placeholder="Kharif 2026" />
            </label>
            <label>
              Land area
              <span className="input-shell split-input">
                <Ruler size={17} />
                <input type="number" min="0" step="0.01" value={form.landArea} onChange={(event) => updateField("landArea", event.target.value)} />
                <select value={form.landUnit} onChange={(event) => updateField("landUnit", event.target.value)}>
                  <option value="acre">Acre</option>
                  <option value="hectare">Hectare</option>
                  <option value="bigha">Bigha</option>
                </select>
              </span>
            </label>
            <label>
              Location
              <input value={form.location} onChange={(event) => updateField("location", event.target.value)} placeholder="Village or district" />
            </label>
          </div>
          <label>
            Farmer note
            <textarea value={form.farmerNote} onChange={(event) => updateField("farmerNote", event.target.value)} rows={3} placeholder="Loss details or insurance reason" />
          </label>
          <button className="primary-button" disabled={busy}>
            <ShieldCheck size={18} />
            {busy ? "Submitting" : "Submit insurance"}
          </button>
        </form>
      </section>

      <InsuranceList insurance={insurance} />
    </div>
  );
}

function InsuranceList({ insurance, adminMode = false, onDecision }) {
  if (!insurance.length) {
    return (
      <div className="empty-state">
        <ShieldCheck size={36} />
        <h3>No insurance applications</h3>
        <p>Crop insurance requests and decisions will appear here.</p>
      </div>
    );
  }

  return (
    <section className="loan-list" aria-label="Insurance applications">
      {insurance.map((item) => (
        <InsuranceCard key={item.id} insurance={item} adminMode={adminMode} onDecision={onDecision} />
      ))}
    </section>
  );
}

function InsuranceCard({ insurance, adminMode = false, onDecision }) {
  const [adminNote, setAdminNote] = useState(insurance.adminNote || "");
  const [busy, setBusy] = useState(false);

  async function decide(status) {
    if (!onDecision) return;
    setBusy(true);
    try {
      await onDecision(insurance.id, status, adminNote);
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="loan-card">
      <div className="loan-card-header">
        <div>
          <span>{formatDate(insurance.createdAt)}</span>
          <h3>{formatMoney(insurance.coverageAmount)}</h3>
        </div>
        <span className={`status-badge ${insurance.status}`}>{titleCase(insurance.status)}</span>
      </div>
      <p>{insurance.crop} cover for {titleCase(insurance.damageType || "other")} risk</p>
      <div className="analysis-tags">
        <span>{insurance.landArea ? `${insurance.landArea} ${insurance.landUnit}` : "Land not set"}</span>
        <span>{insurance.season || "Season not set"}</span>
        <span>{insurance.location || "Location not set"}</span>
        {adminMode && <span>{insurance.farmerName}</span>}
        {!adminMode && insurance.farmName && <span>{insurance.farmName}</span>}
      </div>
      {insurance.farmerNote && <p className="loan-note">{insurance.farmerNote}</p>}
      {insurance.adminNote && <p className="loan-note admin-note">{insurance.adminNote}</p>}

      {adminMode && (
        <div className="loan-actions">
          <textarea value={adminNote} onChange={(event) => setAdminNote(event.target.value)} rows={2} placeholder="Admin note" />
          <div className="action-row">
            <button className="secondary-button" disabled={busy} onClick={() => decide("approved")}>
              <CheckCircle2 size={16} />
              Approve
            </button>
            <button className="danger-button" disabled={busy} onClick={() => decide("rejected")}>
              <UserX size={16} />
              Reject
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

function PasswordPanel({ token }) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submitPassword(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const validation = passwordClientSchema.safeParse(form);
      if (!validation.success) throw new Error(firstValidationMessage(validation));

      await apiRequest("/api/auth/password", {
        token,
        method: "PATCH",
        body: {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword
        }
      });

      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage("Password changed successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="form-card account-panel">
      <div className="section-heading">
        <span className="eyebrow">Account security</span>
        <h2>Change password</h2>
      </div>
      {error && <p className="error-banner">{error}</p>}
      {message && <p className="success-banner">{message}</p>}

      <form className="stack-form" onSubmit={submitPassword}>
        <label>
          Current password
          <span className="input-shell">
            <Lock size={17} />
            <input
              type="password"
              value={form.currentPassword}
              onChange={(event) => updateField("currentPassword", event.target.value)}
              required
            />
          </span>
        </label>
        <label>
          New password
          <span className="input-shell">
            <KeyRound size={17} />
            <input
              type="password"
              minLength={8}
              value={form.newPassword}
              onChange={(event) => updateField("newPassword", event.target.value)}
              required
            />
          </span>
        </label>
        <label>
          Confirm new password
          <span className="input-shell">
            <KeyRound size={17} />
            <input
              type="password"
              minLength={8}
              value={form.confirmPassword}
              onChange={(event) => updateField("confirmPassword", event.target.value)}
              required
            />
          </span>
        </label>
        <button className="primary-button" disabled={busy}>
          <KeyRound size={18} />
          {busy ? "Updating" : "Update password"}
        </button>
      </form>
    </section>
  );
}

function AnalysisHistory({ analyses, loading }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [soilFilter, setSoilFilter] = useState("all");
  const soilOptions = useMemo(
    () => [...new Set(analyses.map((analysis) => analysis.result?.soilType).filter(Boolean))].sort(),
    [analyses]
  );
  const filteredAnalyses = useMemo(() => {
    const search = query.trim().toLowerCase();
    return analyses.filter((analysis) => {
      const matchesStatus = statusFilter === "all" || analysis.status === statusFilter;
      const matchesSoil = soilFilter === "all" || analysis.result?.soilType === soilFilter;
      const haystack = [
        analysis.result?.soilType,
        analysis.result?.summary,
        analysis.input?.crop,
        analysis.input?.location,
        analysis.result?.riskLevel
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesStatus && matchesSoil && (!search || haystack.includes(search));
    });
  }, [analyses, query, statusFilter, soilFilter]);

  if (loading) return <div className="empty-state"><RefreshCw size={34} /><h3>Loading reports</h3></div>;
  if (!analyses.length) return <div className="empty-state"><ClipboardList size={34} /><h3>No reports yet</h3><p>Submit a field report to start history.</p></div>;

  return (
    <>
      <section className="history-toolbar">
        <label>
          Search
          <span className="input-shell">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Soil, crop, risk, location" />
          </span>
        </label>
        <label>
          Status
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="follow_up">Follow up</option>
          </select>
        </label>
        <label>
          Soil
          <select value={soilFilter} onChange={(event) => setSoilFilter(event.target.value)}>
            <option value="all">All</option>
            {soilOptions.map((soil) => (
              <option key={soil} value={soil}>
                {soil}
              </option>
            ))}
          </select>
        </label>
        <button className="secondary-button" disabled={!filteredAnalyses.length} onClick={() => exportAnalysesCsv(filteredAnalyses)}>
          <Download size={17} />
          Export CSV
        </button>
      </section>

      {filteredAnalyses.length ? (
        <div className="history-list">
          {filteredAnalyses.map((analysis) => (
            <AnalysisCard key={analysis.id} analysis={analysis} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={34} />
          <h3>No matching reports</h3>
        </div>
      )}
    </>
  );
}

function AnalysisCard({ analysis, adminMode = false, onStatusChange }) {
  return (
    <article className="analysis-card">
      {analysis.photoUrl ? <img src={analysis.photoUrl} alt="Submitted soil" /> : <div className="photo-placeholder"><ImageIcon size={24} /></div>}
      <div className="analysis-main">
        <div className="analysis-title">
          <div>
            <span>{formatDate(analysis.createdAt)}</span>
            <h3>{analysis.result.soilType}</h3>
          </div>
          <span className={`status-badge ${analysis.status}`}>{titleCase(analysis.status)}</span>
        </div>
        <p>{analysis.result.summary}</p>
        <div className="analysis-tags">
          <span>{analysis.input.crop || "Crop not set"}</span>
          <span>{analysis.input.landArea} {analysis.input.landUnit}</span>
          <span>{analysis.result.healthScore} health</span>
          {adminMode && <span>{analysis.farmerName}</span>}
          {!adminMode && analysis.farmName && <span>{analysis.farmName}</span>}
        </div>
        <div className="analysis-actions">
          <button className="small-button" onClick={() => printAnalysisReport(analysis)}>
            <Download size={15} />
            Save PDF
          </button>
        </div>
        {adminMode && (
          <div className="admin-inline">
            <select value={analysis.status} onChange={(event) => onStatusChange(analysis.id, event.target.value)}>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="follow_up">Follow up</option>
            </select>
          </div>
        )}
      </div>
    </article>
  );
}

function AdminUserRow({ user, onStatusChange, onPasswordReset, onRemove }) {
  const [password, setPassword] = useState("");
  const [busyAction, setBusyAction] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const isFarmer = user.role === "farmer";

  async function runAction(action, task) {
    setBusyAction(action);
    setError("");
    setMessage("");
    try {
      await task();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyAction("");
    }
  }

  async function handlePasswordReset(event) {
    event.preventDefault();
    const validation = adminPasswordClientSchema.safeParse({ password });
    if (!validation.success) {
      setError(firstValidationMessage(validation));
      return;
    }

    await runAction("password", async () => {
      await onPasswordReset(user.id, password);
      setPassword("");
      setMessage("Password reset");
    });
  }

  function handleRemove() {
    const confirmed = window.confirm(`Remove ${user.name}? Their reports and loan applications will also be removed.`);
    if (!confirmed) return;
    runAction("remove", () => onRemove(user.id));
  }

  return (
    <tr>
      <td>
        <strong>{user.name}</strong>
        {(message || error) && <span className={error ? "row-error" : "row-message"}>{error || message}</span>}
      </td>
      <td>{user.email}</td>
      <td>{titleCase(user.role)}</td>
      <td>
        <span className={`status-badge ${user.isActive ? "active-account" : "banned-account"}`}>
          {user.isActive ? "Active" : "Banned"}
        </span>
      </td>
      <td>{user.farmName || "-"}</td>
      <td>{user.analysisCount}</td>
      <td>{user.diseaseCount || 0}</td>
      <td>{user.loanCount}</td>
      <td>{user.insuranceCount || 0}</td>
      <td>{user.orderCount || 0}</td>
      <td>
        {isFarmer ? (
          <form className="password-reset-row" onSubmit={handlePasswordReset}>
            <input
              type="password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="New password"
            />
            <button className="small-button" disabled={busyAction === "password"}>
              <KeyRound size={15} />
              Reset
            </button>
          </form>
        ) : (
          "-"
        )}
      </td>
      <td>
        {isFarmer ? (
          <div className="table-actions">
            <button
              className="small-button"
              disabled={Boolean(busyAction)}
              onClick={() => runAction("status", () => onStatusChange(user.id, !user.isActive))}
            >
              {user.isActive ? <Ban size={15} /> : <ShieldCheck size={15} />}
              {user.isActive ? "Ban" : "Unban"}
            </button>
            <button className="small-danger-button" disabled={Boolean(busyAction)} onClick={handleRemove}>
              <Trash2 size={15} />
              Remove
            </button>
          </div>
        ) : (
          "-"
        )}
      </td>
    </tr>
  );
}

function AdminDashboard({ token }) {
  const [tab, setTab] = useState("reports");
  const [analyses, setAnalyses] = useState([]);
  const [insurance, setInsurance] = useState([]);
  const [loans, setLoans] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadAdminData() {
    setLoading(true);
    const [analysisData, loanData, insuranceData, userData, orderData, statsData] = await Promise.all([
      apiRequest("/api/analyses", { token }),
      apiRequest("/api/loans", { token }),
      apiRequest("/api/insurance", { token }),
      apiRequest("/api/admin/users", { token }),
      apiRequest("/api/admin/orders", { token }),
      apiRequest("/api/admin/stats", { token })
    ]);
    setAnalyses(analysisData.analyses);
    setLoans(loanData.loans);
    setInsurance(insuranceData.insurance);
    setUsers(userData.users);
    setOrders(orderData.orders);
    setStats(statsData.stats);
    setLoading(false);
  }

  useEffect(() => {
    loadAdminData().catch(() => setLoading(false));
  }, []);

  async function updateStatus(id, status) {
    const data = await apiRequest(`/api/admin/analyses/${id}/status`, {
      token,
      method: "PATCH",
      body: { status }
    });
    setAnalyses((current) => current.map((analysis) => (analysis.id === id ? data.analysis : analysis)));
    const statsData = await apiRequest("/api/admin/stats", { token });
    setStats(statsData.stats);
  }

  async function updateLoanStatus(id, status, adminNote) {
    const data = await apiRequest(`/api/admin/loans/${id}/status`, {
      token,
      method: "PATCH",
      body: { status, adminNote }
    });
    setLoans((current) => current.map((loan) => (loan.id === id ? data.loan : loan)));
    const statsData = await apiRequest("/api/admin/stats", { token });
    setStats(statsData.stats);
  }

  async function updateInsuranceStatus(id, status, adminNote) {
    const data = await apiRequest(`/api/insurance/${id}/status`, {
      token,
      method: "PATCH",
      body: { status, adminNote }
    });
    setInsurance((current) => current.map((item) => (item.id === id ? data.insurance : item)));
    const statsData = await apiRequest("/api/admin/stats", { token });
    setStats(statsData.stats);
  }

  async function updateUserStatus(id, isActive) {
    const data = await apiRequest(`/api/admin/users/${id}/status`, {
      token,
      method: "PATCH",
      body: { isActive }
    });
    setUsers((current) => current.map((user) => (user.id === id ? data.user : user)));
  }

  async function updateOrderStatus(id, status) {
    const data = await apiRequest(`/api/admin/orders/${id}/status`, {
      token,
      method: "PATCH",
      body: { status }
    });
    setOrders((current) => current.map((order) => (order.id === id ? data.order : order)));
  }

  async function resetUserPassword(id, password) {
    await apiRequest(`/api/admin/users/${id}/password`, {
      token,
      method: "PATCH",
      body: { password }
    });
  }

  async function removeUser(id) {
    await apiRequest(`/api/admin/users/${id}`, {
      token,
      method: "DELETE"
    });
    setUsers((current) => current.filter((user) => user.id !== id));
    setAnalyses((current) => current.filter((analysis) => analysis.userId !== id));
    setLoans((current) => current.filter((loan) => loan.userId !== id));
    setInsurance((current) => current.filter((item) => item.userId !== id));
    setOrders((current) => current.filter((order) => order.userId !== id));
    const statsData = await apiRequest("/api/admin/stats", { token });
    setStats(statsData.stats);
  }

  const topSoils = useMemo(() => {
    if (!stats?.soilCounts) return [];
    return Object.entries(stats.soilCounts).sort((a, b) => b[1] - a[1]);
  }, [stats]);

  return (
    <div className="admin-layout">
      <section className="admin-hero">
        <div>
          <span className="eyebrow">Operations</span>
          <h1>Admin review dashboard</h1>
        </div>
        <div className="admin-metrics">
          <Metric icon={<Users size={19} />} label="Farmers" value={stats?.farmers ?? 0} />
          <Metric icon={<FlaskConical size={19} />} label="Reports" value={stats?.totalAnalyses ?? 0} />
          <Metric icon={<Clock3 size={19} />} label="Pending" value={stats?.pending ?? 0} />
          <Metric icon={<HandCoins size={19} />} label="Loan queue" value={stats?.pendingLoans ?? 0} />
          <Metric icon={<ShieldCheck size={19} />} label="Insurance queue" value={stats?.pendingInsurance ?? 0} />
          <Metric icon={<ShoppingCart size={19} />} label="Market orders" value={stats?.totalOrders ?? 0} />
        </div>
      </section>

      <div className="segmented-control admin-tabs" role="tablist" aria-label="Admin views">
        <button className={tab === "reports" ? "active" : ""} onClick={() => setTab("reports")}>
          <ClipboardList size={16} />
          Reports
        </button>
        <button className={tab === "loans" ? "active" : ""} onClick={() => setTab("loans")}>
          <HandCoins size={16} />
          Loans
        </button>
        <button className={tab === "insurance" ? "active" : ""} onClick={() => setTab("insurance")}>
          <ShieldCheck size={16} />
          Insurance
        </button>
        <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>
          <ShoppingCart size={16} />
          Orders
        </button>
        <button className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>
          <Users size={16} />
          Users
        </button>
        <button className={tab === "analytics" ? "active" : ""} onClick={() => setTab("analytics")}>
          <BarChart3 size={16} />
          Analytics
        </button>
      </div>

      {loading ? (
        <div className="empty-state">
          <RefreshCw size={34} />
          <h3>Loading admin data</h3>
        </div>
      ) : (
        <>
          {tab === "reports" && (
            <AdminReportsPanel analyses={analyses} onStatusChange={updateStatus} />
          )}

          {tab === "loans" && (
            <div className="loan-list">
              {loans.length ? (
                loans.map((loan) => (
                  <LoanCard key={loan.id} loan={loan} adminMode onDecision={updateLoanStatus} />
                ))
              ) : (
                <div className="empty-state">
                  <HandCoins size={34} />
                  <h3>No loan applications</h3>
                </div>
              )}
            </div>
          )}

          {tab === "insurance" && <InsuranceList insurance={insurance} adminMode onDecision={updateInsuranceStatus} />}

          {tab === "orders" && <AdminOrdersPanel orders={orders} onStatusChange={updateOrderStatus} />}

          {tab === "users" && (
            <>
              <section className="history-toolbar">
                <button className="secondary-button" disabled={!users.length} onClick={() => exportUsersCsv(users)}>
                  <Download size={17} />
                  Export users
                </button>
              </section>
              <div className="table-shell">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Farm</th>
                      <th>Reports</th>
                      <th>Diseases</th>
                      <th>Loans</th>
                      <th>Insurance</th>
                      <th>Orders</th>
                      <th>Password</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <AdminUserRow
                        key={user.id}
                        user={user}
                        onStatusChange={updateUserStatus}
                        onPasswordReset={resetUserPassword}
                        onRemove={removeUser}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === "analytics" && <AdminAnalyticsPanel analyses={analyses} loans={loans} insurance={insurance} orders={orders} topSoils={topSoils} stats={stats} />}
        </>
      )}
    </div>
  );
}

function AdminReportsPanel({ analyses, onStatusChange }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const filteredAnalyses = useMemo(() => {
    const search = query.trim().toLowerCase();
    return analyses.filter((analysis) => {
      const matchesStatus = statusFilter === "all" || analysis.status === statusFilter;
      const matchesRisk = riskFilter === "all" || analysis.result?.riskLevel === riskFilter;
      const haystack = [
        analysis.result?.soilType,
        analysis.result?.summary,
        analysis.input?.crop,
        analysis.input?.location,
        analysis.result?.riskLevel,
        analysis.farmerName,
        analysis.farmName
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesStatus && matchesRisk && (!search || haystack.includes(search));
    });
  }, [analyses, query, statusFilter, riskFilter]);

  if (!analyses.length) {
    return (
      <div className="empty-state">
        <ClipboardList size={34} />
        <h3>No farmer reports</h3>
      </div>
    );
  }

  return (
    <div className="admin-stack">
      <section className="history-toolbar">
        <label>
          Search
          <span className="input-shell">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Farmer, soil, crop, location" />
          </span>
        </label>
        <label>
          Status
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="follow_up">Follow up</option>
          </select>
        </label>
        <label>
          Risk
          <select value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)}>
            <option value="all">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>
        <button className="secondary-button" disabled={!filteredAnalyses.length} onClick={() => exportAnalysesCsv(filteredAnalyses)}>
          <Download size={17} />
          Export reports
        </button>
      </section>
      {filteredAnalyses.length ? (
        <div className="history-list">
          {filteredAnalyses.map((analysis) => (
            <AnalysisCard key={analysis.id} analysis={analysis} adminMode onStatusChange={onStatusChange} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={34} />
          <h3>No matching reports</h3>
        </div>
      )}
    </div>
  );
}

function AdminOrdersPanel({ orders, onStatusChange }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const categories = useMemo(() => [...new Set(orders.map((order) => order.category).filter(Boolean))].sort(), [orders]);
  const filteredOrders = useMemo(() => {
    const search = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || order.category === categoryFilter;
      const haystack = [order.itemName, order.category, order.farmerName, order.farmName, order.farmerEmail, order.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesStatus && matchesCategory && (!search || haystack.includes(search));
    });
  }, [orders, query, statusFilter, categoryFilter]);
  const revenue = filteredOrders.reduce((total, order) => total + Number(order.totalPrice || 0), 0);
  const delivered = filteredOrders.filter((order) => order.status === "delivered").length;

  if (!orders.length) {
    return (
      <div className="empty-state">
        <ShoppingCart size={34} />
        <h3>No market orders</h3>
        <p>Farmer purchases will appear here for fulfilment tracking.</p>
      </div>
    );
  }

  return (
    <div className="admin-stack">
      <section className="metric-row">
        <Metric icon={<ShoppingCart size={19} />} label="Filtered orders" value={filteredOrders.length} />
        <Metric icon={<Wallet size={19} />} label="Order value" value={formatMoney(revenue)} />
        <Metric icon={<CheckCircle2 size={19} />} label="Delivered" value={delivered} />
      </section>
      <section className="history-toolbar">
        <label>
          Search
          <span className="input-shell">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Farmer, item, category" />
          </span>
        </label>
        <label>
          Status
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All</option>
            <option value="confirmed">Confirmed</option>
            <option value="packed">Packed</option>
            <option value="delivered">Delivered</option>
          </select>
        </label>
        <label>
          Category
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <button className="secondary-button" disabled={!filteredOrders.length} onClick={() => exportOrdersCsv(filteredOrders)}>
          <Download size={17} />
          Export orders
        </button>
      </section>
      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Farmer</th>
              <th>Item</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{formatDate(order.createdAt)}</td>
                <td>
                  <strong>{order.farmerName || "Farmer"}</strong>
                  <span className="table-subtext">{order.farmerEmail || order.farmName || "-"}</span>
                </td>
                <td>{order.itemName}</td>
                <td>{order.category}</td>
                <td>{order.quantity} {order.unit}</td>
                <td>{formatMoney(order.totalPrice)}</td>
                <td><span className={`status-badge ${order.status}`}>{titleCase(order.status)}</span></td>
                <td>
                  <select value={order.status} onChange={(event) => onStatusChange(order.id, event.target.value)}>
                    <option value="confirmed">Confirmed</option>
                    <option value="packed">Packed</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!filteredOrders.length && (
        <div className="empty-state">
          <Search size={34} />
          <h3>No matching orders</h3>
        </div>
      )}
    </div>
  );
}

function AdminAnalyticsPanel({ analyses, loans, insurance, orders, topSoils, stats }) {
  const reportStatus = topEntries(analyses.map((analysis) => analysis.status), 4).map(([label, count]) => [titleCase(label), count]);
  const loanStatus = topEntries(loans.map((loan) => loan.status), 4).map(([label, count]) => [titleCase(label), count]);
  const insuranceStatus = topEntries(insurance.map((item) => item.status), 4).map(([label, count]) => [titleCase(label), count]);
  const orderStatus = topEntries(orders.map((order) => order.status), 4).map(([label, count]) => [titleCase(label), count]);
  const riskMix = topEntries(analyses.map((analysis) => analysis.result?.riskLevel), 4);
  const pendingWork = [
    ["Reports to review", analyses.filter((analysis) => analysis.status === "pending").length],
    ["Loan decisions", loans.filter((loan) => loan.status === "pending").length],
    ["Insurance decisions", insurance.filter((item) => item.status === "pending").length],
    ["Orders to deliver", orders.filter((order) => order.status !== "delivered").length]
  ];

  return (
    <div className="analytics-grid">
      <section className="form-card">
        <div className="section-heading compact-heading">
          <span className="eyebrow">Priority queue</span>
          <h2>Admin work left</h2>
        </div>
        <SignalBars entries={pendingWork} emptyLabel="Nothing pending" />
      </section>
      <section className="form-card">
        <div className="section-heading compact-heading">
          <span className="eyebrow">Soil distribution</span>
          <h2>Most common soils</h2>
        </div>
        <SignalBars entries={topSoils} emptyLabel="No soil data yet" />
      </section>
      <section className="form-card">
        <div className="section-heading compact-heading">
          <span className="eyebrow">Report workflow</span>
          <h2>Review status</h2>
        </div>
        <SignalBars entries={reportStatus} emptyLabel="No reports yet" />
      </section>
      <section className="form-card">
        <div className="section-heading compact-heading">
          <span className="eyebrow">Finance</span>
          <h2>Loan decisions</h2>
        </div>
        <SignalBars entries={loanStatus} emptyLabel="No loans yet" />
      </section>
      <section className="form-card">
        <div className="section-heading compact-heading">
          <span className="eyebrow">Protection</span>
          <h2>Insurance decisions</h2>
        </div>
        <SignalBars entries={insuranceStatus} emptyLabel="No insurance yet" />
      </section>
      <section className="form-card">
        <div className="section-heading compact-heading">
          <span className="eyebrow">Market</span>
          <h2>Order fulfilment</h2>
        </div>
        <SignalBars entries={orderStatus} emptyLabel="No market orders yet" />
      </section>
      <section className="form-card">
        <div className="section-heading compact-heading">
          <span className="eyebrow">Risk profile</span>
          <h2>Field risk</h2>
        </div>
        <SignalBars entries={riskMix} emptyLabel="No risk data yet" />
      </section>
      <section className="analytics-summary">
        <Metric icon={<Users size={19} />} label="Farmers" value={stats?.farmers ?? 0} />
        <Metric icon={<ShoppingCart size={19} />} label="Orders" value={stats?.totalOrders ?? 0} />
        <Metric icon={<CheckCircle2 size={19} />} label="Approved loans" value={stats?.approvedLoans ?? 0} />
        <Metric icon={<ShieldCheck size={19} />} label="Insurance" value={stats?.totalInsurance ?? 0} />
      </section>
    </div>
  );
}

export default App;
