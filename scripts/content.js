function findElements(selector, ignoredClasses = [], validateFn = () => true) {
	const elements = document.querySelectorAll(selector);
	const result = [];

	elements.forEach((element) => {
		const shouldIgnore = ignoredClasses.some((className) =>
			element.classList.contains(className)
		);

		if (shouldIgnore) {
			return;
		}

		if (validateFn(element)) {
			result.push({
				tag: element.tagName,
				text: element.textContent.trim(),
				href: element.getAttribute("href") || null,
				element,
			});
		}
	});

	return result;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	linkParams = [
		"a",
		[
			"premium-menu-link-parent",
			"premium-sub-menu-link",
			"has-submenu",
			"ab-item",
		],
		(link) => !link.getAttribute("href") || link.getAttribute("href") === "#",
	];
	headingParams = "h1,h2,h3,h4,h5,h6";

	if (message.action === "scanLinks") {
		const invalidLinks = findElements(...linkParams);
		sendResponse({ invalidLinks });
	}

	if (message.action === "scanHeadings") {
		const headings = findElements(headingParams);
		sendResponse({ headings });
	}

	if (message.action === "scrollToLink") {
		const invalidLinks = findElements(...linkParams);
		const linkToScroll = invalidLinks[message.index].element;

		linkToScroll.scrollIntoView({ behavior: "smooth", block: "center" });
		linkToScroll.style.backgroundColor = "yellow";
		setTimeout(() => {
			linkToScroll.style.backgroundColor = "";
		}, 2000);
	}

	if (message.action === "scrollToHeading") {
		const headings = findElements(headingParams);
		const headingToScroll = headings[message.index].element;

		headingToScroll.scrollIntoView({ behavior: "smooth", block: "center" });
		headingToScroll.style.color = "yellow";
		setTimeout(() => {
			headingToScroll.style.color = "";
		}, 2000);
	}
});
