const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "by6d5vvr3z9njhultbp2-mysql.services.clever-cloud.com",
  database: "by6d5vvr3z9njhultbp2",
  user: "u46swhmhngbcnwwk",
  password: "SczE5gbtrV1ontHohvil",
});

const promisePool = pool.promise();

const registerPatient = async (
  name,
  email,
  password,
  phone,
  address,
  photo,
  psid
) => {
  const [rows, fields] = await promisePool.execute(
    `INSERT INTO Patients (name, address, email, phone, password, photo) VALUES ('${name}', '${address}', '${email}','${phone}', '${password}', '${photo}')`
  );
  const [rows1, fields1] = await promisePool.execute(
    `INSERT INTO Appointments (pid, psid) VALUES ('${rows.insertId}', '${psid}')`
  );
  return rows1;
};

const getHospital = async (hid) => {
  const [rows, fields] =
    await promisePool.execute(`SELECT Hospitals.name as 'Hospital Name',
    (SELECT COUNT(DISTINCT psid) FROM Psychiatrists WHERE hid = ${hid}) as 'Total Psychiatrist count',
    (SELECT COUNT(DISTINCT Patients.pid) FROM Patients 
        JOIN Appointments ON Patients.pid = Appointments.pid
        JOIN Psychiatrists ON Appointments.psid = Psychiatrists.psid
        WHERE Psychiatrists.hid = ${hid}) as 'Total patients count',
    GROUP_CONCAT(DISTINCT CONCAT('Id:',Psychiatrists.psid,', Name:', Psychiatrists.name, ', Patients count:', (SELECT COUNT(DISTINCT Appointments.pid) FROM Appointments WHERE psid = Psychiatrists.psid)) SEPARATOR '; ') as 'Psychiatrist Details'
FROM Hospitals
JOIN Psychiatrists ON Hospitals.hid = Psychiatrists.hid
WHERE Hospitals.hid = ${hid}
GROUP BY Hospitals.name;`);
  return rows;
};

module.exports = { registerPatient, getHospital };
