require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { TwitterApi } = require("twitter-api-v2");
const SECRETS = require("./SECRETS");

const twitterClient = new TwitterApi({
  appKey: SECRETS.APP_KEY,
  appSecret: SECRETS.APP_SECRET,
  accessToken: SECRETS.ACCESS_TOKEN,
  accessSecret: SECRETS.ACCESS_SECRET,
});

const genAI = new GoogleGenerativeAI(SECRETS.GEMINI_API_KEY);

async function run() {
  try {
    // Try to generate AI content first
    const generatedText = await generateAIContent();
    console.log("Generated AI text:", generatedText);
    sendTweet(generatedText);
  } catch (error) {
    console.error("Error generating AI content:", error);
    // Only use fallback if AI generation fails
    const fallbackText = generateTemplateContent();
    console.log("Using template-generated message:", fallbackText);
    sendTweet(fallbackText);
  }
}

async function generateAIContent() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt =
    "Generate an empowering and encouraging tweet for women who are heartbroken and need encouragement. Focus on self-love, inner strength, beauty, healing, and moving forward. The message should be uplifting, authentic, and remind them of their worth. Keep it under 280 characters, use plain text, and you can include emojis. Make it feel personal and supportive.";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();

  // Clean up and ensure it's tweet-appropriate
  text = text.trim();
  if (text.length > 280) {
    text = text.substring(0, 277) + "...";
  }

  if (!text || text.length < 20) {
    throw new Error("Generated text too short");
  }

  return text;
}

function generateTemplateContent() {
  // Template-based content generation for variety
  const templates = [
    "You are {adjective} than you know, more {quality} than you see, and more {emotion} than you feel. {action}. 💕 #SelfLove #Healing",
    "Your worth isn't determined by someone else's inability to see it. You are {affirmation}. ✨ #SelfWorth #Healing",
    "{encouragement} is not the end of your story. It's the beginning of your {outcome}. Rise, beautiful soul! 🌟 #Resilience #SelfLove",
    "You deserve {desire} that stays, {care} that heals, and {peace} that lasts. Don't settle for less. 💖 #KnowYourWorth #SelfLove",
    "Every {ending} is a new beginning in disguise. Your heart is {healing}, your strength is {growing}. Keep going! 🌸 #Healing #Growth",
  ];

  const replacements = {
    adjective: [
      "stronger",
      "braver",
      "more resilient",
      "more powerful",
      "more capable",
    ],
    quality: ["beautiful", "worthy", "amazing", "incredible", "valuable"],
    emotion: ["loved", "cherished", "appreciated", "valued", "important"],
    action: [
      "Your heart will heal",
      "You will rise again",
      "Better days are coming",
      "You will find peace",
      "Love will find you again",
    ],
    affirmation: [
      "enough, just as you are",
      "worthy of love",
      "deserving of happiness",
      "complete on your own",
      "perfectly imperfect",
    ],
    encouragement: [
      "Heartbreak",
      "This pain",
      "This chapter",
      "This struggle",
      "This moment",
    ],
    outcome: [
      "comeback",
      "transformation",
      "awakening",
      "renaissance",
      "rebirth",
    ],
    desire: ["love", "kindness", "respect", "joy", "peace"],
    care: ["care", "support", "understanding", "compassion", "tenderness"],
    peace: ["peace", "happiness", "serenity", "contentment", "joy"],
    ending: ["ending", "goodbye", "loss", "setback", "challenge"],
    healing: ["healing", "growing", "mending", "recovering", "strengthening"],
    growing: ["growing", "expanding", "developing", "flourishing", "blooming"],
  };

  const template = templates[Math.floor(Math.random() * templates.length)];

  let result = template;
  Object.keys(replacements).forEach((key) => {
    if (result.includes(`{${key}}`)) {
      const options = replacements[key];
      const replacement = options[Math.floor(Math.random() * options.length)];
      result = result.replace(`{${key}}`, replacement);
    }
  });

  return result;
}

run();

async function sendTweet(tweetText) {
  try {
    console.log("Attempting to tweet:", tweetText);
    console.log("Using credentials:");
    console.log("- APP_KEY:", SECRETS.APP_KEY ? "✓ Set" : "✗ Missing");
    console.log("- APP_SECRET:", SECRETS.APP_SECRET ? "✓ Set" : "✗ Missing");
    console.log(
      "- ACCESS_TOKEN:",
      SECRETS.ACCESS_TOKEN ? "✓ Set" : "✗ Missing"
    );
    console.log(
      "- ACCESS_SECRET:",
      SECRETS.ACCESS_SECRET ? "✓ Set" : "✗ Missing"
    );

    const tweet = await twitterClient.v2.tweet(tweetText);
    console.log("Tweet sent successfully!", tweet);
  } catch (error) {
    console.error("Error sending tweet:", error);
    console.error("Error details:", error.data || error.message);

    // Check if it's a credentials issue
    if (error.code === 401) {
      console.log("\n🔑 Twitter API Authentication Error!");
      console.log("Please verify your Twitter API credentials:");
      console.log("1. Check that your API keys are correct in the .env file");
      console.log("2. Ensure your Twitter app has Read and Write permissions");
      console.log("3. Make sure you're using the correct API version (v2)");
      console.log("4. Verify your app is not suspended or restricted");
    }
  }
}
