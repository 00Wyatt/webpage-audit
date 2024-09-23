document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("scanLinksButton").addEventListener("click", () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(
				tabs[0].id,
				{ action: "scanLinks" },
				(response) => {
					const results = document.getElementById("results");
					results.innerHTML = "";

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
							results.appendChild(li);
						});
					} else {
						const li = document.createElement("li");
						li.textContent = "No invalid links found.";
						results.appendChild(li);
					}
				}
			);
		});
	});
});
