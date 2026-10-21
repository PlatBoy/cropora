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
  Cloud,
  CloudRain,
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
  Wind,
  Wheat
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { getIntlLocale, localize, setActiveLocale } from "./i18n.js";

const SESSION_KEY = "cropura-session";
const THEME_KEY = "cropura-theme";
const LANG_KEY = "krishsense-lang";
const LEGACY_LANG_KEY = "cropura-lang";

const LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "hi", label: "HI", name: "हिन्दी" },
  { code: "pa", label: "PA", name: "ਪੰਜਾਬੀ" },
  { code: "bn", label: "BN", name: "বাংলা" },
  { code: "ta", label: "TA", name: "தமிழ்" },
  { code: "te", label: "TE", name: "తెలుగు" },
  { code: "mr", label: "MR", name: "मराठी" },
  { code: "gu", label: "GU", name: "ગુજરાતી" },
  { code: "kn", label: "KN", name: "ಕನ್ನಡ" },
  { code: "ml", label: "ML", name: "മലയാളം" },
  { code: "ur", label: "UR", name: "اردو" },
  { code: "ne", label: "NE", name: "नेपाली" },
  { code: "or", label: "OR", name: "ଓଡ଼ିଆ" },
  { code: "as", label: "AS", name: "অসমীয়া" },
  { code: "es", label: "ES", name: "Español" }
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
const fieldVideos = [
  "https://videos.pexels.com/video-files/10848268/10848268-hd_1280_720_30fps.mp4",
  "https://videos.pexels.com/video-files/5636708/5636708-hd_1280_720_30fps.mp4",
  "https://videos.pexels.com/video-files/4144211/4144211-hd_1280_720_25fps.mp4",
  "https://videos.pexels.com/video-files/9256240/9256240-hd_1280_720_30fps.mp4",
  "https://videos.pexels.com/video-files/9487181/9487181-hd_1280_720_30fps.mp4",
  "https://videos.pexels.com/video-files/13944886/13944886-hd_1280_720_30fps.mp4"
];

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

