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
  | 'admin.title'
  | 'admin.subtitle'
  | 'admin.passcode.title'
  | 'admin.passcode.subtitle'
  | 'admin.passcode.placeholder'
  | 'admin.passcode.submit'
  | 'admin.passcode.error'
  | 'admin.passcode.cancel'
  | 'admin.back'
  | 'admin.logout'
  | 'admin.uidTitle'
  | 'admin.uidBody'
  | 'admin.uidCopy'
  | 'admin.uidCopied'
  | 'admin.tab.issues'
  | 'admin.tab.requests'
  | 'admin.tab.requested'
  | 'admin.empty.issues'
  | 'admin.empty.requests'
  | 'admin.empty.requested'
  | 'admin.machine'
  | 'admin.product'
  | 'admin.issueType'
  | 'admin.description'
  | 'admin.phone'
  | 'admin.date'
  | 'admin.status'
  | 'admin.actions'
  | 'admin.save'
  | 'admin.saving'
  | 'admin.saved'
  | 'admin.noteLabel'
  | 'admin.notePlaceholder'
  | 'admin.votes'
  | 'admin.photo'
  | 'admin.noPhoto'
  | 'admin.photoAdd'
  | 'admin.photoChange'
  | 'admin.photoRemove'
  | 'admin.photoUploading'
  | 'admin.updateFailed'
  | 'admin.tab.machines'
  | 'admin.empty.machines'
  | 'admin.machines.addTitle'
  | 'admin.machines.add'
  | 'admin.machines.edit'
  | 'admin.machines.delete'
  | 'admin.machines.deleteConfirm'
  | 'admin.machines.code'
  | 'admin.machines.name'
  | 'admin.machines.namePlaceholder'
  | 'admin.machines.nameAr'
  | 'admin.machines.nameArPlaceholder'
  | 'admin.machines.location'
  | 'admin.machines.locationPlaceholder'
  | 'admin.machines.visible'
  | 'admin.machines.active'
  | 'admin.machines.inactive'
  | 'admin.machines.visitors'
  | 'admin.tab.admins'
  | 'admin.admins.title'
  | 'admin.admins.subtitle'
  | 'admin.admins.current'
  | 'admin.admins.addLabel'
  | 'admin.admins.addPlaceholder'
  | 'admin.admins.add'
  | 'admin.admins.adding'
  | 'admin.admins.empty'
  | 'admin.admins.remove'
  | 'admin.admins.removeConfirm'
  | 'admin.admins.you'
  | 'admin.admins.failed'
  | 'contact.title'
  | 'contact.subtitle'
  | 'contact.call'
  | 'contact.callHint'
  | 'contact.whatsapp'
  | 'contact.whatsappHint'
  | 'contact.facebook'
  | 'contact.facebookHint'
  | 'contact.email'
  | 'contact.emailHint'

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
    'admin.title': 'Admin Panel',
    'admin.subtitle': 'Manage customer issues and product requests.',
    'admin.passcode.title': 'Admin Access',
    'admin.passcode.subtitle': 'Enter the admin passcode to continue.',
    'admin.passcode.placeholder': 'Passcode',
    'admin.passcode.submit': 'Unlock',
    'admin.passcode.error': 'Incorrect passcode. Please try again.',
    'admin.passcode.cancel': 'Cancel',
    'admin.back': 'Back to home',
    'admin.logout': 'Lock & exit',
    'admin.uidTitle': 'Admin access — one-time setup',
    'admin.uidBody': 'Copy your admin UID, then add it to the `admins` collection in Firestore (document id = this UID). Then reload to manage machines here.',
    'admin.uidCopy': 'Copy UID',
    'admin.uidCopied': 'Copied!',
    'admin.tab.issues': 'Issues',
    'admin.tab.requests': 'Requests',
    'admin.tab.requested': 'Requested Products',
    'admin.empty.issues': 'No issues reported yet.',
    'admin.empty.requests': 'No product requests yet.',
    'admin.empty.requested': 'No requested products yet.',
    'admin.machine': 'Machine',
    'admin.product': 'Product',
    'admin.issueType': 'Issue type',
    'admin.description': 'Description',
    'admin.phone': 'Phone',
    'admin.date': 'Date',
    'admin.status': 'Status',
    'admin.actions': 'Actions',
    'admin.save': 'Save',
    'admin.saving': 'Saving...',
    'admin.saved': 'Saved',
    'admin.noteLabel': 'Admin note',
    'admin.notePlaceholder': 'Add a note for customers...',
    'admin.votes': 'votes',
    'admin.photo': 'Photo',
    'admin.noPhoto': 'No photo',
    'admin.photoAdd': 'Add photo',
    'admin.photoChange': 'Change photo',
    'admin.photoRemove': 'Remove photo',
    'admin.photoUploading': 'Uploading photo...',
    'admin.updateFailed': 'Could not save changes. Please try again.',
    'admin.tab.machines': 'Machines',
    'admin.empty.machines': 'No machines yet.',
    'admin.machines.addTitle': 'Add a machine',
    'admin.machines.add': 'Add machine',
    'admin.machines.edit': 'Edit machine',
    'admin.machines.delete': 'Delete machine',
    'admin.machines.deleteConfirm': 'Delete this machine? This cannot be undone.',
    'admin.machines.code': 'Machine code',
    'admin.machines.name': 'Machine name',
    'admin.machines.namePlaceholder': 'e.g. ST-007',
    'admin.machines.nameAr': 'Arabic name',
    'admin.machines.nameArPlaceholder': 'e.g. المدخل الرئيسي (optional)',
    'admin.machines.location': 'Location',
    'admin.machines.locationPlaceholder': 'e.g. Second Floor (optional)',
    'admin.machines.visible': 'Visible to customers',
    'admin.machines.active': 'Active',
    'admin.machines.inactive': 'Hidden',
    'admin.machines.visitors': 'visitors',
    'admin.tab.admins': 'Admins',
    'admin.admins.title': 'Admin access',
    'admin.admins.subtitle': 'Manage who can access this dashboard from any device.',
    'admin.admins.current': 'This device',
    'admin.admins.addLabel': 'Add an admin by UID',
    'admin.admins.addPlaceholder': 'Paste the admin UID from the other device',
    'admin.admins.add': 'Grant access',
    'admin.admins.adding': 'Adding...',
    'admin.admins.empty': 'No other admins yet.',
    'admin.admins.remove': 'Revoke',
    'admin.admins.removeConfirm': 'Revoke admin access for this user?',
    'admin.admins.you': '(you)',
    'admin.admins.failed': 'Could not update admins. Please try again.',
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Reach out to us anytime — we\'re happy to help.',
    'contact.call': 'Call us',
    'contact.callHint': 'Speak to our support team',
    'contact.whatsapp': 'WhatsApp',
    'contact.whatsappHint': 'Chat with us on WhatsApp',
    'contact.facebook': 'Facebook',
    'contact.facebookHint': 'Follow us on Facebook',
    'contact.email': 'Email us',
    'contact.emailHint': 'Send us an email',
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
    'admin.title': 'لوحة التحكم',
    'admin.subtitle': 'إدارة مشاكل العملاء وطلبات المنتجات.',
    'admin.passcode.title': 'دخول المسؤول',
    'admin.passcode.subtitle': 'أدخل رمز المسؤول للمتابعة.',
    'admin.passcode.placeholder': 'رمز الدخول',
    'admin.passcode.submit': 'فتح',
    'admin.passcode.error': 'رمز غير صحيح. يرجى المحاولة مرة أخرى.',
    'admin.passcode.cancel': 'إلغاء',
    'admin.back': 'العودة إلى الرئيسية',
    'admin.logout': 'قفل وخروج',
    'admin.uidTitle': 'صلاحية المسؤول — إعداد لمرة واحدة',
    'admin.uidBody': 'انسخ معرف المسؤول، ثم أضفه إلى مجموعة `admins` في Firestore (معرف المستند = هذا المعرف). ثم أعد التحميل لإدارة الآلات هنا.',
    'admin.uidCopy': 'نسخ المعرف',
    'admin.uidCopied': 'تم النسخ!',
    'admin.tab.issues': 'المشاكل',
    'admin.tab.requests': 'الطلبات',
    'admin.tab.requested': 'المنتجات المطلوبة',
    'admin.empty.issues': 'لا توجد مشاكل مبلّغ عنها بعد.',
    'admin.empty.requests': 'لا توجد طلبات منتجات بعد.',
    'admin.empty.requested': 'لا توجد منتجات مطلوبة بعد.',
    'admin.machine': 'الآلة',
    'admin.product': 'المنتج',
    'admin.issueType': 'نوع المشكلة',
    'admin.description': 'الوصف',
    'admin.phone': 'الهاتف',
    'admin.date': 'التاريخ',
    'admin.status': 'الحالة',
    'admin.actions': 'إجراءات',
    'admin.save': 'حفظ',
    'admin.saving': 'جارٍ الحفظ...',
    'admin.saved': 'تم الحفظ',
    'admin.noteLabel': 'ملاحظة المسؤول',
    'admin.notePlaceholder': 'أضف ملاحظة للعملاء...',
    'admin.votes': 'تصويت',
    'admin.photo': 'الصورة',
    'admin.noPhoto': 'لا توجد صورة',
    'admin.photoAdd': 'إضافة صورة',
    'admin.photoChange': 'تغيير الصورة',
    'admin.photoRemove': 'إزالة الصورة',
    'admin.photoUploading': 'جارٍ رفع الصورة...',
    'admin.updateFailed': 'تعذر حفظ التغييرات. يرجى المحاولة مرة أخرى.',
    'admin.tab.machines': 'الآلات',
    'admin.empty.machines': 'لا توجد آلات بعد.',
    'admin.machines.addTitle': 'إضافة آلة',
    'admin.machines.add': 'إضافة آلة',
    'admin.machines.edit': 'تعديل الآلة',
    'admin.machines.delete': 'حذف الآلة',
    'admin.machines.deleteConfirm': 'حذف هذه الآلة؟ لا يمكن التراجع عن هذا الإجراء.',
    'admin.machines.code': 'رمز الآلة',
    'admin.machines.name': 'اسم الآلة',
    'admin.machines.namePlaceholder': 'مثال: ST-007',
    'admin.machines.nameAr': 'الاسم بالعربية',
    'admin.machines.nameArPlaceholder': 'مثال: المدخل الرئيسي (اختياري)',
    'admin.machines.location': 'الموقع',
    'admin.machines.locationPlaceholder': 'مثال: الطابق الثاني (اختياري)',
    'admin.machines.visible': 'ظاهرة للعملاء',
    'admin.machines.active': 'نشطة',
    'admin.machines.inactive': 'مخفية',
    'admin.machines.visitors': 'زائر',
    'admin.tab.admins': 'المسؤولون',
    'admin.admins.title': 'صلاحية المسؤول',
    'admin.admins.subtitle': 'إدارة من يمكنه الوصول إلى لوحة التحكم من أي جهاز.',
    'admin.admins.current': 'هذا الجهاز',
    'admin.admins.addLabel': 'إضافة مسؤول بواسطة المعرف',
    'admin.admins.addPlaceholder': 'الصق معرف المسؤول من الجهاز الآخر',
    'admin.admins.add': 'منح الصلاحية',
    'admin.admins.adding': 'جارٍ الإضافة...',
    'admin.admins.empty': 'لا يوجد مسؤولون آخرون بعد.',
    'admin.admins.remove': 'إزالة',
    'admin.admins.removeConfirm': 'إزالة صلاحية المسؤول لهذا المستخدم؟',
    'admin.admins.you': '(أنت)',
    'admin.admins.failed': 'تعذر تحديث المسؤولين. حاول مرة أخرى.',
    'contact.title': 'تواصل معنا',
    'contact.subtitle': 'تواصل معنا في أي وقت — يسعدنا مساعدتك.',
    'contact.call': 'اتصل بنا',
    'contact.callHint': 'تحدث مع فريق الدعم',
    'contact.whatsapp': 'واتساب',
    'contact.whatsappHint': 'راسلنا عبر واتساب',
    'contact.facebook': 'فيسبوك',
    'contact.facebookHint': 'تابعنا على فيسبوك',
    'contact.email': 'راسلنا',
    'contact.emailHint': 'أرسل لنا بريداً إلكترونياً',
  },
}