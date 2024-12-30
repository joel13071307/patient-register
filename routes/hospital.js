const express = require("express");
const router = express.Router();
const { getHospital } = require("../database/database.js");

// get hospital
router.get("/:hid", async (req, res) => {
  const hid = req.params.hid;
  try {
    const hospital = await getHospital(hid);
    hospital.map((item) => {
      item["Psychiatrist Details"] = item["Psychiatrist Details"]
        .split("; ")
        .map((item) => {
          const j = {
            Id: item.split(", ")[0].split(":")[1],
            Name: item.split(", ")[1].split(":")[1],
            "Patients count": item.split(", ")[2].split(":")[1],
          };
          return j;
        });
    });
    return res.status(200).send(hospital);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
