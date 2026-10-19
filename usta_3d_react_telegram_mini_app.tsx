import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutGrid,
  Sparkles,
  ShoppingCart,
  ClipboardList,
  Search,
  SlidersHorizontal,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Send,
  ShieldCheck,
  Leaf,
  Box,
  Truck,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Package,
  XCircle,
  Camera,
  Edit3,
  Bot,
  Database,
  Bell,
  Phone,
  User,
  ExternalLink,
  Check,
  AlertCircle,
  Copy,
  RefreshCw,
  X
} from 'lucide-react';

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

const DEFAULT_PRODUCTS = [
  {
    id: 'prod-berry-bowl',
    title: 'Чаша-дуршлаг для мытья ягод и фруктов с циркуляцией воды',
    shortTitle: 'Чаша для мытья ягод и фруктов',
    subtitle: 'Промывка под проточной водой',
    category: 'Для дома',
    price: 86000,
    stock: 12,
    isNew: true,
    colors: ['Синий', 'Жёлтый', 'Красный', 'Белый'],
    material: 'Экологичный пластик (PLA / PETG)',
    images: [''],
    description:
      'Чаша-дуршлаг помогает промывать ягоды и небольшие фрукты под проточной водой. Боковой канал направляет струю в основную чашу, где вода циркулирует вокруг плодов. Через прорези в нижней части вода уходит в раковину, а плоды остаются в чаше.\n\nИзделие объединяет ёмкость для промывки и дуршлаг: после ополаскивания не нужно переливать содержимое в отдельное сито, чтобы дать воде стечь. Подходит для клубники, винограда и помидоров черри.',
    howToUse: [
      'Поставьте чашу в раковину, не перекрывая сливные прорези.',
      'Положите внутрь небольшую порцию плодов, оставив место для движения воды.',
      'Направьте струю из крана в круглое боковое отверстие.',
      'Отрегулируйте поток так, чтобы вода циркулировала без перелива через край.',
      'После промывки выключите воду, дайте ей стечь и достаньте плоды.',
      'Ополосните чашу и просушите.'
    ]
  },
  {
    id: 'prod-pistachio-bowl',
    title: 'Чаша для фисташек и семечек со скрытым отсеком для скорлупы',
    shortTitle: 'Чаша для фисташек',
    subtitle: 'Со скрытым отсеком для скорлупы',
    category: 'Для дома',
    price: 75000,
    stock: 9,
    isNew: true,
    colors: ['Серый', 'Белый', 'Синий', 'Чёрный'],
    material: 'Экологичный пластик (PLA)',
    images: [''],
    description:
      'Стильная двухъярусная чаша с рельефной геометрией стенок для подачи фисташек, орехов, семечек или оливок. Верхняя съёмная воронка позволяет удобно сбрасывать скорлупу во внутренний скрытый отсек, сохраняя чистоту и эстетику на столе.',
    howToUse: [
      'Засыпьте фисташки или семечки в верхнюю чашу вокруг центральной воронки.',
      'Сбрасывайте скорлупу в центральное отверстие.',
      'По окончании просто поднимите верхнюю часть и вытряхните скорлупу из нижней чаши.'
    ]
  },
  {
    id: 'prod-pen-holder',
    title: 'Подставка для ручек Geometric USTA 3D (Органайзер настольный)',
    shortTitle: 'Подставка для ручек',
    subtitle: 'Стильный и практичный аксессуар для рабочего стола',
    category: 'Для офиса',
    price: 49000,
    stock: 20,
    isNew: false,
    colors: ['Чёрный', 'Синий', 'Белый', 'Серый'],
    material: 'Экологичный пластик (PLA)',
    images: [''],
    description:
      'Стильный и практичный аксессуар для вашего рабочего стола от USTA 3D. Гранёная архитектурная текстура отлично смотрится в современном офисе и дома. Выполнена методом высокоточной 3D-печати из экологичного и долговечного пластика PLA.',
    howToUse: [
      'Разместите органайзер на рабочем столе.',
      'Используйте для хранения ручек, маркеров, ножниц, кистей или инструментов.',
      'При необходимости протирайте влажной салфеткой.'
    ]
  },
  {
    id: 'prod-dragon',
    title: 'Подвижный 3D Дракон (Articulated Dragon) на подставке',
    shortTitle: 'Подвижный 3D Дракон',
    subtitle: 'Качество в каждой детали · Подвижные сегменты',
    category: 'Подарки',
    price: 120000,
    stock: 5,
    isNew: true,
    colors: ['Синий', 'Чёрный', 'Красный', 'Золотой'],
    material: 'Шёлковый PLA (Silk PLA)',
    images: [''],
    description:
      'Детализированный подвижный дракон с крыльями, напечатанный целиком без склейки. Все звенья тела и крылья двигаются, позволяя придавать фигуре эффектные позы. Отличный подарок, антистресс и украшение рабочего места.',
    howToUse: [
      'Расположите дракона на полке, мониторе или рабочем столе.',
      'Меняйте положение хвоста и крыльев благодаря шарнирным соединениям.'
    ]
  },
  {
    id: 'prod-poly-cat',
    title: 'Дизайнерская статуэтка «Полигональный Кот» Low-Poly',
    shortTitle: 'Полигональный Кот',
    subtitle: 'Современный минималистичный декор интерьера',
    category: 'Для дома',
    price: 65000,
    stock: 8,
    isNew: false,
    colors: ['Белый', 'Чёрный', 'Синий', 'Серый'],
    material: 'Матовый PLA пластик',
    images: [''],
    description:
      'Геометрическая скульптура кота в стиле Low-Poly из фирменной коллекции USTA 3D. Идеально вписывается в скандинавский и лофт интерьер, подходит для подарка любителям необычного декора.',
    howToUse: [
      'Установите на книжную полку, консоль или рабочий стол.',
      'Не ставьте вблизи открытого огня и нагревательных приборов свыше 60°C.'
    ]
  },
  {
    id: 'prod-vortex-vase',
    title: 'Дизайнерская витая ваза-кашпо «Vortex»',
    shortTitle: 'Витая ваза Vortex',
    subtitle: 'Превращаем идеи в объекты · Спиральная геометрия',
    category: 'Для дома',
    price: 95000,
    stock: 7,
    isNew: true,
    colors: ['Синий', 'Белый', 'Чёрный', 'Изумрудный'],
    material: 'Водостойкий PETG пластик',
    images: [''],
    description:
      'Футуристическая спиральная ваза, созданная методом непрерывной контурной 3D-печати. Мягко преломляет свет на изгибах граней и подходит как для сухоцветов, так и для декоративных композиций.',
    howToUse: [
      'Используйте для композиций из сухоцветов или искусственных растений.',
      'При использовании с водой рекомендуется промывать прохладной водой.'
    ]
  },
  {
    id: 'prod-auto-gears',
    title: 'Авто-клипсы, шестерни и ремкомплекты на заказ (PETG / ABS)',
    shortTitle: 'Шестерни и Авто-детали',
    subtitle: 'Высокая прочность · По образцу или чертежу',
    category: 'Авто',
    price: 45000,
    stock: 25,
    isNew: false,
    colors: ['Синий', 'Чёрный', 'Серый'],
    material: 'Ударопрочный ABS / PETG / Nylon',
    images: [''],
    description:
      'Изготовление редких шестерёнок, втулок стеклоподъёмников, креплений фар, заглушек бампера и бытовой техники. Печатаем из инженерных износостойких пластиков (PETG, ABS, Nylon), устойчивых к нагрузкам и температуре.',
    howToUse: [
      'Оформите заказ и укажите в комментарии модель авто или размеры детали.',
      'Наш инженер свяжется с вами в Telegram для уточнения посадочных размеров.'
    ]
  }
];

const BTS_BRANCHES = [
  {
    code: 'CHILANZAR BTS',
    city: 'г.Ташкент',
    address: 'г.Ташкент, Чиланзарский район, квартал 6, ориентир м. Мирзо Улугбек',
    hours: 'Пн-Сб: 08:30-20:00 ; Вс: 09:00-17:00'
  },
  {
    code: 'YUNUSABAD BTS',
    city: 'г.Ташкент',
    address: 'г.Ташкент, Юнусабадский район, квартал 4, проспект Амира Темура, 112',
    hours: 'Пн-Сб: 08:30-20:00 ; Вс: 09:00-17:00'
  },
  {
    code: 'SERGELI BTS',
    city: 'г.Ташкент',
    address: 'г.Ташкент, Сергелийский район, массив Сергели-5, ул. Янги Сергели',
    hours: 'Пн-Сб: 09:00-19:00 ; Вс: Выходной'
  },
  {
    code: '13-MIKRARAYON',
    city: 'г.Зарафшан',
    address: 'город Зарафшан, 13-й микрорайон, дом 77',
    hours: 'Пн-Сб: 09:00-18:00 ; Вс: Выходные дни ; Обед: 13:00-14:00'
  },
  {
    code: '14-MIKRARAYON',
    city: 'г.Бекабад',
    address: 'г. Бекабад, ул.Гафура Гулама, дом 35/2',
    hours: 'Пн-Сб: 09:00-18:00 ; Вс: Выходные дни ; Обед: 13:00-14:00'
  },
  {
    code: '6/4 ANGREN',
    city: 'г.Ангрен',
    address: 'г.Ангрен, ул.Мустакиллик, 223-дом',
    hours: 'Пн-Сб: 09:00-18:00 ; Вс: Выходные дни ; Обед: 13:00-14:00'
  },
  {
    code: '8-MIKRORAYON',
    city: 'г.Чирчик',
    address: 'Город Чирчик, 10-й микрорайон, дом 23 (рынок 8-го микрорайона)',
    hours: 'Пн-Сб: 09:00-18:00 ; Вс: Выходные дни ; Обед: 13:00-14:00'
  },
  {
    code: 'SAMARKAND BTS',
    city: 'г.Самарканд',
    address: 'г.Самарканд, ул. Мирзо Улугбека, дом 48',
    hours: 'Пн-Сб: 09:00-18:00 ; Вс: Выходной'
  },
  {
    code: 'BUKHARA BTS',
    city: 'г.Бухара',
    address: 'г.Бухара, ул. Ибрагима Муминова, дом 19',
    hours: 'Пн-Сб: 09:00-18:00 ; Вс: Выходной'
  },
  {
    code: 'FERGANA BTS',
    city: 'г.Фергана',
    address: 'г.Фергана, ул. Сайилгох, дом 29',
    hours: 'Пн-Сб: 09:00-18:00 ; Вс: Выходной'
  },
  {
    code: 'ANDIJAN BTS',
    city: 'г.Андижан',
    address: 'г.Андижан, проспект Бабура, дом 64',
    hours: 'Пн-Сб: 09:00-18:00 ; Вс: Выходной'
  },
  {
    code: 'COURIER TASHKENT',
    city: 'г.Ташкент (Курьер до двери)',
    address: 'Доставка Яндекс / Курьером по Ташкенту прямо до вашего адреса',
    hours: 'Ежедневно: 09:00-22:00'
  }
];

