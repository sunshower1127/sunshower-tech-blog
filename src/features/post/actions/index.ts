"use server";

export async function translateText(formData: FormData) {
  const text = formData.get("text");
  const sourceLang = formData.get("source_lang");
  const targetLang = formData.get("target_lang");

  try {
    const response = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang,
        source_lang: sourceLang,
      }),
    });

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    throw new Error("Translation API request failed: " + error);
  }
  // console.log("Translation response:", data);
  // return data.translations[0].text;
}
