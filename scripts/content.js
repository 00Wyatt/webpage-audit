function findInvalidLinks() {
	const links = document.querySelectorAll("a");
	const invalidLinks = [];
	const classesToIgnore = [
		"premium-menu-link-parent",
		"has-submenu",
		"ab-item",
	];

	links.forEach((link) => {
		const href = link.getAttribute("href");

		// Check if the link has any class that should be ignored
		const shouldIgnore = classesToIgnore.some((className) =>
			link.classList.contains(className)
		);

		if (shouldIgnore) {
			return;
		}

		// Check if the href is invalid
		if (!href || href === "#") {
			invalidLinks.push({
				text: link.textContent.trim(),
				href: href || "Missing href",
				element: link,
			});
		}
	});

	return invalidLinks;
}

function findHeadings() {
	const headings = document.querySelectorAll("h1,h2,h3,h4,h5,h6");
	const headingsList = [];

	headings.forEach((heading) => {
		headingsList.push({
			tag: heading.tagName,
			text: heading.textContent.trim(),
			element: heading,
		});
	});

	return headingsList;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "scanLinks") {
		const invalidLinks = findInvalidLinks();
		sendResponse({ invalidLinks });
	}
	if (message.action === "scrollToLink") {
		const invalidLinks = findInvalidLinks();
		const linkToScroll = invalidLinks[message.index].element;

		linkToScroll.scrollIntoView({ behavior: "smooth", block: "center" });

		linkToScroll.style.backgroundColor = "yellow";
		setTimeout(() => {
			linkToScroll.style.backgroundColor = "";
		}, 2000);
	}
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "scanHeadings") {
		const headings = findHeadings();
		sendResponse({ headings });
	}
	if (message.action === "scrollToHeading") {
		const headings = findHeadings();
		const headingToScroll = headings[message.index].element;

		headingToScroll.scrollIntoView({ behavior: "smooth", block: "center" });

		headingToScroll.style.color = "yellow";
		setTimeout(() => {
			headingToScroll.style.color = "";
		}, 2000);
	}
});
