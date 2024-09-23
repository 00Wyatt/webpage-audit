function findInvalidLinks() {
	const links = document.querySelectorAll("a");
	const invalidLinks = [];
	const classesToIgnore = ["premium-menu-link-parent", "has-submenu"];

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
