const { GoogleGenAI} = require("@google/genai")
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const aiReview = async (req, res) => {
  const { code} = req.body;
  if(code === undefined || code.trim() === "") {
    return res.status(400).json({ error: "Code is required for AI review.", success: false });
  }

  try{
    const review = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Please review the following code and provide feedback on its quality, efficiency, and potential improvements:\n\n" + code,
    });
    return res.status(200).json({
      message: "AI review is currently under development.",
      data: {
       "review": review.text,
      },
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ error: "An error occurred while processing the AI review.", success: false });
  }
};
module.exports = {
  aiReview,
};
