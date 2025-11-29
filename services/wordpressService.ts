import { WordPressConfig } from "../types";

export const publishToWordPress = async (
  config: WordPressConfig,
  title: string,
  content: string
) => {
  const { url, username, appPassword } = config;

  // Ensure URL ends with wp-json/wp/v2/posts
  let endpoint = url.replace(/\/$/, ""); // remove trailing slash
  if (!endpoint.includes("wp-json")) {
    endpoint += "/wp-json/wp/v2/posts";
  } else if (!endpoint.endsWith("/posts")) {
    endpoint += "/wp/v2/posts";
  }

  const authString = btoa(`${username}:${appPassword}`);

  // We assume the user wants to publish immediately
  const postData = {
    title: title || "Generated Content",
    content: content,
    status: "publish", 
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to publish: ${response.status} ${response.statusText}. ${
          errorData.message || ""
        }`
      );
    }

    return await response.json();
  } catch (error: any) {
    // Check for CORS error
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error("שגיאת CORS: האתר שלך חוסם את הבקשה. יש להתקין תוסף CORS או לאפשר בקשות מהדפדפן, או להשתמש בשרת פרוקסי.");
    }
    throw error;
  }
};