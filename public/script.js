const API_BASE = "/api";
let selectedSlot = null;
let slots = [];

const slotsContainer = document.querySelector("#slots-container");
const meetingsContainer = document.querySelector("#meetings-container");
const bookingForm = document.querySelector("#booking-form");
const selectedSlotText = document.querySelector("#selected-slot");
const bookButton = document.querySelector("#book-button");
const formMessage = document.querySelector("#form-message");
const meetingCount = document.querySelector("#meeting-count");

function renderSlots() {
  slotsContainer.replaceChildren();
  slots.forEach((slot) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `slot-button${selectedSlot === slot.time ? " selected" : ""}`;
    button.disabled = slot.available === 0;
    const time = document.createElement("span");
    time.className = "slot-time";
    time.textContent = slot.time;
    const seats = document.createElement("span");
    seats.className = "slot-seats";
    seats.textContent =
      slot.available === 0 ? "Fully booked" : `${slot.available} Available`;
    button.append(time, seats);
    button.addEventListener("click", () => {
      selectedSlot = slot.time;
      selectedSlotText.textContent = slot.time;
      bookButton.disabled = false;
      renderSlots();
    });
    slotsContainer.append(button);
  });
}

function createMeetingCard(meeting) {
  const card = document.createElement("article");
  card.className = "meeting-card";

  const top = document.createElement("div");
  top.className = "meeting-card-top";
  const time = document.createElement("span");
  time.className = "meeting-time";
  time.textContent = meeting.slotTime;
  const status = document.createElement("span");
  status.className = "status-pill";
  status.textContent = "Scheduled";
  top.append(time, status);

  const name = document.createElement("p");
  name.className = "meeting-name";
  name.textContent = meeting.name;
  const email = document.createElement("p");
  email.className = "meeting-email";
  email.textContent = meeting.email;
  const link = document.createElement("a");
  link.className = "meeting-link";
  link.href = meeting.meetingLink;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = meeting.meetingLink;

  const actions = document.createElement("div");
  actions.className = "card-actions";
  const copy = document.createElement("button");
  copy.type = "button";
  copy.className = "copy-button";
  copy.textContent = "Copy link";
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(meeting.meetingLink);
      copy.textContent = "Copied!";
      setTimeout(() => {
        copy.textContent = "Copy link";
      }, 1500);
    } catch {
      copy.textContent = "Copy unavailable";
    }
  });
  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.className = "cancel-button";
  cancel.textContent = "Cancel meeting";
  cancel.addEventListener("click", () => cancelBooking(meeting.id));
  actions.append(copy, cancel);
  card.append(top, name, email, link, actions);
  return card;
}

function renderMeetings(meetings) {
  meetingsContainer.replaceChildren();
  meetingCount.textContent = `${meetings.length} ${meetings.length === 1 ? "meeting" : "meetings"}`;
  if (meetings.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    const icon = document.createElement("span");
    icon.className = "empty-icon";
    icon.textContent = "▦";
    const heading = document.createElement("h3");
    heading.textContent = "No meetings yet";
    const message = document.createElement("p");
    message.textContent = "Your confirmed meetings will appear here.";
    empty.append(icon, heading, message);
    meetingsContainer.append(empty);
    return;
  }
  meetings.forEach((meeting) =>
    meetingsContainer.append(createMeetingCard(meeting)),
  );
}

async function loadSlots() {
  const response = await axios.get(`${API_BASE}/slots`);
  slots = response.data;
  if (
    selectedSlot &&
    !slots.some((slot) => slot.time === selectedSlot && slot.available > 0)
  ) {
    selectedSlot = null;
    selectedSlotText.textContent = "No slot selected";
    bookButton.disabled = true;
  }
  renderSlots();
}

async function loadMeetings() {
  const response = await axios.get(`${API_BASE}/bookings`);
  renderMeetings(response.data);
}

async function refreshPage() {
  try {
    await Promise.all([loadSlots(), loadMeetings()]);
  } catch (error) {
    slotsContainer.textContent = error.response?.data?.message || error.message;
    formMessage.textContent =
      "Could not connect to the server. Check that the backend is running.";
    formMessage.classList.add("error");
  }
}

bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!selectedSlot) {
    formMessage.textContent = "Please select a meeting slot first.";
    formMessage.classList.add("error");
    return;
  }
  bookButton.disabled = true;
  formMessage.classList.remove("error");
  formMessage.textContent = "Booking your meeting…";
  const formData = new FormData(bookingForm);
  try {
    const response = await axios.post(`${API_BASE}/bookings`, {
      name: formData.get("name"),
      email: formData.get("email"),
      slotTime: selectedSlot,
    });
    bookingForm.reset();
    selectedSlot = null;
    selectedSlotText.textContent = "No slot selected";
    formMessage.textContent = response.data.message;
    await Promise.all([loadSlots(), loadMeetings()]);
  } catch (error) {
    formMessage.textContent = error.response?.data?.message || error.message;
    formMessage.classList.add("error");
    await loadSlots();
  } finally {
    bookButton.disabled = !selectedSlot;
  }
});

async function cancelBooking(id) {
  if (!window.confirm("Are you sure you want to cancel this meeting?")) return;
  try {
    const response = await axios.delete(`${API_BASE}/bookings/${id}`);
    formMessage.classList.remove("error");
    formMessage.textContent = response.data.message;
    await Promise.all([loadSlots(), loadMeetings()]);
  } catch (error) {
    window.alert(error.response?.data?.message || error.message);
  }
}

refreshPage();