const CATEGORIES = ['Все товары', 'Для дома', 'Для офиса', 'Авто', 'Подарки', 'Детали', 'На заказ'];

const I18N = {
  ru: {
    nav_catalog: 'Каталог',
    nav_custom: 'На заказ 3D',
    nav_cart: 'Корзина',
    nav_orders: 'Мои заказы',
    hero_kicker: 'ПОВСЕДНЕВНОЕ — С ОСОБЫМ ХАРАКТЕРОМ · 3D ПЕЧАТЬ',
    hero_title: 'Для дома. Для себя.',
    hero_sub: 'Полезные вещи и 3D-изделия, продуманные до мелочей. Ваши идеи в реальность!',
    search_placeholder: 'Найти товар или 3D-модель...',
    tab_all: 'Все товары',
    tab_new: 'Новинки',
    tab_stock: 'В наличии',
    items_count: 'товаров',
    sort_default: 'По порядку',
    sort_asc: 'Дешевле',
    sort_desc: 'Дороже',
    choose_color: 'Выберите цвет',
    ready_stock: 'Готово:',
    add_to_cart: 'В корзину',
    buy_now: 'Купить',
    desc_title: 'Описание',
    how_to_use: 'Как использовать:',
    cart_title: 'Корзина',
    checkout_title: 'Оформить заказ',
    recipient_name: 'Имя получателя',
    phone_label: 'Телефон',
    tg_username: 'Telegram (@username) или доп. контакт',
    bts_delivery: 'Доставка BTS по Узбекистану',
    bts_cost_note: 'Стоимость доставки: уточняется (по тарифам BTS)',
    find_nearest_bts: 'Найти ближайший BTS (Ташкент / Область)',
    select_bts_manual: 'Или выберите отделение вручную',
    bts_search_placeholder: 'Город, район или адрес',
    orders_title: 'Мои заказы',
    no_orders_title: 'Заказов пока нет',
    no_orders_sub: 'Здесь появятся ваши заказы, статусы 3D-печати и трек-номера BTS.',
    open_catalog: 'Открыть каталог',
    custom_3d_title: 'Индивидуальный 3D-заказ',
    custom_3d_sub: 'По вашим чертежам, эскизам, 3D-моделям (.STL/.OBJ) или просто по фото'
  },
  uz: {
    nav_catalog: 'Katalog',
    nav_custom: 'Buyurtma 3D',
    nav_cart: 'Savat',
    nav_orders: 'Buyurtmalarim',
    hero_kicker: 'SIZ O‘YLANG — BIZ YARATAMIZ · 3D BOSMA',
    hero_title: 'Uy uchun. O‘zingiz uchun.',
    hero_sub: 'Har bir detaligacha o‘ylangan foydali 3D buyumlar va maxsus buyurtmalar.',
    search_placeholder: 'Mahsulot yoki 3D model qidirish...',
    tab_all: 'Barchasi',
    tab_new: 'Yangilar',
    tab_stock: 'Mavjud',
    items_count: 'mahsulot',
    sort_default: 'Tartib bo‘yicha',
    sort_asc: 'Arzonroq',
    sort_desc: 'Qimmatroq',
    choose_color: 'Rangni tanlang',
    ready_stock: 'Tayyor:',
    add_to_cart: 'Savatga',
    buy_now: 'Xarid qilish',
    desc_title: 'Tavsif',
    how_to_use: 'Foydalanish tartibi:',
    cart_title: 'Savat',
    checkout_title: 'Buyurtma berish',
    recipient_name: 'Qabul qiluvchi ismi',
    phone_label: 'Telefon raqami',
    tg_username: 'Telegram (@username) yoki aloqa',
    bts_delivery: 'BTS orqali O‘zbekiston bo‘ylab yetkazish',
    bts_cost_note: 'Yetkazib berish narxi: aniqlashtiriladi',
    find_nearest_bts: 'Eng yaqin BTS bo‘limini topish',
    select_bts_manual: 'Yoki bo‘limni ro‘yxatdan tanlang',
    bts_search_placeholder: 'Shahar, tuman yoki manzil',
    orders_title: 'Mening buyurtmalarim',
    no_orders_title: 'Hozircha buyurtmalar yo‘q',
    no_orders_sub: 'Bu yerda buyurtmalaringiz, 3D-bosma holati va BTS trek-raqamlari ko‘rinadi.',
    open_catalog: 'Katalogni ochish',
    custom_3d_title: 'Individual 3D buyurtma',
    custom_3d_sub: 'Chizma, eskiz yoki rasm asosida 3D-bosma tayyorlab beramiz'
  }
};

// ВНИМАНИЕ: Если вы выгружаете проект на внешний хостинг (Vercel / Netlify),
// вы можете вставить сюда свой конфиг Firebase ИЛИ ввести его прямо в Админ-панели!
const HARDCODED_BOT_CONFIG = {
  // Вы можете сразу вписать сюда свой Bot Token и Chat ID, чтобы они работали на любом телефоне даже без настройки:
  botToken: '',
  sellerChatId: '',
  ownerPin: '1234'
};

let dbInstance = null;
let authInstance = null;
let currentAppId = typeof __app_id !== 'undefined' && __app_id ? __app_id : 'usta-3d-miniapp';

try {
  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    const parsedConfig = typeof __firebase_config === 'string' ? JSON.parse(__firebase_config) : __firebase_config;
    if (parsedConfig && parsedConfig.apiKey) {
      const app = getApps().length === 0 ? initializeApp(parsedConfig) : getApp();
      authInstance = getAuth(app);
      dbInstance = getFirestore(app);
    }
  }
} catch (e) {
  console.warn('Environment Firebase init warning:', e);
}

function formatSum(amount) {
  const num = Number(amount) || 0;
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' сум';
}

function UstaCubeLogo({ className = 'w-7 h-7' }) {
  return (
    <svg viewBox="0 0 100 110" className={className}>
      <polygon points="50,6 90,29 50,52 10,29" fill="#0066FF" />
      <path
        d="M8,36 L35,51.5 L35,76 L50,84.5 L65,76 L65,51.5 L92,36 L92,81 L50,105 L8,81 Z"
        fill="#0D0D0D"
      />
    </svg>
  );
}

