const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

// initialize process
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// encode image to base64
function encode(image_path) {
  const image_buffer = fs.readFileSync(image_path);
  return image_buffer.toString("base64");
}

async function tester() {
  return "Hello World!";
}

// generate response to prompt
async function respond(image_path) {
  const encodedImage = encode(image_path);

  const request = {
    contents: [{
      parts: [
        { text: `You are assisting a visually impaired person by describing their surroundings based on the image provided. The purpose is to give actionable and helpful guidance.
        
        Consider the following:

        1. Identify key obstacles, such as cars, poles, people, or walls, and their relative positions (e.g., "ahead," "left," "right", distance in feet, etc).

        2. If a crosswalk is present, indicate whether it is safe to cross, considering any approaching vehicles.

        3. Mention other important details that could impact movement or navigation, such as stairs, open doors, or uneven terrain.

        4. Keep the response concise, in 1-2 sentences, using simple and clear language.` 
        },
        {
          inline_data: {
            mime_type: "image/jpeg",
            data: encodedImage,
          },
        },
      ],
    }],
  };

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(request);
    console.log(result.response.text());
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// specify image file path and call the respond
const image_path = path.resolve(__dirname, "crosswalk-test-img.jpg");
respond(image_path);
