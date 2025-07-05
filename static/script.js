document.addEventListener("DOMContentLoaded", () => {
  const eventsGrid = document.getElementById("events-grid");
  const loader = document.getElementById("loader");
  const lastUpdated = document.getElementById("last-updated");

  const icons = {
    push: "📦",
    pull_request: "🔃",
    merge: "✅",
  };

  const fetchData = async () => {
    loader.style.display = "flex";
    try {
      const response = await fetch("/events");
      const events = await response.json();
      updateUI(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      eventsGrid.innerHTML =
        '<p class="text-red-500 col-span-full">Failed to load events. Please try again later.</p>';
    } finally {
      loader.style.display = "none";
    }
  };

  const updateUI = (events) => {
    eventsGrid.innerHTML = ""; // Clear existing events

    if (events.length === 0) {
      eventsGrid.innerHTML =
        '<p class="text-gray-500 col-span-full">No recent events.</p>';
      return;
    }

    events.forEach((event) => {
      if (!event || !event.event_type) {
        console.warn("Skipping invalid event:", event);
        return; // Skip this iteration if the event is not valid
      }
      const eventType = event.event_type.toLowerCase();
      const icon = icons[eventType] || "❓";
      const card = document.createElement("div");
      card.className =
        "bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300";

      card.innerHTML = `
        <div class="flex items-center mb-4">
          <span class="text-2xl mr-4">${icon}</span>
          <h2 class="text-lg font-semibold text-gray-800">${
            event.author
          } ${getVerb(eventType)} ${getBranch(event)}</h2>
        </div>
        <p class="text-sm text-gray-500">
          🕒 ${new Date(event.timestamp).toLocaleString()}
        </p>
      `;
      eventsGrid.appendChild(card);
    });

    lastUpdated.textContent = new Date().toLocaleTimeString();
  };

  const getVerb = (eventType) => {
    switch (eventType) {
      case "push":
        return "pushed to";
      case "pull_request":
        return "opened a pull request on";
      case "merge":
        return "merged to";
      default:
        return "did something on";
    }
  };

  const getBranch = (event) => {
    if (event.event_type === "push") {
      return `<strong>${event.to_branch}</strong>`;
    } else if (event.event_type === "pull_request") {
      return `<strong>${event.to_branch}</strong> from <strong>${event.from_branch}</strong>`;
    } else if (event.event_type === "merge") {
      return `<strong>${event.to_branch}</strong>`;
    }
    return "";
  };

  // Initial fetch and set interval
  fetchData();
  setInterval(fetchData, 15000);
});
