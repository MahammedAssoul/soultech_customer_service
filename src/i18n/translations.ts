export type Language = 'en' | 'ar'

export type TranslationKey =
  | 'brand.name'
  | 'brand.tagline'
  | 'home.title'
  | 'home.subtitle'
  | 'home.scanHint'
  | 'home.enterCode'
  | 'home.enterCodePlaceholder'
  | 'home.selectMachine'
  | 'home.selectMachinePlaceholder'
  | 'home.noMachines'
  | 'home.go'
  | 'home.codeError'
  | 'machine.notFound.title'
  | 'machine.notFound.body'
  | 'machine.notFound.hint'
  | 'machine.howCanWeHelp'
  | 'machine.reportIssue'
  | 'machine.reportIssueHint'
  | 'machine.requestProduct'
  | 'machine.requestProductHint'
  | 'machine.back'
  | 'issue.title'
  | 'issue.subtitle'
  | 'issue.typeLabel'
  | 'issue.type.productDidntComeOut'
  | 'issue.type.productGotStuck'
  | 'issue.type.paymentProblem'
  | 'issue.type.wrongChange'
  | 'issue.type.machineNotWorking'
  | 'issue.type.machineEmpty'
  | 'issue.type.productDamaged'
  | 'issue.type.other'
  | 'issue.descriptionLabel'
  | 'issue.descriptionPlaceholder'
  | 'issue.photoLabel'
  | 'issue.photoHint'
  | 'issue.photoUploading'
  | 'issue.photoFailed'
  | 'issue.photoRemove'
  | 'issue.phoneLabel'
  | 'issue.phonePlaceholder'
  | 'issue.submit'
  | 'issue.submitting'
  | 'issue.required'
  | 'request.title'
  | 'request.subtitle'
  | 'request.searchLabel'
  | 'request.searchPlaceholder'
  | 'request.noResults'
  | 'request.otherProduct'
  | 'request.otherProductPlaceholder'
  | 'request.noteLabel'
  | 'request.notePlaceholder'
  | 'request.phoneLabel'
  | 'request.phonePlaceholder'
  | 'request.submit'
  | 'request.submitting'
  | 'request.required'
  | 'requested.title'
  | 'requested.subtitle'
  | 'requested.helpTitle'
  | 'requested.helpBody'
  | 'requested.voteHint'
  | 'requested.newRequest'
  | 'requested.votes'
  | 'requested.youVoted'
  | 'requested.voted'
  | 'requested.notVoted'
  | 'requested.adminNote'
  | 'requested.photoComingSoon'
  | 'requested.empty.title'
  | 'requested.empty.body'
  | 'requested.alreadyRequested.title'
  | 'requested.alreadyRequested.body'
  | 'requested.status.new'
  | 'requested.status.reviewing'
  | 'requested.status.approved'
  | 'requested.status.available'
  | 'requested.status.rejected'
  | 'requested.sort.mostVotes'
  | 'requested.sort.newest'
  | 'requested.voteError'
  | 'requested.new.title'
  | 'requested.new.subtitle'
  | 'requested.new.productName'
  | 'requested.new.productNamePlaceholder'
  | 'requested.new.category'
  | 'requested.new.categoryPlaceholder'
  | 'requested.new.submit'
  | 'requested.new.submitting'
  | 'requested.new.required'
  | 'requested.new.success.title'
  | 'requested.new.success.body'
  | 'requested.new.success.vote'
  | 'requested.new.duplicate.title'
  | 'requested.new.duplicate.body'
  | 'requested.new.duplicate.vote'
  | 'requested.new.duplicate.view'
  | 'success.issue.title'
  | 'success.issue.body'
  | 'success.request.title'
  | 'success.request.body'
  | 'success.reference'
  | 'success.done'
  | 'success.track'
  | 'track.title'
  | 'track.issue'
  | 'track.request'
  | 'track.machine'
  | 'track.product'
  | 'track.status'
  | 'track.submitted'
  | 'track.received'
  | 'track.inProgress'
  | 'track.resolved'
  | 'track.rejected'
  | 'track.reviewing'
  | 'track.added'
  | 'track.notFound.title'
  | 'track.notFound.body'
  | 'track.back'
  | 'error.title'
  | 'error.body'
  | 'error.retry'
  | 'error.setup.title'
  | 'error.setup.body'
  | 'error.setup.hint'
  | 'error.backHome'
  | 'common.loading'
  | 'common.optional'
  | 'common.required'
  | 'common.cancel'
  | 'common.continue'
  | 'common.language'
  | 'common.phoneInvalid'
  | 'common.photoTooLarge'
  | 'common.photoUnsupported'
  | 'common.photoCompressing'
  | 'common.photoCompressFailed'
  | 'common.uploadFailed'
  | 'common.submitFailed'
  | 'common.retry'
  | 'common.contactSupport'
  | 'common.footer'