function ProductArtwork({ imageUrl, title }) {
  const [imgError, setImgError] = useState(false);
  const cleanUrl = (imageUrl || '').trim();
  const isValid =
    !imgError &&
    (cleanUrl.startsWith('http://') ||
      cleanUrl.startsWith('https://') ||
      cleanUrl.startsWith('data:image/'));

  if (isValid) {
    return (
      <img
        src={cleanUrl}
        alt={title || 'USTA 3D'}
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#F8FAFC] to-[#EEF2F6] flex flex-col items-center justify-center p-4 text-center select-none">
      <div className="w-14 h-14 rounded-2xl bg-white/90 border border-gray-200/80 shadow-xs flex items-center justify-center mb-2">
        <UstaCubeLogo className="w-8 h-8 opacity-35" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Фото товара</span>
      <span className="text-[9px] text-gray-400/80 mt-0.5">USTA 3D</span>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [isCloudConnected, setIsCloudConnected] = useState(Boolean(dbInstance));
  const [lang, setLang] = useState('ru');
  const [currentView, setCurrentView] = useState('catalog');

  // Данные магазина (синхронизируются с облаком Firestore)
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);

  // Состояние каталога и карточки товара
  const [selectedCategory, setSelectedCategory] = useState('Все товары');
  const [selectedSubTab, setSelectedSubTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [activeProductId, setActiveProductId] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');

  // Профиль клиента и доставка BTS
  const [customerProfile, setCustomerProfile] = useState({
    name: '',
    phone: '+998 ',
    telegram: '',
    comment: ''
  });
  const [btsSearch, setBtsSearch] = useState('');
  const [selectedBtsCode, setSelectedBtsCode] = useState('CHILANZAR BTS');

  // Индивидуальный 3D заказ
  const [customForm, setCustomForm] = useState({
    desc: '',
    color: 'Чёрный',
    material: 'Посоветуйте (Мастер выберет)',
    link: ''
  });

  // Админ-панель и защита владельца
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [logoTapCount, setLogoTapCount] = useState(0);
  const [adminTab, setAdminTab] = useState('orders');
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    shortTitle: '',
    category: 'Для дома',
    price: 55000,
    stock: 10,
    colors: 'Синий, Чёрный, Белый, Серый',
    images: '',
    description: '',
    isNew: true
  });
  const [trackInputs, setTrackInputs] = useState({});

  // Конфигурация Telegram-бота (хранится в облаке Firestore, чтобы все клиенты отправляли заказы продавцу!)
  const [botConfig, setBotConfig] = useState({
    botToken: HARDCODED_BOT_CONFIG.botToken || '',
    sellerChatId: HARDCODED_BOT_CONFIG.sellerChatId || '',
    webAppUrl: typeof window !== 'undefined' && window.location.href.startsWith('http')
      ? window.location.href
      : 'https://usta3d.netlify.app',
    ownerPin: HARDCODED_BOT_CONFIG.ownerPin || '1234',
    ownerTelegramIds: '',
    botVerifiedName: ''
  });

  const [detectedTgUser, setDetectedTgUser] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = (key) => I18N[lang]?.[key] || I18N.ru[key] || key;

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3200);
  };

  // 1. Инициализация Auth и Telegram WebApp
  useEffect(() => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready?.();
        tg.expand?.();
        const u = tg.initDataUnsafe?.user;
        if (u) {
          setDetectedTgUser(u);
          setCustomerProfile((prev) => ({
            ...prev,
            name: prev.name || [u.first_name, u.last_name].filter(Boolean).join(' '),
            telegram: prev.telegram || (u.username ? `@${u.username}` : '')
          }));
        }
      }
    } catch (e) {
      console.warn('Telegram WebApp init skipped:', e);
    }

    if (!authInstance) return;

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(authInstance, __initial_auth_token);
        } else {
          await signInAnonymously(authInstance);
        }
      } catch (err) {
        console.warn('Auth sign-in error:', err);
      }
    };

    initAuth();
    const unsubscribe = onAuthStateChanged(authInstance, (u) => {
      setUser(u);
      setIsCloudConnected(Boolean(u && dbInstance));
    });
    return () => unsubscribe();
  }, []);

  // 2. Подписка на данные Firestore в реальном времени (Products, Orders, BotConfig, UserCart)
  useEffect(() => {
    if (!user || !dbInstance) return;

    // A) Слушаем каталог товаров
    const productsCol = collection(dbInstance, 'artifacts', currentAppId, 'public', 'data', 'usta3d_products');
    const unsubProducts = onSnapshot(
      productsCol,
      async (snapshot) => {
        if (snapshot.empty) {
          for (const prod of DEFAULT_PRODUCTS) {
            await setDoc(
              doc(dbInstance, 'artifacts', currentAppId, 'public', 'data', 'usta3d_products', prod.id),
              prod
            );
          }
        } else {
          const loaded = [];
          snapshot.forEach((d) => loaded.push(d.data()));
          setProducts(loaded);
        }
      },
      (err) => console.warn('Products snapshot error:', err)
    );

    // B) Слушаем ВСЕ заказы в облаке (и продавец, и клиент видят актуальные статусы в реальном времени)
    const ordersCol = collection(dbInstance, 'artifacts', currentAppId, 'public', 'data', 'usta3d_orders');
    const unsubOrders = onSnapshot(
      ordersCol,
      (snapshot) => {
        const list = [];
        snapshot.forEach((d) => list.push(d.data()));
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setOrders(list);
      },
      (err) => console.warn('Orders snapshot error:', err)
    );

    // C) Слушаем глобальные настройки Telegram-бота (чтобы телефон клиента знал, куда слать уведомление!)
    const botDocRef = doc(dbInstance, 'artifacts', currentAppId, 'public', 'data', 'usta3d_settings', 'telegram_bot');
    const unsubBot = onSnapshot(
      botDocRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setBotConfig((prev) => ({
            ...prev,
            ...data,
            botToken: data.botToken || HARDCODED_BOT_CONFIG.botToken || prev.botToken,
            sellerChatId: data.sellerChatId || HARDCODED_BOT_CONFIG.sellerChatId || prev.sellerChatId
          }));
        }
      },
      (err) => console.warn('Bot settings snapshot error:', err)
    );

    // D) Загружаем личную корзину и профиль клиента из облака
    const clientDocRef = doc(dbInstance, 'artifacts', currentAppId, 'users', user.uid, 'client_state', 'main');
    const unsubClient = onSnapshot(
      clientDocRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data.cart)) setCart(data.cart);
          if (data.customerProfile) {
            setCustomerProfile((prev) => ({ ...prev, ...data.customerProfile }));
          }
        }
      },
      (err) => console.warn('Client state snapshot error:', err)
    );

    return () => {
      unsubProducts();
      unsubOrders();
      unsubBot();
      unsubClient();
    };
  }, [user]);

  // Авто-разблокировка владельца по его Telegram ID
  useEffect(() => {
    if (!detectedTgUser || !botConfig.ownerTelegramIds) return;
    const allowed = botConfig.ownerTelegramIds
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (allowed.includes(String(detectedTgUser.id))) {
      setIsOwnerUnlocked(true);
    }
  }, [detectedTgUser, botConfig.ownerTelegramIds]);

  const syncClientStateToCloud = async (newCart, newProfile) => {
    if (!user || !dbInstance) return;
    try {
      const clientDocRef = doc(dbInstance, 'artifacts', currentAppId, 'users', user.uid, 'client_state', 'main');
      await setDoc(
        clientDocRef,
        {
          cart: newCart,
          customerProfile: newProfile,
          updatedAt: Date.now()
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('Cloud client state sync warning:', e);
    }
  };

  // Функция отправки заказа напрямую в Telegram продавцу через Bot API
  const sendOrderNotificationToTelegram = async (order) => {
    const activeToken = (botConfig.botToken || HARDCODED_BOT_CONFIG.botToken || '').trim();
    const activeChatId = (botConfig.sellerChatId || HARDCODED_BOT_CONFIG.sellerChatId || '').trim();

    if (!activeToken || !activeChatId) {
      return {
        ok: false,
        reason: 'Токен бота или Chat ID еще не заполнены во вкладке «🚀 Бот и Защита»'
      };
    }

    const itemsLines = (order.items || [])
      .map((it, idx) => `${idx + 1}. <b>${it.title}</b> (${it.color}) — ${it.qty} шт. × ${formatSum(it.price)}`)
      .join('\n');

    const textHtml =
      `🟦 <b>НОВЫЙ ЗАКАЗ В USTA 3D!</b>\n` +
      `🆔 <b>Заказ:</b> #${order.orderNumber}\n` +
      `📅 <b>Время:</b> ${order.dateFormatted}\n\n` +
      `👤 <b>Клиент:</b> ${order.customerName}\n` +
      `📞 <b>Телефон:</b> ${order.customerPhone}\n` +
      `💬 <b>Telegram:</b> ${order.customerTelegram || 'Не указан'}\n\n` +
      `📦 <b>Доставка BTS:</b> ${order.btsBranchCode}\n` +
      `📍 <b>Адрес пункта:</b> ${order.btsBranchAddress}\n` +
      (order.comment ? `📝 <b>Комментарий:</b> ${order.comment}\n` : '') +
      `\n🛒 <b>Состав заказа:</b>\n${itemsLines}\n\n` +
      `💰 <b>ИТОГО: ${formatSum(order.totalPrice)}</b>`;

    try {
      const resp = await fetch(`https://api.telegram.org/bot${activeToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: activeChatId,
          text: textHtml,
          parse_mode: 'HTML'
        })
      });
      const data = await resp.json();
      if (data.ok) {
        return { ok: true };
      } else {
        return { ok: false, reason: data.description || 'Ошибка Telegram API' };
      }
    } catch (err) {
      return { ok: false, reason: 'Сетевая ошибка при обращении к api.telegram.org' };
    }
  };

  const handleLogoTap = () => {
    const nextCount = logoTapCount + 1;
    setLogoTapCount(nextCount);

    if (nextCount >= 5) {
      setLogoTapCount(0);
      if (isOwnerUnlocked) {
        setCurrentView('admin');
      } else {
        setPinInput('');
        setShowPinModal(true);
      }
      return;
    }

    if (nextCount === 1 && currentView !== 'catalog') {
      setCurrentView('catalog');
    }

    setTimeout(() => {
      setLogoTapCount(0);
    }, 2200);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const masterPin = String(botConfig.ownerPin || '1234').trim();
    if (pinInput.trim() === masterPin) {
      setIsOwnerUnlocked(true);
      setShowPinModal(false);
      setCurrentView('admin');
      showToast('🔓 Доступ владельца открыт', 'success');
    } else {
      showToast('Неверный ПИН-код владельца', 'error');
    }
  };

  const handleSearchChange = (val) => {
    if (val.trim().toLowerCase() === '@admin') {
      setSearchQuery('');
      if (isOwnerUnlocked) {
        setCurrentView('admin');
      } else {
        setPinInput('');
        setShowPinModal(true);
      }
      return;
    }
    setSearchQuery(val);
  };

  const openProductDetail = (prod) => {
    setActiveProductId(prod.id);
    setActiveSlide(0);
    setSelectedColor((prod.colors && prod.colors[0]) || 'Синий');
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addItemToCart = (prod, color, qty = 1, goToCart = false) => {
    const chosenColor = color || (prod.colors && prod.colors[0]) || 'Синий';
    const nextCart = [...cart];
    const existingIndex = nextCart.findIndex(
      (item) => item.productId === prod.id && item.color === chosenColor
    );

    if (existingIndex >= 0) {
      nextCart[existingIndex] = {
        ...nextCart[existingIndex],
        qty: nextCart[existingIndex].qty + qty
      };
    } else {
      nextCart.push({
        productId: prod.id,
        title: prod.title,
        shortTitle: prod.shortTitle || prod.title,
        color: chosenColor,
        price: Number(prod.price) || 0,
        qty,
        imageKey: (prod.images && prod.images[0]) || ''
      });
    }

    setCart(nextCart);
    syncClientStateToCloud(nextCart, customerProfile);

    if (goToCart) {
      setCurrentView('cart');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToast(`«${prod.shortTitle || prod.title}» (${chosenColor}) в корзине!`, 'success');
    }
  };

  const changeCartQty = (idx, delta) => {
    const nextCart = [...cart];
    if (!nextCart[idx]) return;
    nextCart[idx].qty += delta;
    if (nextCart[idx].qty <= 0) {
      nextCart.splice(idx, 1);
    }
    setCart(nextCart);
    syncClientStateToCloud(nextCart, customerProfile);
  };

  const removeCartItem = (idx) => {
    const nextCart = cart.filter((_, i) => i !== idx);
    setCart(nextCart);
    syncClientStateToCloud(nextCart, customerProfile);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0 || isSubmitting) return;

    const name = (customerProfile.name || '').trim();
    const phone = (customerProfile.phone || '').trim();
    if (!name || phone.length < 7) {
      showToast('Укажите имя и телефон получателя', 'error');
      return;
    }

    setIsSubmitting(true);
    const bts = BTS_BRANCHES.find((b) => b.code === selectedBtsCode) || BTS_BRANCHES[0];
    const totalPrice = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);

    const now = new Date();
    const orderNumber = String(Math.floor(1000 + Math.random() * 9000));
    const orderId = 'order-' + Date.now();

    const newOrder = {
      id: orderId,
      orderNumber,
      clientId: user?.uid || 'guest-user',
      customerName: name,
      customerPhone: phone,
      customerTelegram: (customerProfile.telegram || '').trim(),
      comment: (customerProfile.comment || '').trim(),
      btsBranchCode: bts.code,
      btsBranchAddress: `${bts.city}, ${bts.address}`,
      items: [...cart],
      totalQty,
      totalPrice,
      status: 'Принят',
      btsTrackNumber: '',
      createdAt: Date.now(),
      dateFormatted:
        now.toLocaleDateString('ru-RU') +
        ' ' +
        now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };

    // 1. Сохраняем заказ в облачную базу Firestore (чтобы продавец увидел его на своем устройстве!)
    if (dbInstance && user) {
      try {
        await setDoc(
          doc(dbInstance, 'artifacts', currentAppId, 'public', 'data', 'usta3d_orders', orderId),
          newOrder
        );
      } catch (err) {
        console.warn('Cloud order write error:', err);
      }
    } else {
      setOrders((prev) => [newOrder, ...prev]);
    }

    // 2. Отправляем уведомление в Telegram-бот продавцу
    const tgResult = await sendOrderNotificationToTelegram(newOrder);

    // 3. Очищаем корзину клиента
    const nextProfile = { ...customerProfile, comment: '' };
    setCart([]);
    setCustomerProfile(nextProfile);
    await syncClientStateToCloud([], nextProfile);

    setIsSubmitting(false);

    if (tgResult.ok) {
      showToast(`Заказ #${orderNumber} оформлен и отправлен в Telegram продавцу!`, 'success');
    } else {
      showToast(`Заказ #${orderNumber} сохранён в облаке!`, 'success');
    }
    setCurrentView('orders');
  };

  const handleCustom3DSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    const name = (customerProfile.name || '').trim();
    const phone = (customerProfile.phone || '').trim();
    if (!customForm.desc.trim() || !name || phone.length < 7) {
      showToast('Заполните описание детали, ваше имя и телефон', 'error');
      return;
    }

    setIsSubmitting(true);
    const now = new Date();
    const orderNumber = '3D-' + String(Math.floor(100 + Math.random() * 900));
    const orderId = 'order-custom-' + Date.now();

    const customOrder = {
      id: orderId,
      orderNumber,
      clientId: user?.uid || 'guest-user',
      customerName: name,
      customerPhone: phone,
      customerTelegram: (customerProfile.telegram || '').trim(),
      comment: `Индивидуальный 3D заказ: ${customForm.desc} | Пластик: ${customForm.material} ${
        customForm.link ? '| Ссылка: ' + customForm.link : ''
      }`,
      btsBranchCode: 'Уточняется с мастером',
      btsBranchAddress: 'Индивидуальный расчёт стоимости',
      items: [
        {
          productId: 'custom-3d',
          title: `Индивидуальная 3D-печать: ${customForm.desc}`,
          shortTitle: '3D-печать на заказ',
          color: `${customForm.color} (${customForm.material})`,
          price: 45000,
          qty: 1,
          imageKey: ''
        }
      ],
      totalQty: 1,
      totalPrice: 45000,
      status: 'Принят',
      btsTrackNumber: '',
      createdAt: Date.now(),
      dateFormatted:
        now.toLocaleDateString('ru-RU') +
        ' ' +
        now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };

    if (dbInstance && user) {
      try {
        await setDoc(
          doc(dbInstance, 'artifacts', currentAppId, 'public', 'data', 'usta3d_orders', orderId),
          customOrder
        );
      } catch (err) {
        console.warn('Cloud custom order error:', err);
      }
    } else {
      setOrders((prev) => [customOrder, ...prev]);
    }

    await sendOrderNotificationToTelegram(customOrder);
    await syncClientStateToCloud(cart, customerProfile);
    setCustomForm({ desc: '', color: 'Чёрный', material: 'Посоветуйте (Мастер выберет)', link: '' });
    setIsSubmitting(false);

    showToast(`Заявка #${orderNumber} отправлена мастеру USTA 3D!`, 'success');
    setCurrentView('orders');
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (dbInstance && user) {
      try {
        await updateDoc(
          doc(dbInstance, 'artifacts', currentAppId, 'public', 'data', 'usta3d_orders', orderId),
          { status: newStatus }
        );
        showToast(`Статус изменён на «${newStatus}»`, 'success');
      } catch (err) {
        showToast('Ошибка обновления статуса в облаке', 'error');
      }
    } else {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      showToast(`Статус изменён на «${newStatus}»`, 'success');
    }
  };

  const handleSaveOrderTrack = async (orderId) => {
    const trackValue = (trackInputs[orderId] ?? '').trim();
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const nextStatus = trackValue && targetOrder.status === 'Принят' ? 'Отправлен в BTS' : targetOrder.status;

    if (dbInstance && user) {
      try {
        await updateDoc(
          doc(dbInstance, 'artifacts', currentAppId, 'public', 'data', 'usta3d_orders', orderId),
          {
            btsTrackNumber: trackValue,
            status: nextStatus
          }
        );
        showToast('Трек-номер BTS сохранён и виден клиенту!', 'success');
      } catch (err) {
        showToast('Ошибка сохранения трек-номера', 'error');
      }
    } else {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, btsTrackNumber: trackValue, status: nextStatus } : o
        )
      );
      showToast('Трек-номер BTS сохранён!', 'success');
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 720;
        let w = img.width;
        let h = img.height;
        if (w > h && w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setProductForm((prev) => ({ ...prev, images: dataUrl }));
        showToast('Фото сжато и готово к публикации!', 'success');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProductCard = async (e) => {
    e.preventDefault();
    const id = editingProductId || 'prod-' + Date.now();
    const colorsArr = productForm.colors
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const imgRaw = productForm.images.trim();
    const imagesList = imgRaw
      ? imgRaw.startsWith('data:image/')
        ? [imgRaw]
        : imgRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : [''];

    const newProduct = {
      id,
      title: productForm.title.trim(),
      shortTitle: (productForm.shortTitle || productForm.title).trim(),
      subtitle: '3D печать высокого качества · USTA 3D',
      category: productForm.category,
      price: Number(productForm.price) || 50000,
      stock: Number(productForm.stock) || 10,
      isNew: Boolean(productForm.isNew),
      colors: colorsArr.length > 0 ? colorsArr : ['Синий', 'Чёрный', 'Белый'],
      material: 'Экологичный пластик (PLA / PETG)',
      images: imagesList,
      description:
        productForm.description.trim() ||
        'Изделие выполнено методом высокоточной 3D-печати из долговечного и экологичного пластика.',
      howToUse: ['Готово к использованию сразу после распаковки.', 'Промывайте тёплой водой.']
    };

    if (dbInstance && user) {
      try {
        await setDoc(
          doc(dbInstance, 'artifacts', currentAppId, 'public', 'data', 'usta3d_products', id),
          newProduct
        );
      } catch (err) {
        console.warn('Cloud product save error:', err);
      }
    } else {
      setProducts((prev) => {
        const idx = prev.findIndex((p) => p.id === id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = newProduct;
          return copy;
        }
        return [newProduct, ...prev];
      });
    }

    setEditingProductId(null);
    setProductForm({
      title: '',
      shortTitle: '',
      category: 'Для дома',
      price: 55000,
      stock: 10,
      colors: 'Синий, Чёрный, Белый, Серый',
      images: '',
      description: '',
      isNew: true
    });
    showToast('Карточка товара опубликована в облачном каталоге!', 'success');
  };

  const handleStartEditProduct = (prod) => {
    setEditingProductId(prod.id);
    setProductForm({
      title: prod.title || '',
      shortTitle: prod.shortTitle || '',
      category: prod.category || 'Для дома',
      price: prod.price || 50000,
      stock: prod.stock || 10,
      colors: Array.isArray(prod.colors) ? prod.colors.join(', ') : 'Синий, Чёрный',
      images: Array.isArray(prod.images) ? prod.images.filter(Boolean).join(', ') : '',
      description: prod.description || '',
      isNew: Boolean(prod.isNew)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (prodId) => {
    if (dbInstance && user) {
      try {
        await deleteDoc(
          doc(dbInstance, 'artifacts', currentAppId, 'public', 'data', 'usta3d_products', prodId)
        );
      } catch (err) {
        console.warn('Delete error:', err);
      }
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== prodId));
    }
    showToast('Карточка удалена из каталога', 'info');
  };

  const handleSaveBotSettings = async (e) => {
    e.preventDefault();
    if (dbInstance && user) {
      try {
        await setDoc(
          doc(dbInstance, 'artifacts', currentAppId, 'public', 'data', 'usta3d_settings', 'telegram_bot'),
          botConfig,
          { merge: true }
        );
        showToast('Настройки бота сохранены в облаке для всех устройств!', 'success');
      } catch (err) {
        showToast('Ошибка сохранения настроек в облаке', 'error');
      }
    } else {
      showToast('Настройки сохранены локально', 'info');
    }
  };

  const handleTestTelegramNotification = async () => {
    const token = (botConfig.botToken || '').trim();
    const chatId = (botConfig.sellerChatId || '').trim();
    if (!token || !chatId) {
      showToast('Сначала введите Bot Token и ваш Chat ID ниже!', 'error');
      return;
    }

    try {
      const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          parse_mode: 'HTML',
          text:
            `✅ <b>ТЕСТОВОЕ УВЕДОМЛЕНИЕ USTA 3D!</b>\n\n` +
            `Связь между вашим Mini App и Telegram-ботом успешно установлена.\n` +
            `Теперь все новые заказы от клиентов с любого устройства будут мгновенно приходить сюда!`
        })
      });
      const data = await resp.json();
      if (data.ok) {
        // Сразу сохраняем рабочие токен и chatId в облако!
        if (dbInstance && user) {
          await setDoc(
            doc(dbInstance, 'artifacts', currentAppId, 'public', 'data', 'usta3d_settings', 'telegram_bot'),
            botConfig,
            { merge: true }
          );
        }
        showToast('🎉 Тестовое сообщение доставлено вам в Telegram!', 'success');
      } else {
        showToast(
          `Ошибка Telegram (${data.description || 'проверьте Chat ID и запустите бота /start'})`,
          'error'
        );
      }
    } catch (err) {
      showToast('Не удалось соединиться с api.telegram.org', 'error');
    }
  };

  const handleVerifyBotToken = async () => {
    const token = (botConfig.botToken || '').trim();
    if (!token) {
      showToast('Вставьте Bot Token от @BotFather!', 'error');
      return;
    }
    try {
      const resp = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const data = await resp.json();
      if (data.ok && data.result) {
        const nextConfig = {
          ...botConfig,
          botVerifiedName: '@' + data.result.username
        };
        setBotConfig(nextConfig);
        if (dbInstance && user) {
          await setDoc(
            doc(dbInstance, 'artifacts', currentAppId, 'public', 'data', 'usta3d_settings', 'telegram_bot'),
            nextConfig,
            { merge: true }
          );
        }
        showToast(`Бот подключён: @${data.result.username}`, 'success');
      } else {
        showToast('Неверный Bot Token! Проверьте токен от @BotFather', 'error');
      }
    } catch (err) {
      showToast('Ошибка связи с Telegram API', 'error');
    }
  };

  const handleSetMenuButton = async () => {
    const token = (botConfig.botToken || '').trim();
    const url = (botConfig.webAppUrl || '').trim();
    if (!token || !url.startsWith('https://')) {
      showToast('Укажите Bot Token и HTTPS-ссылку на ваш Mini App!', 'error');
      return;
    }
    try {
      const resp = await fetch(`https://api.telegram.org/bot${token}/setChatMenuButton`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menu_button: {
            type: 'web_app',
            text: '🟦 USTA 3D Магазин',
            web_app: { url }
          }
        })
      });
      const data = await resp.json();
      if (data.ok) {
        showToast('Кнопка «🟦 USTA 3D Магазин» установлена в бота!', 'success');
      } else {
        showToast('Ошибка: ' + (data.description || 'проверьте HTTPS URL'), 'error');
      }
    } catch (err) {
      showToast('Ошибка сети при установке кнопки', 'error');
    }
  };

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      if (selectedCategory !== 'Все товары' && p.category !== selectedCategory) return false;
      if (selectedSubTab === 'new' && !p.isNew) return false;
      if (selectedSubTab === 'stock' && (Number(p.stock) || 0) <= 0) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (p.title || '').toLowerCase().includes(q);
        const matchCat = (p.category || '').toLowerCase().includes(q);
        const matchDesc = (p.description || '').toLowerCase().includes(q);
        return matchTitle || matchCat || matchDesc;
      }
      return true;
    });

    if (sortBy === 'asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, selectedCategory, selectedSubTab, searchQuery, sortBy]);

  const myOrders = useMemo(() => {
    const uid = user?.uid || 'guest-user';
    return orders.filter((o) => o.clientId === uid || o.clientId === 'guest-user');
  }, [orders, user]);

  const totalCartQty = useMemo(() => cart.reduce((acc, item) => acc + item.qty, 0), [cart]);
  const totalCartPrice = useMemo(
    () => cart.reduce((acc, item) => acc + item.qty * item.price, 0),
    [cart]
  );

  const activeAdminOrdersCount = useMemo(
    () => orders.filter((o) => o.status === 'Принят' || o.status === 'В 3D-печати').length,
    [orders]
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Принят':
        return { bg: 'bg-blue-50 text-[#0066FF] border-blue-200', step: 1, icon: Clock };
      case 'В 3D-печати':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', step: 2, icon: Box };
      case 'Отправлен в BTS':
        return { bg: 'bg-purple-50 text-purple-700 border-purple-200', step: 3, icon: Truck };
      case 'Выполнен':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', step: 4, icon: CheckCircle2 };
      case 'Отменён':
        return { bg: 'bg-red-50 text-red-600 border-red-200', step: 0, icon: XCircle };
      default:
        return { bg: 'bg-blue-50 text-[#0066FF] border-blue-200', step: 1, icon: Clock };
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#EBEEF3] font-sans text-[#0D0D0D] select-none">
      {/* Оболочка мобильного приложения Telegram Mini App */}
      <div className="w-full max-w-[480px] min-h-screen bg-[#F5F6F8] flex flex-col relative shadow-2xl pb-24">
        {/* Верхняя шапка с логотипом USTA 3D (5 скрытых нажатий для владельца) */}
        <header className="sticky top-0 z-40 bg-[#F5F6F8]/95 backdrop-blur-md border-b border-gray-200/80 px-4 pt-3 pb-2.5">
          <div className="flex items-center justify-between">
            <div
              onClick={handleLogoTap}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200/90 shadow-2xs flex items-center justify-center p-1.5 group-active:scale-95 transition">
                <UstaCubeLogo className="w-full h-full" />
              </div>
              <div>
                <div className="flex items-center gap-1 font-black text-lg tracking-tight leading-none">
                  <span className="text-[#0D0D0D]">USTA</span>
                  <span className="text-[#0066FF]">3D</span>
                  <span
                    className={`ml-1 w-2 h-2 rounded-full ${
                      isCloudConnected ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                    title={isCloudConnected ? 'Облако подключено (Real-time)' : 'Локальный режим'}
                  />
                </div>
                <p className="text-[9px] font-semibold tracking-[0.14em] text-gray-500 uppercase mt-0.5">
                  SIZ O&apos;YLANG — BIZ YARATAMIZ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isOwnerUnlocked && (
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`relative px-3 py-1.5 rounded-full text-xs font-bold border transition flex items-center gap-1.5 ${
                    currentView === 'admin'
                      ? 'bg-[#0066FF] text-white border-[#0066FF]'
                      : 'bg-white text-gray-800 border-gray-200 hover:border-[#0066FF]'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Админ</span>
                  {activeAdminOrdersCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </button>
              )}

              <button
                onClick={() => setLang(lang === 'ru' ? 'uz' : 'ru')}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-gray-200 shadow-2xs text-gray-800 hover:border-[#0066FF] transition"
              >
                <span className={lang === 'ru' ? 'text-[#0066FF] font-extrabold' : 'text-gray-400'}>
                  RU
                </span>
                <span className="text-gray-300 mx-0.5">/</span>
                <span className={lang === 'uz' ? 'text-[#0066FF] font-extrabold' : 'text-gray-400'}>
                  UZ
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Всплывающие уведомления (Toasts) */}
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-[440px] px-4 pointer-events-none flex flex-col gap-2">
          {toasts.map((item) => (
            <div
              key={item.id}
              className={`px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2.5 pointer-events-auto transition-all ${
                item.type === 'success'
                  ? 'bg-[#0D0D0D] text-white border-l-4 border-[#0066FF]'
                  : item.type === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-[#0066FF] text-white'
              }`}
            >
              <Bell className="w-4 h-4 shrink-0 text-white" />
              <span>{item.message}</span>
            </div>
          ))}
        </div>

        {/* Секретное модальное окно входа владельца по ПИН-коду */}
        {showPinModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xs w-full p-5 shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-900">Вход владельца</h3>
                    <p className="text-[11px] text-gray-500">Панель управления USTA 3D</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPinModal(false)}
                  className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 hover:text-gray-800 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Секретный ПИН-код владельца
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="••••"
                    autoFocus
                    required
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-center font-extrabold text-lg tracking-[0.35em] focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs shadow-md shadow-blue-500/20 transition"
                >
                  Войти в Админ-панель
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Основной контент экранов */}
        <main className="flex-1 px-4 pt-3 pb-6">
          {/* ================= ЭКРАН 1: КАТАЛОГ ================= */}
          {currentView === 'catalog' && (
            <div>
              <div className="mb-3.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0066FF] mb-1">
                  {t('hero_kicker')}
                </p>
                <h1 className="font-extrabold text-2xl text-[#0D0D0D] tracking-tight leading-tight">
                  {t('hero_title')}
                </h1>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{t('hero_sub')}</p>
              </div>

              {/* Промо-баннер индивидуальной 3D-печати */}
              <div
                onClick={() => setCurrentView('custom')}
                className="mb-4 rounded-2xl bg-gradient-to-r from-[#0D0D0D] via-[#161F30] to-[#0052CC] p-3.5 text-white shadow-lg cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99] transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                    <Box className="w-5 h-5 text-[#0066FF]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0066FF] px-2 py-0.5 rounded-full">
                        USTA 3D
                      </span>
                      <span className="text-[11px] text-blue-200 font-medium">На заказ по фото</span>
                    </div>
                    <p className="text-xs font-bold mt-0.5">Индивидуальная 3D-печать любой детали</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Поиск товаров */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={t('search_placeholder')}
                  className="w-full bg-white border border-gray-200/90 rounded-2xl pl-10 pr-9 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0066FF]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Категории */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-2">
                {CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() =>
                        cat === 'На заказ' ? setCurrentView('custom') : setSelectedCategory(cat)
                      }
                      className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition ${
                        active
                          ? 'bg-[#0D0D0D] text-white'
                          : 'bg-white text-gray-700 border border-gray-200/90 hover:border-gray-300'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Под-вкладки */}
              <div className="flex items-center gap-5 border-b border-gray-200 mb-3 text-xs font-semibold">
                {[
                  { id: 'all', label: t('tab_all') },
                  { id: 'new', label: t('tab_new') },
                  { id: 'stock', label: t('tab_stock') }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedSubTab(tab.id)}
                    className={`pb-2 border-b-2 transition ${
                      selectedSubTab === tab.id
                        ? 'border-[#0D0D0D] text-[#0D0D0D] font-bold'
                        : 'border-transparent text-gray-400'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Счётчик и сортировка */}
              <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                <span>
                  <strong className="text-gray-800">{filteredProducts.length}</strong> ·{' '}
                  {t('items_count')}
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-semibold text-gray-800 focus:outline-none cursor-pointer"
                >
                  <option value="default">{t('sort_default')}</option>
                  <option value="asc">{t('sort_asc')}</option>
                  <option value="desc">{t('sort_desc')}</option>
                </select>
              </div>

              {/* Сетка карточек 2 колонки */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 my-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center mx-auto mb-3">
                    <Box className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-gray-900">Товары не найдены</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Попробуйте изменить запрос или закажите печать по своему фото.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('Все товары');
                      setSearchQuery('');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#0066FF] text-white text-xs font-bold"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredProducts.map((product) => {
                    const mainImg = (product.images && product.images[0]) || '';
                    return (
                      <div
                        key={product.id}
                        onClick={() => openProductDetail(product)}
                        className="bg-white rounded-2xl overflow-hidden border border-gray-200/75 shadow-xs flex flex-col cursor-pointer group hover:border-[#0066FF]/50 transition active:scale-[0.99]"
                      >
                        <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                          <ProductArtwork imageUrl={mainImg} title={product.title} />
                          {product.isNew && (
                            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#0066FF] text-white text-[9px] font-bold uppercase tracking-wider">
                              Новинка
                            </span>
                          )}
                        </div>

                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              {product.category}
                            </span>
                            <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 mt-0.5 leading-snug">
                              {product.title}
                            </h3>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
                            <span className="font-extrabold text-sm text-[#0D0D0D]">
                              {formatSum(product.price)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addItemToCart(product, product.colors?.[0] || 'Синий', 1, false);
                              }}
                              className="w-8 h-8 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white flex items-center justify-center active:scale-90 transition"
                              title="В корзину"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* */}
          {/* ================= ЭКРАН 2: КАРТОЧКА ТОВАРА ================= */}
          {currentView === 'product' && (() => {
            const product = products.find((p) => p.id === activeProductId) || products[0];
            if (!product) return null;
            const images =
              Array.isArray(product.images) && product.images.length > 0 ? product.images : [''];
            const slideIdx = Math.min(activeSlide, images.length - 1);
            const colors =
              Array.isArray(product.colors) && product.colors.length > 0
                ? product.colors
                : ['Синий', 'Чёрный', 'Белый'];
            const currentColor = selectedColor || colors[0];
            const steps = Array.isArray(product.howToUse) ? product.howToUse : [];

            return (
              <div className="pb-6">
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => setCurrentView('catalog')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 bg-white px-3.5 py-2 rounded-full border border-gray-200 hover:border-[#0066FF] transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-[#0066FF]" />
                    <span>Назад в каталог</span>
                  </button>
                  <span className="text-[11px] font-semibold text-gray-400">
                    Арт: {product.id.slice(-5).toUpperCase()}
                  </span>
                </div>

                {/* Галерея фото */}
                <div className="bg-white rounded-3xl p-2.5 border border-gray-200/80 mb-3">
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100">
                    <ProductArtwork imageUrl={images[slideIdx]} title={product.title} />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setActiveSlide((slideIdx - 1 + images.length) % images.length)
                          }
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 text-gray-800 flex items-center justify-center shadow-md"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setActiveSlide((slideIdx + 1) % images.length)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 text-gray-800 flex items-center justify-center shadow-md"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                  <div className="text-center pt-2 pb-1 text-[11px] text-gray-500 font-medium">
                    {slideIdx + 1} / {images.length} · Фото товара
                  </div>
                </div>

                {/* Основной блок покупки */}
                <div className="bg-white rounded-3xl p-4 border border-gray-200/80 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#0066FF]">
                    {product.category}
                  </span>
                  <h1 className="font-extrabold text-lg text-[#0D0D0D] mt-1 leading-snug">
                    {product.title}
                  </h1>
                  <div className="mt-3">
                    <span className="font-black text-2xl text-[#0D0D0D]">
                      {formatSum(product.price)}
                    </span>
                  </div>

                  {/* Выбор цвета */}
                  <div className="mt-4">
                    <p className="text-xs font-bold text-gray-800 mb-2">
                      {t('choose_color')}: <span className="text-[#0066FF]">{currentColor}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((c) => {
                        const active = c === currentColor;
                        return (
                          <button
                            key={c}
                            onClick={() => setSelectedColor(c)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                              active
                                ? 'bg-white border-2 border-[#0D0D0D] text-[#0D0D0D] font-bold'
                                : 'bg-gray-50 border border-gray-200 text-gray-600'
                            }`}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    {t('ready_stock')} <strong className="text-gray-800">{product.stock || 1} шт.</strong> ·{' '}
                    {product.material || 'PLA / PETG'}
                  </p>

                  <div className="grid grid-cols-2 gap-2.5 mt-4">
                    <button
                      onClick={() => addItemToCart(product, currentColor, 1, false)}
                      className="py-3 px-4 rounded-xl border border-gray-300 bg-[#F8F9FB] hover:bg-gray-100 text-[#0D0D0D] font-bold text-xs transition"
                    >
                      {t('add_to_cart')}
                    </button>
                    <button
                      onClick={() => addItemToCart(product, currentColor, 1, true)}
                      className="py-3 px-4 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs shadow-md shadow-blue-500/20 transition"
                    >
                      {t('buy_now')}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3.5 border-t border-gray-100 text-[11px] text-gray-600">
                    <div className="flex items-center gap-2">
                      <Box className="w-4 h-4 text-[#0066FF]" />
                      <span>3D печать высокого качества</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-[#0066FF]" />
                      <span>Экологичный пластик</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
                      <span>Прочный и долговечный</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#0066FF]" />
                      <span>Доставка BTS по Узб.</span>
                    </div>
                  </div>
                </div>

                {/* Описание и инструкция */}
                <div className="bg-white rounded-3xl p-4 border border-gray-200/80 space-y-3 text-xs text-gray-700 leading-relaxed">
                  <h2 className="font-bold text-sm text-[#0D0D0D]">{t('desc_title')}</h2>
                  <p className="whitespace-pre-line">{product.description}</p>
                  {steps.length > 0 && (
                    <div className="pt-2">
                      <h3 className="font-bold text-gray-900 mb-1.5">{t('how_to_use')}</h3>
                      <ol className="list-decimal list-inside space-y-1 text-gray-700">
                        {steps.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* ================= ЭКРАН 3: КОРЗИНА И ОФОРМЛЕНИЕ С ДОСТАВКОЙ BTS ================= */}
          {currentView === 'cart' && (
            <div className="space-y-4 pb-8">
              <h1 className="font-extrabold text-2xl text-[#0D0D0D]">{t('cart_title')}</h1>

              {cart.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-gray-200/80">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center mx-auto mb-3">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <h2 className="font-bold text-base text-gray-900">Корзина пока пуста</h2>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                    Выберите готовые 3D-изделия в каталоге или оформите индивидуальный заказ по фото.
                  </p>
                  <button
                    onClick={() => setCurrentView('catalog')}
                    className="mt-5 px-6 py-3 rounded-xl bg-[#0066FF] text-white text-xs font-bold shadow-md shadow-blue-500/20"
                  >
                    {t('open_catalog')}
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-2.5">
                    {cart.map((item, idx) => (
                      <div
                        key={`${item.productId}-${item.color}`}
                        className="bg-white rounded-2xl p-3 border border-gray-200/80 flex gap-3 items-center"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-gray-100">
                          <ProductArtwork imageUrl={item.imageKey} title={item.title} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-bold text-gray-900 truncate">
                            {item.shortTitle || item.title}
                          </h3>
                          <p className="text-[11px] text-gray-500 mt-0.5">{item.color}</p>
                          <p className="font-extrabold text-sm text-[#0D0D0D] mt-1">
                            {formatSum(item.price * item.qty)}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1">
                              <button
                                type="button"
                                onClick={() => changeCartQty(idx, -1)}
                                className="w-6 h-6 rounded-lg bg-white border border-gray-200 text-gray-700 flex items-center justify-center"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold px-1">{item.qty}</span>
                              <button
                                type="button"
                                onClick={() => changeCartQty(idx, 1)}
                                className="w-6 h-6 rounded-lg bg-white border border-gray-200 text-gray-700 flex items-center justify-center"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeCartItem(idx)}
                              className="text-[11px] text-gray-400 underline hover:text-red-600"
                            >
                              Убрать
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Итого */}
                  <div className="bg-white rounded-2xl p-4 border border-gray-200/80 space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Товары</span>
                      <span className="font-semibold text-gray-900">{totalCartQty} шт.</span>
                    </div>
                    <div className="border-t border-gray-100 pt-2 flex justify-between items-baseline">
                      <span className="font-bold text-base text-[#0D0D0D]">Итого</span>
                      <span className="font-black text-lg text-[#0D0D0D]">
                        {formatSum(totalCartPrice)}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500">{t('bts_cost_note')}</p>
                  </div>

                  {/* Форма оформления заказа */}
                  <form
                    onSubmit={handleCheckoutSubmit}
                    className="bg-white rounded-3xl p-4 border border-gray-200/80 space-y-3.5"
                  >
                    <h2 className="font-extrabold text-lg text-[#0D0D0D]">{t('checkout_title')}</h2>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        {t('recipient_name')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerProfile.name}
                        onChange={(e) =>
                          setCustomerProfile({ ...customerProfile, name: e.target.value })
                        }
                        placeholder="Имя и фамилия получателя"
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        {t('phone_label')} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerProfile.phone}
                        onChange={(e) =>
                          setCustomerProfile({ ...customerProfile, phone: e.target.value })
                        }
                        placeholder="+998 90 123 45 67"
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        {t('tg_username')}
                      </label>
                      <input
                        type="text"
                        value={customerProfile.telegram}
                        onChange={(e) =>
                          setCustomerProfile({ ...customerProfile, telegram: e.target.value })
                        }
                        placeholder="@username (для связи по заказу)"
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>

                    {/* Выбор отделения BTS */}
                    <div className="pt-2 border-t border-gray-100">
                      <h3 className="font-extrabold text-base text-[#0D0D0D]">
                        {t('bts_delivery')}
                      </h3>
                      <p className="text-[11px] text-gray-500 mb-2.5">{t('bts_cost_note')}</p>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBtsCode('CHILANZAR BTS');
                          setBtsSearch('Ташкент');
                          showToast('Подобраны отделения BTS в г.Ташкент', 'info');
                        }}
                        className="w-full py-2.5 px-3 rounded-xl border border-gray-200 bg-[#F8FAFC] hover:border-[#0066FF] text-xs font-bold text-[#0D0D0D] flex items-center justify-center gap-2 mb-3 transition"
                      >
                        <MapPin className="w-4 h-4 text-[#0066FF]" />
                        <span>{t('find_nearest_bts')}</span>
                      </button>

                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        {t('select_bts_manual')}
                      </label>
                      <input
                        type="text"
                        value={btsSearch}
                        onChange={(e) => setBtsSearch(e.target.value)}
                        placeholder={t('bts_search_placeholder')}
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs mb-2.5 focus:outline-none focus:border-[#0066FF]"
                      />

                      <div className="max-h-56 overflow-y-auto rounded-2xl border border-gray-200 divide-y divide-gray-100 bg-white">
                        {BTS_BRANCHES.filter((b) => {
                          if (!btsSearch.trim()) return true;
                          const q = btsSearch.toLowerCase();
                          return (
                            b.code.toLowerCase().includes(q) ||
                            b.city.toLowerCase().includes(q) ||
                            b.address.toLowerCase().includes(q)
                          );
                        }).map((branch) => {
                          const isSelected = branch.code === selectedBtsCode;
                          return (
                            <div
                              key={branch.code}
                              onClick={() => setSelectedBtsCode(branch.code)}
                              className={`p-3 cursor-pointer transition ${
                                isSelected
                                  ? 'bg-blue-50/70 border-l-4 border-[#0066FF]'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-[#0D0D0D]">
                                  {branch.code}
                                </span>
                                {isSelected && (
                                  <span className="text-[10px] font-bold text-[#0066FF]">
                                    ✓ Выбрано
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-gray-700 mt-0.5">
                                {branch.city} · {branch.address}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{branch.hours}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        Комментарий к заказу
                      </label>
                      <input
                        type="text"
                        value={customerProfile.comment}
                        onChange={(e) =>
                          setCustomerProfile({ ...customerProfile, comment: e.target.value })
                        }
                        placeholder="Пожелания по цвету, размеру или доставке"
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {isSubmitting
                          ? 'Отправка заказа...'
                          : `Подтвердить заказ (${formatSum(totalCartPrice)})`}
                      </span>
                    </button>
                  </form>
                </>
              )}
            </div>
          )}

          {/* */}
          {/* ================= ЭКРАН 4: ИНДИВИДУАЛЬНЫЙ 3D-ЗАКАЗ ================= */}
          {currentView === 'custom' && (
            <div className="space-y-4 pb-8">
              <div className="bg-gradient-to-br from-[#0D0D0D] via-[#131C2E] to-[#0052CC] rounded-3xl p-5 text-white shadow-lg">
                <span className="px-2.5 py-1 rounded-full bg-[#0066FF] text-[10px] font-bold uppercase tracking-wider">
                  SIZ O&apos;YLANG — BIZ YARATAMIZ
                </span>
                <h1 className="font-extrabold text-xl mt-2">{t('custom_3d_title')}</h1>
                <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                  {t('custom_3d_sub')}. Мы спроектируем 3D-модель, подберём прочный пластик (PLA,
                  PETG, ABS, TPU) и напечатаем с высокой точностью.
                </p>
              </div>

              <form
                onSubmit={handleCustom3DSubmit}
                className="bg-white rounded-3xl p-4 border border-gray-200/80 space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Что нужно напечатать? (Описание детали / идеи) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={customForm.desc}
                    onChange={(e) => setCustomForm({ ...customForm, desc: e.target.value })}
                    placeholder="Например: сломалась шестерёнка от блендера диаметром 4 см, или нужен держатель для наушников..."
                    className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Желаемый цвет
                    </label>
                    <select
                      value={customForm.color}
                      onChange={(e) => setCustomForm({ ...customForm, color: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs bg-white"
                    >
                      <option value="Чёрный">Чёрный</option>
                      <option value="Синий USTA">Синий USTA</option>
                      <option value="Белый">Белый</option>
                      <option value="Серый">Серый</option>
                      <option value="Красный / Другой">Красный / Другой</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Тип пластика
                    </label>
                    <select
                      value={customForm.material}
                      onChange={(e) => setCustomForm({ ...customForm, material: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs bg-white"
                    >
                      <option value="Посоветуйте (Мастер выберет)">Посоветуйте мне</option>
                      <option value="PLA (Декор / Дом)">PLA (Декор / Дом)</option>
                      <option value="PETG (Прочный / Водостойкий)">PETG (Прочный)</option>
                      <option value="ABS / Nylon (Авто / Шестерни)">ABS (Авто / Детали)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Ссылка на фото / 3D-модель (если есть)
                  </label>
                  <input
                    type="text"
                    value={customForm.link}
                    onChange={(e) => setCustomForm({ ...customForm, link: e.target.value })}
                    placeholder="Ссылка на Printables, Thingiverse или фото"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-2.5 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">Ваше имя *</label>
                    <input
                      type="text"
                      required
                      value={customerProfile.name}
                      onChange={(e) =>
                        setCustomerProfile({ ...customerProfile, name: e.target.value })
                      }
                      placeholder="Как к вам обращаться"
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Телефон для связи *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerProfile.phone}
                      onChange={(e) =>
                        setCustomerProfile({ ...customerProfile, phone: e.target.value })
                      }
                      placeholder="+998 90 123 45 67"
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Ваш Telegram (@username)
                    </label>
                    <input
                      type="text"
                      value={customerProfile.telegram}
                      onChange={(e) =>
                        setCustomerProfile({ ...customerProfile, telegram: e.target.value })
                      }
                      placeholder="@username (напишем расчёт стоимости)"
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Отправить заявку на расчёт 3D-печати</span>
                </button>
              </form>
            </div>
          )}

          {/* ================= ЭКРАН 5: МОИ ЗАКАЗЫ (СОХРАНЕННЫЕ В ОБЛАКЕ ЗА КЛИЕНТОМ) ================= */}
          {currentView === 'orders' && (
            <div className="space-y-3.5 pb-8">
              <div className="flex items-center justify-between">
                <h1 className="font-extrabold text-2xl text-[#0D0D0D]">{t('orders_title')}</h1>
                <span className="text-xs font-semibold text-gray-500">
                  Сохранено: {myOrders.length}
                </span>
              </div>

              {myOrders.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-gray-200/80 my-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <h2 className="font-bold text-base text-[#0D0D0D]">{t('no_orders_title')}</h2>
                  <p className="text-xs text-gray-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                    {t('no_orders_sub')}
                  </p>
                  <button
                    onClick={() => setCurrentView('catalog')}
                    className="mt-5 px-6 py-2.5 rounded-xl bg-[#0D0D0D] hover:bg-[#0066FF] text-white text-xs font-bold transition"
                  >
                    {t('open_catalog')}
                  </button>
                </div>
              ) : (
                myOrders.map((order) => {
                  const st = getStatusBadge(order.status);
                  const StatusIcon = st.icon;
                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl p-4 border border-gray-200/85 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-[#0D0D0D]">
                              Заказ #{order.orderNumber}
                            </span>
                            <span className="text-[11px] text-gray-400">{order.dateFormatted}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            Получатель: <strong className="text-gray-800">{order.customerName}</strong> (
                            {order.customerPhone})
                          </p>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${st.bg}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{order.status}</span>
                        </span>
                      </div>

                      {/* Шкала прогресса 4 шага */}
                      {order.status !== 'Отменён' && (
                        <div className="grid grid-cols-4 gap-1.5 text-[10px] text-center font-semibold pt-1">
                          <div className={st.step >= 1 ? 'text-[#0066FF]' : 'text-gray-400'}>
                            <div
                              className={`h-1.5 rounded-full mb-1 ${
                                st.step >= 1 ? 'bg-[#0066FF]' : 'bg-gray-200'
                              }`}
                            />
                            Принят
                          </div>
                          <div className={st.step >= 2 ? 'text-[#0066FF]' : 'text-gray-400'}>
                            <div
                              className={`h-1.5 rounded-full mb-1 ${
                                st.step >= 2 ? 'bg-[#0066FF]' : 'bg-gray-200'
                              }`}
                            />
                            3D-печать
                          </div>
                          <div className={st.step >= 3 ? 'text-[#0066FF]' : 'text-gray-400'}>
                            <div
                              className={`h-1.5 rounded-full mb-1 ${
                                st.step >= 3 ? 'bg-[#0066FF]' : 'bg-gray-200'
                              }`}
                            />
                            В пути BTS
                          </div>
                          <div className={st.step >= 4 ? 'text-emerald-600' : 'text-gray-400'}>
                            <div
                              className={`h-1.5 rounded-full mb-1 ${
                                st.step >= 4 ? 'bg-emerald-500' : 'bg-gray-200'
                              }`}
                            />
                            Выполнен
                          </div>
                        </div>
                      )}

                      <div className="space-y-1.5 bg-gray-50 rounded-2xl p-3">
                        {(order.items || []).map((it, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-gray-800 font-medium">
                              {it.title}{' '}
                              <span className="text-gray-400">
                                ({it.color}) × {it.qty}
                              </span>
                            </span>
                            <span className="font-bold text-gray-900 shrink-0 ml-2">
                              {formatSum(it.price * it.qty)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col gap-1 text-xs text-gray-600 pt-1">
                        <div className="flex justify-between">
                          <span>Пункт BTS:</span>
                          <strong className="text-gray-900">{order.btsBranchCode}</strong>
                        </div>
                        {order.btsTrackNumber ? (
                          <div className="flex justify-between items-center bg-blue-50/80 border border-blue-200 rounded-xl px-3 py-1.5 mt-1">
                            <span className="text-[11px] font-bold text-[#0066FF]">
                              Трек-номер BTS:
                            </span>
                            <span className="font-mono font-extrabold text-xs text-[#0D0D0D] select-all">
                              {order.btsTrackNumber}
                            </span>
                          </div>
                        ) : (
                          <p className="text-[11px] text-gray-400">
                            Трек-номер BTS появится здесь сразу после отправки заказа.
                          </p>
                        )}
                      </div>

                      <div className="border-t border-gray-100 pt-2.5 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Сумма заказа:</span>
                        <span className="font-black text-base text-[#0D0D0D]">
                          {formatSum(order.totalPrice)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* */}
          {/* ================= ЭКРАН 6: АДМИН-ПАНЕЛЬ ВЛАДЕЛЬЦА ================= */}
          {currentView === 'admin' && isOwnerUnlocked && (
            <div className="space-y-4 pb-10">
              <div className="bg-[#0D0D0D] text-white rounded-3xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#0066FF] flex items-center justify-center">
                      <SlidersHorizontal className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h1 className="font-extrabold text-base">Админ-панель USTA 3D</h1>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[9px] font-bold uppercase">
                          Cloud Sync
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Единая база заказов со всех телефонов + Telegram API
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsOwnerUnlocked(false);
                      setCurrentView('catalog');
                      showToast('🔒 Вы вышли из админ-панели', 'info');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Выйти</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5 mt-4 bg-white/10 p-1 rounded-2xl text-xs font-bold">
                  <button
                    onClick={() => setAdminTab('orders')}
                    className={`py-2 rounded-xl transition ${
                      adminTab === 'orders' ? 'bg-[#0066FF] text-white' : 'text-gray-300'
                    }`}
                  >
                    Заявки ({orders.length})
                  </button>
                  <button
                    onClick={() => setAdminTab('products')}
                    className={`py-2 rounded-xl transition ${
                      adminTab === 'products' ? 'bg-[#0066FF] text-white' : 'text-gray-300'
                    }`}
                  >
                    Карточки ({products.length})
                  </button>
                  <button
                    onClick={() => setAdminTab('bot')}
                    className={`py-2 rounded-xl transition ${
                      adminTab === 'bot' ? 'bg-[#0066FF] text-white' : 'text-gray-300'
                    }`}
                  >
                    🚀 Бот и Облако
                  </button>
                </div>
              </div>

              {/* ВКЛАДКА 1: ВСЕ ЗАЯВКИ КЛИЕНТОВ (REAL-TIME) */}
              {adminTab === 'orders' && (
                <div className="space-y-3">
                  {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-8 text-center border border-gray-200/80">
                      <p className="font-bold text-gray-800">Заявок в облаке пока нет</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Как только любой клиент оформит заказ, он мгновенно появится здесь и придёт в
                        ваш Telegram-бот.
                      </p>
                    </div>
                  ) : (
                    orders.map((order) => {
                      const st = getStatusBadge(order.status);
                      const currentTrackVal =
                        trackInputs[order.id] !== undefined
                          ? trackInputs[order.id]
                          : order.btsTrackNumber || '';

                      return (
                        <div
                          key={order.id}
                          className="bg-white rounded-3xl p-4 border border-gray-200/90 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2.5">
                            <div>
                              <span className="font-black text-sm text-[#0D0D0D]">
                                Заявка #{order.orderNumber}
                              </span>
                              <span className="text-[11px] text-gray-400 ml-1.5">
                                {order.dateFormatted}
                              </span>
                              <div className="mt-1 space-y-0.5 text-xs">
                                <p>
                                  👤 <strong>{order.customerName}</strong>
                                </p>
                                <p>
                                  📞{' '}
                                  <a
                                    href={`tel:${order.customerPhone}`}
                                    className="text-[#0066FF] font-bold underline"
                                  >
                                    {order.customerPhone}
                                  </a>
                                </p>
                                {order.customerTelegram && (
                                  <p>
                                    💬 TG:{' '}
                                    <span className="font-semibold text-gray-800">
                                      {order.customerTelegram}
                                    </span>
                                  </p>
                                )}
                                <p>
                                  📦 BTS: <strong>{order.btsBranchCode}</strong> (
                                  {order.btsBranchAddress})
                                </p>
                                {order.comment && (
                                  <p className="text-amber-700 bg-amber-50 px-2 py-1 rounded-lg mt-1">
                                    📝 {order.comment}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 ${st.bg}`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <div className="bg-gray-50 rounded-2xl p-2.5 space-y-1 text-xs">
                            {(order.items || []).map((it, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>
                                  • <strong>{it.title}</strong> ({it.color}) × {it.qty} шт.
                                </span>
                                <span className="font-bold">{formatSum(it.price * it.qty)}</span>
                              </div>
                            ))}
                            <div className="border-t border-gray-200 pt-1.5 mt-1 flex justify-between font-extrabold text-sm">
                              <span>Итого к оплате:</span>
                              <span className="text-[#0066FF]">{formatSum(order.totalPrice)}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-2 pt-1">
                            <div className="flex items-center gap-2">
                              <label className="text-[11px] font-bold text-gray-600 shrink-0">
                                Статус у клиента:
                              </label>
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className="flex-1 rounded-xl border border-gray-200 px-2.5 py-1.5 text-xs font-bold bg-white focus:border-[#0066FF] focus:outline-none"
                              >
                                {[
                                  'Принят',
                                  'В 3D-печати',
                                  'Отправлен в BTS',
                                  'Выполнен',
                                  'Отменён'
                                ].map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={currentTrackVal}
                                onChange={(e) =>
                                  setTrackInputs({ ...trackInputs, [order.id]: e.target.value })
                                }
                                placeholder="Вписать трек-номер BTS клиенту..."
                                className="flex-1 rounded-xl border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:border-[#0066FF]"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveOrderTrack(order.id)}
                                className="px-3 py-1.5 rounded-xl bg-[#0D0D0D] text-white text-xs font-bold hover:bg-[#0066FF] transition"
                              >
                                Сохранить трек
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={async () => {
                                const res = await sendOrderNotificationToTelegram(order);
                                if (res.ok) {
                                  showToast('Заявка повторно продублирована в ваш Telegram!', 'success');
                                } else {
                                  showToast(res.reason, 'error');
                                }
                              }}
                              className="w-full py-1.5 rounded-xl border border-blue-200 bg-blue-50/50 text-[#0066FF] text-[11px] font-bold hover:bg-blue-100/60 transition flex items-center justify-center gap-1.5"
                            >
                              <Send className="w-3 h-3" />
                              <span>Продублировать эту заявку мне в Telegram</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* ВКЛАДКА 2: УПРАВЛЕНИЕ КАРТОЧКАМИ ТОВАРОВ */}
              {adminTab === 'products' && (
                <div className="space-y-4">
                  <form
                    onSubmit={handleSaveProductCard}
                    className="bg-white rounded-3xl p-4 border border-gray-200/90 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="font-extrabold text-sm text-[#0D0D0D]">
                        {editingProductId
                          ? '✏️ Редактировать карточку'
                          : '➕ Добавить новую карточку товара'}
                      </h2>
                      {editingProductId && (
                        <button
                          type="button"
                          onClick={() => setEditingProductId(null)}
                          className="text-xs text-red-600 font-bold"
                        >
                          Отмена
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Название товара *
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.title}
                        onChange={(e) =>
                          setProductForm({ ...productForm, title: e.target.value })
                        }
                        placeholder="Например: Подставка для наушников USTA 3D"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Короткое имя
                        </label>
                        <input
                          type="text"
                          value={productForm.shortTitle}
                          onChange={(e) =>
                            setProductForm({ ...productForm, shortTitle: e.target.value })
                          }
                          placeholder="Подставка для наушников"
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-[#0066FF]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Категория *
                        </label>
                        <select
                          value={productForm.category}
                          onChange={(e) =>
                            setProductForm({ ...productForm, category: e.target.value })
                          }
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs bg-white"
                        >
                          {CATEGORIES.filter((c) => c !== 'Все товары').map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Цена (в сумах) *
                        </label>
                        <input
                          type="number"
                          required
                          value={productForm.price}
                          onChange={(e) =>
                            setProductForm({ ...productForm, price: e.target.value })
                          }
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#0066FF]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          В наличии (шт.)
                        </label>
                        <input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) =>
                            setProductForm({ ...productForm, stock: e.target.value })
                          }
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-[#0066FF]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Доступные цвета (через запятую)
                      </label>
                      <input
                        type="text"
                        value={productForm.colors}
                        onChange={(e) =>
                          setProductForm({ ...productForm, colors: e.target.value })
                        }
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>

                    <div className="space-y-2 bg-gray-50 p-3 rounded-2xl border border-gray-200/80">
                      <label className="block text-[11px] font-bold text-gray-800">
                        Фотография товара (с телефона или по ссылке)
                      </label>
                      <label className="cursor-pointer py-2 px-3 rounded-xl bg-white border border-gray-200 hover:border-[#0066FF] text-xs font-bold text-[#0066FF] flex items-center justify-center gap-2 transition">
                        <Camera className="w-4 h-4" />
                        <span>Загрузить фото с устройства</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                      </label>
                      <input
                        type="text"
                        value={productForm.images}
                        onChange={(e) =>
                          setProductForm({ ...productForm, images: e.target.value })
                        }
                        placeholder="Или вставьте https:// ссылку на фото"
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Описание товара
                      </label>
                      <textarea
                        rows={3}
                        value={productForm.description}
                        onChange={(e) =>
                          setProductForm({ ...productForm, description: e.target.value })
                        }
                        placeholder="Подробное описание преимуществ 3D-изделия..."
                        className="w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs shadow-md shadow-blue-500/20 transition"
                    >
                      {editingProductId
                        ? '💾 Сохранить изменения в облаке'
                        : '➕ Опубликовать карточку для всех клиентов'}
                    </button>
                  </form>

                  <div className="space-y-2">
                    <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider px-1">
                      Все карточки в каталоге ({products.length})
                    </h3>
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white rounded-2xl p-3 border border-gray-200/80 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-gray-100">
                            <ProductArtwork imageUrl={p.images?.[0] || ''} title={p.title} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{p.title}</p>
                            <p className="text-[11px] text-gray-500">
                              {p.category} ·{' '}
                              <strong className="text-[#0D0D0D]">{formatSum(p.price)}</strong>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditProduct(p)}
                            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-[#0066FF] flex items-center justify-center"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id)}
                            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 flex items-center justify-center"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ВКЛАДКА 3: НАСТРОЙКА TELEGRAM-БОТА, ДИАГНОСТИКА И ЕДИНАЯ БАЗА */}
              {adminTab === 'bot' && (
                <div className="space-y-4">
                  {/* Статус облачной синхронизации */}
                  <div className="bg-white rounded-3xl p-4 border border-gray-200/90 space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isCloudConnected
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="font-bold text-sm text-[#0D0D0D]">
                          Статус облачной базы:{' '}
                          <span
                            className={isCloudConnected ? 'text-emerald-600' : 'text-amber-600'}
                          >
                            {isCloudConnected ? 'Активна (Real-Time)' : 'Локальный режим'}
                          </span>
                        </h2>
                        <p className="text-[11px] text-gray-500">
                          Все заказы, товары и настройки бота синхронизируются между устройствами через
                          Firestore.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Настройки Telegram Бота */}
                  <div className="bg-white rounded-3xl p-4 border border-gray-200/90 space-y-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="font-bold text-sm text-[#0D0D0D]">
                          Подключение Telegram-бота для приёма заявок
                        </h2>
                        <p className="text-[11px] text-gray-500">
                          Сохраняется в облаке — заявки приходят вам с любого телефона клиента
                        </p>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-[11px] text-amber-900 space-y-1">
                      <p className="font-bold">⚠️ Почему могли не приходить заявки в бот:</p>
                      <p>
                        1. Обязательно зайдите со своего аккаунта в созданного бота и нажмите{' '}
                        <strong>«Запустить» (/start)</strong> — иначе Telegram запрещает боту писать
                        вам первым!
                      </p>
                      <p>
                        2. Проверьте, что в поле <strong>Chat ID</strong> стоят только цифры вашего ID
                        (узнать можно в <code>@userinfobot</code>), а не <code>@username</code>.
                      </p>
                    </div>

                    <form onSubmit={handleSaveBotSettings} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          1. Telegram Bot Token (от @BotFather)
                        </label>
                        <input
                          type="text"
                          value={botConfig.botToken}
                          onChange={(e) =>
                            setBotConfig({ ...botConfig, botToken: e.target.value })
                          }
                          placeholder="1234567890:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw"
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#0066FF]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          2. Ваш числовой Chat ID (из @userinfobot)
                        </label>
                        <input
                          type="text"
                          value={botConfig.sellerChatId}
                          onChange={(e) =>
                            setBotConfig({ ...botConfig, sellerChatId: e.target.value })
                          }
                          placeholder="Например: 987654321"
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#0066FF]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          3. HTTPS-ссылка на ваш Mini App
                        </label>
                        <input
                          type="url"
                          value={botConfig.webAppUrl}
                          onChange={(e) =>
                            setBotConfig({ ...botConfig, webAppUrl: e.target.value })
                          }
                          placeholder="https://usta3d.netlify.app"
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#0066FF]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">
                            Секретный ПИН админки
                          </label>
                          <input
                            type="text"
                            value={botConfig.ownerPin}
                            onChange={(e) =>
                              setBotConfig({ ...botConfig, ownerPin: e.target.value })
                            }
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#0066FF]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">
                            Ваш TG ID (авто-вход)
                          </label>
                          <input
                            type="text"
                            value={botConfig.ownerTelegramIds}
                            onChange={(e) =>
                              setBotConfig({ ...botConfig, ownerTelegramIds: e.target.value })
                            }
                            placeholder="Напр: 987654321"
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-[#0066FF]"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs shadow-md transition"
                      >
                        💾 Сохранить настройки в облачной базе
                      </button>
                    </form>

                    {/* Кнопки диагностики и авто-настройки */}
                    <div className="pt-2 border-t border-gray-100 space-y-2">
                      <p className="text-[11px] font-bold text-gray-700">
                        Проверка и запуск в 1 клик:
                      </p>

                      <button
                        type="button"
                        onClick={handleTestTelegramNotification}
                        className="w-full py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
                      >
                        <Send className="w-4 h-4" />
                        <span>🔔 Отправить ТЕСТОВОЕ уведомление мне в Telegram</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleVerifyBotToken}
                        className="w-full py-2.5 px-3 rounded-xl border border-gray-200 bg-gray-50 hover:border-[#0066FF] text-xs font-bold text-gray-800 flex items-center justify-between transition"
                      >
                        <span>1. Проверить токен бота (getMe)</span>
                        <span className="text-[10px] text-[#0066FF]">
                          {botConfig.botVerifiedName || 'Проверить'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSetMenuButton}
                        className="w-full py-2.5 px-3 rounded-xl border border-gray-200 bg-gray-50 hover:border-[#0066FF] text-xs font-bold text-gray-800 flex items-center justify-between transition"
                      >
                        <span>2. Установить синюю кнопку «USTA 3D Магазин» в бота</span>
                        <Sparkles className="w-3.5 h-3.5 text-[#0066FF]" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Нижняя панель навигации */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 px-2 py-1.5">
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setCurrentView('catalog')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
                currentView === 'catalog' || currentView === 'product'
                  ? 'text-[#0066FF] font-bold'
                  : 'text-gray-500 font-medium hover:text-gray-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4 mb-0.5" />
              <span className="text-[11px]">{t('nav_catalog')}</span>
            </button>

            <button
              onClick={() => setCurrentView('custom')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
                currentView === 'custom'
                  ? 'text-[#0066FF] font-bold'
                  : 'text-gray-500 font-medium hover:text-gray-800'
              }`}
            >
              <Sparkles className="w-4 h-4 mb-0.5" />
              <span className="text-[11px]">{t('nav_custom')}</span>
            </button>

            <button
              onClick={() => setCurrentView('cart')}
              className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
                currentView === 'cart'
                  ? 'text-[#0066FF] font-bold'
                  : 'text-gray-500 font-medium hover:text-gray-800'
              }`}
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 mb-0.5" />
                {totalCartQty > 0 && (
                  <span className="absolute -top-1.5 -right-3 min-w-[18px] h-[18px] px-1 rounded-full bg-[#0066FF] text-white text-[10px] font-bold flex items-center justify-center">
                    {totalCartQty}
                  </span>
                )}
              </div>
              <span className="text-[11px]">{t('nav_cart')}</span>
            </button>

            <button
              onClick={() => setCurrentView('orders')}
              className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
                currentView === 'orders'
                  ? 'text-[#0066FF] font-bold'
                  : 'text-gray-500 font-medium hover:text-gray-800'
              }`}
            >
              <div className="relative">
                <ClipboardList className="w-4 h-4 mb-0.5" />
                {myOrders.length > 0 && (
                  <span className="absolute -top-1.5 -right-3 min-w-[18px] h-[18px] px-1 rounded-full bg-[#0D0D0D] text-white text-[10px] font-bold flex items-center justify-center">
                    {myOrders.length}
                  </span>
                )}
              </div>
              <span className="text-[11px]">{t('nav_orders')}</span>
            </button>
          </div>
          <div className="text-center pt-1 pb-0.5">
            <span className="text-[10px] text-gray-400 font-medium">
              @Usta3dUzBot · SIZ O&apos;YLANG – BIZ YARATAMIZ
            </span>
          </div>
        </nav>
      </div>
    </div>
  );
}