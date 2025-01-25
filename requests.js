export async function respond(base64Image) {
  const apiKey = "AIzaSyANglJxogyArZcrQap-kHivX0_sdDfAsXU"; // Replace with your actual API key.

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
            data: base64Image,
          },
        },
      ],
    }],
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      }
    );

    const result = await response.json();
    console.log(result);
    return result.contents[0].parts[0].text;
  } catch (error) {
    console.error("Error:", error.message);
    return "Failed to generate a response.";
  }
}
