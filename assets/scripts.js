
/**
 * Initialize scripts
 */
setTimeout(function() {
	const appId = 'SourcegraphWeb';
	const env = window.location.origin === "https://about.sourcegraph.com" ? "production" : "development";
	initializeTelligent(appId, env, true);
	initializeIntercom(appId);
	initializeGA();
	
	// Initialize Intercom links
	$('.intercom-toggle').on('click', event => {
		event.preventDefault();
		trackIntercomClicked();
		window.Intercom("show");
	});
}, 0);

/**
 * Globally convenience methods
 */
function trackSigninClicked(loc) {
	trackEvent("Auth", "Click", null, "SigninLinkClicked", { location_on_page: loc });
};
function trackSignupClicked(loc) {
	trackEvent("Auth", "Click", null, "SignupLinkClicked", { location_on_page: loc });
};
function trackCareersClicked(loc) {
	trackEvent("Pages", "Click", null, "CareersLinkClicked", { location_on_page: loc });
};
function trackBlogClicked(loc) {
	trackEvent("Pages", "Click", null, "BlogLinkClicked", { location_on_page: loc });
};
function socialMediaClicked(site) {
	trackEvent("Pages", "Click", null, "SocialMediaLinkClicked", { site: site });
}
function trackIntercomClicked() {
	trackEvent("Pages", "Click", null, "IntercomClicked", { });
};

/**
 * Core event logging
 */
function initializeTelligent(appId, env, retry) {
	if (!window.telligent) {
		// If telligent isn't loaded, try again after a short pause
		// This has proven to be an issue specifically on pages (mostly blog posts)
		// with large image and video files that need to be downloaded
		if (retry) { 
			setTimeout(function() {
				initializeTelligent(appId, env, false);
			}, 1000);
		}
		return;
	}

	const telligentUrl = 'sourcegraph-logging.telligentdata.com';
	window.telligent('newTracker', 'sg', telligentUrl, {
		appId: appId,
		platform: 'Web',
		encodeBase64: false,
		env: env,
		configUseCookies: true,
		useCookies: true,
		cookieDomain: 'sourcegraph.com',
		metadata: {
			gaCookies: true,
			performanceTiming: true,
			augurIdentityLite: true,
			webPage: true,
		},
	});

	// Track page view on page load
	trackPageView();
}

function initializeGA() {		
	if (!window.ga) {
		return;
	}
	this.ga(function(trackerId) {
		if (window.telligent) {
			window.telligent('addStaticMetadataObject', { deviceInfo: { GAClientId: trackerId } });
		}
	});
}

function initializeIntercom(appId) {		
	if (!window.intercom || !window.intercomSettings) {
		return;
	}
	this.intercom('boot', this.intercomSettings);
	this.setIntercomProperty('is_on_prem', false);
	this.setIntercomProperty('tracking_app_id', appId);
}

function trackPageView() {
	if (!window.telligent) {
		return;
	}

	props = {
		platform: 'Web',
		path_name: (window && window.location && window.location.pathname) ? window.location.pathname.slice(1) : '',
		static: true,
	};

	// Remove leading and trailing slashes
	let name = window.location.pathname.replace(/^\/|\/$/g, '');
	// Remove "/index.html" file names
	name = name.replace(/\/index.html$/, '');
	// Remove all ".html" extensions on other file names
	name = name.replace(/(\/[^\/]+).html$/, (_, c) => { return c; });
	// Replace "/"s with capitalized characters
	name = name.replace(/\/(.)/g, (_, c) => { return c.toUpperCase(); });

	if (name === '') {
		name = 'ViewHome';
	} else if (name.startsWith("blog")) {
		name = 'ViewBlog'
		const splitPath = window.location.pathname.replace(/^\/|\/$/g, '').split('/')
		props['blog_article'] = splitPath[splitPath.length - 1];
	} else {
		// Pascal case
		name = `View${name.charAt(0).toUpperCase()}${name.slice(1)}`;
	}

	props['page_name'] = name;
	props['page_title'] = name;

	window.telligent('track', 'view', props);
	logToConsole(name, props);
}

function trackEvent(category, action, feature, label, eventProps) {
	if (!window.telligent) {
		return;
	}
	props = Object.assign(eventProps, {
		eventCategory: category,
		eventAction: action,
		eventFeature: feature,
		eventLabel: label,
		platform: 'Web',
		path_name: (window && window.location && window.location.pathname) ? window.location.pathname.slice(1) : '',
		static: true,
	});
	window.telligent('track', action, props);
	if (window.ga) {
		window.ga('send', {
			hitType: 'event',
			eventCategory: category || '',
			eventAction: action || '',
			eventLabel: label,
		});
	}
	logToConsole(label, props);
}

function logToConsole(eventName, object) {
	const eventLogDebug = typeof localStorage !== 'undefined' && localStorage.getItem('eventLogDebug') !== null;
	if (eventLogDebug) {
		console.log('%cEVENT %s', 'color: #aaa', eventName, object);
	}
}
