import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { motion } from "motion/react";
import { Save } from "lucide-react";

// Helper to flatten nested object into dot-separated keys
function flattenObject(obj: any, prefix = ""): Record<string, string> {
  let result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      result[newKey] = value;
    } else if (typeof value === "object" && value !== null) {
      result = { ...result, ...flattenObject(value, newKey) };
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "string") {
          result[`${newKey}.${index}`] = item;
        } else if (typeof item === "object") {
          result = { ...result, ...flattenObject(item, `${newKey}.${index}`) };
        }
      });
    }
  }
  return result;
}

// Helper to un-flatten dot-separated keys back to nested object (for saving)
function unflattenObject(flat: Record<string, string>): any {
  const result: any = {};
  for (const [key, value] of Object.entries(flat)) {
    const keys = key.split(".");
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = isNaN(Number(keys[i + 1])) ? {} : [];
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }
  return result;
}

const DEFAULT_TRANSLATIONS_EN = {
  nav: { shop: "Shop", about: "About", contact: "Contact", cart: "Cart" },
  brandStory: {
    tagline: "Our Heritage",
    titlePart1: "A Legacy of",
    titlePart2: "Excellence",
    paragraph1: "Since 1847, our maison has been crafting exquisite fragrances that transcend time. Each perfume is a masterpiece, born from the finest ingredients sourced from the most exclusive corners of the world.",
    paragraph2: "Our master perfumers blend tradition with innovation, creating scents that capture emotions, memories, and dreams. Every bottle represents our unwavering commitment to artistry and luxury.",
    paragraph3: "We believe that true elegance is timeless. Our fragrances are not just perfumes—they are experiences, stories waiting to be told on your skin.",
    stat1: "175+",
    stat1Label: "Years of Mastery",
    stat2: "120+",
    stat2Label: "Unique Fragrances",
    stat3: "50+",
    stat3Label: "Awards Won"
  },
  testimonials: {
    tagline: "Testimonials",
    title: "What Our Clients Say",
    testimonial1: {
      name: "Isabella Laurent",
      role: "Fashion Editor",
      content: "Absolutely divine. The Noir Absolu has become my signature scent. Every time I wear it, I receive compliments. The longevity is exceptional."
    },
    testimonial2: {
      name: "Alexander Chen",
      role: "Luxury Consultant",
      content: "These are not just perfumes—they're works of art. The craftsmanship is evident in every note. Worth every penny for true luxury."
    },
    testimonial3: {
      name: "Sophia Martinez",
      role: "Perfume Collector",
      content: "I've been collecting niche fragrances for 15 years, and this house stands apart. The complexity and elegance are unmatched."
    }
  },
  hero: { tagline: "Timeless Elegance in Every Scent", title: "Discover Your Signature", subtitle: "Curated fragrances for those who truly appreciate the art of perfumery", shopNow: "Shop Now", learnMore: "Learn More" },
  featured: { tagline: "Featured", title: "Signature Fragrances", description: "Curated exclusively for those who appreciate the art of fine perfumery", addToCart: "Add to Cart" },
  bestSellers: { tagline: "Most Loved", title: "Best Sellers" },
  shop: { collection: "The Collection", title: "All Fragrances", searchPlaceholder: "Search fragrances…", filters: "Filters", results: "results", result: "result", noProducts: "No products found.", clearFilters: "Clear Filters", all: "All" },
  productDetail: { addToCart: "Add to Cart", inStock: "In Stock", outOfStock: "Out of Stock" },
  cart: { 
    headerLabel: "Your Selection", 
    title: "Shopping Cart", 
    itemSingular: "item", 
    itemPlural: "items", 
    emptyTitle: "Your cart is empty", 
    emptyDescription: "Discover our collection of exceptional fragrances.", 
    exploreCollection: "Explore Collection",
    continueShopping: "Continue Shopping",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    total: "Total",
    proceedToCheckout: "Proceed to Checkout",
    secureCheckout: "Secure checkout · All major cards accepted",
    sslSecured: "SSL Secured",
    returns: "30-day Returns",
    giftWrapped: "Gift Wrapped"
  },
  checkout: { title: "Checkout", fullName: "Full Name", email: "Email", phone: "Phone", address: "Address", city: "City", district: "District", postalCode: "Postal Code", paymentMethod: "Payment Method", bankTransfer: "Bank Transfer", bank: "Bank", accountHolder: "Account Holder", customerInformation: "Customer Information", orderNote: "Order Note (Optional)", placingOrder: "Placing Order...", placeOrder: "Place Order", orderSummary: "Order Summary", subtotal: "Subtotal", shipping: "Shipping", free: "Free", total: "Total" },
  orderSuccess: { title: "Order Received!", message: "Your order has been received successfully.", orderNumber: "Order Number", paymentNote: "Please include your order number in the payment description.", continueShopping: "Continue Shopping", needHelp: "Need Help? Chat with Us" },
  footer: { 
    description: "A curated collection of luxury fragrances for those who appreciate the finer things in life.", 
    shop: "Shop", 
    allFragrances: "All Fragrances", 
    newArrivals: "New Arrivals", 
    bestSellers: "Best Sellers", 
    giftSets: "Gift Sets", 
    discover: "Discover", 
    ourStory: "Our Story", 
    contactUs: "Contact Us", 
    copyright: "© 2026 Élégance Absolue. All rights reserved. Est. 1847, Grasse.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    shippingPolicy: "Shipping Policy"
  },
  language: { english: "English", arabic: "العربية" },
  common: { add: "Add", edit: "Edit", delete: "Delete", save: "Save", cancel: "Cancel", back: "Back to Home", addedToCart: "Added to Cart!", productAddedSuccessfully: "Product successfully added to your cart" },
  checkoutSuccess: {
    title: "Your order has been successfully received.",
    description: "We will contact you soon to confirm the details.",
    backToShop: "Back to Shop"
  },
  contact: {
    title: "Contact Us",
    subtitle: "Have a question or want to learn more about our fragrances? We'd love to hear from you.",
    info: "Contact Info",
    email: "Email",
    phone: "Phone",
    address: "Address",
    location: "Grasse, France",
    getDirections: "Get Directions",
    visitUs: "Visit Us",
    sendMessage: "Send Message",
    fullName: "Full Name",
    emailPlaceholder: "you@example.com",
    subject: "Subject",
    message: "Your Message"
  },
  about: {
    hero: { tagline: "Est. 1847 · Grasse, France", titlePart1: "The Art of", titlePart2: "Perfumery", description: "For over one hundred and seventy-nine years, we have pursued a single vision: to create fragrances that transcend time and transform the wearer." },
    philosophy: { tagline: "Our Philosophy", titlePart1: "Scent as", titlePart2: "Memory", para1: "We believe that the finest fragrances are not merely products — they are emotional architecture. Each composition we create is designed to inhabit the deepest chambers of memory: the limbic system, where feeling and recall intertwine.", para2: "When you wear Élégance Absolue, you do not simply apply a scent. You claim a territory of the senses — a signature as distinctive and irreducible as a fingerprint, yet capable of evoking the entire complex of a life lived fully.", para3: "This is why we allow no compromise. Not in ingredient selection. Not in concentration. Not in the thousand hours of evaluation that precede every launch. The fragrance must be worthy of the memory it will one day become." },
    values: { tagline: "Our Principles", title: "What We Stand For", quality: { title: "Uncompromising Quality", desc: "We source only the finest raw materials on earth — Bulgarian rose absolutes, Cambodian oud, Mysore sandalwood. No budgetary constraint governs our ingredient selection." }, craft: { title: "Artisanal Craft", desc: "Every fragrance is created by hand in our Grasse atelier. No automated blending, no mass production. The human nose remains our most precise instrument." }, vision: { title: "Timeless Vision", desc: "We create for the ages, not the season. Our fragrances are conceived to be worn for decades — to become part of the stories that define lives." } },
    founder: { tagline: "The Nose", titlePart1: "A Life in", titlePart2: "Scent", role: "Maître Parfumeur", name: "Marie-Claire Fontaine", para1: "Marie-Claire Fontaine grew up in a small farmhouse in the Luberon, surrounded by lavender fields that her grandmother tended. Her earliest memory is olfactory — the precise, clean scent of fresh-cut lavender on a July morning.", para2: "She trained for fifteen years under the legendary Jean-Paul Guerlain in Grasse before joining Élégance Absolue as creative director in 2009. In seventeen years here, she has created forty-three fragrances, each bearing the unmistakable mark of a mind that experiences the world primarily through scent.", para3: "\"I think of each fragrance as a complete world,\" she says. \"You should be able to close your eyes and be transported — not to a generic idea of luxury, but to a specific place, a specific moment, a specific feeling.\"" },
    timeline: { tagline: "History", title: "One Hundred and Seventy-Nine Years", items: [
      { year: "1847", title: "The Founding", desc: "Henri-Louis Beaumont establishes the first atelier in Grasse, drawing from centuries of regional perfumery tradition." },
      { year: "1903", title: "Imperial Recognition", desc: "Élégance Absolue receives its first royal appointment, supplying the fragrances for the French Imperial Court." },
      { year: "1947", title: "The Golden Age", desc: "The centenary collection becomes one of the most critically acclaimed fragrance launches of the twentieth century." },
      { year: "1983", title: "A New Vision", desc: "Third-generation master Sophie Beaumont reimagines the house's identity, introducing the legendary Signature Collection." },
      { year: "2012", title: "Artisanal Renaissance", desc: "A return to small-batch, handcrafted production. Every bottle now personally approved by the maître parfumeur." },
      { year: "2026", title: "Present Day", desc: "One hundred and seventy-nine years of mastery, now reaching connoisseurs worldwide through our global network." }
    ] },
    cta: { titlePart1: "Experience the", titlePart2: "Difference", description: "Discover fragrances that have taken years to perfect, sourced from the most extraordinary ingredients on earth, and crafted entirely by hand.", button: "Explore the Collection" }
  }
};

