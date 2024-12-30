const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const patientRouter = require("./routes/patient.js");
const hospitalRouter = require("./routes/hospital.js");

app.use(cors());
app.use(express.json());
app.use("/patient", patientRouter);
app.use("/hospital", hospitalRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
