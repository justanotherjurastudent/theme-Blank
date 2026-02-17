// This is your main script file

(function () {
	const THEME_STORAGE_KEY = 'publii-theme-mode';
	const THEME_LABEL_LIGHT = 'Zum Light Mode wechseln';
	const THEME_LABEL_DARK = 'Zum Dark Mode wechseln';

	const applyTheme = (themeName, toggleButtons) => {
		document.documentElement.setAttribute('data-theme', themeName);

		if (!toggleButtons || !toggleButtons.length) {
			return;
		}

		const isDark = themeName === 'dark';

		toggleButtons.forEach((toggleButton) => {
			toggleButton.setAttribute('aria-pressed', isDark ? 'true' : 'false');
			toggleButton.setAttribute('aria-label', isDark ? THEME_LABEL_LIGHT : THEME_LABEL_DARK);

			const sunIcon = toggleButton.querySelector('.theme-toggle__icon--sun');
			const moonIcon = toggleButton.querySelector('.theme-toggle__icon--moon');

			if (sunIcon && moonIcon) {
				sunIcon.hidden = isDark;
				moonIcon.hidden = !isDark;
			}
		});
	};

	const initThemeToggle = () => {
		const toggleButtons = Array.from(document.querySelectorAll('[data-theme-toggle]'));
		const defaultTheme = document.body.getAttribute('data-default-theme') || 'light';
		const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
		const initialTheme = storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : defaultTheme;

		applyTheme(initialTheme, toggleButtons);

		if (!toggleButtons.length) {
			return;
		}

		toggleButtons.forEach((toggleButton) => {
			toggleButton.addEventListener('click', () => {
				const currentTheme = document.documentElement.getAttribute('data-theme') || initialTheme;
				const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
				window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
				applyTheme(nextTheme, toggleButtons);
			});
		});
	};

	const initMobileSidebar = () => {
		const sidebarElement = document.querySelector('.app-sidebar');
		const toggleButton = document.querySelector('[data-sidebar-toggle]');
		const contentElement = document.querySelector('[data-sidebar-content]');

		if (!sidebarElement || !toggleButton || !contentElement) {
			return;
		}

		const mobileQuery = window.matchMedia('(max-width: 1023px)');

		const applyExpandedState = (isExpanded) => {
			toggleButton.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
			sidebarElement.classList.toggle('is-open', isExpanded);
			contentElement.setAttribute('aria-hidden', isExpanded ? 'false' : 'true');
		};

		const syncToViewport = () => {
			if (mobileQuery.matches) {
				applyExpandedState(false);
				return;
			}

			applyExpandedState(true);
		};

		toggleButton.addEventListener('click', () => {
			const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
			applyExpandedState(!isExpanded);
		});

		document.addEventListener('keydown', (event) => {
			if (event.key !== 'Escape' || !mobileQuery.matches) {
				return;
			}

			applyExpandedState(false);
		});

		if (typeof mobileQuery.addEventListener === 'function') {
			mobileQuery.addEventListener('change', syncToViewport);
		} else if (typeof mobileQuery.addListener === 'function') {
			mobileQuery.addListener(syncToViewport);
		}

		syncToViewport();
	};

	const initMobileSidebarDrawer = () => {
		const drawerElement = document.querySelector('[data-mobile-sidebar-drawer]');
		const openButton = document.querySelector('[data-mobile-sidebar-open]');
		const closeButton = document.querySelector('[data-mobile-sidebar-close]');
		const overlayElement = document.querySelector('[data-mobile-sidebar-overlay]');
		const tabsContainer = document.querySelector('[data-mobile-tabs]');
		const indicatorElement = document.querySelector('[data-mobile-tab-indicator]');
		const tabButtons = Array.from(document.querySelectorAll('[data-mobile-tab]'));
		const panelElements = Array.from(document.querySelectorAll('[data-mobile-panel]'));

		if (!drawerElement || !openButton || !closeButton || !overlayElement || !tabsContainer || !indicatorElement) {
			return;
		}

		const isMobileQuery = window.matchMedia('(max-width: 767px)');
		const emptyTocMessage = drawerElement.getAttribute('data-empty-toc') || 'No table of contents available';

		const setIndicatorPosition = (tabName) => {
			const activeButton = tabButtons.find((button) => button.getAttribute('data-mobile-tab') === tabName);

			if (!activeButton) {
				return;
			}

			indicatorElement.style.left = `${activeButton.offsetLeft + 2}px`;
			indicatorElement.style.width = `${Math.max(0, activeButton.offsetWidth - 4)}px`;
		};

		const setActiveTab = (tabName) => {
			tabButtons.forEach((button) => {
				const isActive = button.getAttribute('data-mobile-tab') === tabName;
				button.classList.toggle('is-active', isActive);
				button.setAttribute('aria-selected', isActive ? 'true' : 'false');
			});

			panelElements.forEach((panelElement) => {
				const isActive = panelElement.getAttribute('data-mobile-panel') === tabName;
				panelElement.classList.toggle('is-active', isActive);
			});

			setIndicatorPosition(tabName);
		};

		const wireDrawerThemeToggle = (containerElement) => {
			const toggleButton = containerElement.querySelector('[data-theme-toggle]');

			if (!toggleButton) {
				return;
			}

			toggleButton.addEventListener('click', () => {
				const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
				const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
				window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
				applyTheme(nextTheme, Array.from(document.querySelectorAll('[data-theme-toggle]')));
			});
		};

		const buildMenuPanel = () => {
			const menuPanel = panelElements.find((panel) => panel.getAttribute('data-mobile-panel') === 'menu');
			const sourceSidebar = document.querySelector('.app-sidebar');

			if (!menuPanel || !sourceSidebar) {
				return;
			}

			const sidebarClone = sourceSidebar.cloneNode(true);
			sidebarClone.classList.add('mobile-sidebar-clone');
			sidebarClone.querySelector('[data-sidebar-toggle]')?.remove();
			sidebarClone.querySelector('[data-sidebar-content]')?.removeAttribute('id');
			sidebarClone.querySelector('[data-sidebar-content]')?.removeAttribute('hidden');
			sidebarClone.querySelector('#logo img')?.remove();
			sidebarClone.querySelector('#logo')?.classList.add('mobile-brand-link');
			sidebarClone.querySelector('#logo')?.removeAttribute('id');

			menuPanel.replaceChildren(sidebarClone);
			wireDrawerThemeToggle(sidebarClone);
		};

		const buildTocPanel = () => {
			const tocPanel = panelElements.find((panel) => panel.getAttribute('data-mobile-panel') === 'toc');
			const tocSidebarInner = document.querySelector('.toc-sidebar__inner');

			if (!tocPanel) {
				return;
			}

			if (!tocSidebarInner || tocSidebarInner.parentElement?.hidden) {
				const emptyElement = document.createElement('p');
				emptyElement.className = 'app-sidebar__menu-empty';
				emptyElement.textContent = emptyTocMessage;
				tocPanel.replaceChildren(emptyElement);
				return;
			}

			const tocClone = tocSidebarInner.cloneNode(true);
			tocClone.addEventListener('click', (event) => {
				const tocLink = event.target.closest('a[href^="#"]');

				if (!tocLink) {
					return;
				}

				window.setTimeout(() => {
					closeDrawer();
				}, 0);
			});
			tocPanel.replaceChildren(tocClone);
		};

		const buildPanels = () => {
			buildMenuPanel();
			buildTocPanel();
		};

		const openDrawer = () => {
			if (!isMobileQuery.matches) {
				return;
			}

			buildPanels();
			setActiveTab('menu');
			window.requestAnimationFrame(() => {
				setIndicatorPosition('menu');
			});
			document.body.classList.add('is-mobile-drawer-open');
			drawerElement.setAttribute('aria-hidden', 'false');
			openButton.setAttribute('aria-expanded', 'true');
		};

		const closeDrawer = () => {
			document.body.classList.remove('is-mobile-drawer-open');
			drawerElement.setAttribute('aria-hidden', 'true');
			openButton.setAttribute('aria-expanded', 'false');
		};

		tabButtons.forEach((buttonElement) => {
			buttonElement.addEventListener('click', () => {
				setActiveTab(buttonElement.getAttribute('data-mobile-tab'));
			});
		});

		openButton.addEventListener('click', openDrawer);
		closeButton.addEventListener('click', closeDrawer);
		overlayElement.addEventListener('click', closeDrawer);

		document.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				closeDrawer();
			}
		});

		if (typeof isMobileQuery.addEventListener === 'function') {
			isMobileQuery.addEventListener('change', () => {
				setIndicatorPosition(tabButtons.find((button) => button.classList.contains('is-active'))?.getAttribute('data-mobile-tab') || 'menu');
				if (!isMobileQuery.matches) {
					closeDrawer();
				}
			});
		} else if (typeof isMobileQuery.addListener === 'function') {
			isMobileQuery.addListener(() => {
				setIndicatorPosition(tabButtons.find((button) => button.classList.contains('is-active'))?.getAttribute('data-mobile-tab') || 'menu');
				if (!isMobileQuery.matches) {
					closeDrawer();
				}
			});
		}

		setActiveTab('menu');
		window.addEventListener('resize', () => {
			const activeTab = tabButtons.find((button) => button.classList.contains('is-active'))?.getAttribute('data-mobile-tab') || 'menu';
			setIndicatorPosition(activeTab);
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

			let url;

			try {
				url = new URL(href, window.location.href);
			} catch (error) {
				return;
			}

			if (url.origin !== window.location.origin) {
				linkElement.setAttribute('target', '_blank');
				linkElement.setAttribute('rel', 'noopener noreferrer');
			}
		});
	};

	const slugifyHeading = (text) =>
		text
			.toLowerCase()
			.trim()
			.replace(/[\s\u00A0]+/g, '-')
			.replace(/[^a-z0-9\-äöüß]/gi, '')
			.replace(/\-+/g, '-');

	const initTocSidebar = () => {
		const tocSidebar = document.querySelector('[data-toc-sidebar]');
		const tocNav = document.querySelector('[data-toc-nav]');

		if (!tocSidebar || !tocNav) {
			return;
		}

		const contentRoot = document.querySelector('#post-entry, #page-entry');

		if (!contentRoot) {
			return;
		}

		const headingElements = Array.from(contentRoot.querySelectorAll('h2, h3, h4'));

		if (!headingElements.length) {
			return;
		}

		const usedIds = new Set();
		headingElements.forEach((headingElement, headingIndex) => {
			const textContent = (headingElement.textContent || '').trim();
			const fallbackId = `section-${headingIndex + 1}`;
			let headingId = headingElement.id || slugifyHeading(textContent) || fallbackId;

			while (usedIds.has(headingId)) {
				headingId = `${headingId}-${headingIndex + 1}`;
			}

			usedIds.add(headingId);
			headingElement.id = headingId;
		});

		const rootList = document.createElement('ul');
		rootList.className = 'toc-level-2';

		const levelStack = [{ level: 2, listElement: rootList }];

		headingElements.forEach((headingElement) => {
			const level = Number.parseInt(headingElement.tagName.replace('H', ''), 10);
			const title = (headingElement.textContent || '').trim();

			if (!title) {
				return;
			}

			while (levelStack.length > 1 && level < levelStack[levelStack.length - 1].level) {
				levelStack.pop();
			}

			while (level > levelStack[levelStack.length - 1].level) {
				const parentList = levelStack[levelStack.length - 1].listElement;
				const parentListItems = parentList.querySelectorAll(':scope > li');
				const parentItem = parentListItems[parentListItems.length - 1];

				if (!parentItem) {
					break;
				}

				const nestedList = document.createElement('ul');
				nestedList.className = `toc-level-${levelStack[levelStack.length - 1].level + 1}`;
				parentItem.appendChild(nestedList);
				levelStack.push({
					level: levelStack[levelStack.length - 1].level + 1,
					listElement: nestedList
				});
			}

			const targetList = levelStack[levelStack.length - 1].listElement;
			const listItem = document.createElement('li');
			const linkElement = document.createElement('a');
			linkElement.href = `#${headingElement.id}`;
			linkElement.textContent = title;
			listItem.appendChild(linkElement);
			targetList.appendChild(listItem);
		});

		tocNav.replaceChildren(rootList);
		tocSidebar.hidden = false;

		tocNav.addEventListener('click', (event) => {
			const linkElement = event.target.closest('a[href^="#"]');

			if (!linkElement) {
				return;
			}

			event.preventDefault();
			const targetId = linkElement.getAttribute('href').slice(1);
			const targetElement = document.getElementById(targetId);

			if (!targetElement) {
				return;
			}

			targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
			window.history.replaceState(null, '', `#${targetId}`);
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

		let touchStartX = 0;
		let touchStartY = 0;
		let touchEndX = 0;
		let touchEndY = 0;
		let suppressClickAfterSwipe = false;
		let autoplayIntervalId = null;
		let isAnimating = false;
		const swipeThreshold = 40;
		const autoplayDelay = 6000;
		const animationDurationMs = 220;

		const setTrackTransition = (enabled) => {
			trackElement.style.transition = enabled
				? `transform ${animationDurationMs}ms ease-out`
				: 'none';
		};

		const getSlideStep = () => {
			const firstSlide = slideElements[0];

			if (!firstSlide) {
				return 0;
			}

			return firstSlide.getBoundingClientRect().width;
		};

		const resetTrackPosition = () => {
			setTrackTransition(false);
			trackElement.style.transform = 'translateX(0px)';
			trackElement.getBoundingClientRect();
			setTrackTransition(true);
		};

		const goToPrevious = () => {
			if (isAnimating || slideElements.length < 2) {
				return;
			}

			const step = getSlideStep();

			if (!step) {
				return;
			}

			const lastSlide = slideElements.pop();
			slideElements.unshift(lastSlide);
			trackElement.insertBefore(lastSlide, trackElement.firstChild);

			setTrackTransition(false);
			trackElement.style.transform = `translateX(-${step}px)`;
			trackElement.getBoundingClientRect();

			setTrackTransition(true);
			isAnimating = true;

			const onTransitionEnd = (event) => {
				if (event.target !== trackElement || event.propertyName !== 'transform') {
					return;
				}

				trackElement.removeEventListener('transitionend', onTransitionEnd);
				isAnimating = false;
			};

			trackElement.addEventListener('transitionend', onTransitionEnd);
			requestAnimationFrame(() => {
				trackElement.style.transform = 'translateX(0px)';
			});
		};

		const goToNext = () => {
			if (isAnimating || slideElements.length < 2) {
				return;
			}

			const step = getSlideStep();

			if (!step) {
				return;
			}

			isAnimating = true;

			const onTransitionEnd = (event) => {
				if (event.target !== trackElement || event.propertyName !== 'transform') {
					return;
				}

				trackElement.removeEventListener('transitionend', onTransitionEnd);

				const firstSlide = slideElements.shift();
				slideElements.push(firstSlide);
				trackElement.appendChild(firstSlide);
				resetTrackPosition();
				isAnimating = false;
			};

			trackElement.addEventListener('transitionend', onTransitionEnd);
			trackElement.style.transform = `translateX(-${step}px)`;
		};

		const stopAutoplay = () => {
			if (!autoplayIntervalId) {
				return;
			}

			window.clearInterval(autoplayIntervalId);
			autoplayIntervalId = null;
		};

		const startAutoplay = () => {
			stopAutoplay();

			if (slideElements.length < 2) {
				return;
			}

			autoplayIntervalId = window.setInterval(() => {
				goToNext();
			}, autoplayDelay);
		};

		const restartAutoplay = () => {
			startAutoplay();
		};

		previousButton.addEventListener('click', goToPrevious);

		nextButton.addEventListener('click', goToNext);

		previousButton.addEventListener('click', restartAutoplay);
		nextButton.addEventListener('click', restartAutoplay);

		carouselElement.setAttribute('tabindex', '0');
		carouselElement.addEventListener('keydown', (event) => {
			if (event.key === 'ArrowLeft') {
				event.preventDefault();
				goToPrevious();
			}

			if (event.key === 'ArrowRight') {
				event.preventDefault();
				goToNext();
			}
		});

		carouselElement.addEventListener('touchstart', (event) => {
			stopAutoplay();
			touchStartX = event.changedTouches[0].screenX;
			touchStartY = event.changedTouches[0].screenY;
			touchEndX = touchStartX;
			touchEndY = touchStartY;
			suppressClickAfterSwipe = false;
		});

		carouselElement.addEventListener('touchmove', (event) => {
			touchEndX = event.changedTouches[0].screenX;
			touchEndY = event.changedTouches[0].screenY;
		});

		carouselElement.addEventListener('touchend', (event) => {
			touchEndX = event.changedTouches[0].screenX;
			touchEndY = event.changedTouches[0].screenY;
			const swipeDistanceX = touchEndX - touchStartX;
			const swipeDistanceY = touchEndY - touchStartY;

			if (Math.abs(swipeDistanceX) < swipeThreshold || Math.abs(swipeDistanceX) <= Math.abs(swipeDistanceY)) {
				return;
			}

			suppressClickAfterSwipe = true;
			window.setTimeout(() => {
				suppressClickAfterSwipe = false;
			}, 150);

			if (swipeDistanceX > 0) {
				goToPrevious();
			} else {
				goToNext();
			}

			restartAutoplay();
		});

		carouselElement.addEventListener('mouseenter', stopAutoplay);
		carouselElement.addEventListener('mouseleave', startAutoplay);
		carouselElement.addEventListener('focusin', stopAutoplay);
		carouselElement.addEventListener('focusout', (event) => {
			if (carouselElement.contains(event.relatedTarget)) {
				return;
			}

			startAutoplay();
		});

		carouselElement.addEventListener(
			'click',
			(event) => {
				if (!suppressClickAfterSwipe) {
					return;
				}

				event.preventDefault();
				event.stopPropagation();
			},
			true
		);

		window.addEventListener('resize', () => {
			resetTrackPosition();
			restartAutoplay();
		});

		setTrackTransition(true);
		trackElement.style.transform = 'translateX(0px)';
		startAutoplay();
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
			const isQuestionButton = questionElement.tagName.toLowerCase() === 'button';

			questionElement.setAttribute('id', questionId);

			if (isQuestionButton) {
				questionElement.setAttribute('type', 'button');
			} else {
				questionElement.setAttribute('role', 'button');
				questionElement.setAttribute('tabindex', '0');
			}

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

			const toggleFaqItem = () => {
				const isOpen = faqItem.classList.toggle('is-open');
				questionElement.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
				answerElement.style.maxHeight = isOpen ? `${answerElement.scrollHeight}px` : '0px';
			};

			questionElement.addEventListener('click', toggleFaqItem);

			if (!isQuestionButton) {
				questionElement.addEventListener('keydown', (event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault();
						toggleFaqItem();
					}
				});
			}
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
		document.body.classList.remove('allow-scroll');
	};

	document.addEventListener('DOMContentLoaded', () => {
		initThemeToggle();
		initMobileSidebar();
		initLinksTargetBlank();
		initTocSidebar();
		initMobileSidebarDrawer();
		initHomeCarousel();
		initFaqAccordions();
		initLottiePlayers();
		initResponsiveVideoEmbeds();
		initHomeNoScrollFailSafe();
	});
})();