const DEFAULT_TRANSLATIONS_AR = {
  nav: { shop: "المتجر", about: "من نحن", contact: "تواصل معنا", cart: "السلة" },
  brandStory: {
    tagline: "تراثنا",
    titlePart1: "إرث من",
    titlePart2: "التميز",
    paragraph1: "منذ عام 1847، ظل منزلتنا تصنع العطور الفاخرة التي تتجاوز الزمان. كل عطر هو تحفة فنية، مولدة من أجود المكونات المقدمة من أنحاء العالم الأكثر تفرداً.",
    paragraph2: "مزج طوابينا الأساسيون بين التقنية والابتكار، مخلقون عطوراً تلتقط المشاعر والذكريات والأحلام. كل زجاجة تمثل التزامنا الراسخ للفن والفخامة.",
    paragraph3: "نعتقد أن الأناقة الحقيقية دائمة. عطورنا ليست مجرد عطور - بل هي تجارب، قصص تنتظر أن تُحكى على بشرتك.",
    stat1: "+175",
    stat1Label: "سنة من الإتقان",
    stat2: "+120",
    stat2Label: "عطر فريد",
    stat3: "+50",
    stat3Label: "جائزة مُمنوحة"
  },
  testimonials: {
    tagline: "شهادات",
    title: "ماذا يقول عملاؤنا",
    testimonial1: {
      name: "إيزابيلا لوران",
      role: "محررة أزياء",
      content: "أعجوبة حقًا. أصبح نوار أبسول توقيعي الخاص. كل مرة أرتديه، أتلقى التحيات. العمر الرفيع استثنائي."
    },
    testimonial2: {
      name: "ألكساندر تشن",
      role: "مستشار فخامة",
      content: "هؤلاء ليسوا مجرد عطور - بل هم أعمال فنية. البراعة واضحة في كل نوتة. يستحق كل بنسلة من أجل الفخامة الحقيقية."
    },
    testimonial3: {
      name: "صوفيا مارتينز",
      role: "جامعة عطور",
      content: "كنت أُجمع العطور النقدية منذ 15 سنة، ولهذه المنزل شأن مختلف. التعقيد والأناقة لا مثيل لهما."
    }
  },
  hero: { tagline: "أناقة خالدة في كل رائحة", title: "اكتشف توقيعك الخاص", subtitle: "عطور مختارة بعناية لأولئك الذين يقدرون فن العطور حقًا", shopNow: "تسوق الآن", learnMore: "اعرف المزيد" },
  featured: { tagline: "مميز", title: "العطور المميزة", description: "مختارة بعناية لأولئك الذين يقدرون فن العطور الراقية", addToCart: "أضف إلى السلة" },
  bestSellers: { tagline: "الأكثر شعبية", title: "الأفضل مبيعاً" },
  shop: { collection: "المجموعة", title: "جميع العطور", searchPlaceholder: "ابحث عن العطور…", filters: "المرشحات", results: "نتيجة", result: "نتيجة", noProducts: "لم يتم العثور على منتجات.", clearFilters: "مسح المرشحات", all: "الكل" },
  productDetail: { addToCart: "أضف إلى السلة", inStock: "متوفر", outOfStock: "غير متوفر" },
  cart: { 
    headerLabel: "اختياراتك", 
    title: "سلة التسوق", 
    itemSingular: "عنصر", 
    itemPlural: "عناصر", 
    emptyTitle: "سلتك فارغة", 
    emptyDescription: "اكتشف مجموعتنا من العطور الاستثنائية.", 
    exploreCollection: "استكشف المجموعة",
    continueShopping: "مواصلة التسوق",
    orderSummary: "ملخص الطلب",
    subtotal: "المجموع الفرعي",
    total: "المجموع",
    proceedToCheckout: "الذهاب إلى الدفع",
    secureCheckout: "دفع آمن · قبول جميع البطاقات الرئيسية",
    sslSecured: "محمي بـ SSL",
    returns: "إرجاع خلال 30 يوم",
    giftWrapped: "مغلف بهداية"
  },
  checkout: { title: "الدفع", fullName: "الاسم الكامل", email: "البريد الإلكتروني", phone: "الهاتف", address: "العنوان", city: "المدينة", district: "الحي", postalCode: "الرمز البريدي", paymentMethod: "طريقة الدفع", bankTransfer: "تحويل بنكي", bank: "البنك", accountHolder: "اسم صاحب الحساب", customerInformation: "معلومات العميل", orderNote: "ملاحظة الطلب (اختياري)", placingOrder: "جارٍ إرسال الطلب...", placeOrder: "إرسال الطلب", orderSummary: "ملخص الطلب", subtotal: "المجموع الفرعي", shipping: "الشحن", free: "مجاني", total: "المجموع" },
  orderSuccess: { title: "تم استقبال الطلب!", message: "تم استقبال طلبك بنجاح.", orderNumber: "رقم الطلب", paymentNote: "يرجى كتابة رقم طلبك في وصف الدفع.", continueShopping: "مواصلة التسوق", needHelp: "تحتاج مساعدة؟ دردش معنا" },
  footer: { 
    description: "مجموعة مختارة من العطور الفاخرة لأولئك الذين يقدرون الأشياء الجميلة في الحياة.", 
    shop: "المتجر", 
    allFragrances: "جميع العطور", 
    newArrivals: "الوصلات الجديدة", 
    bestSellers: "الأفضل مبيعاً", 
    giftSets: "مجموعات الهدايا", 
    discover: "اكتشف", 
    ourStory: "قصتنا", 
    contactUs: "تواصل معنا", 
    copyright: "© 2026 Élégance Absolue. جميع الحقوق محفوظة. تأسست عام 1847، غراس.",
    privacyPolicy: "سياسة الخصوصية",
    termsOfService: "شروط الخدمة",
    shippingPolicy: "سياسة الشحن"
  },
  language: { english: "English", arabic: "العربية" },
  common: { add: "إضافة", edit: "تعديل", delete: "حذف", save: "حفظ", cancel: "إلغاء", back: "العودة للرئيسية", addedToCart: "تمت الإضافة إلى السلة!", productAddedSuccessfully: "تم إضافة المنتج إلى سلتك بنجاح" },
  checkoutSuccess: {
    title: "تم استلام طلبك بنجاح",
    description: "سنتواصل معك قريباً لتأكيد التفاصيل.",
    backToShop: "العودة إلى المتجر"
  },
  contact: {
    title: "تواصل معنا",
    subtitle: "لديك سؤال أو تريد معرفة المزيد عن عطورنا؟ نود أن نسمع منك.",
    info: "معلومات الاتصال",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    address: "العنوان",
    location: "غراس، فرنسا",
    getDirections: "الحصول على الاتجاهات",
    visitUs: "زورنا",
    sendMessage: "إرسال الرسالة",
    fullName: "الاسم الكامل",
    emailPlaceholder: "أنت@مثال.com",
    subject: "الموضوع",
    message: "رسالتك"
  },
  about: {
    hero: { tagline: "تأسست 1847 · غراس، فرنسا", titlePart1: "فن", titlePart2: "العطور", description: "لمدة تزيد عن مائة وسبعة وتسعين عامًا، كنا نتبنى رؤية واحدة فقط: خلق عطور تتجاوز الوقت وتحول مرتديها." },
    philosophy: { tagline: "فلسفتنا", titlePart1: "الرائحة كـ", titlePart2: "الذاكرة", para1: "نعتقد أن أرقى العطور ليست مجرد منتجات، بل إنها هندسة عاطفية. كل تركيبة نخلقها مصممة لتسكن أعمق خزائن الذاكرة: الجهاز الحوفي، حيث تتشابك المشاعر والتذكير.", para2: "عندما ترتدي Élégance Absolue، لست مجرد تطبق رائحة. بل أنت تطالب بمنطقة من الحواس — توقيع مميز لا يمكن تقليده، كالبصمة، مع ذلك قادر على استحضار معقد الحياة الحية كاملة.", para3: "لهذا السبب لا نسمح بأي تنازلات. لا في اختيار المكونات. ولا في التركيز. ولا في ألف ساعة من التقييم التي تسبق كل إطلاق. يجب أن تستحق العطر الذاكرة التي ستكونها يومًا ما." },
    values: { tagline: "مبادئنا", title: "ما نؤمن به", quality: { title: "جودة لا تُقارن", desc: "نحصل فقط على أرقى المواد الخام على الأرض — أسفار الورود البلغاري، العود الكمبودي، الصندل من مايسور. لا تحدد قيود الميزانية اختيارنا للمكونات." }, craft: { title: "حرفة يدوية", desc: "يتم خلق كل عطر باليد في ورشتنا في غراس. لا خلط آلي، لا إنتاج جماعي. الأنف البشري يظمل أداة دقتنا القصوى." }, vision: { title: "رؤية خالدة", desc: "نخلق للأزمنة، لا للموسم. تم تصميم عطورنا ليتم ارتداؤها لعقود — لتصبح جزءًا من القصص التي تحدد الحياة." } },
    founder: { tagline: "الأنف", titlePart1: "حياة في", titlePart2: "الرائحة", role: "ميتير بارفومر", name: "ماري كلير فونتين", para1: "نشأت ماري كلير فونتين في مزرعة صغيرة في لوبيرون، محاطة بحقول اللافندر التي اعتنت بها جدتها. ذكرتها الأولى هي شمية — الرائحة الدقيقة النظيفة لللافندر المقطوع في صباح يوليو.", para2: "تدربت لمدة خمسة عشر عامًا تحت إشراف الأسطورة جان بول غيرلان في غراس قبل الانضمام إلى Élégance Absolue كمديرة إبداعية في عام 2009. في سبعة عشر عامًا هنا، خلقت ثلاثة وأربعين عطرًا، يحمل كل منها بصمة لا تنسى لذاكرة تعيش العالم بشكل أساسي من خلال الرائحة.", para3: "\"أفكر في كل عطر كعالم كامل،\" تقول. \"يجب أن تكون قادرًا على إغلاق عينيك وأن تنقل — ليس إلى فكرة عامة للفخامة، بل إلى مكان محدد، لحظة محددة، إلى شعور محدد.\"" },
    timeline: { tagline: "التاريخ", title: "مائة وسبعة وتسعين عامًا", items: [
      { year: "1847", title: "التأسيس", desc: "ينشئ هنري لويس بومونت أول ورشة عمل في غراس، مستمدًا من قرون من تقليد صنع العطور الإقليمي." },
      { year: "1903", title: "الاعتراف الإمبراطوري", desc: "تلقي Élégance Absolue أول تعيين ملكي، حيث تزود عطور البيت الإمبراطوري الفرنسي." },
      { year: "1947", title: "العصر الذهبي", desc: "تصبح مجموعة المئة عامًا واحدة من أكثر إطلاقات العطور إشادة من النقاد في القرن العشرين." },
      { year: "1983", title: "رؤية جديدة", desc: "تعيد صوفي بومونت المبدعة من الجيل الثالث تصور هوية المنزل، حيث تقدّم مجموعة التوقيع الأسطورية." },
      { year: "2012", title: "نهضة الحرفة اليدوية", desc: "عودة إلى الإنتاج المُصغر الحجم واليدوي. الآن كل زجاجة تُعتمد شخصيًا من قبل الميتير بارفومر." },
      { year: "2026", title: "الوقت الحاضر", desc: "مائة وسبعة وتسعين عامًا من الإتقان، وصل الآن إلى المختصين في جميع أنحاء العالم من خلال شبكتنا العالمية." }
    ] },
    cta: { titlePart1: "تجربة", titlePart2: "الفرق", description: "اكتشف عطور استغرق خلقها سنوات، مُحصلة من أرقى المكونات على الأرض، وخلقها بالكامل باليد.", button: "استكشف المجموعة" }
  }
};