export type Translation = Record<TranslationKey, string>

export const translations: Record<Language, Translation> = {
  en: {
    'brand.name': 'Soultech Vending',
    'brand.tagline': 'Customer Support',
    'home.title': 'How can we help?',
    'home.subtitle':
      "Choose your vending machine by its number or location, then let us know about an issue or request a product.",
    'home.scanHint': 'Select a machine',
    'home.enterCode': 'Enter machine code',
    'home.enterCodePlaceholder': 'e.g. ST-001',
    'home.selectMachine': 'Select your vending machine',
    'home.selectMachinePlaceholder': 'Choose a machine...',
    'home.noMachines': 'No machines available right now.',
    'home.go': 'Continue',
    'home.codeError': 'Please select a machine.',
    'machine.notFound.title': 'Machine Not Found',
    'machine.notFound.body': "We couldn't find this vending machine.",
    'machine.notFound.hint': 'Please scan the QR code again or contact Soultech support.',
    'machine.howCanWeHelp': 'How can we help?',
    'machine.reportIssue': 'Report an Issue',
    'machine.reportIssueHint': "Something isn't working?",
    'machine.requestProduct': 'Request a Product',
    'machine.requestProductHint': "Can't find what you're looking for?",
    'machine.back': 'Back',
    'issue.title': 'Report an Issue',
    'issue.subtitle': 'What went wrong with this machine?',
    'issue.typeLabel': 'Issue type',
    'issue.type.productDidntComeOut': "Product didn't come out",
    'issue.type.productGotStuck': 'Product got stuck',
    'issue.type.paymentProblem': 'Payment problem',
    'issue.type.wrongChange': 'Wrong change',
    'issue.type.machineNotWorking': "Machine isn't working",
    'issue.type.machineEmpty': 'Machine is empty',
    'issue.type.productDamaged': 'Product damaged/expired',
    'issue.type.other': 'Other',
    'issue.descriptionLabel': 'Description',
    'issue.descriptionPlaceholder': 'Tell us what happened...',
    'issue.photoLabel': 'Photo',
    'issue.photoHint': 'Add a photo (optional)',
    'issue.photoUploading': 'Uploading photo...',
    'issue.photoFailed': 'Photo could not be uploaded. You can still submit without it.',
    'issue.photoRemove': 'Remove photo',
    'issue.phoneLabel': 'Phone number',
    'issue.phonePlaceholder': 'Phone number (optional)',
    'issue.submit': 'Submit Issue',
    'issue.submitting': 'Submitting...',
    'issue.required': 'Please select an issue type.',
    'request.title': 'Request a Product',
    'request.subtitle': 'What product would you like to see in this machine?',
    'request.searchLabel': 'Search products',
    'request.searchPlaceholder': 'Search products...',
    'request.noResults': 'No matching products. You can request it below.',
    'request.otherProduct': 'Other product',
    'request.otherProductPlaceholder': 'Enter the product name',
    'request.noteLabel': 'Additional note',
    'request.notePlaceholder': "Anything else you'd like us to know?",
    'request.phoneLabel': 'Phone number',
    'request.phonePlaceholder': 'Phone number (optional)',
    'request.submit': 'Send Request',
    'request.submitting': 'Sending...',
    'request.required': 'Please select a product or enter a product name.',
    'requested.title': 'Requested Products',
    'requested.subtitle': 'Help us decide what to add next.',
    'requested.helpTitle': 'See something you want?',
    'requested.helpBody': 'Vote for it below. Can\'t find it? Request a new product.',
    'requested.voteHint': 'Vote for the products you\'d like to see in this machine.',
    'requested.newRequest': 'Request a New Product',
    'requested.votes': 'votes',
    'requested.youVoted': 'You voted',
    'requested.voted': 'Voted',
    'requested.notVoted': 'Tap to vote',
    'requested.adminNote': 'Soultech Note',
    'requested.photoComingSoon': 'Photo coming soon',
    'requested.empty.title': 'No product requests yet.',
    'requested.empty.body': 'Be the first to suggest a product for this machine!',
    'requested.alreadyRequested.title': 'Already requested!',
    'requested.alreadyRequested.body': 'This product has already been requested for this machine.',
    'requested.status.new': 'New Request',
    'requested.status.reviewing': 'Under Review',
    'requested.status.approved': 'Coming Soon',
    'requested.status.available': 'Available',
    'requested.status.rejected': 'Not Planned',
    'requested.sort.mostVotes': 'Most Votes',
    'requested.sort.newest': 'Newest',
    'requested.voteError': 'Could not update your vote. Please try again.',
    'requested.new.title': 'Request a New Product',
    'requested.new.subtitle': 'Suggest a product you\'d like to see in this machine.',
    'requested.new.productName': 'Product name',
    'requested.new.productNamePlaceholder': 'e.g. KitKat',
    'requested.new.category': 'Category',
    'requested.new.categoryPlaceholder': 'e.g. Snacks (optional)',
    'requested.new.submit': 'Submit Request',
    'requested.new.submitting': 'Submitting...',
    'requested.new.required': 'Please enter a product name.',
    'requested.new.success.title': 'Request Submitted!',
    'requested.new.success.body': 'Your product request has been added to the list.',
    'requested.new.success.vote': 'Vote for it now',
    'requested.new.duplicate.title': 'Already requested!',
    'requested.new.duplicate.body': 'This product has already been requested for this machine.',
    'requested.new.duplicate.vote': 'You can vote for it instead.',
    'requested.new.duplicate.view': 'View the product',
    'success.issue.title': 'Thank You!',
    'success.issue.body': 'Your request has been received.',
    'success.request.title': 'Request Received!',
    'success.request.body': "We'll consider adding this product to the vending machine.",
    'success.reference': 'Reference number',
    'success.done': 'Done',
    'success.track': 'Track Request',
    'track.title': 'Track Request',
    'track.issue': 'Issue',
    'track.request': 'Product Request',
    'track.machine': 'Machine',
    'track.product': 'Product',
    'track.status': 'Status',
    'track.submitted': 'Submitted',
    'track.received': 'Received',
    'track.inProgress': 'In Progress',
    'track.resolved': 'Resolved',
    'track.rejected': 'Rejected',
    'track.reviewing': 'Reviewing',
    'track.added': 'Added',
    'track.notFound.title': 'Request Not Found',
    'track.notFound.body': "We couldn't find a request with this reference number.",
    'track.back': 'Back to home',
    'error.title': 'Something went wrong',
    'error.body': 'Please check your internet connection and try again.',
    'error.retry': 'Try again',
    'error.setup.title': 'Service not configured',
    'error.setup.body': 'This service is not connected to its database yet.',
    'error.setup.hint': 'Please contact Soultech support.',
    'error.backHome': 'Back to home',
    'common.loading': 'Loading...',
    'common.optional': 'Optional',
    'common.required': 'Required',
    'common.cancel': 'Cancel',
    'common.continue': 'Continue',
    'common.language': 'Language',
    'common.phoneInvalid': 'Please enter a valid phone number.',
    'common.photoTooLarge': 'Photo is too large. Please choose a smaller image.',
    'common.photoUnsupported': 'Unsupported file type. Please choose a JPG, PNG or WebP image.',
    'common.photoCompressing': 'Compressing photo...',
    'common.photoCompressFailed': 'Could not compress the photo.',
    'common.uploadFailed': 'The photo could not be uploaded.',
    'common.submitFailed': 'Something went wrong. Please try again.',
    'common.retry': 'Retry',
    'common.contactSupport': 'Contact Soultech support',
    'common.footer': 'Soultech Vending — Customer Support',
  },
  ar: {
    'brand.name': 'Soultech Vending',
    'brand.tagline': 'دعم العملاء',
    'home.title': 'كيف يمكننا مساعدتك؟',
    'home.subtitle':
      "اختر المكينة باستخدام رقمها أو موقعها، ثم أبلغنا عن أي مشكلة أو اطلب منتجًا جديدًا.",
    'home.scanHint': 'اختر آلة البيع',
    'home.enterCode': 'أدخل رمز الآلة',
    'home.enterCodePlaceholder': 'مثال: ST-001',
    'home.selectMachine': 'اختر آلة البيع',
    'home.selectMachinePlaceholder': 'اختر آلة...',
    'home.noMachines': 'لا توجد آلات متاحة حالياً.',
    'home.go': 'متابعة',
    'home.codeError': 'يرجى اختيار آلة.',
    'machine.notFound.title': 'الآلة غير موجودة',
    'machine.notFound.body': 'لم نتمكن من العثور على آلة البيع هذه.',
    'machine.notFound.hint': 'يرجى مسح رمز QR مرة أخرى أو الاتصال بدعم Soultech.',
    'machine.howCanWeHelp': 'كيف يمكننا مساعدتك؟',
    'machine.reportIssue': 'الإبلاغ عن مشكلة',
    'machine.reportIssueHint': 'هل هناك شيء لا يعمل؟',
    'machine.requestProduct': 'طلب منتج',
    'machine.requestProductHint': 'ألا تجد ما تبحث عنه؟',
    'machine.back': 'رجوع',
    'issue.title': 'الإبلاغ عن مشكلة',
    'issue.subtitle': 'ما المشكلة في هذه الآلة؟',
    'issue.typeLabel': 'نوع المشكلة',
    'issue.type.productDidntComeOut': 'المنتج لم يخرج',
    'issue.type.productGotStuck': 'المنتج عالق',
    'issue.type.paymentProblem': 'مشكلة في الدفع',
    'issue.type.wrongChange': 'الباقي غير صحيح',
    'issue.type.machineNotWorking': 'الآلة لا تعمل',
    'issue.type.machineEmpty': 'الآلة فارغة',
    'issue.type.productDamaged': 'منتج تالف/منتهي الصلاحية',
    'issue.type.other': 'أخرى',
    'issue.descriptionLabel': 'الوصف',
    'issue.descriptionPlaceholder': 'أخبرنا بما حدث...',
    'issue.photoLabel': 'صورة',
    'issue.photoHint': 'أضف صورة (اختياري)',
    'issue.photoUploading': 'جارٍ رفع الصورة...',
    'issue.photoFailed': 'تعذر رفع الصورة. يمكنك الإرسال بدونها.',
    'issue.photoRemove': 'إزالة الصورة',
    'issue.phoneLabel': 'رقم الهاتف',
    'issue.phonePlaceholder': 'رقم الهاتف (اختياري)',
    'issue.submit': 'إرسال المشكلة',
    'issue.submitting': 'جارٍ الإرسال...',
    'issue.required': 'يرجى اختيار نوع المشكلة.',
    'request.title': 'طلب منتج',
    'request.subtitle': 'ما المنتج الذي تود رؤيته في هذه الآلة؟',
    'request.searchLabel': 'البحث عن المنتجات',
    'request.searchPlaceholder': 'ابحث عن المنتجات...',
    'request.noResults': 'لا توجد منتجات مطابقة. يمكنك طلبه أدناه.',
    'request.otherProduct': 'منتج آخر',
    'request.otherProductPlaceholder': 'أدخل اسم المنتج',
    'request.noteLabel': 'ملاحظة إضافية',
    'request.notePlaceholder': 'هل هناك أي شيء آخر تود إخبارنا به؟',
    'request.phoneLabel': 'رقم الهاتف',
    'request.phonePlaceholder': 'رقم الهاتف (اختياري)',
    'request.submit': 'إرسال الطلب',
    'request.submitting': 'جارٍ الإرسال...',
    'request.required': 'يرجى اختيار منتج أو إدخال اسم المنتج.',
    'requested.title': 'المنتجات المطلوبة',
    'requested.subtitle': 'ساعدنا في اختيار ما نضيفه بعد ذلك.',
    'requested.helpTitle': 'هل ترى شيئاً تريده؟',
    'requested.helpBody': 'صوّت له أدناه. لا تجده؟ اطلب منتجاً جديداً.',
    'requested.voteHint': 'صوّت للمنتجات التي تود رؤيتها في هذه الآلة.',
    'requested.newRequest': 'طلب منتج جديد',
    'requested.votes': 'تصويت',
    'requested.youVoted': 'لقد صوّت',
    'requested.voted': 'تم التصويت',
    'requested.notVoted': 'اضغط للتصويت',
    'requested.adminNote': 'ملاحظة Soultech',
    'requested.photoComingSoon': 'الصورة قريباً',
    'requested.empty.title': 'لا توجد طلبات منتجات بعد.',
    'requested.empty.body': 'كن أول من يقترح منتجاً لهذه الآلة!',
    'requested.alreadyRequested.title': 'تم طلبه بالفعل!',
    'requested.alreadyRequested.body': 'تم طلب هذا المنتج بالفعل لهذه الآلة.',
    'requested.status.new': 'طلب جديد',
    'requested.status.reviewing': 'قيد المراجعة',
    'requested.status.approved': 'قريباً',
    'requested.status.available': 'متوفر',
    'requested.status.rejected': 'غير مخطط له',
    'requested.sort.mostVotes': 'الأكثر تصويتاً',
    'requested.sort.newest': 'الأحدث',
    'requested.voteError': 'تعذر تحديث تصويتك. يرجى المحاولة مرة أخرى.',
    'requested.new.title': 'طلب منتج جديد',
    'requested.new.subtitle': 'اقترح منتجاً تود رؤيته في هذه الآلة.',
    'requested.new.productName': 'اسم المنتج',
    'requested.new.productNamePlaceholder': 'مثال: كيت كات',
    'requested.new.category': 'الفئة',
    'requested.new.categoryPlaceholder': 'مثال: وجبات خفيفة (اختياري)',
    'requested.new.submit': 'إرسال الطلب',
    'requested.new.submitting': 'جارٍ الإرسال...',
    'requested.new.required': 'يرجى إدخال اسم المنتج.',
    'requested.new.success.title': 'تم إرسال الطلب!',
    'requested.new.success.body': 'تمت إضافة طلب المنتج إلى القائمة.',
    'requested.new.success.vote': 'صوّت له الآن',
    'requested.new.duplicate.title': 'تم طلبه بالفعل!',
    'requested.new.duplicate.body': 'تم طلب هذا المنتج بالفعل لهذه الآلة.',
    'requested.new.duplicate.vote': 'يمكنك التصويت له بدلاً من ذلك.',
    'requested.new.duplicate.view': 'عرض المنتج',
    'success.issue.title': 'شكراً لك!',
    'success.issue.body': 'تم استلام طلبك.',
    'success.request.title': 'تم استلام الطلب!',
    'success.request.body': 'سننظر في إضافة هذا المنتج إلى آلة البيع.',
    'success.reference': 'الرقم المرجعي',
    'success.done': 'تم',
    'success.track': 'تتبع الطلب',
    'track.title': 'تتبع الطلب',
    'track.issue': 'مشكلة',
    'track.request': 'طلب منتج',
    'track.machine': 'الآلة',
    'track.product': 'المنتج',
    'track.status': 'الحالة',
    'track.submitted': 'تم الإرسال',
    'track.received': 'تم الاستلام',
    'track.inProgress': 'قيد المعالجة',
    'track.resolved': 'تم الحل',
    'track.rejected': 'مرفوض',
    'track.reviewing': 'قيد المراجعة',
    'track.added': 'تمت الإضافة',
    'track.notFound.title': 'الطلب غير موجود',
    'track.notFound.body': 'لم نتمكن من العثور على طلب بهذا الرقم المرجعي.',
    'track.back': 'العودة إلى الرئيسية',
    'error.title': 'حدث خطأ ما',
    'error.body': 'يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.',
    'error.retry': 'إعادة المحاولة',
    'error.setup.title': 'الخدمة غير مهيأة',
    'error.setup.body': 'هذه الخدمة غير متصلة بقاعدة البيانات بعد.',
    'error.setup.hint': 'يرجى الاتصال بدعم Soultech.',
    'error.backHome': 'العودة إلى الرئيسية',
    'common.loading': 'جارٍ التحميل...',
    'common.optional': 'اختياري',
    'common.required': 'مطلوب',
    'common.cancel': 'إلغاء',
    'common.continue': 'متابعة',
    'common.language': 'اللغة',
    'common.phoneInvalid': 'يرجى إدخال رقم هاتف صحيح.',
    'common.photoTooLarge': 'الصورة كبيرة جداً. يرجى اختيار صورة أصغر.',
    'common.photoUnsupported': 'نوع الملف غير مدعوم. يرجى اختيار صورة JPG أو PNG أو WebP.',
    'common.photoCompressing': 'جارٍ ضغط الصورة...',
    'common.photoCompressFailed': 'تعذر ضغط الصورة.',
    'common.uploadFailed': 'تعذر رفع الصورة.',
    'common.submitFailed': 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    'common.retry': 'إعادة المحاولة',
    'common.contactSupport': 'الاتصال بدعم Soultech',
    'common.footer': 'Soultech Vending — دعم العملاء',
  },
}