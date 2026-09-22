/**
 * عيادات أكنان لطب الأسنان - AKNAN FOR DENTAL CLINIC
 * الملف التفاعلي الرئيسي (Main JavaScript Engine)
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveClinicStatus();
  initMobileMenu();
  initBeforeAfterSlider();
  initReviewFilters();
  initFaqAccordion();
  initBookingModal();
  initTreatmentCalculator();
  initHeaderScroll();
});

/* ==========================================================================
   1. فحص وتحديث حالة عمل العيادة في الوقت الحقيقي (Live Clinic Status)
   يفتح الساعة 2:00 م حتى 10:00 م
   ========================================================================== */
function initLiveClinicStatus() {
  const statusBadges = document.querySelectorAll('.clinic-live-status');
  if (!statusBadges.length) return;

  function updateStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours + minutes / 60;

    // الدوام الرسمي: السبت إلى الخميس (من 2:00 م = 14:00 إلى 10:00 م = 22:00)
    // الجمعة عطلة أو استقبال مسبق
    const isFriday = (day === 5);
    const isOpenHours = (currentTime >= 14 && currentTime < 22);
    const isOpen = !isFriday && isOpenHours;

    statusBadges.forEach(badge => {
      const dot = badge.querySelector('.status-dot') || document.createElement('span');
      dot.className = 'status-dot';
      
      const textSpan = badge.querySelector('.status-text') || badge;

      if (isOpen) {
        badge.classList.remove('closed');
        badge.innerHTML = '<span class="status-dot"></span> <span class="status-text">مفتوح الآن · يستقبل المراجعين حتى 10:00 م</span>';
      } else {
        badge.classList.add('closed');
        let nextOpenText = 'مغلق الآن · يفتح عند الساعة 2:00 م';
        if (isFriday) {
          nextOpenText = 'مغلق اليوم (الجمعة) · يفتح السبت الساعة 2:00 م';
        } else if (currentTime >= 22) {
          nextOpenText = 'مغلق حالياً · يفتح غداً عند الساعة 2:00 م';
        }
        badge.innerHTML = `<span class="status-dot"></span> <span class="status-text">${nextOpenText}</span>`;
      }
    });
  }

  updateStatus();
  // تحديث تلقائي كل 5 دقائق
  setInterval(updateStatus, 5 * 60 * 1000);
}

/* ==========================================================================
   2. القائمة الجانبية للشاشات المحمولة (Mobile Hamburger Menu)
   ========================================================================== */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburgerBtn || !mobileMenu) return;

  hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const icon = hamburgerBtn.querySelector('i');
    if (icon) {
      if (mobileMenu.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      const icon = hamburgerBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  });
}

/* ==========================================================================
   3. تفاعل مقارنة الابتسامة قبل وبعد (Before & After Slider)
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('baContainer');
  const afterImg = document.getElementById('baAfter');
  const handle = document.getElementById('baHandle');

  if (!container || !afterImg || !handle) return;

  let isDragging = false;

  function updateSlider(xPosition) {
    const rect = container.getBoundingClientRect();
    let x = xPosition - rect.left;

    // حصر الحركة داخل أبعاد الحاوية (من 5% إلى 95%)
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percent = (x / rect.width) * 100;
    afterImg.style.width = `${percent}%`;
    handle.style.left = `${percent}%`;
  }

  // أحداث الماوس
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  // أحداث اللمس للهواتف
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSlider(e.touches[0].clientX);
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateSlider(e.touches[0].clientX);
  });
}

/* ==========================================================================
   4. فلترة آراء وتقييمات المراجعين (Review Category Filtering)
   ========================================================================== */
function initReviewFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const reviewCards = document.querySelectorAll('.review-card');

  if (!filterBtns.length || !reviewCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      reviewCards.forEach(card => {
        const categories = card.getAttribute('data-categories') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. قائمة الأسئلة الشائعة القابلة للطي (FAQ Accordion)
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // إغلاق باقي الأسئلة
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      // فتح أو إغلاق السؤال الحالي
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });
}

