function findElements(selector, ignoredClasses = [], validateFn = () => true) {
	let elements = Array.from(document.querySelectorAll(selector));
	if (selector === "img") {
		elements = elements.filter(
			img =>
				!img.hasAttribute("alt") ||
				img.getAttribute("alt").trim() === ""
		);
	}
	const result = [];

	elements.forEach(element => {
		const shouldIgnore = ignoredClasses.some(className =>
			element.classList.contains(className)
		);

		if (shouldIgnore) {
			return;
		}

		if (validateFn(element)) {
			result.push({
				tag: element.tagName,
				text: element.textContent.trim() || null,
				href: element.getAttribute("href") || element.src || null,
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
		link => !link.getAttribute("href") || link.getAttribute("href") === "#",
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

	if (message.action === "scanImages") {
		const images = findElements("img");
		sendResponse({ images });
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

	if (message.action === "scrollToImage") {
		const images = findElements("img");
		const imageToScroll = images[message.index].element;

		imageToScroll.scrollIntoView({ behavior: "smooth", block: "center" });
		imageToScroll.style.filter = "drop-shadow(0 0 16px yellow)";
		setTimeout(() => {
			imageToScroll.style.filter = "";
		}, 2000);
	}
});
