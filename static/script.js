function formatEvent(event) {
  const { type, author, from_branch, to_branch, timestamp } = event;

  if (type === "push") {
    return `${author} pushed to ${to_branch} on ${timestamp}`;
  } else if (type === "pull_request") {
    return `${author} submitted a pull request from ${from_branch} to ${to_branch} on ${timestamp}`;
  } else if (type === "merge") {
    return `${author} merged branch ${from_branch} to ${to_branch} on ${timestamp}`;
  }

  return "Unknown event";
}

function fetchEvents() {
  fetch("/events")
    .then((response) => response.json())
    .then((data) => {
      const eventsList = document.getElementById("eventsList");
      eventsList.innerHTML = "";

      data.forEach((event) => {
        const li = document.createElement("li");
        li.textContent = formatEvent(event);
        eventsList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
    });
}

// Initial fetch
fetchEvents();

// Refresh every 15 seconds
setInterval(fetchEvents, 15000);
