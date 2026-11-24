import Meeting from "../models/Meeting.js";

export const SLOT_TIMES = ["2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM"];
export const SLOT_CAPACITY = 4;

// Returns all four slots and the number of seats still available in each.
export const getSlots = async (req, res) => {
  try {
    const bookings = await Meeting.findAll({
      attributes: ["slotTime"],
      where: { status: "scheduled" },
      raw: true,
    });

    const slots = SLOT_TIMES.map((time) => ({
      time,
      available:
        SLOT_CAPACITY -
        bookings.filter((booking) => booking.slotTime === time).length,
    }));

    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: "Could not load meeting slots." });
  }
};

export const createBooking = async (req, res) => {
  const { name, email, slotTime } = req.body;
  if (!name?.trim() || !email?.trim() || !slotTime) {
    return res
      .status(400)
      .json({ message: "Name, email and a meeting slot are required." });
  }
  if (!SLOT_TIMES.includes(slotTime)) {
    return res
      .status(400)
      .json({ message: "Please select a valid meeting slot." });
  }

  try {
    const bookedCount = await Meeting.count({
      where: { slotTime, status: "scheduled" },
    });

    if (bookedCount >= SLOT_CAPACITY) {
      return res.status(409).json({
        message:
          "Sorry, this meeting slot is full. Please choose another slot.",
      });
    }

    const demoCode = `${Math.random().toString(36).slice(2, 5)}-${Math.random().toString(36).slice(2, 6)}-${Math.random().toString(36).slice(2, 5)}`;

    const meeting = await Meeting.create(
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        slotTime,
        meetingLink: `https://meet.google.com/${demoCode}`,
      }
    );

    res.status(201).json({ message: "Meeting booked successfully!", meeting });
  } catch (error) {
    res.status(500).json({ message: "Could not book the meeting." });
  }
};

export const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.findAll({
      where: { status: "scheduled" },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: "Could not load scheduled meetings." });
  }
};

export const cancelMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByPk(req.params.id);
    if (!meeting || meeting.status !== "scheduled") {
      return res.status(404).json({ message: "Scheduled meeting not found." });
    }

    meeting.status = "cancelled";
    await meeting.save();
    res.status(200).json({ message: "Meeting cancelled successfully." });
  } catch (error) {
    res.status(500).json({ message: "Could not cancel the meeting." });
  }
};
