const API_KEY = import.meta.env.VITE_API_KEY;
console.log(import.meta.env)
console.log(import.meta.env.VITE_API_KEY)

export async function respond(base64image) {

  const request = {
    contents: [
      {
        parts: [
          {
            text: `You are assisting a visually impaired person by describing their surroundings based on the image provided. The purpose is to give actionable and helpful guidance.
            
            Consider the following:

            1. Identify key obstacles, such as cars, poles, people, or walls, and their relative positions (e.g., "ahead," "left," "right", distance in feet, etc).

            2. If a crosswalk is present, indicate whether it is safe to cross, considering any approaching vehicles.

            3. Mention other important details that could impact movement or navigation, such as stairs, open doors, or uneven terrain.

            4. Keep the response concise, in 1-2 sentences, using simple and clear language.`,
          },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: base64image,
            },
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    // console.log("API Response:", result);

    return result.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error:", error.message);
    return "Failed to process the image.";
  }
}

window.respond = respond;
export default respond;