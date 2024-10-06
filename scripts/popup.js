function displayResults(results, containerId, scrollAction, tabs) {
	const container = document.getElementById(containerId);
	container.innerHTML = "";

	if (results && results.length > 0) {
		results.forEach((result, index) => {
			const li = document.createElement("li");
			if (result.tag === "A") {
				li.innerHTML = `${index + 1}. Text: "<strong>${
					result.text
				}</strong>", Href: "${result.href ?? ""}"`;
			} else {
				li.classList.add(result.tag.toLowerCase());
				li.innerHTML = `<strong>${result.tag}:</strong> "${result.text}"`;
			}
			li.addEventListener("click", () => {
				chrome.tabs.sendMessage(tabs[0].id, {
					action: scrollAction,
					index,
				});
			});

			container.appendChild(li);
		});
	} else {
		const li = document.createElement("li");
		li.textContent = "No results found.";
		container.appendChild(li);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, { action: "scanLinks" }, (response) => {
			displayResults(
				response.invalidLinks,
				"linkResults",
				"scrollToLink",
				tabs
			);
		});

		chrome.tabs.sendMessage(
			tabs[0].id,
			{ action: "scanHeadings" },
			(response) => {
				displayResults(
					response.headings,
					"headingResults",
					"scrollToHeading",
					tabs
				);
			}
		);
	});
});
