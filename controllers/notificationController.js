const Notification = require("../models/notificationModel");

const getallnotifs = async (req, res) => {
  try {
    const notifs = await Notification.find({ userId: req.locals })
    .sort({ createdAt: -1 });
    return res.send(notifs);
  } catch (error) {
    res.status(500).send("Unable to get all notifications");
  }
};

module.exports = {
  getallnotifs,
};
