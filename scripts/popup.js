document.addEventListener("DOMContentLoaded", () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, { action: "scanLinks" }, (response) => {
			const linkResults = document.getElementById("linkResults");
			linkResults.innerHTML = "";

			if (response && response.invalidLinks.length > 0) {
				response.invalidLinks.forEach((link, index) => {
					const li = document.createElement("li");
					li.innerHTML = `${index + 1}. Text: "<strong>${
						link.text
					}</strong>", Href: "${link.href}"`;
					li.addEventListener("click", () => {
						chrome.tabs.sendMessage(tabs[0].id, {
							action: "scrollToLink",
							index,
						});
					});
					linkResults.appendChild(li);
				});
			} else {
				const li = document.createElement("li");
				li.textContent = "No invalid links found.";
				linkResults.appendChild(li);
			}
		});
		chrome.tabs.sendMessage(
			tabs[0].id,
			{ action: "scanHeadings" },
			(response) => {
				const headingResults = document.getElementById("headingResults");
				headingResults.innerHTML = "";

				if (response && response.headings.length > 0) {
					response.headings.forEach((heading, index) => {
						const li = document.createElement("li");
						li.classList.add(heading.tag);
						li.innerHTML = `<strong>${heading.tag}:</strong> "${heading.text}"`;
						li.addEventListener("click", () => {
							chrome.tabs.sendMessage(tabs[0].id, {
								action: "scrollToHeading",
								index,
							});
						});
						headingResults.appendChild(li);
					});
				} else {
					const li = document.createElement("li");
					li.textContent = "No headings found.";
					headingResults.appendChild(li);
				}
			}
		);
	});
});
