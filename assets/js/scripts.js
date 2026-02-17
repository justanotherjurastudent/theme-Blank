// This is your main script file

(function () {
	const THEME_STORAGE_KEY = 'publii-theme-mode';

	const applyTheme = (themeName, toggleButton) => {
		document.documentElement.setAttribute('data-theme', themeName);

		if (!toggleButton) {
			return;
		}

		const isDark = themeName === 'dark';
		toggleButton.setAttribute('aria-pressed', isDark ? 'true' : 'false');
		toggleButton.setAttribute(
			'aria-label',
			isDark ? 'Zum Light Mode wechseln' : 'Zum Dark Mode wechseln'
		);

		const sunIcon = toggleButton.querySelector('.theme-toggle__icon--sun');
		const moonIcon = toggleButton.querySelector('.theme-toggle__icon--moon');

		if (sunIcon && moonIcon) {
			sunIcon.hidden = isDark;
			moonIcon.hidden = !isDark;
		}
	};

	const initThemeToggle = () => {
		const toggleButton = document.querySelector('[data-theme-toggle]');
		const defaultTheme = document.body.getAttribute('data-default-theme') || 'light';
		const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
		const initialTheme = storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : defaultTheme;

		applyTheme(initialTheme, toggleButton);

		if (!toggleButton) {
			return;
		}

		toggleButton.addEventListener('click', () => {
			const currentTheme = document.documentElement.getAttribute('data-theme') || initialTheme;
			const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
			window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
			applyTheme(nextTheme, toggleButton);
		});
	};

	const initLinksTargetBlank = () => {
		const links = document.querySelectorAll('a[href]');

		links.forEach((linkElement) => {
			const href = linkElement.getAttribute('href') || '';

			if (
				href.startsWith('#') ||
				href.startsWith('mailto:') ||
				href.startsWith('tel:') ||
				href.startsWith('javascript:')
			) {
				return;
			}

			linkElement.setAttribute('target', '_blank');
			linkElement.setAttribute('rel', 'noopener noreferrer');
		});
	};

	const initHomeCarousel = () => {
		const carouselElement = document.querySelector('[data-home-carousel]');

		if (!carouselElement) {
			return;
		}

		const trackElement = carouselElement.querySelector('[data-carousel-track]');
		const slideElements = Array.from(carouselElement.querySelectorAll('[data-carousel-slide]'));
		const previousButton = carouselElement.querySelector('[data-carousel-prev]');
		const nextButton = carouselElement.querySelector('[data-carousel-next]');

		if (!trackElement || !slideElements.length || !previousButton || !nextButton) {
			return;
		}

		let currentIndex = 0;

		const getCardsVisible = () => {
			if (window.innerWidth >= 1100) {
				return 3;
			}

			if (window.innerWidth >= 768) {
				return 2;
			}

			return 1;
		};

		const updateCarousel = () => {
			const cardsVisible = getCardsVisible();
			const maxIndex = Math.max(0, slideElements.length - cardsVisible);
			currentIndex = Math.min(currentIndex, maxIndex);

			const translateValue = (100 / cardsVisible) * currentIndex;
			trackElement.style.transform = `translateX(-${translateValue}%)`;

			previousButton.disabled = currentIndex === 0;
			nextButton.disabled = currentIndex >= maxIndex;
		};

		previousButton.addEventListener('click', () => {
			currentIndex -= 1;
			updateCarousel();
		});

		nextButton.addEventListener('click', () => {
			currentIndex += 1;
			updateCarousel();
		});

		window.addEventListener('resize', updateCarousel);
		updateCarousel();
	};

	const initFaqAccordions = () => {
		const faqItems = document.querySelectorAll('.faq-item, [data-faq-item]');

		faqItems.forEach((faqItem, itemIndex) => {
			const questionElement = faqItem.querySelector('.faq-question, [data-faq-question]');
			const answerElement = faqItem.querySelector('.faq-answer, [data-faq-answer]');

			if (!questionElement || !answerElement) {
				return;
			}

			const questionId = `faq-question-${itemIndex}`;
			const answerId = `faq-answer-${itemIndex}`;
			const initiallyOpen = faqItem.classList.contains('is-open');

			questionElement.setAttribute('id', questionId);
			questionElement.setAttribute('type', 'button');
			questionElement.setAttribute('aria-controls', answerId);
			questionElement.setAttribute('aria-expanded', initiallyOpen ? 'true' : 'false');

			answerElement.setAttribute('id', answerId);
			answerElement.setAttribute('role', 'region');
			answerElement.setAttribute('aria-labelledby', questionId);

			if (!initiallyOpen) {
				answerElement.style.maxHeight = '0px';
			} else {
				answerElement.style.maxHeight = `${answerElement.scrollHeight}px`;
			}

			questionElement.addEventListener('click', () => {
				const isOpen = faqItem.classList.toggle('is-open');
				questionElement.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
				answerElement.style.maxHeight = isOpen ? `${answerElement.scrollHeight}px` : '0px';
			});
		});
	};

	const initLottiePlayers = () => {
		const lottieWrappers = document.querySelectorAll('.lottie-embed[data-src]');

		if (!lottieWrappers.length) {
			return;
		}

		const defaultWidth = document.body.getAttribute('data-lottie-default-width') || '100%';
		const defaultHeight = document.body.getAttribute('data-lottie-default-height') || '320px';
		const defaultLoop = document.body.getAttribute('data-lottie-default-loop') === 'true';

		lottieWrappers.forEach((wrapper) => {
			const source = wrapper.getAttribute('data-src');

			if (!source) {
				return;
			}

			const width = wrapper.getAttribute('data-width') || defaultWidth;
			const height = wrapper.getAttribute('data-height') || defaultHeight;
			const loop = wrapper.getAttribute('data-loop');
			const shouldLoop = loop === null ? defaultLoop : loop === 'true';

			const playerElement = document.createElement('lottie-player');
			playerElement.setAttribute('src', source);
			playerElement.setAttribute('background', 'transparent');
			playerElement.setAttribute('speed', '1');
			playerElement.setAttribute('autoplay', '');

			if (shouldLoop) {
				playerElement.setAttribute('loop', '');
			}

			playerElement.style.width = width;
			playerElement.style.height = height;

			wrapper.replaceChildren(playerElement);
		});
	};

	const initResponsiveVideoEmbeds = () => {
		const mediaElements = document.querySelectorAll('#post-entry iframe, #post-entry video');

		mediaElements.forEach((mediaElement) => {
			if (mediaElement.closest('.responsive-media')) {
				return;
			}

			const wrapperElement = document.createElement('div');
			wrapperElement.className = 'responsive-media';
			mediaElement.parentNode.insertBefore(wrapperElement, mediaElement);
			wrapperElement.appendChild(mediaElement);
		});
	};

	const initHomeNoScrollFailSafe = () => {
		const homeLayout = document.querySelector('.home-layout');

		if (!homeLayout) {
			return;
		}

		document.body.classList.add('is-home-layout');

		const applyOverflowMode = () => {
			const isDesktopOrTablet = window.matchMedia('(min-width: 768px)').matches;

			if (!isDesktopOrTablet) {
				document.body.classList.add('allow-scroll');
				return;
			}

			const pageNeedsScroll = document.documentElement.scrollHeight > window.innerHeight;
			document.body.classList.toggle('allow-scroll', pageNeedsScroll);
		};

		window.addEventListener('resize', applyOverflowMode);
		applyOverflowMode();
	};

	document.addEventListener('DOMContentLoaded', () => {
		initThemeToggle();
		initLinksTargetBlank();
		initHomeCarousel();
		initFaqAccordions();
		initLottiePlayers();
		initResponsiveVideoEmbeds();
		initHomeNoScrollFailSafe();
	});
})();