/* ==========================================================================
   6. نافذة حجز المواعيد المنبثقة وإرسالها إلى الواتساب
   ========================================================================== */
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const openBtns = document.querySelectorAll('.open-booking-modal');
  const closeBtn = document.getElementById('closeModalBtn');
  const bookingForm = document.getElementById('bookingForm');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // إذا كان الزر يحتوي على طبيب أو خدمة محددة
      const doctorParam = btn.getAttribute('data-doctor');
      const serviceParam = btn.getAttribute('data-service');

      if (doctorParam) {
        const doctorSelect = document.getElementById('modalDoctor');
        if (doctorSelect) doctorSelect.value = doctorParam;
      }

      if (serviceParam) {
        const serviceSelect = document.getElementById('modalService');
        if (serviceSelect) serviceSelect.value = serviceParam;
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // معالجة إرسال النموذج وتوجيهه إلى واتساب العيادة المعتمد (+966550774859)
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('modalName').value.trim();
      const phone = document.getElementById('modalPhone').value.trim();
      const doctor = document.getElementById('modalDoctor').value;
      const service = document.getElementById('modalService').value;
      const date = document.getElementById('modalDate').value;
      const notes = document.getElementById('modalNotes').value.trim();

      const clinicWhatsAppNumber = '966550774859'; // الرقم المعتمد لعيادات أكنان

      // بناء رسالة منظمة وراقية
      let message = `مرحباً عيادات أكنان لطب الأسنان 🦷%0A`;
      message += `أرغب في حجز موعد جديد عبر الموقع الإلكتروني:%0A`;
      message += `━━━━━━━━━━━━━━━━━━━%0A`;
      message += `👤 *الاسم:* ${encodeURIComponent(name)}%0A`;
      message += `📱 *رقم الجوال:* ${encodeURIComponent(phone)}%0A`;
      message += `🩺 *الخدمة المطلوبة:* ${encodeURIComponent(service)}%0A`;
      message += `👨‍⚕️ *الطبيب المفضل:* ${encodeURIComponent(doctor)}%0A`;
      if (date) {
        message += `📅 *الموعد المقترح:* ${encodeURIComponent(date)}%0A`;
      }
      if (notes) {
        message += `📝 *ملاحظات إضافية:* ${encodeURIComponent(notes)}%0A`;
      }
      message += `━━━━━━━━━━━━━━━━━━━%0A`;
      message += `شكراً لكم، بانتظار تأكيد الحجز.`;

      // فتح الواتساب
      const whatsappUrl = `https://wa.me/${clinicWhatsAppNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');

      closeModal();
      bookingForm.reset();
    });
  }
}

/* ==========================================================================
   7. حاسبة تقدير خطة العلاج التفاعلية (Treatment Estimator)
   ========================================================================== */
function initTreatmentCalculator() {
  const serviceOptions = document.querySelectorAll('.calc-service-opt');
  const doctorOptions = document.querySelectorAll('.calc-doctor-opt');
  const calcResultBox = document.getElementById('calcResultBox');
  const calcDoctorRecommendation = document.getElementById('calcDoctorRecommendation');
  const calcText = document.getElementById('calcText');
  const calcBookBtn = document.getElementById('calcBookBtn');

  if (!serviceOptions.length) return;

  let selectedService = 'تبييض الأسنان بالليزر';
  let selectedDoctor = 'د. لبنى (أخصائية التبييض والحشوات)';

  function updateRecommendation() {
    if (selectedService.includes('تبييض') || selectedService.includes('حشوة')) {
      selectedDoctor = 'د. لبنى (طبيبة متميزة بخفة اليد والتبييض المتقن بدون ألم)';
    } else if (selectedService.includes('ابتسامة') || selectedService.includes('تركيبة') || selectedService.includes('تلبيسة')) {
      selectedDoctor = 'د. أحمد عثمان (أخصائي التركيبات وتفاصيل الابتسامة الدقيقة)';
    } else {
      selectedDoctor = 'نخبة أطباء عيادات أكنان حسب تخصص الحالة';
    }

    if (calcDoctorRecommendation) {
      calcDoctorRecommendation.textContent = selectedDoctor;
    }
    if (calcText) {
      calcText.textContent = `بناءً على اختيارك لـ (${selectedService})، ننصحك بالاستشارة مع:`;
    }
    if (calcBookBtn) {
      calcBookBtn.setAttribute('data-service', selectedService);
      calcBookBtn.setAttribute('data-doctor', selectedDoctor);
    }
  }

  serviceOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      serviceOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedService = opt.getAttribute('data-value') || opt.textContent.trim();
      updateRecommendation();
    });
  });

  // التشغيل المبدئي
  updateRecommendation();
}

/* ==========================================================================
   8. تأثير شريط التنقل عند التمرير (Header Scroll Effect)
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}
