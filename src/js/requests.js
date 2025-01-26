const API_KEY = import.meta.env.VITE_API_KEY;
console.log(import.meta.env)
console.log(import.meta.env.VITE_API_KEY)

export async function respond(base64image) {

  const request = {
    contents: [
      {
        parts: [
          {
            text: `You are assisting a visually impaired person by describing their surroundings based on the image provided. The purpose is to give helpful guidance. Keep the response very concise using simple and clear language. 
            The user is never in frame, do not mistake a person in the image for the user. Do not mention colors or lighting.
            Identify all key obstacles, such as cars, poles, people, low ceilings, stairs, walls, or uneven terrain, and their relative positions (e.g., "ahead," "left," "right", distance in feet, etc). If these obstacles are moving, indicate so (e.g. running, something thrown, etc).
            Include another sentence only if there is a street, crosswalk, or path and indicate whether it is safe to cross it. If this is not applicable, do not write a second sentence.`            
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