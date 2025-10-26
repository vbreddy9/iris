const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const requestIp = require("request-ip");
const axios = require("axios");

const app = express();
const PORT = 5000;

// CORS config - allow all origins for now
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Middleware
app.use(bodyParser.json());
app.use(requestIp.mw());

// Health check route
app.get("/home", (req, res) => {
  console.log("GET /home: Health check");
  res.status(200).json("Backend working");
});

// Nodemailer transporter - use Gmail credentials/app password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "admin@aurealconsulting.com",
    pass: "ihdt hwnd ipyx iacl", // replace with your actual Gmail app password
  },
});

// Send Auto-Reply Email to user
const sendAutoReply = async (userEmail, userName) => {
  const mailOptions = {
    from: `"IRIS by Raghava" <admin@aurealconsulting.com>`,
    to: userEmail,
    subject: "Thank You for Your Interest!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; color: #333;">
        <div style="background-color: #cb8904; color: white; padding: 15px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">Thank You for Contacting Us!</h1>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #cb8904;">Hello ${userName},</h2>
          <p>Thank you for reaching out to the <strong>IRIS by Raghava Team</strong>!</p>
          <p>We appreciate your interest and will get in touch with you shortly.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p style="font-size: 14px; color: #555;">
            For any questions, call us at 
            <strong><a href="tel:+919392925831" style="color: #cb8904; text-decoration: none;">+91-9392925831</a></strong>.
          </p>
        </div>
        <div style="background-color: #f0f0f0; padding: 15px 20px; font-size: 14px; text-align: center; color: #666;">
          <p style="margin: 0; font-style: italic;">Warm regards,<br/>IRIS by Raghava Team</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// Notify Admin with Form Data
const notifyAdmin = async (formData) => {
  const mailOptions = {
    from: `"IRIS by Raghava" <admin@aurealconsulting.com>`,
    to: "ayesha@aurealconsulting.com",
    subject: "New Lead - IRIS by Raghava",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #cb8904; color: white; padding: 15px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">New Inquiry Received</h1>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tbody>
            <tr style="background-color: #f7f7f7;">
              <td style="padding: 12px; font-weight: bold; border: 1px solid #ddd;">Name</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${formData.name}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; border: 1px solid #ddd;">Email</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${formData.email}</td>
            </tr>
            <tr style="background-color: #f7f7f7;">
              <td style="padding: 12px; font-weight: bold; border: 1px solid #ddd;">Mobile</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${formData.mobile}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; border: 1px solid #ddd;">IP Address</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${formData.ip}</td>
            </tr>
          </tbody>
        </table>
        <div style="padding: 15px 20px; font-size: 14px; background-color: #f0f0f0; border-top: 1px solid #ddd;">
          <p style="margin: 0;">
            Please follow up with this lead as early as possible.
          </p>
          <p style="margin: 8px 0 0; font-style: italic; color: #555;">
            Thank you,<br/>
            IRIS by Raghava Team
          </p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// TeleCRM Integration
const pushToTeleCRM = async (lead) => {
  const telecrmUrl = "https://api.telecrm.in/enterprise/669f8deb9c0669c069b90fc3/autoupdatelead";
  const telecrmAuth = "Bearer dfc2d8a1-cca4-4226-b121-ebe4b22f6b071721799771196:b0f4940e-3a88-4941-9f34-5485c382e5d7";

  const payload = {
    fields: {
      name: lead.name,
      phone: lead.mobile,
      email: lead.email,
      ip_address: lead.ip,
    },
    actions: [
      {
        type: "SYSTEM_NOTE",
        text: "Lead Source: IRIS by Raghava Website",
      },
    ],
  };

  try {
    const response = await axios.post(telecrmUrl, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: telecrmAuth,
      },
    });
    console.log("✅ TeleCRM Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ TeleCRM Error:", error.response?.data || error.message);
    throw new Error("Failed to push lead to TeleCRM");
  }
};

// POST route to receive form data and process
app.post("/home/send-email", async (req, res) => {
  const { name, email, mobile } = req.body;
  const ip = req.clientIp || "Unknown";

  if (!name || !email || !mobile) {
    return res.status(400).json({ error: "Name, email, and mobile are required." });
  }

  try {
    // Send emails and push to CRM in parallel
    await Promise.all([
      sendAutoReply(email, name),
      notifyAdmin({ name, email, mobile, ip }),
      pushToTeleCRM({ name, email, mobile, ip }),
    ]);

    console.log("✅ Emails sent and lead pushed to TeleCRM");
    res.status(200).json({ message: "Emails sent and lead added to TeleCRM successfully" });
  } catch (error) {
    console.error("❌ FULL ERROR LOG:", error);
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