export function AdminTranslationsPage() {
  const [translationsEn, setTranslationsEn] = useState<Record<string, string>>({});
  const [translationsAr, setTranslationsAr] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("all");

  // Flatten default translations
  const flatDefaultEn = flattenObject(DEFAULT_TRANSLATIONS_EN);
  const flatDefaultAr = flattenObject(DEFAULT_TRANSLATIONS_AR);

  // Section groups
  const sections = ["all", "nav", "hero", "featured", "bestSellers", "shop", "productDetail", "cart", "checkout", "checkoutSuccess", "orderSuccess", "footer", "common", "about", "contact", "brandStory", "testimonials"];

  useEffect(() => {
    loadTranslations();
  }, []);

  async function loadTranslations() {
    try {
      const { data } = await supabase.from("translations").select("*");
      const en: Record<string, string> = {};
      const ar: Record<string, string> = {};
      
      // Load existing or use defaults
      const existingEn: Record<string, string> = {};
      const existingAr: Record<string, string> = {};
      data?.forEach(item => {
        if (item.lang === "en") existingEn[item.key] = item.value;
        if (item.lang === "ar") existingAr[item.key] = item.value;
      });

      // Merge with defaults
      for (const key of Object.keys(flatDefaultEn)) {
        en[key] = existingEn[key] || flatDefaultEn[key];
      }
      for (const key of Object.keys(flatDefaultAr)) {
        ar[key] = existingAr[key] || flatDefaultAr[key];
      }

      setTranslationsEn(en);
      setTranslationsAr(ar);
    } catch (error) {
      console.error("Error loading translations:", error);
      // Fallback to defaults
      setTranslationsEn(flatDefaultEn);
      setTranslationsAr(flatDefaultAr);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      // Save English translations
      for (const [key, value] of Object.entries(translationsEn)) {
        await supabase.from("translations").upsert(
          { key, value, lang: "en", updated_at: new Date().toISOString() },
          { onConflict: "key, lang" }
        );
      }
      // Save Arabic translations
      for (const [key, value] of Object.entries(translationsAr)) {
        await supabase.from("translations").upsert(
          { key, value, lang: "ar", updated_at: new Date().toISOString() },
          { onConflict: "key, lang" }
        );
      }
      
      // Clear localStorage cache so the frontend picks up fresh data
      localStorage.removeItem("translations_en");
      localStorage.removeItem("translations_ar");
      
      alert("Translations saved successfully! Refresh the main site to see changes.");
    } catch (error: any) {
      console.error("Error saving translations:", error);
      alert("Error saving translations: " + (error.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  }

  // Filter keys by active section
  const filteredKeys = Object.keys(translationsEn).filter(key => activeSection === "all" || key.startsWith(activeSection + ".")).sort();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-[var(--background)] pt-20 md:pt-24 pb-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center mb-8 gap-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-4xl text-foreground"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Translations
          </motion.h1>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-[var(--gold)] text-[var(--black)] tracking-wider uppercase text-xs md:text-sm hover:bg-[var(--gold-light)] transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Translations"}
          </motion.button>
        </div>

        {/* Section Filter */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-8">
          {sections.map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm tracking-wider uppercase transition-colors border rounded ${
                activeSection === section
                  ? "bg-[var(--gold)] text-[var(--black)] border-[var(--gold)]"
                  : "bg-transparent text-[var(--muted-foreground)] border-[var(--border)] hover:text-foreground hover:border-[var(--gold)]"
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        {/* Translation Grid */}
        <div className="bg-gradient-to-br from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)] p-4 md:p-8 rounded-lg space-y-4 md:space-y-6">
          {filteredKeys.map(key => (
            <div key={key} className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-[var(--muted-foreground)] text-xs tracking-wider uppercase break-all">{key}</label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--muted-foreground)] text-xs tracking-wider uppercase mb-1">English</label>
                  <input
                    value={translationsEn[key] || ""}
                    onChange={(e) => setTranslationsEn({ ...translationsEn, [key]: e.target.value })}
                    className="w-full px-4 py-2 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--muted-foreground)] text-xs tracking-wider uppercase mb-1">العربية</label>
                  <input
                    value={translationsAr[key] || ""}
                    onChange={(e) => setTranslationsAr({ ...translationsAr, [key]: e.target.value })}
                    dir="rtl"
                    className="w-full px-4 py-2 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>
              </div>
            </div>
          ))}
          {filteredKeys.length === 0 && (
            <div className="text-center text-[var(--muted-foreground)]">No translations in this section.</div>
          )}
        </div>
      </div>
    </div>
  );
}