const farmTaskRecordClientSchema = z.object({
  actualCost: z.coerce.number().min(0).max(100000000),
  harvestQuantity: z.coerce.number().min(0).max(100000000),
  harvestUnit: z.enum(["kg", "quintal", "tonne"]),
  saleProceeds: z.coerce.number().min(0).max(1000000000)
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

const communityClientSchema = z.object({
  authorName: z.string().trim().min(2, "Enter your name.").max(80),
  title: z.string().trim().max(140),
  body: z.string().trim().min(20, "Write at least 20 characters.").max(1800),
  rating: z.coerce.number().int().min(1).max(5),
  website: z.string().max(200)
});

const BLOG_LABELS = {
  en: "Blogs", hi: "ब्लॉग", pa: "ਬਲੌਗ", bn: "ব্লগ", ta: "வலைப்பதிவுகள்", te: "బ్లాగులు",
  mr: "ब्लॉग", gu: "બ્લોગ્સ", kn: "ಬ್ಲಾಗ್‌ಗಳು", ml: "ബ്ലോഗുകൾ", ur: "بلاگز", ne: "ब्लगहरू",
  or: "ବ୍ଲଗ୍", as: "ব্লগ", es: "Blogs"
};

const COMMUNITY_COPY = {
  en: ["Write a review", "Write a blog", "Community stories", "Your name", "Rating", "Blog title", "Your review", "Your story", "Share your experience", "Write from the field", "Submit for review", "An admin checks submissions before they appear on the homepage.", "Loading reviews…", "No reviews yet. Be the first to share your experience.", "No blogs yet. Share a lesson from your farm."],
  hi: ["समीक्षा लिखें", "ब्लॉग लिखें", "समुदाय की कहानियाँ", "आपका नाम", "रेटिंग", "ब्लॉग का शीर्षक", "आपकी समीक्षा", "आपकी कहानी", "अपना अनुभव साझा करें", "खेत से लिखें", "समीक्षा के लिए भेजें", "होमपेज पर दिखने से पहले व्यवस्थापक सामग्री की जाँच करता है।", "समीक्षाएँ लोड हो रही हैं…", "अभी कोई समीक्षा नहीं है। अपना अनुभव साझा करने वाले पहले व्यक्ति बनें।", "अभी कोई ब्लॉग नहीं है। अपने खेत का अनुभव साझा करें।"],
  pa: ["ਸਮੀਖਿਆ ਲਿਖੋ", "ਬਲੌਗ ਲਿਖੋ", "ਭਾਈਚਾਰੇ ਦੀਆਂ ਕਹਾਣੀਆਂ", "ਤੁਹਾਡਾ ਨਾਮ", "ਰੇਟਿੰਗ", "ਬਲੌਗ ਦਾ ਸਿਰਲੇਖ", "ਤੁਹਾਡੀ ਸਮੀਖਿਆ", "ਤੁਹਾਡੀ ਕਹਾਣੀ", "ਆਪਣਾ ਤਜਰਬਾ ਸਾਂਝਾ ਕਰੋ", "ਖੇਤ ਤੋਂ ਲਿਖੋ", "ਸਮੀਖਿਆ ਲਈ ਭੇਜੋ", "ਹੋਮਪੇਜ 'ਤੇ ਦਿਖਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਐਡਮਿਨ ਸਮੱਗਰੀ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ।", "ਸਮੀਖਿਆਵਾਂ ਲੋਡ ਹੋ ਰਹੀਆਂ ਹਨ…", "ਹਾਲੇ ਕੋਈ ਸਮੀਖਿਆ ਨਹੀਂ। ਆਪਣਾ ਤਜਰਬਾ ਸਾਂਝਾ ਕਰਨ ਵਾਲੇ ਪਹਿਲੇ ਬਣੋ।", "ਹਾਲੇ ਕੋਈ ਬਲੌਗ ਨਹੀਂ। ਆਪਣੇ ਖੇਤ ਦਾ ਤਜਰਬਾ ਸਾਂਝਾ ਕਰੋ।"],
  bn: ["রিভিউ লিখুন", "ব্লগ লিখুন", "কমিউনিটির গল্প", "আপনার নাম", "রেটিং", "ব্লগের শিরোনাম", "আপনার রিভিউ", "আপনার গল্প", "আপনার অভিজ্ঞতা জানান", "খেত থেকে লিখুন", "পর্যালোচনার জন্য জমা দিন", "হোমপেজে দেখানোর আগে অ্যাডমিন জমা যাচাই করবেন।", "রিভিউ লোড হচ্ছে…", "এখনও কোনো রিভিউ নেই। আপনার অভিজ্ঞতা প্রথমে জানান।", "এখনও কোনো ব্লগ নেই। খামারের অভিজ্ঞতা লিখুন।"],
  ta: ["மதிப்பாய்வு எழுதுங்கள்", "வலைப்பதிவு எழுதுங்கள்", "சமூகக் கதைகள்", "உங்கள் பெயர்", "மதிப்பீடு", "வலைப்பதிவின் தலைப்பு", "உங்கள் மதிப்பாய்வு", "உங்கள் கதை", "உங்கள் அனுபவத்தைப் பகிருங்கள்", "வயலிலிருந்து எழுதுங்கள்", "மதிப்பாய்வுக்கு சமர்ப்பிக்கவும்", "முகப்புப் பக்கத்தில் காட்டுவதற்கு முன் நிர்வாகி சமர்ப்பிப்பைச் சரிபார்ப்பார்.", "மதிப்பாய்வுகள் ஏற்றப்படுகின்றன…", "மதிப்பாய்வுகள் இன்னும் இல்லை. உங்கள் அனுபவத்தை முதலில் பகிருங்கள்.", "வலைப்பதிவுகள் இன்னும் இல்லை. உங்கள் பண்ணை அனுபவத்தைப் பகிருங்கள்."],
  te: ["సమీక్ష రాయండి", "బ్లాగ్ రాయండి", "సమాజ కథలు", "మీ పేరు", "రేటింగ్", "బ్లాగ్ శీర్షిక", "మీ సమీక్ష", "మీ కథ", "మీ అనుభవాన్ని పంచుకోండి", "పొలం నుంచి రాయండి", "సమీక్ష కోసం పంపండి", "హోమ్‌పేజీలో చూపే ముందు నిర్వాహకుడు సమర్పణలను పరిశీలిస్తారు.", "సమీక్షలు లోడ్ అవుతున్నాయి…", "ఇంకా సమీక్షలు లేవు. మీ అనుభవాన్ని ముందుగా పంచుకోండి.", "ఇంకా బ్లాగులు లేవు. మీ పొలం అనుభవాన్ని పంచుకోండి."],
  mr: ["अभिप्राय लिहा", "ब्लॉग लिहा", "समुदायाच्या गोष्टी", "तुमचे नाव", "रेटिंग", "ब्लॉगचे शीर्षक", "तुमचा अभिप्राय", "तुमची गोष्ट", "तुमचा अनुभव शेअर करा", "शेतातून लिहा", "पुनरावलोकनासाठी पाठवा", "मुख्यपृष्ठावर दिसण्यापूर्वी प्रशासक सबमिशन तपासतो.", "अभिप्राय लोड होत आहेत…", "अजून अभिप्राय नाहीत. तुमचा अनुभव आधी शेअर करा.", "अजून ब्लॉग नाहीत. शेतातील अनुभव सांगा."],
  gu: ["સમીક્ષા લખો", "બ્લોગ લખો", "સમુદાયની વાતો", "તમારું નામ", "રેટિંગ", "બ્લોગનું શીર્ષક", "તમારી સમીક્ષા", "તમારી વાત", "તમારો અનુભવ શેર કરો", "ખેતરમાંથી લખો", "સમીક્ષા માટે મોકલો", "હોમપેજ પર દેખાય તે પહેલાં સંચાલક સબમિશન તપાસે છે.", "સમીક્ષાઓ લોડ થઈ રહી છે…", "હજી કોઈ સમીક્ષા નથી. તમારો અનુભવ પહેલા શેર કરો.", "હજી કોઈ બ્લોગ નથી. તમારા ખેતરની વાત શેર કરો."],
  kn: ["ವಿಮರ್ಶೆ ಬರೆಯಿರಿ", "ಬ್ಲಾಗ್ ಬರೆಯಿರಿ", "ಸಮುದಾಯದ ಕಥೆಗಳು", "ನಿಮ್ಮ ಹೆಸರು", "ರೇಟಿಂಗ್", "ಬ್ಲಾಗ್ ಶೀರ್ಷಿಕೆ", "ನಿಮ್ಮ ವಿಮರ್ಶೆ", "ನಿಮ್ಮ ಕಥೆ", "ನಿಮ್ಮ ಅನುಭವ ಹಂಚಿಕೊಳ್ಳಿ", "ಹೊಲದಿಂದ ಬರೆಯಿರಿ", "ಪರಿಶೀಲನೆಗೆ ಸಲ್ಲಿಸಿ", "ಮುಖಪುಟದಲ್ಲಿ ಕಾಣಿಸುವ ಮೊದಲು ನಿರ್ವಾಹಕರು ಸಲ್ಲಿಕೆಯನ್ನು ಪರಿಶೀಲಿಸುತ್ತಾರೆ.", "ವಿಮರ್ಶೆಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ…", "ಇನ್ನೂ ವಿಮರ್ಶೆಗಳಿಲ್ಲ. ನಿಮ್ಮ ಅನುಭವವನ್ನು ಮೊದಲು ಹಂಚಿಕೊಳ್ಳಿ.", "ಇನ್ನೂ ಬ್ಲಾಗ್‌ಗಳಿಲ್ಲ. ನಿಮ್ಮ ಹೊಲದ ಅನುಭವ ಹಂಚಿಕೊಳ್ಳಿ."],
  ml: ["അവലോകനം എഴുതുക", "ബ്ലോഗ് എഴുതുക", "കമ്മ്യൂണിറ്റി കഥകൾ", "നിങ്ങളുടെ പേര്", "റേറ്റിംഗ്", "ബ്ലോഗ് തലക്കെട്ട്", "നിങ്ങളുടെ അവലോകനം", "നിങ്ങളുടെ കഥ", "നിങ്ങളുടെ അനുഭവം പങ്കിടുക", "കൃഷിയിടത്തിൽ നിന്ന് എഴുതുക", "പരിശോധനയ്ക്ക് സമർപ്പിക്കുക", "ഹോംപേജിൽ പ്രസിദ്ധീകരിക്കുന്നതിന് മുമ്പ് അഡ്മിൻ സമർപ്പണം പരിശോധിക്കും.", "അവലോകനങ്ങൾ ലോഡ് ചെയ്യുന്നു…", "അവലോകനങ്ങളൊന്നുമില്ല. നിങ്ങളുടെ അനുഭവം ആദ്യം പങ്കിടൂ.", "ബ്ലോഗുകളൊന്നുമില്ല. നിങ്ങളുടെ കൃഷിയിടത്തിലെ അനുഭവം പങ്കിടൂ."],
  ur: ["جائزہ لکھیں", "بلاگ لکھیں", "کمیونٹی کی کہانیاں", "آپ کا نام", "درجہ بندی", "بلاگ کا عنوان", "آپ کا جائزہ", "آپ کی کہانی", "اپنا تجربہ شیئر کریں", "کھیت سے لکھیں", "جائزے کے لیے جمع کریں", "ہوم پیج پر دکھانے سے پہلے منتظم مواد کی جانچ کرے گا۔", "جائزے لوڈ ہو رہے ہیں…", "ابھی کوئی جائزہ نہیں۔ اپنا تجربہ پہلے شیئر کریں۔", "ابھی کوئی بلاگ نہیں۔ اپنے کھیت کا تجربہ لکھیں۔"],
  ne: ["समीक्षा लेख्नुहोस्", "ब्लग लेख्नुहोस्", "समुदायका कथाहरू", "तपाईंको नाम", "रेटिङ", "ब्लग शीर्षक", "तपाईंको समीक्षा", "तपाईंको कथा", "आफ्नो अनुभव साझा गर्नुहोस्", "खेतबाट लेख्नुहोस्", "समीक्षाका लागि पठाउनुहोस्", "गृहपृष्ठमा देखाउनुअघि प्रशासकले सामग्री जाँच गर्छन्।", "समीक्षाहरू लोड हुँदैछन्…", "अहिलेसम्म समीक्षा छैन। आफ्नो अनुभव पहिले साझा गर्नुहोस्।", "अहिलेसम्म ब्लग छैन। खेतको अनुभव लेख्नुहोस्।"],
  or: ["ସମୀକ୍ଷା ଲେଖନ୍ତୁ", "ବ୍ଲଗ୍ ଲେଖନ୍ତୁ", "ସମ୍ପ୍ରଦାୟର କାହାଣୀ", "ଆପଣଙ୍କ ନାମ", "ରେଟିଂ", "ବ୍ଲଗ୍ ଶୀର୍ଷକ", "ଆପଣଙ୍କ ସମୀକ୍ଷା", "ଆପଣଙ୍କ କାହାଣୀ", "ଆପଣଙ୍କ ଅନୁଭୂତି ବାଣ୍ଟନ୍ତୁ", "କ୍ଷେତରୁ ଲେଖନ୍ତୁ", "ସମୀକ୍ଷା ପାଇଁ ଦାଖଲ କରନ୍ତୁ", "ମୁଖ୍ୟ ପୃଷ୍ଠାରେ ଦେଖାଇବା ପୂର୍ବରୁ ପ୍ରଶାସକ ଯାଞ୍ଚ କରିବେ।", "ସମୀକ୍ଷା ଲୋଡ୍ ହେଉଛି…", "ଏପର୍ଯ୍ୟନ୍ତ ସମୀକ୍ଷା ନାହିଁ। ଆପଣଙ୍କ ଅନୁଭୂତି ପ୍ରଥମେ ବାଣ୍ଟନ୍ତୁ।", "ଏପର୍ଯ୍ୟନ୍ତ ବ୍ଲଗ୍ ନାହିଁ। ଆପଣଙ୍କ ଚାଷ ଅନୁଭୂତି ବାଣ୍ଟନ୍ତୁ।"],
  as: ["পৰ্যালোচনা লিখক", "ব্লগ লিখক", "সমাজৰ কাহিনী", "আপোনাৰ নাম", "ৰেটিং", "ব্লগৰ শিৰোনাম", "আপোনাৰ পৰ্যালোচনা", "আপোনাৰ কাহিনী", "আপোনাৰ অভিজ্ঞতা ভাগ-বতৰা কৰক", "খেতিৰ পৰা লিখক", "পৰ্যালোচনাৰ বাবে জমা দিয়ক", "হোমপেজত দেখুওৱাৰ আগতে প্ৰশাসকে জমা পৰীক্ষা কৰিব।", "পৰ্যালোচনা লোড হৈছে…", "এতিয়াও কোনো পৰ্যালোচনা নাই। আপোনাৰ অভিজ্ঞতা প্ৰথমে ভাগ-বতৰা কৰক।", "এতিয়াও কোনো ব্লগ নাই। খেতিৰ অভিজ্ঞতা লিখক।"],
  es: ["Escribir una reseña", "Escribir un blog", "Historias de la comunidad", "Tu nombre", "Valoración", "Título del blog", "Tu reseña", "Tu historia", "Comparte tu experiencia", "Escribe desde el campo", "Enviar para revisión", "Un administrador revisa los envíos antes de publicarlos en la página de inicio.", "Cargando reseñas…", "Aún no hay reseñas. Comparte tu experiencia primero.", "Aún no hay blogs. Comparte una experiencia de tu finca."]
};

function communityText(language, index) {
  return (COMMUNITY_COPY[language] || COMMUNITY_COPY.en)[index];
}

const COMMUNITY_SUCCESS = {
  en: "Thanks. Your submission is awaiting admin review.", hi: "धन्यवाद। आपकी सामग्री व्यवस्थापक की समीक्षा की प्रतीक्षा में है।",
  pa: "ਧੰਨਵਾਦ। ਤੁਹਾਡੀ ਸਮੱਗਰੀ ਐਡਮਿਨ ਦੀ ਸਮੀਖਿਆ ਦੀ ਉਡੀਕ ਕਰ ਰਹੀ ਹੈ।", bn: "ধন্যবাদ। আপনার লেখা অ্যাডমিনের পর্যালোচনার অপেক্ষায় আছে।",
  ta: "நன்றி. உங்கள் பதிவு நிர்வாகியின் மதிப்பாய்வுக்காக காத்திருக்கிறது.", te: "ధన్యవాదాలు. మీ సమర్పణ నిర్వాహకుడి సమీక్ష కోసం వేచి ఉంది.",
  mr: "धन्यवाद. तुमची नोंद प्रशासकाच्या तपासणीच्या प्रतीक्षेत आहे.", gu: "આભાર. તમારી રજૂઆત સંચાલકની સમીક્ષા માટે રાહ જોઈ રહી છે.",
  kn: "ಧನ್ಯವಾದಗಳು. ನಿಮ್ಮ ಸಲ್ಲಿಕೆ ನಿರ್ವಾಹಕರ ಪರಿಶೀಲನೆಗಾಗಿ ಕಾಯುತ್ತಿದೆ.", ml: "നന്ദി. നിങ്ങളുടെ സമർപ്പണം അഡ്മിൻ പരിശോധനയ്ക്കായി കാത്തിരിക്കുന്നു.",
  ur: "شکریہ۔ آپ کی تحریر منتظم کے جائزے کی منتظر ہے۔", ne: "धन्यवाद। तपाईंको सामग्री प्रशासकको समीक्षाको प्रतीक्षामा छ।",
  or: "ଧନ୍ୟବାଦ। ଆପଣଙ୍କ ଲେଖା ପ୍ରଶାସକଙ୍କ ସମୀକ୍ଷାକୁ ଅପେକ୍ଷା କରୁଛି।", as: "ধন্যবাদ। আপোনাৰ লেখা প্ৰশাসকৰ পৰ্যালোচনাৰ বাবে অপেক্ষা কৰি আছে।",
  es: "Gracias. Tu envío está pendiente de revisión por parte del administrador."
};

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
  return new Intl.DateTimeFormat(getIntlLocale(), {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatDay(value) {
  return new Intl.DateTimeFormat(getIntlLocale(), {
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
  return new Intl.NumberFormat(getIntlLocale(), {
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
const ABOUT_COPY = {
  en: ["About Krishisense", "Better decisions begin with the soil.", "Krishisense brings soil insights, crop health checks, and farm planning together, helping farmers choose a clearer next step."],
  hi: ["कृषिसेंस के बारे में", "बेहतर फैसले मिट्टी को समझने से शुरू होते हैं।", "Krishisense मिट्टी की जानकारी, फसल स्वास्थ्य जाँच और खेत की योजना को एक जगह लाता है, ताकि किसान अगला कदम सोच-समझकर चुन सकें।"],
  pa: ["Krishisense ਬਾਰੇ", "ਚੰਗੇ ਫੈਸਲੇ ਮਿੱਟੀ ਨੂੰ ਸਮਝਣ ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦੇ ਹਨ।", "Krishisense ਮਿੱਟੀ ਦੀ ਜਾਣਕਾਰੀ, ਫ਼ਸਲ ਦੀ ਸਿਹਤ ਜਾਂਚ ਅਤੇ ਖੇਤ ਦੀ ਯੋਜਨਾ ਇਕੱਠੇ ਕਰਦਾ ਹੈ, ਤਾਂ ਜੋ ਕਿਸਾਨ ਅਗਲਾ ਕਦਮ ਸੋਚ-ਸਮਝ ਕੇ ਚੁਣ ਸਕਣ।"],
  bn: ["Krishisense সম্পর্কে", "ভালো সিদ্ধান্ত মাটি বোঝা থেকেই শুরু হয়।", "Krishisense মাটির তথ্য, ফসলের স্বাস্থ্য পরীক্ষা এবং খামারের পরিকল্পনাকে একসঙ্গে আনে, যাতে কৃষকেরা পরের পদক্ষেপটি বুঝে নিতে পারেন।"],
  ta: ["Krishisense பற்றி", "சிறந்த முடிவுகள் மண்ணைப் புரிந்துகொள்வதில் தொடங்குகின்றன.", "Krishisense மண் தகவல், பயிர் ஆரோக்கியச் சோதனை, பண்ணைத் திட்டமிடல் ஆகியவற்றை ஒன்றிணைத்து, அடுத்த படியைத் தெளிவாகத் தேர்ந்தெடுக்க உதவுகிறது."],
  te: ["Krishisense గురించి", "మంచి నిర్ణయాలు నేలను అర్థం చేసుకోవడంతో ప్రారంభమవుతాయి.", "Krishisense నేల సమాచారం, పంట ఆరోగ్య తనిఖీలు, పొలం ప్రణాళికను ఒకచోట చేర్చి, రైతులు తదుపరి అడుగును స్పష్టంగా ఎంచుకోవడంలో సహాయపడుతుంది."],
  mr: ["Krishisense बद्दल", "चांगले निर्णय माती समजून घेण्यापासून सुरू होतात.", "Krishisense मातीची माहिती, पिकांच्या आरोग्याची तपासणी आणि शेताचे नियोजन एकत्र आणते, ज्यामुळे शेतकऱ्यांना पुढचे पाऊल स्पष्टपणे ठरवता येते."],
  gu: ["Krishisense વિશે", "સારા નિર્ણયો માટીને સમજવાથી શરૂ થાય છે.", "Krishisense માટીની માહિતી, પાકના આરોગ્યની તપાસ અને ખેતરનું આયોજન એકસાથે આપે છે, જેથી ખેડૂતો આગળનું પગલું વધુ સ્પષ્ટ રીતે પસંદ કરી શકે."],
  kn: ["Krishisense ಬಗ್ಗೆ", "ಉತ್ತಮ ನಿರ್ಧಾರಗಳು ಮಣ್ಣನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದರಿಂದ ಆರಂಭವಾಗುತ್ತವೆ.", "Krishisense ಮಣ್ಣಿನ ಮಾಹಿತಿ, ಬೆಳೆ ಆರೋಗ್ಯ ಪರಿಶೀಲನೆ ಮತ್ತು ಕೃಷಿ ಯೋಜನೆಯನ್ನು ಒಟ್ಟುಗೂಡಿಸಿ, ರೈತರಿಗೆ ಮುಂದಿನ ಹೆಜ್ಜೆಯನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಆಯ್ಕೆ ಮಾಡಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ."],
  ml: ["Krishisense-നെക്കുറിച്ച്", "നല്ല തീരുമാനങ്ങൾ മണ്ണിനെ മനസ്സിലാക്കുന്നതിൽ തുടങ്ങുന്നു.", "Krishisense മണ്ണിന്റെ വിവരങ്ങൾ, വിളയുടെ ആരോഗ്യ പരിശോധന, കൃഷിയിട ആസൂത്രണം എന്നിവ ഒരുമിച്ച് നൽകുന്നു; അടുത്ത നടപടി വ്യക്തമായി തിരഞ്ഞെടുക്കാൻ ഇത് കർഷകരെ സഹായിക്കുന്നു."],
  ur: ["Krishisense کے بارے میں", "بہتر فیصلے مٹی کو سمجھنے سے شروع ہوتے ہیں۔", "Krishisense مٹی کی معلومات، فصل کی صحت کی جانچ اور کھیت کی منصوبہ بندی کو یکجا کرتا ہے، تاکہ کسان اگلا قدم زیادہ وضاحت سے چن سکیں۔"],
  ne: ["Krishisense बारेमा", "राम्रो निर्णय माटो बुझ्नबाट सुरु हुन्छ।", "Krishisense ले माटोको जानकारी, बालीको स्वास्थ्य जाँच र खेतको योजना एउटै ठाउँमा ल्याउँछ, जसले किसानलाई अर्को कदम स्पष्ट रूपमा छान्न मद्दत गर्छ।"],
  or: ["Krishisense ବିଷୟରେ", "ଭଲ ନିଷ୍ପତ୍ତି ମାଟିକୁ ବୁଝିବାରୁ ଆରମ୍ଭ ହୁଏ।", "Krishisense ମାଟିର ସୂଚନା, ଫସଲର ସ୍ୱାସ୍ଥ୍ୟ ଯାଞ୍ଚ ଏବଂ ଚାଷ ଯୋଜନାକୁ ଏକାଠି କରେ, ଯାହାଦ୍ୱାରା ଚାଷୀମାନେ ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ ସ୍ପଷ୍ଟ ଭାବେ ବାଛିପାରନ୍ତି।"],
  as: ["Krishisense বিষয়ে", "ভাল সিদ্ধান্ত মাটি বুজাৰ পৰাই আৰম্ভ হয়।", "Krishisense-এ মাটিৰ তথ্য, শস্যৰ স্বাস্থ্য পৰীক্ষা আৰু খেতিৰ পৰিকল্পনা একেলগে আনে, যাতে কৃষকে পৰৱৰ্তী পদক্ষেপটো স্পষ্টকৈ বাছি ল’ব পাৰে।"],
  es: ["Acerca de Krishisense", "Las mejores decisiones empiezan por conocer el suelo.", "Krishisense reúne información del suelo, revisiones de cultivos y planificación de la finca para ayudar a los agricultores a elegir el siguiente paso con claridad."]
};
const LANDING_REVIEW_COPY = {
  en: ["Farmer reviews", "Illustrative sample feedback only. These are not verified customer reviews.", "I can keep soil photos and field details together before planning my next step.", "Having crop health and field tasks in one place helps me organize the season.", "The guidance gives me a starting point; I still confirm decisions with local advice."],
  hi: ["किसानों की समीक्षाएँ", "ये केवल उदाहरण हैं, सत्यापित ग्राहक समीक्षाएँ नहीं।", "अगला कदम तय करने से पहले मैं मिट्टी की तस्वीरें और खेत की जानकारी एक जगह रख सकता हूँ।", "फसल का स्वास्थ्य और खेत के काम एक जगह होने से मौसम की योजना बनाना आसान होता है।", "यह सलाह शुरुआत करने में मदद करती है; फैसलों की पुष्टि मैं स्थानीय सलाह से करता हूँ।"],
  pa: ["ਕਿਸਾਨਾਂ ਦੀਆਂ ਸਮੀਖਿਆਵਾਂ", "ਇਹ ਸਿਰਫ਼ ਉਦਾਹਰਨਾਂ ਹਨ, ਪ੍ਰਮਾਣਿਤ ਗਾਹਕ ਸਮੀਖਿਆਵਾਂ ਨਹੀਂ।", "ਅਗਲਾ ਕਦਮ ਸੋਚਣ ਤੋਂ ਪਹਿਲਾਂ ਮੈਂ ਮਿੱਟੀ ਦੀਆਂ ਤਸਵੀਰਾਂ ਅਤੇ ਖੇਤ ਦੀ ਜਾਣਕਾਰੀ ਇਕੱਠੀ ਰੱਖ ਸਕਦਾ ਹਾਂ।", "ਫ਼ਸਲ ਦੀ ਸਿਹਤ ਅਤੇ ਖੇਤ ਦੇ ਕੰਮ ਇੱਕ ਥਾਂ ਹੋਣ ਨਾਲ ਮੌਸਮ ਦੀ ਯੋਜਨਾ ਬਣਾਉਣੀ ਸੌਖੀ ਹੁੰਦੀ ਹੈ।", "ਇਹ ਸਲਾਹ ਸ਼ੁਰੂਆਤ ਦਿੰਦੀ ਹੈ; ਫ਼ੈਸਲਿਆਂ ਦੀ ਪੁਸ਼ਟੀ ਮੈਂ ਸਥਾਨਕ ਸਲਾਹ ਨਾਲ ਕਰਦਾ ਹਾਂ।"],
  bn: ["কৃষকদের পর্যালোচনা", "এগুলো কেবল উদাহরণ, যাচাইকৃত গ্রাহক পর্যালোচনা নয়।", "পরের পদক্ষেপ ঠিক করার আগে আমি মাটির ছবি ও জমির তথ্য একসঙ্গে রাখতে পারি।", "ফসলের স্বাস্থ্য ও জমির কাজ এক জায়গায় থাকলে মরসুমের পরিকল্পনা সহজ হয়।", "এই পরামর্শ শুরু করার দিশা দেয়; সিদ্ধান্ত স্থানীয় পরামর্শে যাচাই করি।"],
  ta: ["விவசாயிகளின் மதிப்புரைகள்", "இவை எடுத்துக்காட்டுகள் மட்டுமே; சரிபார்க்கப்பட்ட வாடிக்கையாளர் மதிப்புரைகள் அல்ல.", "அடுத்த படியைத் திட்டமிடும் முன் மண் படங்களையும் வயல் விவரங்களையும் ஒன்றாக வைத்துக்கொள்ளலாம்.", "பயிர் ஆரோக்கியமும் வயல் பணிகளும் ஒரே இடத்தில் இருப்பது பருவத்தைத் திட்டமிட உதவுகிறது.", "இந்த வழிகாட்டுதல் தொடங்க உதவும்; முடிவுகளை உள்ளூர் ஆலோசனையுடன் உறுதிப்படுத்துவேன்."],
  te: ["రైతుల సమీక్షలు", "ఇవి నమూనా ఉదాహరణలు మాత్రమే; ధృవీకరించిన కస్టమర్ సమీక్షలు కావు.", "తదుపరి అడుగు నిర్ణయించే ముందు నేల ఫోటోలు, పొలం వివరాలను ఒకచోట ఉంచగలను.", "పంట ఆరోగ్యం, పొలం పనులు ఒకచోట ఉండటం వల్ల సీజన్‌ను సులభంగా ప్రణాళిక చేయగలను.", "ఈ సూచనలు ప్రారంభానికి ఉపయోగపడతాయి; నిర్ణయాలను స్థానిక సలహాతో నిర్ధారిస్తాను."],
  mr: ["शेतकऱ्यांची मते", "ही केवळ उदाहरणे आहेत; सत्यापित ग्राहक अभिप्राय नाहीत.", "पुढचे पाऊल ठरवण्याआधी मातीचे फोटो आणि शेताची माहिती एकत्र ठेवता येते.", "पीक आरोग्य आणि शेतातील कामे एकाच ठिकाणी असल्याने हंगामाचे नियोजन सोपे होते.", "हे मार्गदर्शन सुरुवात करून देते; निर्णयांची खात्री मी स्थानिक सल्ल्याने करतो."],
  gu: ["ખેડૂતોના અભિપ્રાયો", "આ માત્ર ઉદાહરણો છે; ચકાસેલા ગ્રાહક અભિપ્રાયો નથી.", "આગળનું પગલું નક્કી કરતાં પહેલાં માટીના ફોટા અને ખેતરની માહિતી એકસાથે રાખી શકું છું.", "પાકનું આરોગ્ય અને ખેતરનાં કામ એક જગ્યાએ હોવાથી ઋતુનું આયોજન સરળ બને છે.", "આ માર્ગદર્શન શરૂઆત કરવામાં મદદ કરે છે; નિર્ણયની ખાતરી હું સ્થાનિક સલાહથી કરું છું."],
  kn: ["ರೈತರ ವಿಮರ್ಶೆಗಳು", "ಇವು ಮಾದರಿ ಉದಾಹರಣೆಗಳು ಮಾತ್ರ; ಪರಿಶೀಲಿತ ಗ್ರಾಹಕ ವಿಮರ್ಶೆಗಳಲ್ಲ.", "ಮುಂದಿನ ಹೆಜ್ಜೆ ಯೋಜಿಸುವ ಮೊದಲು ಮಣ್ಣಿನ ಫೋಟೋ ಮತ್ತು ಜಮೀನಿನ ವಿವರಗಳನ್ನು ಒಟ್ಟಿಗೆ ಇರಿಸಬಹುದು.", "ಬೆಳೆ ಆರೋಗ್ಯ ಮತ್ತು ಜಮೀನಿನ ಕೆಲಸಗಳು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿದ್ದರೆ ಋತುವನ್ನು ಯೋಜಿಸುವುದು ಸುಲಭ.", "ಈ ಮಾರ್ಗದರ್ಶನ ಆರಂಭಕ್ಕೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ; ನಿರ್ಧಾರಗಳನ್ನು ಸ್ಥಳೀಯ ಸಲಹೆಯಿಂದ ದೃಢಪಡಿಸುತ್ತೇನೆ."],
  ml: ["കർഷകരുടെ അവലോകനങ്ങൾ", "ഇവ ഉദാഹരണങ്ങൾ മാത്രമാണ്; സ്ഥിരീകരിച്ച ഉപഭോക്തൃ അവലോകനങ്ങളല്ല.", "അടുത്ത നടപടി ആസൂത്രണം ചെയ്യുന്നതിന് മുമ്പ് മണ്ണിന്റെ ചിത്രങ്ങളും കൃഷിയിട വിവരങ്ങളും ഒരുമിച്ച് സൂക്ഷിക്കാം.", "വിളയുടെ ആരോഗ്യവും കൃഷിയിട ജോലികളും ഒരിടത്ത് ഉണ്ടെങ്കിൽ സീസൺ ആസൂത്രണം എളുപ്പമാകും.", "ഈ നിർദേശം തുടക്കത്തിന് സഹായിക്കും; തീരുമാനങ്ങൾ പ്രാദേശിക ഉപദേശത്തോടെ ഉറപ്പാക്കും."],
  ur: ["کسانوں کے تاثرات", "یہ صرف نمونے ہیں، تصدیق شدہ صارفین کے جائزے نہیں۔", "اگلا قدم طے کرنے سے پہلے میں مٹی کی تصاویر اور کھیت کی تفصیل ایک جگہ رکھ سکتا ہوں۔", "فصل کی صحت اور کھیت کے کام ایک جگہ ہوں تو موسم کی منصوبہ بندی آسان ہوتی ہے۔", "یہ رہنمائی آغاز میں مدد دیتی ہے؛ فیصلوں کی تصدیق مقامی مشورے سے کرتا ہوں۔"],
  ne: ["किसानका समीक्षा", "यी नमुना उदाहरण मात्र हुन्, प्रमाणित ग्राहक समीक्षा होइनन्।", "अर्को कदम योजना गर्नु अघि म माटोका तस्बिर र खेतका विवरण सँगै राख्न सक्छु।", "बालीको स्वास्थ्य र खेतका काम एकै ठाउँमा हुँदा मौसमको योजना बनाउन सजिलो हुन्छ।", "यो सुझावले सुरुवात गर्न मद्दत गर्छ; निर्णय स्थानीय सल्लाहबाट पुष्टि गर्छु।"],
  or: ["ଚାଷୀଙ୍କ ମତାମତ", "ଏଗୁଡ଼ିକ କେବଳ ନମୁନା, ଯାଞ୍ଚ ହୋଇଥିବା ଗ୍ରାହକ ସମୀକ୍ଷା ନୁହେଁ।", "ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ ଯୋଜନା କରିବା ପୂର୍ବରୁ ମାଟିର ଫଟୋ ଓ ଜମିର ବିବରଣୀ ଏକାଠି ରଖିପାରିବି।", "ଫସଲର ସ୍ୱାସ୍ଥ୍ୟ ଓ ଜମିର କାମ ଗୋଟିଏ ସ୍ଥାନରେ ରହିଲେ ଋତୁ ଯୋଜନା ସହଜ ହୁଏ।", "ଏହି ପରାମର୍ଶ ଆରମ୍ଭ କରିବାରେ ସାହାଯ୍ୟ କରେ; ନିଷ୍ପତ୍ତି ସ୍ଥାନୀୟ ପରାମର୍ଶରେ ଯାଞ୍ଚ କରେ।"],
  as: ["কৃষকৰ মতামত", "এইবোৰ কেৱল উদাহৰণ, যাচাইকৃত গ্ৰাহকৰ পৰ্যালোচনা নহয়।", "পৰৱৰ্তী পদক্ষেপ ঠিক কৰাৰ আগতে মাটিৰ ফটো আৰু পথাৰৰ তথ্য একেলগে ৰাখিব পাৰোঁ।", "শস্যৰ স্বাস্থ্য আৰু পথাৰৰ কাম একে ঠাইত থাকিলে ঋতুৰ পৰিকল্পনা সহজ হয়।", "এই পৰামৰ্শই আৰম্ভণিত সহায় কৰে; সিদ্ধান্ত স্থানীয় পৰামৰ্শৰে নিশ্চিত কৰোঁ।"],
  es: ["Opiniones de agricultores", "Son ejemplos ilustrativos, no opiniones verificadas de clientes.", "Puedo reunir fotos del suelo y datos del terreno antes de planificar el siguiente paso.", "Tener la salud del cultivo y las tareas del campo en un solo lugar facilita organizar la temporada.", "La orientación me da un punto de partida; confirmo las decisiones con asesoramiento local."]
};
const JOURNAL_INTRO = {
  en: "Practical notes for soil, water and crop care.", hi: "मिट्टी, पानी और फसल की देखभाल के लिए व्यावहारिक सुझाव।",
  pa: "ਮਿੱਟੀ, ਪਾਣੀ ਅਤੇ ਫ਼ਸਲ ਦੀ ਦੇਖਭਾਲ ਲਈ ਵਰਤੋਂਯੋਗ ਨੋਟਸ।", bn: "মাটি, জল ও ফসলের যত্নের ব্যবহারিক পরামর্শ।",
  ta: "மண், நீர் மற்றும் பயிர் பராமரிப்புக்கான நடைமுறை குறிப்புகள்.", te: "నేల, నీరు, పంట సంరక్షణకు ఉపయోగకరమైన సూచనలు.",
  mr: "माती, पाणी आणि पीक काळजीसाठी उपयुक्त टिपा.", gu: "માટી, પાણી અને પાકની સંભાળ માટે ઉપયોગી નોંધો.",
  kn: "ಮಣ್ಣು, ನೀರು ಮತ್ತು ಬೆಳೆ ಆರೈಕೆಗೆ ಪ್ರಾಯೋಗಿಕ ಟಿಪ್ಪಣಿಗಳು.", ml: "മണ്ണ്, വെള്ളം, വിള പരിപാലനം എന്നിവയ്ക്കുള്ള പ്രായോഗിക കുറിപ്പുകൾ.",
  ur: "مٹی، پانی اور فصل کی دیکھ بھال کے لیے عملی نکات۔", ne: "माटो, पानी र बाली हेरचाहका व्यावहारिक टिपोटहरू।",
  or: "ମାଟି, ଜଳ ଓ ଫସଲ ଯତ୍ନ ପାଇଁ ବ୍ୟବହାରିକ ଟିପ୍ପଣୀ।", as: "মাটি, পানী আৰু শস্যৰ যত্নৰ ব্যৱহাৰিক টোকা।",
  es: "Consejos prácticos sobre suelo, agua y cuidado de cultivos."
};
const JOURNAL_TITLES = {
  en: ["Read the soil before the next crop", "Give water to the roots, not the calendar", "Scout first. Treat with care."],
  hi: ["अगली फसल से पहले मिट्टी को समझें", "तारीख नहीं, जड़ों की ज़रूरत देखकर पानी दें", "पहले निरीक्षण करें, फिर सावधानी से उपचार करें"],
  pa: ["ਅਗਲੀ ਫ਼ਸਲ ਤੋਂ ਪਹਿਲਾਂ ਮਿੱਟੀ ਨੂੰ ਸਮਝੋ", "ਤਾਰੀਖ ਨਹੀਂ, ਜੜ੍ਹਾਂ ਦੀ ਲੋੜ ਦੇਖ ਕੇ ਪਾਣੀ ਦਿਓ", "ਪਹਿਲਾਂ ਜਾਂਚੋ, ਫਿਰ ਸੋਚ-ਸਮਝ ਕੇ ਇਲਾਜ ਕਰੋ"],
  bn: ["পরের ফসলের আগে মাটি বুঝুন", "ক্যালেন্ডার নয়, শিকড়ের প্রয়োজন বুঝে জল দিন", "আগে খতিয়ে দেখুন, তারপর সাবধানে ব্যবস্থা নিন"],
  ta: ["அடுத்த பயிருக்கு முன் மண்ணைப் புரிந்துகொள்ளுங்கள்", "நாள்காட்டியை அல்ல, வேர்களின் தேவையைப் பார்த்து நீர் பாய்ச்சுங்கள்", "முதலில் ஆய்வு செய்யுங்கள்; பிறகு கவனமாகச் செயல்படுங்கள்"],
  te: ["తదుపరి పంటకు ముందు నేలను అర్థం చేసుకోండి", "తేదీని కాదు, వేర్ల అవసరాన్ని బట్టి నీరు పెట్టండి", "ముందుగా పరిశీలించండి; తర్వాత జాగ్రత్తగా చర్య తీసుకోండి"],
  mr: ["पुढील पिकाआधी माती समजून घ्या", "तारखेपेक्षा मुळांची गरज पाहून पाणी द्या", "आधी निरीक्षण करा; मग काळजीपूर्वक उपाय करा"],
  gu: ["આગળના પાક પહેલાં માટીને સમજો", "તારીખ નહીં, મૂળની જરૂરિયાત જોઈને પાણી આપો", "પહેલાં નિરીક્ષણ કરો, પછી કાળજીથી પગલું લો"],
  kn: ["ಮುಂದಿನ ಬೆಳೆಗೆ ಮೊದಲು ಮಣ್ಣನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ", "ದಿನಾಂಕವಲ್ಲ, ಬೇರುಗಳ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ ನೀರುಣಿಸಿ", "ಮೊದಲು ಪರಿಶೀಲಿಸಿ; ನಂತರ ಎಚ್ಚರಿಕೆಯಿಂದ ಕ್ರಮ ಕೈಗೊಳ್ಳಿ"],
  ml: ["അടുത്ത വിളയ്ക്ക് മുമ്പ് മണ്ണിനെ മനസ്സിലാക്കൂ", "തീയതിയല്ല, വേരുകളുടെ ആവശ്യം നോക്കി നനയ്ക്കൂ", "ആദ്യം നിരീക്ഷിക്കൂ; പിന്നെ ശ്രദ്ധയോടെ നടപടി എടുക്കൂ"],
  ur: ["اگلی فصل سے پہلے مٹی کو سمجھیں", "تاریخ نہیں، جڑوں کی ضرورت دیکھ کر پانی دیں", "پہلے معائنہ کریں، پھر احتیاط سے قدم اٹھائیں"],
  ne: ["अर्को बालीअघि माटो बुझ्नुहोस्", "मिति होइन, जराको आवश्यकताअनुसार पानी दिनुहोस्", "पहिले निरीक्षण गर्नुहोस्, त्यसपछि सावधानीपूर्वक कदम चाल्नुहोस्"],
  or: ["ପରବର୍ତ୍ତୀ ଫସଲ ପୂର୍ବରୁ ମାଟିକୁ ବୁଝନ୍ତୁ", "ତାରିଖ ନୁହେଁ, ମୂଳର ଆବଶ୍ୟକତା ଦେଖି ପାଣି ଦିଅନ୍ତୁ", "ପ୍ରଥମେ ଯାଞ୍ଚ କରନ୍ତୁ, ପରେ ସାବଧାନତାର ସହ ପଦକ୍ଷେପ ନିଅନ୍ତୁ"],
  as: ["পৰৱৰ্তী শস্যৰ আগতে মাটি বুজি লওক", "তাৰিখ নহয়, শিপাৰ প্ৰয়োজন চাই পানী দিয়ক", "আগতে পৰীক্ষা কৰক, তাৰ পিছত সাৱধানে ব্যৱস্থা লওক"],
  es: ["Conoce el suelo antes del próximo cultivo", "Riega según las raíces, no según el calendario", "Observa primero. Actúa con cuidado."]
};
const FIELD_BOOK_HEADLINES = {
  en: "A season is made of small decisions.",
  hi: "हर मौसम छोटे-छोटे फैसलों से बनता है।",
  pa: "ਹਰ ਮੌਸਮ ਛੋਟੇ-ਛੋਟੇ ਫੈਸਲਿਆਂ ਨਾਲ ਬਣਦਾ ਹੈ।",
  bn: "প্রতিটি মৌসুম ছোট ছোট সিদ্ধান্তে গড়ে ওঠে।",
  ta: "ஒவ்வொரு பருவமும் சிறிய முடிவுகளால் உருவாகிறது.",
  te: "ప్రతి సీజన్ చిన్న నిర్ణయాలతో రూపుదిద్దుకుంటుంది.",
  mr: "प्रत्येक हंगाम लहान निर्णयांनी घडतो.",
  gu: "દરેક મોસમ નાના નિર્ણયોથી ઘડાય છે.",
  kn: "ಪ್ರತಿ ಋತುವೂ ಸಣ್ಣ ನಿರ್ಧಾರಗಳಿಂದ ರೂಪುಗೊಳ್ಳುತ್ತದೆ.",
  ml: "ഓരോ സീസണും ചെറു തീരുമാനങ്ങളാൽ രൂപപ്പെടുന്നു.",
  ur: "ہر موسم چھوٹے فیصلوں سے بنتا ہے۔",
  ne: "प्रत्येक मौसम साना निर्णयहरूले बन्छ।",
  or: "ପ୍ରତ୍ୟେକ ଋତୁ ଛୋଟ ନିଷ୍ପତ୍ତିରେ ଗଢ଼ିଉଠେ।",
  as: "প্ৰতিটো ঋতু সৰু সৰু সিদ্ধান্তৰে গঢ় লয়।",
  es: "Cada temporada se construye con pequeñas decisiones."
};
const FILM_CONTROL_COPY = {
  en: ["Previous farm film", "Next farm film"],
  hi: ["पिछली खेती की फ़िल्म", "अगली खेती की फ़िल्म"],
  pa: ["ਪਿਛਲੀ ਖੇਤੀ ਵੀਡੀਓ", "ਅਗਲੀ ਖੇਤੀ ਵੀਡੀਓ"],
  bn: ["আগের কৃষি ভিডিও", "পরের কৃষি ভিডিও"],
  ta: ["முந்தைய விவசாயக் காணொளி", "அடுத்த விவசாயக் காணொளி"],
  te: ["మునుపటి వ్యవసాయ వీడియో", "తదుపరి వ్యవసాయ వీడియో"],
  mr: ["मागील शेती व्हिडिओ", "पुढील शेती व्हिडिओ"],
  gu: ["પહેલાંનો ખેતી વિડિયો", "આગળનો ખેતી વિડિયો"],
  kn: ["ಹಿಂದಿನ ಕೃಷಿ ವಿಡಿಯೋ", "ಮುಂದಿನ ಕೃಷಿ ವಿಡಿಯೋ"],
  ml: ["മുമ്പത്തെ കൃഷി വീഡിയോ", "അടുത്ത കൃഷി വീഡിയോ"],
  ur: ["پچھلی زرعی ویڈیو", "اگلی زرعی ویڈیو"],
  ne: ["अघिल्लो खेती भिडियो", "अर्को खेती भिडियो"],
  or: ["ପୂର୍ବ କୃଷି ଭିଡିଓ", "ପରବର୍ତ୍ତୀ କୃଷି ଭିଡିଓ"],
  as: ["আগৰ কৃষি ভিডিঅ’", "পৰৱৰ্তী কৃষি ভিডিঅ’"],
  es: ["Vídeo agrícola anterior", "Siguiente vídeo agrícola"]
};
const LIVE_COPY_KEYS = ["farmData", "updated", "refreshData", "refreshingData", "syncWarning"];
const LIVE_COPY_ROWS = {
  en: ["Farm data", "Updated", "Refresh data", "Refreshing…", "Some data may be out of date"],
  hi: ["खेत का डेटा", "अपडेट हुआ", "डेटा रीफ़्रेश करें", "रीफ़्रेश हो रहा है…", "कुछ डेटा पुराना हो सकता है"],
  pa: ["ਖੇਤ ਦਾ ਡਾਟਾ", "ਅੱਪਡੇਟ ਹੋਇਆ", "ਡਾਟਾ ਤਾਜ਼ਾ ਕਰੋ", "ਤਾਜ਼ਾ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ…", "ਕੁਝ ਡਾਟਾ ਪੁਰਾਣਾ ਹੋ ਸਕਦਾ ਹੈ"],
  bn: ["খামারের তথ্য", "আপডেট হয়েছে", "খামারের তথ্য রিফ্রেশ করুন", "রিফ্রেশ হচ্ছে…", "কিছু তথ্য পুরোনো হতে পারে"],
  ta: ["பண்ணைத் தரவு", "புதுப்பிக்கப்பட்டது", "பண்ணைத் தரவைப் புதுப்பிக்கவும்", "புதுப்பிக்கப்படுகிறது…", "சில தரவுகள் பழையதாக இருக்கலாம்"],
  te: ["పొలం సమాచారం", "నవీకరించబడింది", "పొలం సమాచారాన్ని రిఫ్రెష్ చేయండి", "రిఫ్రెష్ అవుతోంది…", "కొంత సమాచారం పాతదై ఉండవచ్చు"],
  mr: ["शेताचा डेटा", "अपडेट झाले", "शेताचा डेटा रिफ्रेश करा", "रिफ्रेश होत आहे…", "काही डेटा जुना असू शकतो"],
  gu: ["ખેતરની માહિતી", "અપડેટ થયું", "ખેતરની માહિતી રિફ્રેશ કરો", "રિફ્રેશ થઈ રહ્યું છે…", "કેટલીક માહિતી જૂની હોઈ શકે"],
  kn: ["ಜಮೀನಿನ ಮಾಹಿತಿ", "ನವೀಕರಿಸಲಾಗಿದೆ", "ಜಮೀನಿನ ಮಾಹಿತಿಯನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ", "ರಿಫ್ರೆಶ್ ಆಗುತ್ತಿದೆ…", "ಕೆಲವು ಮಾಹಿತಿ ಹಳೆಯದಾಗಿರಬಹುದು"],
  ml: ["കൃഷിയിട ഡാറ്റ", "പുതുക്കി", "കൃഷിയിട ഡാറ്റ പുതുക്കുക", "പുതുക്കുന്നു…", "ചില വിവരങ്ങൾ പഴയതായിരിക്കാം"],
  ur: ["کھیت کا ڈیٹا", "اپ ڈیٹ ہوا", "کھیت کا ڈیٹا ریفریش کریں", "ریفریش ہو رہا ہے…", "کچھ ڈیٹا پرانا ہو سکتا ہے"],
  ne: ["खेतको विवरण", "अपडेट भयो", "खेतको विवरण रिफ्रेस गर्नुहोस्", "रिफ्रेस हुँदैछ…", "केही विवरण पुराना हुन सक्छन्"],
  or: ["ଚାଷ ତଥ୍ୟ", "ଅଦ୍ୟତନ ହେଲା", "ଚାଷ ତଥ୍ୟ ସତେଜ କରନ୍ତୁ", "ସତେଜ ହେଉଛି…", "କିଛି ତଥ୍ୟ ପୁରୁଣା ହୋଇପାରେ"],
  as: ["পথাৰৰ তথ্য", "আপডেট হৈছে", "পথাৰৰ তথ্য সতেজ কৰক", "সতেজ হৈ আছে…", "কিছুমান তথ্য পুৰণি হ’ব পাৰে"],
  es: ["Datos de la granja", "Actualizado", "Actualizar datos", "Actualizando…", "Algunos datos podrían estar desactualizados"]
};
const LIVE_COPY = Object.fromEntries(LIVE_COPY_KEYS.map((key, index) => [
  key,
  Object.fromEntries(Object.entries(LIVE_COPY_ROWS).map(([code, row]) => [code, row[index]]))
]));
const FARM_BUDDY_KEYS = ["name", "tipTitle", "nextTip", "closeTip", "moisture", "scout", "compost", "spray"];
const FARM_BUDDY_ROWS = {
  en: ["Farm buddy", "Field tip", "Another tip", "Close tip", "Check soil moisture before watering.", "Inspect leaf undersides when scouting for pests.", "Add compost to improve soil structure over time.", "Avoid spraying in strong wind or peak heat."],
  hi: ["खेत साथी", "खेत की सलाह", "अगली सलाह", "सलाह बंद करें", "पानी देने से पहले मिट्टी की नमी जांचें।", "कीटों की जांच करते समय पत्तियों के नीचे देखें।", "मिट्टी की बनावट सुधारने के लिए खाद डालें।", "तेज हवा या कड़ी धूप में छिड़काव न करें।"],
  pa: ["ਖੇਤ ਦਾ ਸਾਥੀ", "ਖੇਤ ਦੀ ਸਲਾਹ", "ਅਗਲੀ ਸਲਾਹ", "ਸਲਾਹ ਬੰਦ ਕਰੋ", "ਪਾਣੀ ਦੇਣ ਤੋਂ ਪਹਿਲਾਂ ਮਿੱਟੀ ਦੀ ਨਮੀ ਜਾਂਚੋ।", "ਕੀੜਿਆਂ ਦੀ ਜਾਂਚ ਲਈ ਪੱਤਿਆਂ ਦੇ ਹੇਠਾਂ ਵੇਖੋ।", "ਮਿੱਟੀ ਦੀ ਬਣਤਰ ਸੁਧਾਰਨ ਲਈ ਖਾਦ ਪਾਓ।", "ਤੇਜ਼ ਹਵਾ ਜਾਂ ਤਿੱਖੀ ਧੁੱਪ ਵਿੱਚ ਛਿੜਕਾਅ ਨਾ ਕਰੋ।"],
  bn: ["খামারের সঙ্গী", "খেতের পরামর্শ", "আরেকটি পরামর্শ", "পরামর্শ বন্ধ করুন", "জল দেওয়ার আগে মাটির আর্দ্রতা পরীক্ষা করুন।", "পোকা খুঁজতে পাতার নিচের দিক দেখুন।", "মাটির গঠন উন্নত করতে কম্পোস্ট যোগ করুন।", "জোরে বাতাস বা প্রচণ্ড গরমে স্প্রে করবেন না।"],
  ta: ["பண்ணைத் தோழன்", "வயல் குறிப்பு", "அடுத்த குறிப்பு", "குறிப்பை மூடு", "நீர் பாய்ச்சும் முன் மண்ணின் ஈரத்தைச் சரிபார்க்கவும்.", "பூச்சிகளைத் தேட இலைகளின் அடிப்புறத்தைப் பாருங்கள்.", "மண் அமைப்பை மேம்படுத்த கம்போஸ்ட் சேர்க்கவும்.", "பலத்த காற்று அல்லது கடும் வெயிலில் தெளிக்க வேண்டாம்."],
  te: ["పొలం నేస్తం", "పొలం చిట్కా", "మరో చిట్కా", "చిట్కాను మూసివేయండి", "నీరు పెట్టే ముందు నేల తేమను తనిఖీ చేయండి.", "పురుగుల కోసం ఆకుల అడుగు భాగాన్ని పరిశీలించండి.", "నేల నిర్మాణం మెరుగుపడేందుకు కంపోస్ట్ కలపండి.", "బలమైన గాలి లేదా తీవ్రమైన ఎండలో పిచికారీ చేయవద్దు."],
  mr: ["शेतमित्र", "शेतातील टिप", "आणखी एक टिप", "टिप बंद करा", "पाणी देण्यापूर्वी मातीतील ओलावा तपासा.", "किडींसाठी पानांच्या खालच्या बाजूची पाहणी करा.", "मातीची रचना सुधारण्यासाठी कंपोस्ट घाला.", "जोराचा वारा किंवा कडक उन्हात फवारणी टाळा."],
  gu: ["ખેતરનો સાથી", "ખેતરની સલાહ", "બીજી સલાહ", "સલાહ બંધ કરો", "પાણી આપતા પહેલાં જમીનની ભેજ તપાસો.", "જીવાત જોવા પાંદડાની નીચેની બાજુ તપાસો.", "જમીનની રચના સુધારવા કમ્પોસ્ટ ઉમેરો.", "તેજ પવન અથવા ભારે ગરમીમાં છંટકાવ ટાળો."],
  kn: ["ಹೊಲದ ಗೆಳೆಯ", "ಹೊಲದ ಸಲಹೆ", "ಇನ್ನೊಂದು ಸಲಹೆ", "ಸಲಹೆ ಮುಚ್ಚಿ", "ನೀರು ಹಾಕುವ ಮೊದಲು ಮಣ್ಣಿನ ತೇವಾಂಶ ಪರಿಶೀಲಿಸಿ.", "ಕೀಟಗಳಿಗಾಗಿ ಎಲೆಗಳ ಕೆಳಭಾಗವನ್ನು ನೋಡಿ.", "ಮಣ್ಣಿನ ರಚನೆ ಉತ್ತಮಗೊಳಿಸಲು ಕಾಂಪೋಸ್ಟ್ ಸೇರಿಸಿ.", "ಬಲವಾದ ಗಾಳಿ ಅಥವಾ ತೀವ್ರ ಬಿಸಿಲಿನಲ್ಲಿ ಸಿಂಪಡಿಸಬೇಡಿ."],
  ml: ["കൃഷിത്തോട്ട കൂട്ടുകാരൻ", "കൃഷിയിട കുറിപ്പ്", "അടുത്ത കുറിപ്പ്", "കുറിപ്പ് അടയ്ക്കുക", "നനയ്ക്കുന്നതിന് മുമ്പ് മണ്ണിലെ ഈർപ്പം പരിശോധിക്കുക.", "കീടങ്ങൾക്കായി ഇലകളുടെ അടിവശം പരിശോധിക്കുക.", "മണ്ണിന്റെ ഘടന മെച്ചപ്പെടുത്താൻ കമ്പോസ്റ്റ് ചേർക്കുക.", "ശക്തമായ കാറ്റിലോ കടുത്ത ചൂടിലോ തളിക്കരുത്."],
  ur: ["کھیت کا ساتھی", "کھیت کی ترکیب", "اگلی ترکیب", "ترکیب بند کریں", "پانی دینے سے پہلے مٹی کی نمی جانچیں۔", "کیڑوں کی تلاش میں پتوں کی نچلی سطح دیکھیں۔", "مٹی کی ساخت بہتر بنانے کے لیے کمپوسٹ ڈالیں۔", "تیز ہوا یا سخت دھوپ میں اسپرے نہ کریں۔"],
  ne: ["खेतको साथी", "खेतको सुझाव", "अर्को सुझाव", "सुझाव बन्द गर्नुहोस्", "पानी हाल्नुअघि माटोको चिस्यान जाँच्नुहोस्।", "कीरा खोज्न पातको तल्लो भाग हेर्नुहोस्।", "माटोको बनावट सुधार्न कम्पोस्ट थप्नुहोस्।", "तेज हावा वा कडा घाममा छर्कनु हुँदैन।"],
  or: ["କ୍ଷେତର ସାଥୀ", "କ୍ଷେତ ଟିପ୍ସ", "ଆଉ ଏକ ଟିପ୍ସ", "ଟିପ୍ସ ବନ୍ଦ କରନ୍ତୁ", "ଜଳ ଦେବା ପୂର୍ବରୁ ମାଟିର ଆର୍ଦ୍ରତା ଯାଞ୍ଚ କରନ୍ତୁ।", "ପୋକ ଖୋଜିବା ପାଇଁ ପତ୍ରର ତଳ ପଟ ଦେଖନ୍ତୁ।", "ମାଟିର ଗଠନ ଉନ୍ନତ କରିବାକୁ କମ୍ପୋଷ୍ଟ ମିଶାନ୍ତୁ।", "ଜୋର ପବନ କିମ୍ବା ଅଧିକ ଖରାରେ ସ୍ପ୍ରେ କରନ୍ତୁ ନାହିଁ।"],
  as: ["পথাৰৰ বন্ধু", "পথাৰৰ পৰামৰ্শ", "আন এটা পৰামৰ্শ", "পৰামৰ্শ বন্ধ কৰক", "পানী দিয়াৰ আগতে মাটিৰ আৰ্দ্ৰতা পৰীক্ষা কৰক।", "পোক বিচাৰিবলৈ পাতৰ তলৰ ফাল চাওক।", "মাটিৰ গঠন উন্নত কৰিবলৈ কম্পোষ্ট যোগ কৰক।", "প্ৰবল বতাহ বা অত্যধিক গৰমত স্প্ৰে নকৰিব।"],
  es: ["Amigo del campo", "Consejo de campo", "Otro consejo", "Cerrar consejo", "Comprueba la humedad del suelo antes de regar.", "Revisa el envés de las hojas al buscar plagas.", "Añade compost para mejorar la estructura del suelo.", "Evita fumigar con viento fuerte o calor intenso."]
};
const FARM_BUDDY_COPY = Object.fromEntries(FARM_BUDDY_KEYS.map((key, index) => [
  key,
  Object.fromEntries(Object.entries(FARM_BUDDY_ROWS).map(([code, row]) => [code, row[index]]))
]));

const FARM_LEDGER_KEYS = ["fieldRecords", "farmLogbook", "logbookNote", "loggedCosts", "recordedSales", "harvestLogs", "actualResults", "actualCost", "harvestQuantity", "saleProceeds", "saveComplete", "saving", "cancel", "spent", "sales", "completedLogbookMessage", "manualCompleteTask"];
const FARM_LEDGER_ROWS = {
  en: ["Field records", "Farm logbook", "Totals use the costs and harvest sales you record when completing tasks.", "Logged costs", "Recorded sales", "Harvest logs", "Record actual results", "Actual cost (INR)", "Harvest quantity", "Sale proceeds (INR)", "Save and complete", "Saving…", "Cancel", "Spent", "Sales", "Task completed and added to this farm's logbook.", "To record results, complete a planner task and enter its actual cost. For harvests, also add the quantity and sale proceeds."],
  hi: ["खेत के रिकॉर्ड", "खेत की डायरी", "कुल में काम पूरा करते समय आपके दर्ज किए गए खर्च और फसल की बिक्री शामिल हैं।", "दर्ज लागत", "दर्ज बिक्री", "कटाई के रिकॉर्ड", "वास्तविक परिणाम दर्ज करें", "वास्तविक लागत (INR)", "कटाई की मात्रा", "बिक्री की राशि (INR)", "सहेजें और पूरा करें", "सहेजा जा रहा है…", "रद्द करें", "खर्च", "बिक्री", "काम पूरा हुआ और खेत की डायरी में जोड़ दिया गया।", "नतीजे दर्ज करने के लिए, फसल योजना का काम पूरा करें और वास्तविक लागत लिखें। कटाई के लिए मात्रा और बिक्री की राशि भी जोड़ें।"],
  pa: ["ਖੇਤ ਦੇ ਰਿਕਾਰਡ", "ਖੇਤ ਦੀ ਡਾਇਰੀ", "ਕੁੱਲ ਵਿੱਚ ਕੰਮ ਪੂਰਾ ਕਰਦੇ ਸਮੇਂ ਦਰਜ ਕੀਤੇ ਖਰਚੇ ਅਤੇ ਫ਼ਸਲ ਦੀ ਵਿਕਰੀ ਸ਼ਾਮਲ ਹੈ।", "ਦਰਜ ਖਰਚੇ", "ਦਰਜ ਵਿਕਰੀ", "ਵਾਢੀ ਦੇ ਰਿਕਾਰਡ", "ਅਸਲ ਨਤੀਜੇ ਦਰਜ ਕਰੋ", "ਅਸਲ ਖਰਚਾ (INR)", "ਵਾਢੀ ਦੀ ਮਾਤਰਾ", "ਵਿਕਰੀ ਦੀ ਰਕਮ (INR)", "ਸੰਭਾਲੋ ਅਤੇ ਪੂਰਾ ਕਰੋ", "ਸੰਭਾਲਿਆ ਜਾ ਰਿਹਾ ਹੈ…", "ਰੱਦ ਕਰੋ", "ਖਰਚਿਆ", "ਵਿਕਰੀ", "ਕੰਮ ਪੂਰਾ ਹੋਇਆ ਅਤੇ ਖੇਤ ਦੀ ਡਾਇਰੀ ਵਿੱਚ ਜੋੜਿਆ ਗਿਆ।", "ਨਤੀਜੇ ਦਰਜ ਕਰਨ ਲਈ, ਫਸਲ ਯੋਜਨਾ ਦਾ ਕੰਮ ਪੂਰਾ ਕਰੋ ਅਤੇ ਅਸਲ ਖਰਚਾ ਲਿਖੋ। ਵਾਢੀ ਲਈ ਮਾਤਰਾ ਅਤੇ ਵਿਕਰੀ ਦੀ ਰਕਮ ਵੀ ਜੋੜੋ।"],
  bn: ["খেতের রেকর্ড", "খামারের খাতা", "কাজ শেষ করার সময় আপনার নথিভুক্ত খরচ ও ফসল বিক্রির হিসাব এখানে যোগ হয়।", "নথিভুক্ত খরচ", "নথিভুক্ত বিক্রি", "ফসল কাটার রেকর্ড", "প্রকৃত ফলাফল লিখুন", "প্রকৃত খরচ (INR)", "ফসলের পরিমাণ", "বিক্রির অর্থ (INR)", "সংরক্ষণ করে সম্পন্ন করুন", "সংরক্ষণ হচ্ছে…", "বাতিল", "খরচ", "বিক্রি", "কাজ সম্পন্ন হয়েছে এবং খামারের খাতায় যোগ হয়েছে।", "ফলাফল লিখতে, ফসল পরিকল্পনার একটি কাজ সম্পন্ন করে প্রকৃত খরচ লিখুন। ফসল কাটার ক্ষেত্রে পরিমাণ ও বিক্রির অর্থও যোগ করুন।"],
  ta: ["வயல் பதிவுகள்", "பண்ணைப் பதிவேடு", "பணியை முடிக்கும்போது நீங்கள் பதிவு செய்யும் செலவுகளும் அறுவடை விற்பனையும் இங்கே கணக்கிடப்படும்.", "பதிவு செய்த செலவுகள்", "பதிவு செய்த விற்பனை", "அறுவடை பதிவுகள்", "உண்மையான முடிவுகளைப் பதிவு செய்", "உண்மையான செலவு (INR)", "அறுவடை அளவு", "விற்பனைத் தொகை (INR)", "சேமித்து முடி", "சேமிக்கப்படுகிறது…", "ரத்து செய்", "செலவு", "விற்பனை", "பணி முடிக்கப்பட்டு பண்ணைப் பதிவேட்டில் சேர்க்கப்பட்டது.", "முடிவுகளைப் பதிவு செய்ய, பயிர் திட்டப் பணியை முடித்து உண்மையான செலவை உள்ளிடவும். அறுவடைக்கு அளவு மற்றும் விற்பனைத் தொகையையும் சேர்க்கவும்."],
  te: ["పొలం రికార్డులు", "వ్యవసాయ లాగ్‌బుక్", "పని పూర్తిచేసేటప్పుడు మీరు నమోదు చేసే ఖర్చులు, పంట అమ్మకాలే ఈ మొత్తాల్లో ఉంటాయి.", "నమోదు చేసిన ఖర్చులు", "నమోదు చేసిన అమ్మకాలు", "పంట కోత రికార్డులు", "వాస్తవ ఫలితాలను నమోదు చేయండి", "వాస్తవ ఖర్చు (INR)", "పంట పరిమాణం", "అమ్మకాల మొత్తం (INR)", "సేవ్ చేసి పూర్తి చేయండి", "సేవ్ అవుతోంది…", "రద్దు చేయండి", "ఖర్చు", "అమ్మకాలు", "పని పూర్తయి వ్యవసాయ లాగ్‌బుక్‌లో చేర్చబడింది.", "ఫలితాలను నమోదు చేయడానికి, పంట ప్రణాళికలోని పనిని పూర్తి చేసి వాస్తవ ఖర్చును నమోదు చేయండి. పంట కోతకు పరిమాణం, అమ్మకాల మొత్తాన్ని కూడా జోడించండి."],
  mr: ["शेतातील नोंदी", "शेताची नोंदवही", "काम पूर्ण करताना तुम्ही नोंदवलेले खर्च आणि पीक विक्री या एकूण रकमेत समाविष्ट आहेत.", "नोंदवलेला खर्च", "नोंदवलेली विक्री", "कापणीच्या नोंदी", "प्रत्यक्ष निकाल नोंदवा", "प्रत्यक्ष खर्च (INR)", "कापणीचे प्रमाण", "विक्रीची रक्कम (INR)", "जतन करा आणि पूर्ण करा", "जतन होत आहे…", "रद्द करा", "खर्च", "विक्री", "काम पूर्ण झाले आणि शेताच्या नोंदवहीत जोडले.", "निकाल नोंदवण्यासाठी, पीक नियोजनातील काम पूर्ण करा आणि प्रत्यक्ष खर्च लिहा. कापणीसाठी प्रमाण आणि विक्रीची रक्कमही जोडा."],
  gu: ["ખેતરના રેકોર્ડ", "ખેતરની નોંધપોથી", "કામ પૂરું કરતી વખતે તમે નોંધેલા ખર્ચ અને પાકના વેચાણનો જ કુલમાં સમાવેશ થાય છે.", "નોંધાયેલ ખર્ચ", "નોંધાયેલ વેચાણ", "લણણીના રેકોર્ડ", "વાસ્તવિક પરિણામ નોંધો", "વાસ્તવિક ખર્ચ (INR)", "લણણીનું પ્રમાણ", "વેચાણની રકમ (INR)", "સાચવો અને પૂર્ણ કરો", "સાચવાઈ રહ્યું છે…", "રદ કરો", "ખર્ચ", "વેચાણ", "કામ પૂર્ણ થયું અને ખેતરની નોંધપોથીમાં ઉમેરાયું.", "પરિણામ નોંધવા માટે, પાક યોજનાનું કામ પૂર્ણ કરો અને વાસ્તવિક ખર્ચ લખો. લણણી માટે જથ્થો અને વેચાણની રકમ પણ ઉમેરો."],
  kn: ["ಹೊಲದ ದಾಖಲೆಗಳು", "ಕೃಷಿ ದಾಖಲಾತಿ ಪುಸ್ತಕ", "ಕೆಲಸ ಪೂರ್ಣಗೊಳಿಸುವಾಗ ನೀವು ದಾಖಲಿಸುವ ವೆಚ್ಚ ಮತ್ತು ಬೆಳೆ ಮಾರಾಟವನ್ನು ಮಾತ್ರ ಇಲ್ಲಿ ಲೆಕ್ಕಿಸಲಾಗುತ್ತದೆ.", "ದಾಖಲಿಸಿದ ವೆಚ್ಚ", "ದಾಖಲಿಸಿದ ಮಾರಾಟ", "ಸುಗ್ಗಿಯ ದಾಖಲೆಗಳು", "ನಿಜವಾದ ಫಲಿತಾಂಶಗಳನ್ನು ದಾಖಲಿಸಿ", "ನಿಜವಾದ ವೆಚ್ಚ (INR)", "ಸುಗ್ಗಿಯ ಪ್ರಮಾಣ", "ಮಾರಾಟದ ಮೊತ್ತ (INR)", "ಉಳಿಸಿ ಪೂರ್ಣಗೊಳಿಸಿ", "ಉಳಿಸಲಾಗುತ್ತಿದೆ…", "ರದ್ದುಮಾಡಿ", "ವೆಚ್ಚ", "ಮಾರಾಟ", "ಕೆಲಸ ಪೂರ್ಣಗೊಂಡು ಕೃಷಿ ದಾಖಲಾತಿ ಪುಸ್ತಕಕ್ಕೆ ಸೇರಿಸಲಾಗಿದೆ.", "ಫಲಿತಾಂಶಗಳನ್ನು ದಾಖಲಿಸಲು, ಬೆಳೆ ಯೋಜನೆಯ ಕೆಲಸವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ ನಿಜವಾದ ವೆಚ್ಚವನ್ನು ನಮೂದಿಸಿ. ಕೊಯ್ಲಿಗೆ ಪ್ರಮಾಣ ಮತ್ತು ಮಾರಾಟದ ಮೊತ್ತವನ್ನೂ ಸೇರಿಸಿ."],
  ml: ["കൃഷിയിട രേഖകൾ", "ഫാം രേഖാപുസ്തകം", "ജോലി പൂർത്തിയാക്കുമ്പോൾ നിങ്ങൾ രേഖപ്പെടുത്തുന്ന ചെലവും വിളവിന്റെ വിൽപ്പനയും മാത്രമാണ് ആകെ തുകയിൽ ഉൾപ്പെടുന്നത്.", "രേഖപ്പെടുത്തിയ ചെലവ്", "രേഖപ്പെടുത്തിയ വിൽപ്പന", "വിളവെടുപ്പ് രേഖകൾ", "യഥാർത്ഥ ഫലം രേഖപ്പെടുത്തുക", "യഥാർത്ഥ ചെലവ് (INR)", "വിളവിന്റെ അളവ്", "വിൽപ്പന തുക (INR)", "സൂക്ഷിച്ച് പൂർത്തിയാക്കുക", "സൂക്ഷിക്കുന്നു…", "റദ്ദാക്കുക", "ചെലവഴിച്ചത്", "വിൽപ്പന", "ജോലി പൂർത്തിയാക്കി ഫാം രേഖാപുസ്തകത്തിൽ ചേർത്തു.", "ഫലം രേഖപ്പെടുത്താൻ, വിള പദ്ധതി ടാസ്‌ക് പൂർത്തിയാക്കി യഥാർത്ഥ ചെലവ് നൽകുക. വിളവെടുപ്പിന് അളവും വിൽപ്പനത്തുകയും ചേർക്കുക."],
  ur: ["کھیت کے ریکارڈ", "فارم کی ڈائری", "کل رقم میں کام مکمل کرتے وقت آپ کے درج کردہ اخراجات اور فصل کی فروخت شامل ہیں۔", "درج اخراجات", "درج فروخت", "کٹائی کے ریکارڈ", "اصل نتائج درج کریں", "اصل لاگت (INR)", "کٹائی کی مقدار", "فروخت کی رقم (INR)", "محفوظ کریں اور مکمل کریں", "محفوظ ہو رہا ہے…", "منسوخ کریں", "خرچ", "فروخت", "کام مکمل ہوا اور فارم کی ڈائری میں شامل کر دیا گیا۔", "نتائج درج کرنے کے لیے فصل کے منصوبے کا کام مکمل کریں اور اصل لاگت لکھیں۔ کٹائی کے لیے مقدار اور فروخت کی رقم بھی شامل کریں۔"],
  ne: ["खेतका अभिलेख", "खेतको लगबुक", "काम पूरा गर्दा तपाईंले लेख्नुभएको खर्च र बाली बिक्री मात्र जम्मा रकममा समावेश हुन्छ।", "लेखिएको खर्च", "लेखिएको बिक्री", "कटानी अभिलेख", "वास्तविक नतिजा लेख्नुहोस्", "वास्तविक लागत (INR)", "कटानीको मात्रा", "बिक्री रकम (INR)", "सुरक्षित गरी पूरा गर्नुहोस्", "सुरक्षित हुँदैछ…", "रद्द गर्नुहोस्", "खर्च", "बिक्री", "काम पूरा भयो र खेतको लगबुकमा थपियो।", "नतिजा लेख्न, बाली योजनाको काम पूरा गरी वास्तविक लागत लेख्नुहोस्। कटानीको मात्रा र बिक्री रकम पनि थप्नुहोस्।"],
  or: ["କ୍ଷେତ ରେକର୍ଡ", "ଚାଷ ଖାତା", "କାମ ସମାପ୍ତ କଲାବେଳେ ଆପଣ ଲେଖିଥିବା ଖର୍ଚ୍ଚ ଏବଂ ଫସଲ ବିକ୍ରି ଏହି ମୋଟରେ ରହିଛି।", "ଲିପିବଦ୍ଧ ଖର୍ଚ୍ଚ", "ଲିପିବଦ୍ଧ ବିକ୍ରି", "ଅମଳ ରେକର୍ଡ", "ପ୍ରକୃତ ଫଳାଫଳ ଲେଖନ୍ତୁ", "ପ୍ରକୃତ ଖର୍ଚ୍ଚ (INR)", "ଅମଳ ପରିମାଣ", "ବିକ୍ରି ରାଶି (INR)", "ସଞ୍ଚୟ କରି ସମାପ୍ତ କରନ୍ତୁ", "ସଞ୍ଚୟ ହେଉଛି…", "ବାତିଲ କରନ୍ତୁ", "ଖର୍ଚ୍ଚ", "ବିକ୍ରି", "କାମ ସମାପ୍ତ ହେଲା ଏବଂ ଚାଷ ଖାତାରେ ଯୋଡ଼ାଗଲା।", "ଫଳାଫଳ ଲେଖିବାକୁ, ଫସଲ ଯୋଜନାର କାମ ସମାପ୍ତ କରି ପ୍ରକୃତ ଖର୍ଚ୍ଚ ଲେଖନ୍ତୁ। ଅମଳ ପାଇଁ ପରିମାଣ ଓ ବିକ୍ରି ରାଶି ମଧ୍ୟ ଯୋଡ଼ନ୍ତୁ।"],
  as: ["পথাৰৰ অভিলেখ", "খেতিৰ খতিয়ান", "কাম সম্পূৰ্ণ কৰাৰ সময়ত আপুনি লিখা খৰচ আৰু শস্য বিক্ৰীৰ পৰিমাণ ইয়াত গণনা হয়।", "লিখা খৰচ", "লিখা বিক্ৰী", "চপোৱাৰ অভিলেখ", "প্ৰকৃত ফলাফল লিখক", "প্ৰকৃত খৰচ (INR)", "চপোৱাৰ পৰিমাণ", "বিক্ৰীৰ ধন (INR)", "সংৰক্ষণ কৰি সম্পূৰ্ণ কৰক", "সংৰক্ষণ হৈ আছে…", "বাতিল কৰক", "খৰচ", "বিক্ৰী", "কাম সম্পূৰ্ণ হ’ল আৰু খেতিৰ খতিয়ানত যোগ কৰা হ’ল।", "ফলাফল লিখিবলৈ শস্য পৰিকল্পনাৰ কাম সম্পূৰ্ণ কৰি প্ৰকৃত খৰচ লিখক। চপোৱাৰ পৰিমাণ আৰু বিক্ৰীৰ ধনো যোগ কৰক।"],
  es: ["Registros del campo", "Cuaderno de la granja", "Los totales incluyen los gastos y las ventas de cosecha que anotas al completar tareas.", "Gastos registrados", "Ventas registradas", "Registros de cosecha", "Registrar resultados reales", "Coste real (INR)", "Cantidad cosechada", "Importe de venta (INR)", "Guardar y completar", "Guardando…", "Cancelar", "Gastado", "Ventas", "Tarea completada y añadida al cuaderno de la granja.", "Para registrar resultados, completa una tarea del plan y anota su coste real. En las tareas de cosecha, añade también la cantidad y el importe de venta."]
};
const FARM_LEDGER_COPY = Object.fromEntries(Object.entries(FARM_LEDGER_ROWS).map(([code, row]) => [
  code,
  Object.fromEntries(FARM_LEDGER_KEYS.map((key, index) => [key, row[index]]))
]));

function ledgerText(language, key) {
  return FARM_LEDGER_COPY[language]?.[key] || FARM_LEDGER_COPY.en[key] || key;
}

const MANUAL_LANGUAGE_STEP = {
  en: "Choose a language from the header menu. This guide changes with it, and the assistant is asked to reply in that language.",
  hi: "ऊपर के भाषा मेनू से भाषा चुनें। यह मार्गदर्शिका उसी भाषा में दिखेगी और सहायक से भी उसी भाषा में जवाब देने को कहा जाएगा।",
  pa: "ਉੱਪਰਲੇ ਭਾਸ਼ਾ ਮੀਨੂ ਵਿੱਚੋਂ ਭਾਸ਼ਾ ਚੁਣੋ। ਇਹ ਮੈਨੂਅਲ ਉਸ ਭਾਸ਼ਾ ਵਿੱਚ ਦਿਖੇਗਾ ਅਤੇ ਸਹਾਇਕ ਨੂੰ ਵੀ ਉਸੇ ਭਾਸ਼ਾ ਵਿੱਚ ਜਵਾਬ ਦੇਣ ਲਈ ਕਿਹਾ ਜਾਵੇਗਾ।",
  bn: "উপরের ভাষা মেনু থেকে ভাষা বেছে নিন। এই নির্দেশিকা সেই ভাষায় দেখাবে এবং সহকারীকেও সেই ভাষায় উত্তর দিতে বলা হবে।",
  ta: "மேலே உள்ள மொழி மெனுவில் இருந்து மொழியைத் தேர்ந்தெடுக்கவும். இந்த வழிகாட்டி அந்த மொழியில் மாறும்; உதவியாளரும் அதில் பதிலளிக்கக் கோரப்படும்.",
  te: "పై భాషా మెనూలో భాషను ఎంచుకోండి. ఈ మార్గదర్శి ఆ భాషలోకి మారుతుంది; సహాయకుడిని కూడా అదే భాషలో సమాధానం చెప్పమని అడుగుతాం.",
  mr: "वरील भाषा मेनूमधून भाषा निवडा. ही मार्गदर्शिका त्या भाषेत दिसेल आणि सहाय्यकाला देखील त्याच भाषेत उत्तर देण्यास सांगितले जाईल.",
  gu: "ઉપરના ભાષા મેનૂમાંથી ભાષા પસંદ કરો. આ માર્ગદર્શિકા એ ભાષામાં દેખાશે અને સહાયકને પણ એ જ ભાષામાં જવાબ આપવા કહેવામાં આવશે.",
  kn: "ಮೇಲಿನ ಭಾಷಾ ಮೆನುವಿನಿಂದ ಭಾಷೆಯನ್ನು ಆರಿಸಿ. ಈ ಮಾರ್ಗದರ್ಶಿ ಆ ಭಾಷೆಗೆ ಬದಲಾಗುತ್ತದೆ ಮತ್ತು ಸಹಾಯಕನಿಗೂ ಅದೇ ಭಾಷೆಯಲ್ಲಿ ಉತ್ತರಿಸಲು ಸೂಚಿಸಲಾಗುತ್ತದೆ.",
  ml: "മുകളിലെ ഭാഷാ മെനുവിൽ നിന്ന് ഭാഷ തിരഞ്ഞെടുക്കുക. ഈ മാർഗ്ഗരേഖ ആ ഭാഷയിലേക്ക് മാറും; സഹായിയോടും അതേ ഭാഷയിൽ മറുപടി നൽകാൻ ആവശ്യപ്പെടും.",
  ur: "اوپر کے زبان مینو سے زبان منتخب کریں۔ یہ رہنما اسی زبان میں دکھائی دے گا اور معاون سے بھی اسی زبان میں جواب دینے کو کہا جائے گا۔",
  ne: "माथिको भाषा मेनुबाट भाषा छान्नुहोस्। यो मार्गदर्शिका त्यही भाषामा देखिन्छ र सहायकलाई पनि त्यही भाषामा जवाफ दिन भनिन्छ।",
  or: "ଉପର ଭାଷା ମେନୁରୁ ଭାଷା ବାଛନ୍ତୁ। ଏହି ମାର୍ଗଦର୍ଶିକା ସେହି ଭାଷାରେ ଦେଖାଯିବ ଏବଂ ସହାୟକଙ୍କୁ ମଧ୍ୟ ସେହି ଭାଷାରେ ଉତ୍ତର ଦେବାକୁ କୁହାଯିବ।",
  as: "ওপৰৰ ভাষা মেনুৰ পৰা ভাষা বাছনি কৰক। এই নিৰ্দেশিকাখন সেই ভাষাত দেখা যাব আৰু সহায়ককো সেই ভাষাতে উত্তৰ দিবলৈ কোৱা হ’ব।",
  es: "Elige un idioma en el menú superior. Esta guía cambiará y se pedirá al asistente que responda en ese idioma."
};
const MANUAL_ASSISTANT_STEP = {
  en: "In Farm tools, choose a suggested question or type your own, then select Ask assistant. Use Clear chat to start a fresh conversation.",
  hi: "खेती के टूल में सुझाया गया सवाल चुनें या अपना सवाल लिखें, फिर सहायक से पूछें चुनें। नई बातचीत शुरू करने के लिए चैट साफ़ करें चुनें।",
  pa: "ਖੇਤੀ ਸੰਦਾਂ ਵਿੱਚ ਸੁਝਾਇਆ ਸਵਾਲ ਚੁਣੋ ਜਾਂ ਆਪਣਾ ਸਵਾਲ ਲਿਖੋ, ਫਿਰ ਸਹਾਇਕ ਨੂੰ ਪੁੱਛੋ ਚੁਣੋ। ਨਵੀਂ ਗੱਲਬਾਤ ਲਈ ਚੈਟ ਸਾਫ਼ ਕਰੋ ਚੁਣੋ।",
  bn: "খামারের টুলে একটি প্রস্তাবিত প্রশ্ন বেছে নিন বা নিজের প্রশ্ন লিখুন, তারপর সহকারীকে জিজ্ঞাসা করুন চাপুন। নতুন কথোপকথনের জন্য চ্যাট মুছুন চাপুন।",
  ta: "பண்ணைக் கருவிகளில் பரிந்துரைக்கப்பட்ட கேள்வியைத் தேர்ந்தெடுக்கவும் அல்லது உங்கள் கேள்வியை எழுதிப் உதவியாளரிடம் கேள் என்பதைத் தேர்ந்தெடுக்கவும். புதிய உரையாடலைத் தொடங்க அரட்டையை அழி என்பதைத் தேர்ந்தெடுக்கவும்.",
  te: "వ్యవసాయ సాధనాల్లో సూచించిన ప్రశ్నను ఎంచుకోండి లేదా మీ ప్రశ్నను టైప్ చేసి సహాయకుడిని అడగండి ఎంచుకోండి. కొత్త సంభాషణ కోసం చాట్‌ను క్లియర్ చేయండి ఎంచుకోండి.",
  mr: "शेतीच्या साधनांमध्ये सुचवलेला प्रश्न निवडा किंवा स्वतःचा प्रश्न लिहून सहाय्यकाला विचारा निवडा. नवीन संभाषणासाठी चॅट साफ करा निवडा.",
  gu: "ખેતીના સાધનોમાં સૂચવેલો પ્રશ્ન પસંદ કરો અથવા તમારો પ્રશ્ન લખો, પછી સહાયકને પૂછો પસંદ કરો. નવી વાતચીત માટે ચેટ સાફ કરો પસંદ કરો.",
  kn: "ಕೃಷಿ ಸಾಧನಗಳಲ್ಲಿ ಸೂಚಿಸಿದ ಪ್ರಶ್ನೆಯನ್ನು ಆರಿಸಿ ಅಥವಾ ನಿಮ್ಮದೇ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ, ನಂತರ ಸಹಾಯಕರನ್ನು ಕೇಳಿ ಆಯ್ಕೆಮಾಡಿ. ಹೊಸ ಸಂಭಾಷಣೆಗಾಗಿ ಚಾಟ್ ತೆರವುಗೊಳಿಸಿ ಆಯ್ಕೆಮಾಡಿ.",
  ml: "കൃഷി ഉപകരണങ്ങളിൽ നിർദ്ദേശിച്ച ചോദ്യം തിരഞ്ഞെടുക്കുക അല്ലെങ്കിൽ സ്വന്തം ചോദ്യം ടൈപ്പ് ചെയ്ത് സഹായിയോട് ചോദിക്കുക തിരഞ്ഞെടുക്കുക. പുതിയ സംഭാഷണത്തിന് ചാറ്റ് മായ്ക്കുക തിരഞ്ഞെടുക്കുക.",
  ur: "فارم ٹولز میں تجویز کردہ سوال منتخب کریں یا اپنا سوال لکھیں، پھر معاون سے پوچھیں منتخب کریں۔ نئی گفتگو شروع کرنے کے لیے چیٹ صاف کریں منتخب کریں۔",
  ne: "कृषि उपकरणमा सुझाइएको प्रश्न छान्नुहोस् वा आफ्नै प्रश्न लेखेर सहायकलाई सोध्नुहोस् छान्नुहोस्। नयाँ कुराकानीका लागि च्याट खाली गर्नुहोस् छान्नुहोस्।",
  or: "ଚାଷ ଉପକରଣରେ ଏକ ପ୍ରସ୍ତାବିତ ପ୍ରଶ୍ନ ବାଛନ୍ତୁ କିମ୍ବା ନିଜ ପ୍ରଶ୍ନ ଲେଖି ସହାୟକଙ୍କୁ ପଚାରନ୍ତୁ ବାଛନ୍ତୁ। ନୂଆ କଥାବାର୍ତ୍ତା ପାଇଁ ଚାଟ୍ ସଫା କରନ୍ତୁ ବାଛନ୍ତୁ।",
  as: "কৃষি সঁজুলিত এটা পৰামৰ্শ দিয়া প্ৰশ্ন বাছনি কৰক বা নিজৰ প্ৰশ্ন লিখি সহায়কক সোধক বাছনি কৰক। নতুন কথোপকথনৰ বাবে চেট পৰিষ্কাৰ কৰক বাছনি কৰক।",
  es: "En Herramientas agrícolas, elige una pregunta sugerida o escribe la tuya y pulsa Preguntar al asistente. Usa Borrar chat para iniciar otra conversación."
};

function text(language, key) {
  if (key === "userManual") return MANUAL_LABELS[language] || MANUAL_LABELS.en;
  return FARM_BUDDY_COPY[key]?.[language] || LIVE_COPY[key]?.[language] || UI_COPY[key]?.[language] || FARM_BUDDY_COPY[key]?.en || LIVE_COPY[key]?.en || UI_COPY[key]?.en || key;
}

function useLiveRefresh(refreshData) {
  const refreshHandler = useRef(refreshData);
  const requestInFlight = useRef(false);
  const refreshQueued = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [hasRefreshError, setHasRefreshError] = useState(false);

  const refresh = useCallback(async () => {
    if (requestInFlight.current) {
      refreshQueued.current = true;
      return;
    }
    requestInFlight.current = true;
    setRefreshing(true);
    try {
      await refreshHandler.current();
      setLastUpdatedAt(Date.now());
      setHasRefreshError(false);
    } catch {
      setHasRefreshError(true);
    } finally {
      requestInFlight.current = false;
      setRefreshing(false);
      if (refreshQueued.current) {
        refreshQueued.current = false;
        window.setTimeout(refresh, 0);
      }
    }
  }, []);

  useEffect(() => {
    refreshHandler.current = refreshData;
    refresh();
  }, [refreshData, refresh]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!document.hidden) refresh();
    }, 120000);
    const refreshWhenVisible = () => {
      if (!document.hidden) refresh();
    };
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [refresh]);

  return { refresh, refreshing, lastUpdatedAt, hasRefreshError };
}

function DataRefreshStatus({ language, refresh, refreshing, lastUpdatedAt, hasRefreshError }) {
  const updatedTime = lastUpdatedAt
    ? new Intl.DateTimeFormat(getIntlLocale(), { hour: "2-digit", minute: "2-digit" }).format(lastUpdatedAt)
    : "";

  return (
    <div className={`data-refresh-status${hasRefreshError ? " has-error" : ""}`} role="status" aria-live="polite">
      <span className="data-refresh-dot" aria-hidden="true" />
      <strong>{text(language, hasRefreshError ? "syncWarning" : "farmData")}</strong>
      <span className="data-refresh-time">
        {lastUpdatedAt ? <><span>{text(language, "updated")}</span> <time>{updatedTime}</time></> : text(language, "refreshingData")}
      </span>
      <button
        className="data-refresh-button"
        type="button"
        onClick={refresh}
        disabled={refreshing}
        title={text(language, "refreshData")}
        aria-label={text(language, "refreshData")}
      >
        <RefreshCw size={16} className={refreshing ? "data-refresh-spinning" : ""} />
      </button>
    </div>
  );
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
    [localize("Soil type"), localize(analysis.result?.soilType)],
    [localize("Confidence"), `${analysis.result?.confidence || 0}%`],
    [localize("Health score"), analysis.result?.healthScore],
    [localize("Risk"), localize(analysis.result?.riskLevel)],
    [localize("Crop"), localize(analysis.input?.crop || "Not set")],
    [localize("Location"), analysis.input?.location || localize("Not set")],
    [localize("Land"), `${analysis.input?.landArea || ""} ${localize(analysis.input?.landUnit || "")}`.trim() || localize("Not set")],
    [localize("Status"), localize(titleCase(analysis.status))]
  ];
  const recommendations = (analysis.result?.recommendations || []).map((item) => `<li>${escapeHtml(localize(item))}</li>`).join("");
  const nutrients = (analysis.result?.nutrients || []).map((item) => `<li>${escapeHtml(localize(item))}</li>`).join("");
  const html = `<!doctype html>
<html>
  <head>
    <title>${escapeHtml(localize("Analysis result"))} · Krishisense</title>
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
    <h1>${escapeHtml(localize("Analysis result"))} · Krishisense</h1>
    <p class="muted">${escapeHtml(formatDate(analysis.createdAt))}</p>
    ${analysis.photoUrl ? `<img src="${escapeHtml(analysis.photoUrl)}" alt="Soil" style="width:180px;height:130px;object-fit:cover;border-radius:8px" />` : ""}
    <table>${rows.map(([label, value]) => `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value == null ? localize("Not available") : value)}</td></tr>`).join("")}</table>
    <section><h2>${escapeHtml(localize("Summary"))}</h2><p>${escapeHtml(localize(analysis.result?.summary || "No summary available."))}</p></section>
    <section><h2>${escapeHtml(localize("Recommendations"))}</h2><ul>${recommendations || localize("<li>No recommendations available.</li>")}</ul></section>
    <section><h2>${escapeHtml(localize("Likely nutrients"))}</h2><ul>${nutrients || localize("<li>No nutrient details available.</li>")}</ul></section>
    <section><h2>${escapeHtml(localize("Irrigation"))}</h2><p>${escapeHtml(localize(analysis.result?.irrigation || "No irrigation note available."))}</p></section>
    <p class="muted">${escapeHtml(localize("AI photo analysis is guidance only. Confirm fertilizer and pH decisions with a lab soil test."))}</p>
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
  setActiveLocale(language);

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
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  const [heroVideoIndex, setHeroVideoIndex] = useState(0);
  const [error, setError] = useState("");
  const [captchaConfig, setCaptchaConfig] = useState({ loading: true, required: true, siteKey: "", error: "" });
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaCycle, setCaptchaCycle] = useState(0);
  const [captchaWidgetError, setCaptchaWidgetError] = useState("");
  const [communityPosts, setCommunityPosts] = useState([]);
  const [communityLoading, setCommunityLoading] = useState(true);
  const [communityKind, setCommunityKind] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    farmName: "",
    phone: ""
  });
  const aboutSectionRef = useRef(null);
  const aboutTrackRef = useRef(null);
  const aboutProgressRef = useRef(null);
  const landingRef = useRef(null);

  useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return undefined;
    const updatePreference = () => setReducedMotion(query.matches);
    query.addEventListener?.("change", updatePreference);
    return () => query.removeEventListener?.("change", updatePreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const timer = window.setTimeout(() => {
      setHeroVideoIndex((index) => (index + 1) % fieldVideos.length);
    }, 10000);
    return () => window.clearTimeout(timer);
  }, [heroVideoIndex, reducedMotion]);

  useEffect(() => {
    const section = aboutSectionRef.current;
    const track = aboutTrackRef.current;
    if (!section || !track) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
      if (reduceMotion) {
        track.style.transform = "none";
        if (aboutProgressRef.current) aboutProgressRef.current.style.transform = "scaleX(0)";
        return;
      }

      const navHeight = document.querySelector(".auth-page-nav")?.offsetHeight || 0;
      const scrollDistance = Math.max(section.offsetHeight - (window.innerHeight - navHeight), 1);
      const progress = Math.min(Math.max(-section.getBoundingClientRect().top / scrollDistance, 0), 1);
      const travel = Math.max(track.scrollWidth - section.clientWidth, 0);
      track.style.transform = `translate3d(${-travel * progress}px, 0, 0)`;
      if (aboutProgressRef.current) aboutProgressRef.current.style.transform = `scaleX(${progress})`;
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    update();
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const root = landingRef.current;
    const targets = root?.querySelectorAll("[data-reveal]");
    if (!root || !targets?.length) return undefined;

    const revealAll = () => targets.forEach((target) => target.classList.add("is-revealed"));
    if (!("IntersectionObserver" in window) || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      revealAll();
      return undefined;
    }

    root.classList.add("landing-reveal-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      root.classList.remove("landing-reveal-ready");
    };
  }, []);

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

  useEffect(() => {
    let active = true;
    apiRequest("/api/community")
      .then(({ posts }) => { if (active) setCommunityPosts(Array.isArray(posts) ? posts : []); })
      .catch(() => { if (active) setCommunityPosts([]); })
      .finally(() => { if (active) setCommunityLoading(false); });
    return () => { active = false; };
  }, []);

  const captchaReady = !captchaConfig.loading
    && !captchaConfig.error
    && (!captchaConfig.required || Boolean(captchaConfig.siteKey && captchaToken));

  const aboutCopy = ABOUT_COPY[language] || ABOUT_COPY.en;
  const filmControlCopy = FILM_CONTROL_COPY[language] || FILM_CONTROL_COPY.en;
  const reviewCopy = LANDING_REVIEW_COPY[language] || LANDING_REVIEW_COPY.en;
  const blogLabel = BLOG_LABELS[language] || BLOG_LABELS.en;
  const journalTitles = JOURNAL_TITLES[language] || JOURNAL_TITLES.en;
  const aboutPanels = [
    {
      title: text(language, "soilAnalysis"),
      description: localize("Upload a soil photo and add your crop and field details to get farm-specific guidance."),
      image: "https://images.unsplash.com/photo-1727620338160-489b7c3dc4c7?auto=format&fit=crop&w=1600&q=82"
    },
    {
      title: text(language, "diseaseDetection"),
      description: localize("Open Disease detection, select the crop, describe the symptoms, and upload a sharp photo of the affected plant."),
      image: "https://images.unsplash.com/photo-1638503206597-cc8703cfe3c2?auto=format&fit=crop&w=1600&q=82"
    },
    {
      title: text(language, "cropPlanner"),
      description: localize("Use Crop planner to record field tasks and due dates; check Farm tools for saved reports, weather, market information, and the assistant."),
      image: "https://images.unsplash.com/photo-1577109559107-8f94d2c68b7d?auto=format&fit=crop&w=1600&q=82"
    }
  ];
  const journalArticles = [
    {
      title: journalTitles[0],
      category: localize("Soil"),
      image: aboutPanels[0].image,
      paragraphs: [
        localize("Upload a soil photo and add your crop and field details to get farm-specific guidance."),
        localize("Use a soil test and local agricultural advice for exact nutrient or pH corrections.")
      ]
    },
    {
      title: journalTitles[1],
      category: localize("Irrigation"),
      image: aboutPanels[2].image,
      paragraphs: [
        localize("Keep water moderate for loamy soil, give shorter gaps for sandy soil, and avoid standing water in clay soil."),
        localize("Use the forecast with a field check before changing irrigation or spraying plans.")
      ]
    },
    {
      title: journalTitles[2],
      category: text(language, "cropPlanner"),
      image: aboutPanels[1].image,
      paragraphs: [
        localize("Control weeds early, apply fertilizer in split doses, and watch for pest or leaf colour changes."),
        localize("Use mandi prices and water availability before deciding how much area to plant.")
      ]
    }
  ];

  function changeMode(nextMode) {
    setMode(nextMode);
    setError("");
    setCaptchaToken("");
    setCaptchaWidgetError("");
    setCaptchaCycle((cycle) => cycle + 1);
  }

  function startRegistration() {
    changeMode("register");
    document.querySelector(".auth-panel")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function openCommunityForm(kind) {
    setCommunityKind(kind);
    window.setTimeout(() => document.getElementById("community-compose")?.scrollIntoView({ behavior: "smooth", block: "center" }), 30);
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
    <main className="auth-shell landing-shell" id="home" ref={landingRef}>
      <nav className="auth-page-nav" aria-label={localize("Homepage navigation")}>
        <a className="auth-nav-brand" href="#home" aria-label="Krishisense home">
          <span className="brand-mark"><Sprout size={18} /></span>
          <strong>Krishisense</strong>
        </a>
        <div className="landing-nav-controls">
          <div className="auth-page-nav-links">
            <a href="#fieldbook">{text(language, "farmTools")}</a>
            <a href="#public-tools">{text(language, "recommendedNextSteps")}</a>
            <a href="#login-panel">{text(language, "login")}</a>
            <a href="#about-krishisense">{aboutCopy[0]}</a>
            <a className="landing-nav-cta" href="#farmer-reviews">{reviewCopy[0]}</a>
            <a className="landing-nav-cta" href="#field-journal">{blogLabel}</a>
          </div>
          <LanguageSwitcher language={language} onChange={onLanguageChange} />
        </div>
      </nav>
      <div className="landing-edition-bar">
        <span className="landing-edition-number">01 <i /></span>
        <span className="landing-edition-label">{aboutCopy[0]}</span>
        <span className="landing-edition-message">{aboutCopy[1]}</span>
        <a href="#fieldbook" aria-label={text(language, "farmTools")}><ChevronRight size={17} /></a>
      </div>
      <section className="auth-visual landing-hero" aria-label="Farm field">
        <img src={fieldImage} alt="Farm field at sunrise" />
        {!reducedMotion && (
          <video
            key={heroVideoIndex}
            className="auth-hero-video"
            autoPlay
            muted
            playsInline
            preload="metadata"
            poster={fieldImage}
            aria-hidden="true"
            tabIndex={-1}
            onError={(event) => { event.currentTarget.style.opacity = "0"; }}
          >
            <source src={fieldVideos[heroVideoIndex]} type="video/mp4" />
          </video>
        )}
        <div className="auth-visual-topline">
          <span className="auth-scene-label"><Sparkles size={15} />{text(language, "farmTools")}</span>
          {!reducedMotion && (
            <div className="landing-film-controls">
              <button
                type="button"
                onClick={() => setHeroVideoIndex((index) => (index - 1 + fieldVideos.length) % fieldVideos.length)}
                aria-label={filmControlCopy[0]}
                title={filmControlCopy[0]}
              ><ChevronLeft size={16} /></button>
              <span className="auth-video-count">{String(heroVideoIndex + 1).padStart(2, "0")} <i /> {String(fieldVideos.length).padStart(2, "0")}</span>
              <button
                type="button"
                onClick={() => setHeroVideoIndex((index) => (index + 1) % fieldVideos.length)}
                aria-label={filmControlCopy[1]}
                title={filmControlCopy[1]}
              ><ChevronRight size={16} /></button>
            </div>
          )}
        </div>
        <div className="auth-hero-copy">
          <div className="brand-lockup">
            <div>
              <p>{text(language, "farmTools")}</p>
              <h1>Krishisense</h1>
              <p className="landing-hero-declaration">{aboutCopy[1]}</p>
            </div>
          </div>
          <p className="auth-hero-description">{aboutCopy[2]}</p>
          <div className="auth-hero-actions">
            <button className="primary-button" type="button" onClick={startRegistration}>
              <UserPlus size={18} />
              {text(language, "createFarmerAccount")}
              <ChevronRight size={17} />
            </button>
            <a className="auth-explore-link" href="#fieldbook">
              {text(language, "farmTools")}
              <ChevronDown size={16} />
            </a>
          </div>
        </div>
        <div className="auth-metrics">
          <span className="auth-metric-card">
            <span className="auth-metric-icon"><FlaskConical size={18} /></span>
            <span className="auth-metric-label">{localize("Photo analysis")}</span>
          </span>
          <span className="auth-metric-card">
            <span className="auth-metric-icon"><Leaf size={18} /></span>
            <span className="auth-metric-label">{localize("Crop guidance")}</span>
          </span>
          <span className="auth-metric-card">
            <span className="auth-metric-icon"><Camera size={18} /></span>
            <span className="auth-metric-label">{localize("AI disease detection")}</span>
          </span>
        </div>
        <div className="landing-hero-index" aria-hidden="true">
          <span>01</span><i /><small>FIELD / SEASON</small>
        </div>
        <a className="hero-scroll-cue" href="#fieldbook" aria-label={text(language, "farmTools")}>
          <span>{text(language, "farmTools")}</span>
          <ChevronDown size={16} />
        </a>
      </section>

      <section className="landing-manifesto" id="fieldbook" aria-labelledby="fieldbook-heading" data-reveal>
        <div className="landing-manifesto-heading">
          <span className="landing-section-kicker"><span>01</span>{text(language, "farmTools")}</span>
          <h2 id="fieldbook-heading">{FIELD_BOOK_HEADLINES[language] || FIELD_BOOK_HEADLINES.en}</h2>
          <p>{aboutCopy[2]}</p>
        </div>
        <div className="landing-story-grid">
          {aboutPanels.map((panel, index) => (
            <article className={`landing-story landing-story-${index + 1}`} key={panel.title} style={{ "--story-order": index }}>
              <div className="landing-story-image">
                <img src={panel.image} alt={panel.title} loading="lazy" />
                <span className="landing-story-number">0{index + 1}</span>
                <span className="landing-story-open" aria-hidden="true"><ChevronRight size={19} /></span>
              </div>
              <div className="landing-story-copy">
                <h3>{index === 0 ? text(language, "soilAnalysis") : index === 1 ? text(language, "diseaseDetection") : text(language, "cropPlanner")}</h3>
                <p>{panel.description}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="landing-manifesto-foot">
          <span>{text(language, "farmTools")}</span>
          <a href="#login-panel">{text(language, "createFarmerAccount")} <ChevronRight size={16} /></a>
        </div>
      </section>

      <div className="landing-marquee" aria-label={text(language, "farmTools")}>
        <div className="landing-marquee-track" aria-hidden="true">
          {[0, 1].map((copy) => (
            <span className="landing-marquee-set" key={copy}>
              {[text(language, "soilAnalysis"), text(language, "diseaseDetection"), text(language, "cropPlanner"), text(language, "market"), text(language, "loans"), text(language, "insurance")].map((item, index) => (
                <span key={`${copy}-${index}`}>{item}<i /></span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <section className="auth-panel" id="login-panel" data-reveal>
        <div className="landing-auth-story">
          <span className="landing-section-kicker"><span>02</span>{text(language, "farmerDesk")}</span>
          <h2>{aboutCopy[1]}</h2>
          <p>{aboutCopy[2]}</p>
          <div className="landing-auth-capabilities">
            <span><FlaskConical size={17} />{text(language, "soilAnalysis")}</span>
            <span><Leaf size={17} />{text(language, "diseaseDetection")}</span>
            <span><CalendarDays size={17} />{text(language, "cropPlanner")}</span>
          </div>
        </div>
        <div className="landing-auth-form">
          <div className="auth-panel-actions">
            <ThemeSwitch theme={theme} onToggle={onThemeToggle} />
          </div>

          <div className="panel-heading auth-panel-heading">
            <span className="auth-heading-icon" aria-hidden="true"><ShieldCheck size={21} /></span>
            <div className="auth-panel-heading-copy">
              <span className="eyebrow">{text(language, "secureAccess")}</span>
              <h2>{text(language, mode === "login" ? "welcomeBack" : "createFarmerAccount")}</h2>
            </div>
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
                {localize("Name")}
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
        </div>
      </section>

      <section className="public-toolkit" id="public-tools" aria-labelledby="public-tools-title" data-reveal>
        <div className="public-toolkit-heading">
          <span className="eyebrow">{text(language, "farmTools")}</span>
          <h2 id="public-tools-title">{localize("Get practical next steps")}</h2>
        </div>
        <div className="public-feature-grid">
          <article className="public-feature">
            <span className="public-feature-icon"><FlaskConical size={21} /></span>
            <h3>{text(language, "soilAnalysis")}</h3>
            <p>{localize("Upload a soil photo and add your crop and field details to get farm-specific guidance.")}</p>
          </article>
          <article className="public-feature">
            <span className="public-feature-icon"><Leaf size={21} /></span>
            <h3>{text(language, "diseaseDetection")}</h3>
            <p>{localize("Open Disease detection, select the crop, describe the symptoms, and upload a sharp photo of the affected plant.")}</p>
          </article>
          <article className="public-feature">
            <span className="public-feature-icon"><CalendarDays size={21} /></span>
            <h3>{text(language, "cropPlanner")}</h3>
            <p>{localize("Use Crop planner to record field tasks and due dates; check Farm tools for saved reports, weather, market information, and the assistant.")}</p>
          </article>
          <article className="public-feature">
            <span className="public-feature-icon"><Bot size={21} /></span>
            <h3>{localize("Ask assistant")}</h3>
            <p>{localize("Ask about crop care, soil, irrigation, pests or planning. You can ask follow-up questions too.")}</p>
          </article>
          <article className="public-feature">
            <span className="public-feature-icon"><ShoppingCart size={21} /></span>
            <h3>{text(language, "market")}</h3>
            <p>{localize("Market orders, loan requests, and insurance applications are submitted from their respective sections and may require admin review.")}</p>
          </article>
          <article className="public-feature">
            <span className="public-feature-icon"><CloudSun size={21} /></span>
            <h3>{localize("Weather")}</h3>
            <p>{localize("Use the forecast with a field check before changing irrigation or spraying plans.")}</p>
          </article>
        </div>
        <div className="public-toolkit-footer">
          <span><ShieldCheck size={17} />{localize("AI photo analysis is guidance only. Confirm fertilizer and pH decisions with a lab soil test.")}</span>
          <button className="secondary-button" type="button" onClick={startRegistration}>
            {text(language, "createFarmerAccount")}
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      <section className="landing-method" aria-labelledby="landing-method-title" data-reveal>
        <div className="landing-method-intro">
          <span className="landing-section-kicker"><span>03</span>{text(language, "recommendedNextSteps")}</span>
          <h2 id="landing-method-title">{text(language, "cropPlanner")}</h2>
          <p>{aboutCopy[2]}</p>
        </div>
        <ol className="landing-steps">
          <li>
            <span className="landing-step-number">01</span>
            <span className="landing-step-icon"><Camera size={20} /></span>
            <h3>{text(language, "soilAnalysis")}</h3>
            <p>{aboutPanels[0].description}</p>
          </li>
          <li>
            <span className="landing-step-number">02</span>
            <span className="landing-step-icon"><Leaf size={20} /></span>
            <h3>{text(language, "diseaseDetection")}</h3>
            <p>{aboutPanels[1].description}</p>
          </li>
          <li>
            <span className="landing-step-number">03</span>
            <span className="landing-step-icon"><CalendarDays size={20} /></span>
            <h3>{text(language, "cropPlanner")}</h3>
            <p>{aboutPanels[2].description}</p>
          </li>
        </ol>
        <div className="landing-method-footer">
          <span><ShieldCheck size={17} />{localize("AI suggestions are general guidance. Check local conditions and product labels before irrigation, fertilizer, or pesticide decisions.")}</span>
          <button className="primary-button" type="button" onClick={startRegistration}>
            {text(language, "createFarmerAccount")} <ChevronRight size={17} />
          </button>
        </div>
      </section>

      <section className="landing-reviews" id="farmer-reviews" aria-labelledby="landing-reviews-title" data-reveal>
        <div className="landing-reviews-heading">
          <div>
            <span className="landing-section-kicker"><span>04</span>{text(language, "farmerDesk")}</span>
            <h2 id="landing-reviews-title">{reviewCopy[0]}</h2>
          </div>
          <div className="landing-reviews-aside">
            <p>{communityText(language, 11)}</p>
            <button className="landing-community-write" type="button" onClick={() => openCommunityForm("review")}>{communityText(language, 0)} <ChevronRight size={16} /></button>
          </div>
        </div>
        {communityLoading ? <p className="landing-community-status" role="status">{communityText(language, 12)}</p> : null}
        <div className="landing-review-grid">
          {communityPosts.filter((post) => post.kind === "review").map((post, index) => (
            <article className="landing-review" key={post.id} style={{ "--story-order": index }}>
              <span className="landing-review-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="landing-review-rating" aria-label={`${post.rating} out of 5 stars`}>{post.rating} / 5</span>
              <blockquote>{post.body}</blockquote>
              <footer><strong>{post.authorName}</strong><time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time></footer>
            </article>
          ))}
          {!communityLoading && !communityPosts.some((post) => post.kind === "review") && (
            <p className="landing-community-status">{communityText(language, 13)}</p>
          )}
        </div>
        {communityKind === "review" && (
          <CommunitySubmissionForm kind="review" language={language} theme={theme} captchaConfig={captchaConfig} onClose={() => setCommunityKind("")} />
        )}
      </section>

      <section className="landing-journal" id="field-journal" aria-labelledby="landing-journal-title" data-reveal>
        <div className="landing-journal-heading">
          <span className="landing-section-kicker"><span>05</span>{localize("Krishisense quick guide")}</span>
          <h2 id="landing-journal-title">{blogLabel}</h2>
          <p>{JOURNAL_INTRO[language] || JOURNAL_INTRO.en}</p>
          <button className="landing-community-write" type="button" onClick={() => openCommunityForm("blog")}>{communityText(language, 1)} <ChevronRight size={16} /></button>
        </div>
        <div className="landing-community-blogs">
          <h3>{communityText(language, 2)}</h3>
          {communityPosts.filter((post) => post.kind === "blog").map((post) => (
            <details className="landing-community-blog" key={post.id}>
              <summary><span><strong>{post.title}</strong><small>{post.authorName} · {formatDate(post.createdAt)}</small></span><ChevronDown size={18} /></summary>
              <p>{post.body}</p>
            </details>
          ))}
          {!communityLoading && !communityPosts.some((post) => post.kind === "blog") && (
            <p className="landing-community-status">{communityText(language, 14)}</p>
          )}
        </div>
        {communityKind === "blog" && (
          <CommunitySubmissionForm kind="blog" language={language} theme={theme} captchaConfig={captchaConfig} onClose={() => setCommunityKind("")} />
        )}
        <div className="landing-journal-subheading"><span className="landing-section-kicker">{localize("Field notes")}</span><p>{JOURNAL_INTRO[language] || JOURNAL_INTRO.en}</p></div>
        <div className="landing-journal-grid">
          {journalArticles.map((article, index) => (
            <details className="landing-journal-entry" key={`${language}-${article.title}`} style={{ "--story-order": index }}>
              <summary>
                <span className="landing-journal-image">
                  <img src={article.image} alt="" loading="lazy" />
                  <span className="landing-journal-number">0{index + 1}</span>
                </span>
                <span className="landing-journal-meta">
                  <span>{article.category}</span>
                  <ChevronDown size={18} aria-hidden="true" />
                </span>
                <span className="landing-journal-title">{article.title}</span>
              </summary>
              <div className="landing-journal-copy">
                {article.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </details>
          ))}
        </div>
        <div className="landing-journal-footer">
          <span><ShieldCheck size={17} />{localize("AI suggestions are general guidance. Check local conditions and product labels before irrigation, fertilizer, or pesticide decisions.")}</span>
          <a href="#farmer-reviews">{reviewCopy[0]} <ChevronRight size={16} /></a>
        </div>
      </section>

      <section
        ref={aboutSectionRef}
        className="about-scroll"
        id="about-krishisense"
        aria-labelledby="about-heading"
        data-reveal
      >
        <div className="about-stage">
          <div className="about-track" ref={aboutTrackRef}>
            <article className="about-panel about-panel-intro" aria-labelledby="about-heading">
              <div className="about-copy">
                <span className="about-eyebrow">{aboutCopy[0]}</span>
                <h2 id="about-heading">{aboutCopy[1]}</h2>
                <p>{aboutCopy[2]}</p>
                <span className="about-index">01 <i /> 04</span>
              </div>
              <div className="about-image-wrap">
                <img src={fieldImage} alt={localize("Farm field at sunrise")} loading="lazy" />
                <span className="about-image-caption">Krishisense <Sprout size={16} /></span>
              </div>
            </article>

            {aboutPanels.map((panel, index) => (
              <article
                className={`about-panel${index % 2 === 0 ? " about-panel-reverse" : ""}`}
                key={panel.title}
                aria-labelledby={`about-panel-${index + 2}-heading`}
              >
                <div className="about-copy">
                  <span className="about-eyebrow">{aboutCopy[0]}</span>
                  <h2 id={`about-panel-${index + 2}-heading`}>{panel.title}</h2>
                  <p>{panel.description}</p>
                  <span className="about-index">{String(index + 2).padStart(2, "0")} <i /> 04</span>
                  {index === aboutPanels.length - 1 && (
                    <button className="primary-button about-cta" type="button" onClick={startRegistration}>
                      <UserPlus size={17} />
                      {text(language, "createFarmerAccount")}
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
                <div className="about-image-wrap">
                  <img src={panel.image} alt={panel.title} loading="lazy" />
                  <span className="about-image-caption">{panel.title}</span>
                </div>
              </article>
            ))}
          </div>
          <div className="about-progress" aria-hidden="true">
            <span ref={aboutProgressRef} />
          </div>
        </div>
      </section>
    </main>
  );
}

function CommunitySubmissionForm({ kind, language, theme, captchaConfig, onClose }) {
  const [form, setForm] = useState({ authorName: "", title: "", body: "", rating: "5", website: "" });
  const [token, setToken] = useState("");
  const [captchaCycle, setCaptchaCycle] = useState(0);
  const [captchaError, setCaptchaError] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const isReview = kind === "review";

  async function submit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (captchaConfig.loading || captchaConfig.error || (captchaConfig.required && !token)) {
      setError(captchaConfig.error || localize("Complete the human verification check first."));
      return;
    }
    const validation = communityClientSchema.safeParse(form);
    if (!validation.success) {
      setError(firstValidationMessage(validation));
      return;
    }
    setBusy(true);
    try {
      await apiRequest("/api/community", {
        method: "POST",
        body: { ...validation.data, kind, turnstileToken: token }
      });
      setMessage(COMMUNITY_SUCCESS[language] || COMMUNITY_SUCCESS.en);
      setForm({ authorName: "", title: "", body: "", rating: "5", website: "" });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setBusy(false);
      setToken("");
      setCaptchaError("");
      setCaptchaCycle((cycle) => cycle + 1);
    }
  }

  return (
    <form className="community-compose" id="community-compose" onSubmit={submit}>
      <div className="community-compose-heading">
        <div><span className="eyebrow">{isReview ? communityText(language, 0) : communityText(language, 1)}</span><h3>{isReview ? communityText(language, 8) : communityText(language, 9)}</h3></div>
        <button className="icon-button" type="button" onClick={onClose} aria-label={localize("Close form")}><ChevronUp size={18} /></button>
      </div>
      <div className="community-compose-fields">
        <label>{communityText(language, 3)}<input required minLength={2} maxLength={80} value={form.authorName} onChange={(event) => setForm({ ...form, authorName: event.target.value })} /></label>
        {isReview ? (
          <label>{communityText(language, 4)}<select value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })}><option value="5">5 / 5</option><option value="4">4 / 5</option><option value="3">3 / 5</option><option value="2">2 / 5</option><option value="1">1 / 5</option></select></label>
        ) : (
          <label>{communityText(language, 5)}<input required minLength={4} maxLength={140} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
        )}
        <label className="community-compose-body">{isReview ? communityText(language, 6) : communityText(language, 7)}<textarea required minLength={20} maxLength={1800} rows={5} value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} /></label>
        <input className="community-honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} />
      </div>
      {captchaConfig.loading ? <p className="turnstile-status">{localize("Loading security check…")}</p> : captchaConfig.required && captchaConfig.siteKey ? (
        <div className="auth-captcha">
          <TurnstileWidget key={captchaCycle} siteKey={captchaConfig.siteKey} action="community" theme={theme} onToken={setToken} onError={setCaptchaError} />
          {captchaError && <div className="turnstile-error-row"><p className="turnstile-status error">{captchaError}</p><button className="small-button" type="button" onClick={() => { setCaptchaError(""); setToken(""); setCaptchaCycle((cycle) => cycle + 1); }}>Retry</button></div>}
        </div>
      ) : captchaConfig.error ? <p className="turnstile-status error">{captchaConfig.error}</p> : null}
      {error && <p className="error-banner" role="alert">{error}</p>}
      {message && <p className="success-banner" role="status">{message}</p>}
      <div className="community-compose-actions"><button className="primary-button" disabled={busy || captchaConfig.loading || (captchaConfig.required && !token)}>{busy ? localize("Sending…") : communityText(language, 10)} <ChevronRight size={16} /></button><span>{communityText(language, 11)}</span></div>
    </form>
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
        <AdminDashboard token={session.token} language={language} />
      ) : (
        <FarmerDashboard token={session.token} user={session.user} language={language} onFarmChange={setFarmName} />
      )}
      <FarmBuddy language={language} />
    </main>
  );
}

function FarmBuddy({ language }) {
  const [open, setOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const tipKeys = ["moisture", "scout", "compost", "spray"];

  return (
    <aside className="farm-buddy" aria-label={text(language, "name")}>
      {open && (
        <section className="farm-buddy-tip" aria-live="polite">
          <div className="farm-buddy-tip-heading">
            <span><Sprout size={16} />{text(language, "tipTitle")}</span>
            <button type="button" onClick={() => setOpen(false)} aria-label={text(language, "closeTip")} title={text(language, "closeTip")}>
              <ChevronDown size={17} />
            </button>
          </div>
          <p>{text(language, tipKeys[tipIndex])}</p>
          <button className="farm-buddy-next" type="button" onClick={() => setTipIndex((index) => (index + 1) % tipKeys.length)}>
            <RefreshCw size={14} />{text(language, "nextTip")}
          </button>
        </section>
      )}
      <button
        className={`farm-buddy-trigger${open ? " is-open" : ""}`}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`${text(language, "name")}: ${text(language, open ? "closeTip" : "tipTitle")}`}
        aria-expanded={open}
        title={text(language, "name")}
      >
        <span className="farm-buddy-scene" aria-hidden="true">
          <svg className="farm-buddy-plough-scene" viewBox="0 0 84 72" focusable="false">
            <circle className="plough-sun" cx="72" cy="11" r="5" />
            <path className="plough-horizon" d="M5 53 Q21 49 37 53 T79 52" />
            <path className="plough-furrow" d="M8 61 Q27 56 46 61 T81 60" />
            <path className="plough-furrow plough-furrow-back" d="M12 67 Q30 62 49 67 T82 66" />
            <circle className="plough-soil" cx="74" cy="58" r="1.5" />
            <circle className="plough-soil plough-soil-back" cx="71" cy="60" r="1.1" />
            <g className="plough-tool">
              <path d="M54 36 64 45 68 56" />
              <path d="M57 35 67 43 72 54" />
              <path d="M64 45 72 48 75 57" />
              <path className="plough-blade" d="m69 56 7 1-4 4z" />
            </g>
            <g className="plough-farmer">
              <g className="plough-legs">
                <path d="m39 43-7 10 1 3" />
                <path d="m45 43 4 9-2 4" />
              </g>
              <path className="plough-body" d="M36 28q5-2 9 2l4 13-11 4-7-11z" />
              <circle className="plough-head" cx="39" cy="23" r="5" />
              <path className="plough-hat" d="M32 19q1-6 8-6 6 0 8 5l-3 2H32zm-2 1h21v2H30z" />
              <path className="plough-arm plough-arm-front" d="m42 31 8 2 8 4-2 3-11-3-7-1z" />
              <path className="plough-arm" d="m36 32-5 5 9 5 2-3-5-4 5-2z" />
            </g>
          </svg>
        </span>
      </button>
    </aside>
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

  const loadAnalyses = useCallback(async () => {
    try {
      const data = await apiRequest(withFarm("/api/analyses", activeFarmId), { token });
      setAnalyses(data.analyses);
    } finally {
      setLoading(false);
    }
  }, [token, activeFarmId]);

  const loadLoans = useCallback(async () => {
    const data = await apiRequest(withFarm("/api/loans", activeFarmId), { token });
    setLoans(data.loans);
  }, [token, activeFarmId]);

  const loadMarket = useCallback(async () => {
    const data = await apiRequest(withFarm("/api/market", activeFarmId), { token });
    setMarket(data);
  }, [token, activeFarmId]);

  const loadDiseases = useCallback(async () => {
    const data = await apiRequest(withFarm("/api/diseases", activeFarmId), { token });
    setDiseases(data.diseases);
  }, [token, activeFarmId]);

  const loadInsurance = useCallback(async () => {
    const data = await apiRequest(withFarm("/api/insurance", activeFarmId), { token });
    setInsurance(data.insurance);
  }, [token, activeFarmId]);

  const loadTasks = useCallback(async () => {
    const data = await apiRequest(withFarm("/api/tasks", activeFarmId), { token });
    setTasks(data.tasks);
  }, [token, activeFarmId]);

  const refreshFarmData = useCallback(async () => {
    await Promise.all([loadAnalyses(), loadLoans(), loadMarket(), loadDiseases(), loadInsurance(), loadTasks()]);
  }, [loadAnalyses, loadLoans, loadMarket, loadDiseases, loadInsurance, loadTasks]);

  const sync = useLiveRefresh(refreshFarmData);

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
        <DataRefreshStatus language={language} {...sync} />
        {activeView === "analysis" && (
          <section
            className="farmer-editorial-hero"
            style={{ backgroundImage: `linear-gradient(90deg, rgba(4, 17, 11, 0.92) 0%, rgba(4, 17, 11, 0.66) 52%, rgba(4, 17, 11, 0.18) 100%), url("${fieldImage}")` }}
            aria-labelledby="farmer-editorial-title"
          >
            <div className="farmer-editorial-copy">
              <span className="farmer-editorial-kicker"><i />{localize("Field health snapshot")}</span>
              <h1 id="farmer-editorial-title">{activeFarm?.name || text(language, "mainFarm")}</h1>
              <p>{localize("Soil decisions for every field")}</p>
              <div className="farmer-editorial-actions">
                <button className="editorial-primary" type="button" onClick={() => document.getElementById("soil-report-form")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" })}>
                  <FlaskConical size={16} />{text(language, "soilAnalysis")}
                </button>
                <button className="editorial-secondary" type="button" onClick={() => setActiveView("tools")}>
                  <CloudSun size={16} />{text(language, "farmTools")}
                </button>
              </div>
            </div>
            <div className="farmer-editorial-reading">
              <span>{text(language, "latestSoil")}</span>
              <strong>{latest?.result?.soilType ? localize(latest.result.soilType) : localize("No soil report yet")}</strong>
              {latest?.result?.healthScore != null && <small>{localize("Health score")} · {latest.result.healthScore}</small>}
            </div>
            <span className="farmer-editorial-index" aria-hidden="true">{new Intl.NumberFormat(getIntlLocale(), { minimumIntegerDigits: 2 }).format(1)}</span>
          </section>
        )}
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

        {activeView === "analysis" && <SoilAnalysisForm key={activeFarmId} token={token} farmId={activeFarmId} activeFarm={activeFarm} language={language} onCreated={loadAnalyses} />}
        {activeView === "identify" && <SoilIdentifierUpload key={activeFarmId} token={token} farmId={activeFarmId} language={language} onCreated={loadAnalyses} />}
        {activeView === "history" && <AnalysisHistory analyses={analyses} loading={loading} />}
        {activeView === "planner" && <CropTaskPlanner key={activeFarmId} token={token} farm={activeFarm} farmId={activeFarmId} tasks={tasks} language={language} onChanged={loadTasks} />}
        {activeView === "disease" && <DiseaseDetectionPanel key={activeFarmId} token={token} farmId={activeFarmId} language={language} diseases={diseases} onChanged={loadDiseases} />}
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
      title: text(language, "changeLanguage"),
      titleIsLocalized: true,
      steps: [MANUAL_LANGUAGE_STEP[language] || MANUAL_LANGUAGE_STEP.en],
      action: "",
      view: ""
    },
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
        MANUAL_ASSISTANT_STEP[language] || MANUAL_ASSISTANT_STEP.en,
        ledgerText(language, "manualCompleteTask"),
        ledgerText(language, "logbookNote"),
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
          <h2 id="user-manual-title">{localize("Krishisense quick guide")}</h2>
        </div>
      </div>
      <p className="user-manual-intro">{localize("Follow these steps to set up a farm, understand your reports, and use the main tools.")}</p>
      <div className="user-manual-topics">
        {manualSections.map((section, index) => (
          <article className="user-manual-topic" key={section.title}>
            <span className="eyebrow">{new Intl.NumberFormat(getIntlLocale(), { minimumIntegerDigits: 2 }).format(index + 1)}</span>
            <h3>{section.titleIsLocalized ? section.title : localize(section.title)}</h3>
            <ol>
              {section.steps.map((step) => <li key={step}>{localize(step)}</li>)}
            </ol>
            {section.action && (
              <button className="small-button" type="button" onClick={() => onNavigate(section.view)}>
                {localize(section.action)}<ChevronRight size={15} />
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

function CropTaskPlanner({ token, farm, farmId, tasks, language, onChanged }) {
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
  const [completionTaskId, setCompletionTaskId] = useState("");
  const [completionForm, setCompletionForm] = useState({ actualCost: "", harvestQuantity: "", harvestUnit: "quintal", saleProceeds: "" });
  const todayStart = new Date(new Date().toDateString());
  const pending = tasks.filter((task) => task.status === "planned");
  const overdueCount = pending.filter((task) => new Date(task.dueDate) < todayStart).length;
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const loggedCosts = completedTasks.reduce((sum, task) => sum + Number(task.actualCost || 0), 0);
  const recordedSales = completedTasks.reduce((sum, task) => sum + Number(task.saleProceeds || 0), 0);
  const harvestRecords = completedTasks.filter((task) => task.category === "harvest" && Number(task.harvestQuantity || 0) > 0);

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

  function openCompletionRecord(task) {
    setCompletionTaskId(task.id);
    setCompletionForm({
      actualCost: task.actualCost ? String(task.actualCost) : "",
      harvestQuantity: task.harvestQuantity ? String(task.harvestQuantity) : "",
      harvestUnit: task.harvestUnit || "quintal",
      saleProceeds: task.saleProceeds ? String(task.saleProceeds) : ""
    });
    setError("");
  }

  async function completeTask(event, task) {
    event.preventDefault();
    const parsed = farmTaskRecordClientSchema.safeParse(completionForm);
    if (!parsed.success) {
      setError(firstValidationMessage(parsed));
      return;
    }
    setBusy(task.id);
    setError("");
    setMessage("");
    try {
      await apiRequest(`/api/tasks/${task.id}/status`, {
        token,
        method: "PATCH",
        body: { status: "completed", ...parsed.data }
      });
      setCompletionTaskId("");
      setMessage(ledgerText(language, "completedLogbookMessage"));
      await onChanged();
    } catch (err) {
      setError(err.message || "Could not complete task.");
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
        <section className="farm-logbook" aria-label="Farm logbook">
          <div className="farm-logbook-heading">
            <span className="farm-logbook-icon"><BookOpen size={18} /></span>
            <div>
              <span className="eyebrow">{ledgerText(language, "fieldRecords")}</span>
              <h3>{ledgerText(language, "farmLogbook")}</h3>
              <p>{ledgerText(language, "logbookNote")}</p>
            </div>
          </div>
          <div className="farm-logbook-metrics">
            <div><span>{ledgerText(language, "loggedCosts")}</span><strong>{formatMoney(loggedCosts)}</strong></div>
            <div><span>{ledgerText(language, "recordedSales")}</span><strong>{formatMoney(recordedSales)}</strong></div>
            <div><span>{ledgerText(language, "harvestLogs")}</span><strong>{harvestRecords.length}</strong></div>
          </div>
        </section>
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
                    {task.status === "completed" && (Number(task.actualCost || 0) > 0 || Number(task.harvestQuantity || 0) > 0 || Number(task.saleProceeds || 0) > 0) && (
                      <div className="task-ledger-chips">
                        {Number(task.actualCost || 0) > 0 && <span><Wallet size={13} /> {ledgerText(language, "spent")} {formatMoney(task.actualCost)}</span>}
                        {Number(task.harvestQuantity || 0) > 0 && <span><Wheat size={13} /> {task.harvestQuantity} {task.harvestUnit || "quintal"}</span>}
                        {Number(task.saleProceeds || 0) > 0 && <span><Banknote size={13} /> {ledgerText(language, "sales")} {formatMoney(task.saleProceeds)}</span>}
                      </div>
                    )}
                    {completionTaskId === task.id && (
                      <form className="task-completion-form" onSubmit={(event) => completeTask(event, task)}>
                        <strong>{ledgerText(language, "actualResults")}</strong>
                        <div className="task-record-fields">
                          <label>
                            {ledgerText(language, "actualCost")}
                            <input type="number" min="0" max="100000000" step="0.01" value={completionForm.actualCost} onChange={(event) => setCompletionForm({ ...completionForm, actualCost: event.target.value })} placeholder="0" />
                          </label>
                          {task.category === "harvest" && (
                            <>
                              <label>
                                {ledgerText(language, "harvestQuantity")}
                                <span className="task-quantity-input">
                                  <input type="number" min="0" max="100000000" step="0.01" value={completionForm.harvestQuantity} onChange={(event) => setCompletionForm({ ...completionForm, harvestQuantity: event.target.value })} placeholder="0" />
                                  <select value={completionForm.harvestUnit} onChange={(event) => setCompletionForm({ ...completionForm, harvestUnit: event.target.value })} aria-label="Harvest unit">
                                    <option value="kg">kg</option>
                                    <option value="quintal">quintal</option>
                                    <option value="tonne">tonne</option>
                                  </select>
                                </span>
                              </label>
                              <label>
                                {ledgerText(language, "saleProceeds")}
                                <input type="number" min="0" max="1000000000" step="0.01" value={completionForm.saleProceeds} onChange={(event) => setCompletionForm({ ...completionForm, saleProceeds: event.target.value })} placeholder="0" />
                              </label>
                            </>
                          )}
                        </div>
                        <div className="task-completion-actions">
                          <button className="small-button" disabled={busy === task.id}>
                            <CheckCircle2 size={15} />
                            {busy === task.id ? ledgerText(language, "saving") : ledgerText(language, "saveComplete")}
                          </button>
                          <button className="secondary-button" type="button" onClick={() => setCompletionTaskId("")}>{ledgerText(language, "cancel")}</button>
                        </div>
                      </form>
                    )}
                  </div>
                  <div className="task-actions">
                    <button className="icon-button" type="button" disabled={busy === task.id} onClick={() => task.status === "completed" ? updateTask(task, "planned") : openCompletionRecord(task)} title={task.status === "completed" ? "Reopen task" : "Complete and log results"} aria-label={task.status === "completed" ? "Reopen task" : "Complete and log results"}>
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

function SoilAnalysisForm({ token, farmId, activeFarm, language, onCreated }) {
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
      body.append("language", language);
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
      <section className="form-card" id="soil-report-form">
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

function SoilIdentifierUpload({ token, farmId, language, onCreated }) {
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
      body.append("language", language);
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
        <WeatherTool key={activeFarm?.id || activeFarm?.name || "farm"} latest={latest} diseases={diseases} tasks={tasks} farm={activeFarm} language={language} />
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

function WeatherTool({ latest, diseases, tasks, farm, language }) {
  const locationKey = `krishsense-weather-location:${farm?.id || farm?.name || "default"}`;
  const [location, setLocation] = useState(() => {
    try {
      return localStorage.getItem(locationKey) || farm?.location || latest?.input?.location || "Delhi";
    } catch {
      return farm?.location || latest?.input?.location || "Delhi";
    }
  });
  const [weather, setWeather] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const locale = getIntlLocale();

  async function loadWeather(event) {
    event?.preventDefault();
    setBusy(true);
    setError("");
    try {
      const place = encodeURIComponent(location.trim() || "Delhi");
      const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${place}&count=1&language=${encodeURIComponent(language || "en")}&format=json`);
      if (!geoResponse.ok) throw new Error("Weather lookup failed.");
      const geoData = await geoResponse.json();
      const match = geoData.results?.[0];
      if (!match) throw new Error(localize("Location not found."));

      const forecastResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${match.latitude}&longitude=${match.longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max&forecast_days=7&timezone=auto`
      );
      if (!forecastResponse.ok) throw new Error("Weather lookup failed.");
      const forecast = await forecastResponse.json();
      const daily = forecast.daily || {};
      const days = (daily.time || []).map((date, index) => ({
        date,
        code: Number(daily.weather_code?.[index] ?? 3),
        high: Math.round(daily.temperature_2m_max?.[index] ?? 0),
        low: Math.round(daily.temperature_2m_min?.[index] ?? 0),
        rainChance: Math.round(daily.precipitation_probability_max?.[index] ?? 0),
        rain: Math.round(daily.precipitation_sum?.[index] ?? 0),
        wind: Math.round(daily.wind_speed_10m_max?.[index] ?? 0)
      }));
      setWeather({
        name: `${match.name}${match.admin1 ? `, ${match.admin1}` : ""}`,
        temp: Math.round(forecast.current?.temperature_2m || 0),
        humidity: Math.round(forecast.current?.relative_humidity_2m || 0),
        rain: Math.round(daily.precipitation_probability_max?.[0] || forecast.current?.precipitation || 0),
        wind: Math.round(forecast.current?.wind_speed_10m || 0),
        days,
        updatedAt: new Date().toISOString()
      });
      try {
        localStorage.setItem(locationKey, location.trim() || match.name);
      } catch {
        // Weather lookup still works when browser storage is unavailable.
      }
    } catch (err) {
      setError(localize(err.message || "Weather lookup failed."));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    loadWeather();
  }, []);

  const pendingTasks = tasks.filter((task) => task.status === "planned");
  const overdueTasks = pendingTasks.filter((task) => new Date(task.dueDate) < new Date(new Date().toDateString()));
  const severeDisease = diseases.find((report) => String(report.result?.severity || "").toLowerCase() === "high");
  const healthScore = Number(latest?.result?.healthScore);
  const weatherActions = weather ? buildWeatherActions(weather.days || []) : [];
  const farmActions = [];
  const dueSoonTask = pendingTasks
    .filter((task) => {
      const dueTime = new Date(task.dueDate).getTime();
      return dueTime >= Date.now() && dueTime <= Date.now() + 3 * 24 * 60 * 60 * 1000;
    })
    .sort((first, second) => new Date(first.dueDate) - new Date(second.dueDate))[0];
  if (dueSoonTask) {
    farmActions.push({ icon: <Clock3 size={16} />, title: localize("Upcoming farm task"), detail: `${dueSoonTask.title} · ${formatDay(dueSoonTask.dueDate)}`, tone: "watch" });
  }
  if (overdueTasks.length) {
    farmActions.push({ icon: <CalendarDays size={16} />, title: localize("Farm plan needs attention"), detail: localize(`${overdueTasks.length} overdue task${overdueTasks.length === 1 ? "" : "s"} to review or reschedule.`), tone: "attention" });
  }
  if (severeDisease) {
    farmActions.push({ icon: <AlertTriangle size={16} />, title: localize("Recent high-severity disease alert"), detail: localize("Inspect the affected crop and confirm the diagnosis with a local agriculture expert before treatment."), tone: "attention" });
  }
  if (latest && (latest.result?.riskLevel === "High" || (Number.isFinite(healthScore) && healthScore < 60))) {
    farmActions.push({ icon: <FlaskConical size={16} />, title: localize("Review your latest soil report"), detail: localize("Check its nutrient and drainage notes; confirm important fertilizer decisions with a soil test."), tone: "watch" });
  }
  const actionItems = [...weatherActions, ...farmActions].slice(0, 4);

  return (
    <section className="tool-card weather-card">
      <div className="tool-heading">
        <CloudSun size={22} />
        <div>
          <span className="eyebrow">{localize("Weather")}</span>
          <h3>{localize("Field forecast")}</h3>
        </div>
      </div>
      <form className="inline-tool-form" onSubmit={loadWeather}>
        <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder={localize("Village or city")} aria-label={localize("Village or city")} />
        <button className="small-button" disabled={busy}>
          <RefreshCw size={15} />
          {busy ? localize("Checking") : localize("Check forecast")}
        </button>
      </form>
      {error && <p className="error-banner" role="alert">{error}</p>}
      {weather && (
        <>
          <div className="weather-current-row">
            <div>
              <strong>{weather.name}</strong>
              <p>{localize("Current conditions")} · {new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(new Date(weather.updatedAt))}</p>
            </div>
            <span className="weather-current-temp">{weather.temp}°C</span>
            <span><Droplets size={15} /> {weather.humidity}% {localize("humidity")}</span>
            <span><Wind size={15} /> {weather.wind} km/h</span>
          </div>
          <div className="weather-days" aria-label={localize("Seven-day forecast")}>
            {weather.days.map((day, index) => {
              const dayLabel = index === 0 ? localize("Today") : new Intl.DateTimeFormat(locale, { weekday: "short" }).format(new Date(`${day.date}T12:00:00`));
              const WeatherIcon = weatherIconForCode(day.code);
              return (
                <article className={`weather-day ${day.rainChance >= 65 || day.wind >= 30 || day.high >= 36 ? "weather-day-watch" : ""}`} key={day.date}>
                  <strong>{dayLabel}</strong>
                  <small>{new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(new Date(`${day.date}T12:00:00`))}</small>
                  <WeatherIcon size={22} aria-hidden="true" />
                  <span className="weather-day-temp">{day.high}° <small>{day.low}°</small></span>
                  <span><Droplets size={13} /> {day.rainChance}%</span>
                  <span><Wind size={13} /> {day.wind} km/h</span>
                </article>
              );
            })}
          </div>
          <div className="field-action-brief">
            <div className="field-action-heading">
              <div>
                <span className="eyebrow">{localize("Personalized for this farm")}</span>
                <h4>{localize("Field action brief")}</h4>
              </div>
              <span className="field-action-count">{actionItems.length} {localize("signals")}</span>
            </div>
            {actionItems.length ? (
              <div className="field-action-list">
                {actionItems.map((item, index) => (
                  <article className={`field-action-item ${item.tone || "watch"}`} key={`${item.title}-${index}`}>
                    <span className="field-action-icon">{item.icon}</span>
                    <div><strong>{item.title}</strong><p>{item.detail}</p></div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="field-action-clear">{pendingTasks.length ? localize("No high-priority weather, soil, or disease signals. Keep following your planned farm tasks.") : localize("No high-priority weather, soil, or disease signals. Add routine scouting to your farm plan.")}</p>
            )}
          </div>
          <p className="weather-source-note">
            {localize("Forecast guidance is a planning prompt, not a substitute for field checks or local expert advice.")}
            <span className="weather-attribution">Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a>.</span>
          </p>
        </>
      )}
    </section>
  );
}

function weatherIconForCode(code) {
  if (code === 0 || code === 1) return Sun;
  if (code === 2 || code === 3 || code === 45 || code === 48) return Cloud;
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code)) return CloudRain;
  return CloudSun;
}

function buildWeatherActions(days) {
  const actions = [];
  const rainDay = days.slice(0, 3).find((day) => day.rainChance >= 65 || day.rain >= 15);
  const windDay = days.slice(0, 3).find((day) => day.wind >= 30);
  const heatDay = days.slice(0, 3).find((day) => day.high >= 36);
  const dayName = (day) => new Intl.DateTimeFormat(getIntlLocale(), { weekday: "long" }).format(new Date(`${day.date}T12:00:00`));

  if (rainDay) actions.push({
    icon: <CloudRain size={16} />,
    title: localize("Rain watch"),
    detail: localize(`Rain is possible on ${dayName(rainDay)} (${rainDay.rainChance}% chance). Review irrigation plans and check field drainage.`),
    tone: "watch"
  });
  if (windDay) actions.push({
    icon: <Wind size={16} />,
    title: localize("Wind watch"),
    detail: localize(`Wind may reach ${windDay.wind} km/h on ${dayName(windDay)}. Check conditions and product-label directions before any spraying.`),
    tone: "attention"
  });
  if (heatDay) actions.push({
    icon: <Sun size={16} />,
    title: localize("Heat watch"),
    detail: localize(`Highs near ${heatDay.high}°C are forecast for ${dayName(heatDay)}. Scout for crop stress and use local irrigation guidance.`),
    tone: "attention"
  });
  return actions;
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
  const threadRef = useRef(null);
  const crop = farm?.primaryCrop || latest?.input?.crop;
  const quickQuestions = [
    "What should I do next this week?",
    "How should I care for my crop this week?",
    "How can I check whether my crop has a disease?",
    "How do I use a battery sprayer safely?"
  ];

  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTo({ top: thread.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function askAssistant(event) {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (trimmedQuestion.length < 3) {
      setError(localize("Ask a farming question with at least 3 characters."));
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
            soilRisk: latest?.result?.riskLevel || "",
            crop: crop || "",
            location: farm?.location || latest?.input?.location || "",
            healthScore: latest?.result?.healthScore || "",
            farmName: farm?.name || "",
            farmArea: farm?.landArea ? `${farm.landArea} ${farm.landUnit || ""}`.trim() : "",
            latestDisease: latestDisease?.result?.diseaseName || latestDisease?.diseaseName || "",
            latestDiseaseSeverity: latestDisease?.result?.severity || latestDisease?.severity || "",
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
      if (typeof data.answer !== "string" || !data.answer.trim()) {
        throw new Error("The assistant returned an empty answer. Please try again.");
      }
      setMessages((current) => [
        ...current,
        { role: "user", content: trimmedQuestion },
        { role: "assistant", content: data.answer, source: data.source || "unknown" }
      ].slice(-20));
      setQuestion("");
    } catch {
      setError(localize("Assistant failed."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="tool-card assistant-card">
      <div className="tool-heading">
        <Bot size={22} />
        <div>
          <span className="eyebrow">{localize("AI farming assistant")}{farm?.name ? ` · ${farm.name}` : ""}</span>
          <h3>{localize("Get practical next steps")}</h3>
        </div>
      </div>
      <p className="assistant-context-note">
        {localize("Answers use this farm’s crop, saved reports and upcoming tasks. Check local weather, product labels and soil-test results before acting.")}
      </p>
      <div className="assistant-thread" ref={threadRef} aria-live="polite" aria-label={localize("Assistant conversation")}>
        {messages.length === 0 ? (
          <p className="assistant-welcome">{localize("Ask about crop care, soil, irrigation, pests or planning. You can ask follow-up questions too.")}</p>
        ) : messages.map((message, index) => (
          <article className={`assistant-message ${message.role}`} key={`${message.role}-${index}`}>
            <span>{message.role === "assistant" ? (message.source === "fallback" ? localize("General guidance · AI unavailable") : "Krishisense") : localize("You")}</span>
            <div>{assistantAnswerLines(message.content).map((line, lineIndex) => <p key={`${line}-${lineIndex}`}>{message.role === "assistant" ? localize(line) : line}</p>)}</div>
          </article>
        ))}
        {busy && <p className="assistant-thinking"><span className="loading-dot" /> {localize("Preparing farm-specific guidance…")}</p>}
      </div>
      <form className="assistant-form" onSubmit={askAssistant}>
        <textarea
          rows={3}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={localize("Ask a farming question or a follow-up…")}
          required
        />
        <div className="assistant-quick-row">
          {quickQuestions.map((item) => (
            <button className="chip-button" type="button" key={item} disabled={busy} onClick={() => setQuestion(item)}>
              {localize(item)}
            </button>
          ))}
        </div>
        <div className="assistant-actions">
          <button className="primary-button" disabled={busy || question.trim().length < 3}>
            <Bot size={17} />
            {busy ? localize("Thinking") : localize("Ask assistant")}
          </button>
          {messages.length > 0 && <button className="small-button" type="button" disabled={busy} onClick={() => setMessages([])}>{localize("Clear chat")}</button>}
        </div>
      </form>
      {error && <p className="error-banner">{error}</p>}
    </section>
  );
}

function DiseaseDetectionPanel({ token, farmId, language, diseases, onChanged }) {
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
      payload.append("language", language);
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

function AdminDashboard({ token, language }) {
  const [tab, setTab] = useState("overview");
  const [analyses, setAnalyses] = useState([]);
  const [insurance, setInsurance] = useState([]);
  const [loans, setLoans] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAdminData = useCallback(async () => {
    try {
      const [analysisData, loanData, insuranceData, userData, orderData, statsData, communityData] = await Promise.all([
        apiRequest("/api/analyses", { token }),
        apiRequest("/api/loans", { token }),
        apiRequest("/api/insurance", { token }),
        apiRequest("/api/admin/users", { token }),
        apiRequest("/api/admin/orders", { token }),
        apiRequest("/api/admin/stats", { token }),
        apiRequest("/api/admin/community", { token })
      ]);
      setAnalyses(analysisData.analyses);
      setLoans(loanData.loans);
      setInsurance(insuranceData.insurance);
      setUsers(userData.users);
      setOrders(orderData.orders);
      setStats(statsData.stats);
      setCommunityPosts(communityData.posts || []);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const sync = useLiveRefresh(loadAdminData);

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

  async function updateCommunityStatus(id, status) {
    const { post } = await apiRequest(`/api/admin/community/${id}/status`, {
      token,
      method: "PATCH",
      body: { status }
    });
    setCommunityPosts((current) => current.map((item) => item.id === id ? post : item));
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
      <DataRefreshStatus language={language} {...sync} />
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
        <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>
          <Gauge size={16} />
          Overview
        </button>
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
        <button className={tab === "community" ? "active" : ""} onClick={() => setTab("community")}>
          <Users size={16} />
          Community
          {communityPosts.filter((post) => post.status === "pending").length > 0 && <span className="admin-tab-count">{communityPosts.filter((post) => post.status === "pending").length}</span>}
        </button>
      </div>

      {loading ? (
        <div className="empty-state">
          <RefreshCw size={34} />
          <h3>Loading admin data</h3>
        </div>
      ) : (
        <>
          {tab === "overview" && (
            <AdminOverviewPanel
              analyses={analyses}
              loans={loans}
              insurance={insurance}
              orders={orders}
              onNavigate={setTab}
            />
          )}

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
            <AdminUsersPanel
              users={users}
              onStatusChange={updateUserStatus}
              onPasswordReset={resetUserPassword}
              onRemove={removeUser}
            />
          )}

          {tab === "analytics" && <AdminAnalyticsPanel analyses={analyses} loans={loans} insurance={insurance} orders={orders} topSoils={topSoils} stats={stats} />}

          {tab === "community" && <AdminCommunityPanel posts={communityPosts} onStatusChange={updateCommunityStatus} />}
        </>
      )}
    </div>
  );
}

function AdminOverviewPanel({ analyses, loans, insurance, orders, onNavigate }) {
  const highRiskCount = analyses.filter((analysis) => analysis.result?.riskLevel === "High").length;
  const queues = [
    { label: "Reports to review", count: analyses.filter((item) => item.status === "pending").length, tab: "reports", icon: <ClipboardList size={18} /> },
    { label: "Loan decisions", count: loans.filter((item) => item.status === "pending").length, tab: "loans", icon: <HandCoins size={18} /> },
    { label: "Insurance decisions", count: insurance.filter((item) => item.status === "pending").length, tab: "insurance", icon: <ShieldCheck size={18} /> },
    { label: "Orders to fulfil", count: orders.filter((item) => item.status !== "delivered").length, tab: "orders", icon: <ShoppingCart size={18} /> },
    { label: "High-risk fields", count: highRiskCount, tab: "reports", icon: <AlertTriangle size={18} />, risk: true }
  ];
  const activity = [
    ...analyses.map((item) => ({
      id: `report-${item.id}`,
      date: item.createdAt,
      tab: "reports",
      icon: <FlaskConical size={17} />,
      title: "Soil report",
      detail: [item.farmerName || "Farmer", item.input?.crop || item.result?.soilType || "Field analysis"].filter(Boolean).join(" · "),
      status: item.status,
      risk: item.result?.riskLevel
    })),
    ...loans.map((item) => ({
      id: `loan-${item.id}`,
      date: item.createdAt,
      tab: "loans",
      icon: <HandCoins size={17} />,
      title: "Loan application",
      detail: `${item.farmerName || "Farmer"} · ${formatMoney(item.amount)}`,
      status: item.status
    })),
    ...insurance.map((item) => ({
      id: `insurance-${item.id}`,
      date: item.createdAt,
      tab: "insurance",
      icon: <ShieldCheck size={17} />,
      title: "Insurance application",
      detail: `${item.farmerName || "Farmer"} · ${item.crop || "Crop cover"}`,
      status: item.status
    })),
    ...orders.map((item) => ({
      id: `order-${item.id}`,
      date: item.createdAt,
      tab: "orders",
      icon: <ShoppingCart size={17} />,
      title: "Market order",
      detail: `${item.farmerName || "Farmer"} · ${item.itemName || "Purchase"}`,
      status: item.status
    }))
  ]
    .filter((item) => Number.isFinite(new Date(item.date).getTime()))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  return (
    <section className="admin-command-grid">
      <div className="form-card admin-command-panel">
        <div className="section-heading compact-heading">
          <span className="eyebrow">Operations</span>
          <h2>Needs attention</h2>
        </div>
        <div className="admin-queue-list">
          {queues.map((queue) => (
            <div className={`admin-queue-row${queue.risk ? " is-risk" : ""}`} key={queue.label}>
              <span className="admin-queue-icon">{queue.icon}</span>
              <div className="admin-queue-copy">
                <strong>{queue.label}</strong>
                <span>{queue.count ? `${queue.count} item${queue.count === 1 ? "" : "s"} waiting` : "All clear"}</span>
              </div>
              <strong className="admin-queue-count">{queue.count}</strong>
              <button className="small-button" type="button" onClick={() => onNavigate(queue.tab)}>
                Open
                <ChevronRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-card admin-command-panel">
        <div className="section-heading compact-heading">
          <span className="eyebrow">Live from your records</span>
          <h2>Recent activity</h2>
        </div>
        {activity.length ? (
          <div className="admin-activity-list">
            {activity.map((item) => (
              <button className="admin-activity-row" type="button" key={item.id} onClick={() => onNavigate(item.tab)}>
                <span className="admin-activity-icon">{item.icon}</span>
                <span className="admin-activity-copy">
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                  <time dateTime={item.date}>{formatDate(item.date)}</time>
                </span>
                <span className={`status-badge ${item.risk === "High" ? "follow_up" : item.status}`}>
                  {item.risk === "High" ? "High risk" : titleCase(item.status)}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="admin-activity-empty">
            <Clock3 size={22} />
            <span>New farmer activity will appear here.</span>
          </div>
        )}
      </div>
    </section>
  );
}

function AdminUsersPanel({ users, onStatusChange, onPasswordReset, onRemove }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const filteredUsers = useMemo(() => {
    const search = query.trim().toLowerCase();
    return users
      .filter((user) => {
        const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? user.isActive : !user.isActive);
        const haystack = [user.name, user.email, user.role, user.farmName].filter(Boolean).join(" ").toLowerCase();
        return matchesStatus && (!search || haystack.includes(search));
      })
      .sort((a, b) => sortBy === "reports"
        ? Number(b.analysisCount || 0) - Number(a.analysisCount || 0)
        : new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [users, query, statusFilter, sortBy]);

  return (
    <div className="admin-stack">
      <section className="history-toolbar admin-user-toolbar">
        <label>
          Find a farmer
          <span className="input-shell">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, email, or farm" />
          </span>
        </label>
        <label>
          Account status
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All accounts</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </label>
        <label>
          Sort by
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="newest">Recently joined</option>
            <option value="reports">Most reports</option>
          </select>
        </label>
        <button className="secondary-button" disabled={!filteredUsers.length} onClick={() => exportUsersCsv(filteredUsers)}>
          <Download size={17} />
          Export {filteredUsers.length} users
        </button>
      </section>
      <p className="admin-user-count">Showing <strong>{filteredUsers.length}</strong> of {users.length} accounts</p>
      {filteredUsers.length ? (
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Farm</th><th>Reports</th>
                <th>Diseases</th><th>Loans</th><th>Insurance</th><th>Orders</th><th>Password</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <AdminUserRow
                  key={user.id}
                  user={user}
                  onStatusChange={onStatusChange}
                  onPasswordReset={onPasswordReset}
                  onRemove={onRemove}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <Search size={34} />
          <h3>No matching users</h3>
        </div>
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

function AdminCommunityPanel({ posts, onStatusChange }) {
  const pendingCount = posts.filter((post) => post.status === "pending").length;
  return (
    <div className="admin-community-panel">
      <div className="section-heading compact-heading">
        <span className="eyebrow">Homepage submissions</span>
        <h2>Reviews and blogs</h2>
        <p>{pendingCount} waiting for moderation. Only published entries are visible to visitors.</p>
      </div>
      {posts.length ? (
        <div className="admin-community-list">
          {posts.map((post) => <AdminCommunityPostCard key={post.id} post={post} onStatusChange={onStatusChange} />)}
        </div>
      ) : (
        <div className="empty-state"><BookOpen size={34} /><h3>No community submissions</h3><p>Farmer reviews and blog posts will appear here for moderation.</p></div>
      )}
    </div>
  );
}

function AdminCommunityPostCard({ post, onStatusChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function setStatus(status) {
    setBusy(true);
    setError("");
    try { await onStatusChange(post.id, status); }
    catch (actionError) { setError(actionError.message); }
    finally { setBusy(false); }
  }

  return (
    <article className="admin-community-card">
      <div className="admin-community-card-heading">
        <div><span className="eyebrow">{post.kind === "review" ? `Review${post.rating ? ` · ${post.rating}/5` : ""}` : "Blog"}</span><h3>{post.title || post.authorName}</h3></div>
        <span className={`status-badge ${post.status}`}>{titleCase(post.status)}</span>
      </div>
      {post.title && <strong className="admin-community-author">{post.authorName}</strong>}
      <p>{post.body}</p>
      <footer><time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time><div>
        <button className="small-button" type="button" disabled={busy || post.status === "published"} onClick={() => setStatus("published")}><CheckCircle2 size={15} />Publish</button>
        <button className="small-button danger-button" type="button" disabled={busy || post.status === "rejected"} onClick={() => setStatus("rejected")}><Ban size={15} />Reject</button>
      </div></footer>
      {error && <p className="row-error" role="alert">{error}</p>}
    </article>
  );
}

export default App;
