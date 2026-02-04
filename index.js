import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "PayHero backend running" });
});

app.post("/stk", async (req, res) => {
  const { phone, amount, reference } = req.body;

  try {
    const response = await axios.post(
      "https://backend.payhero.co.ke/api/v2/payments",
      {
        amount: amount,
        phone_number: phone,
        channel_id: process.env.PAYHERO_CHANNEL_ID,
        provider: "m-pesa",
        external_reference: reference || "STK-PUSH"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYHERO_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: error.response?.data || "Payment failed"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
