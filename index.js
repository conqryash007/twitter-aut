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
  // Enhanced content with motivational quotes and high-visibility hashtags
  const contentTypes = [
    // Motivational quotes
    {
      type: "motivational_quotes",
      templates: [
        '"Your current situation is not your final destination. Keep moving forward." 🚀 #Motivation #Success #NeverGiveUp #Inspiration',
        '"The strongest people are not those who show strength in front of us, but those who win battles we know nothing about." 💪 #MentalHealth #Strength #Warrior #Resilience',
        '"You are not broken. You are breaking through." ✨ #Breakthrough #Growth #Healing #SelfLove',
        '"Your worth is not determined by your productivity." 🌟 #SelfWorth #MentalHealthAwareness #Validation #YouMatter',
        '"Progress, not perfection." 📈 #Progress #Growth #Mindset #SelfImprovement',
        '"You survived 100% of your worst days. You\'re doing great." 🌈 #Survivor #Strength #MentalHealth #Hope',
        '"Your healing journey is valid, no matter how long it takes." 🌱 #HealingJourney #Patience #SelfCompassion #Growth',
      ],
    },
    // Empowerment with trending hashtags
    {
      type: "empowerment",
      templates: [
        "You are {adjective} than you think. You are {quality} beyond measure. Remember that today. 💖 #SelfLove #Empowerment #WomenSupportingWomen #MondayMotivation",
        "Your {emotion} is valid. Your journey is yours alone. Trust the process. 🦋 #MentalHealthMatters #Healing #SelfCare #Mindfulness",
        "Stop shrinking yourself to make others comfortable. Take up space. You belong here. 👑 #SelfWorth #Confidence #WomenEmpowerment #BeBold",
        "Your past doesn't define you. Your {action} does. Keep going. 🌟 #NewBeginnings #Growth #Motivation #Resilience",
      ],
    },
    // Daily affirmations with engagement
    {
      type: "affirmations",
      templates: [
        'Daily Affirmation: "I am {affirmation}" 🌸 Save this if you need the reminder! #DailyAffirmation #SelfLove #Mindset #Positivity',
        'Repeat after me: "I am worthy of {desire}" 💕 Like if you believe it! #Affirmations #SelfWorth #LoveYourself #Healing',
        "Today's mantra: \"{mantra}\" 🧘‍♀️ What's yours? Share below! #Mindfulness #Meditation #SelfCare #MentalHealth",
      ],
    },
    // Questions for engagement
    {
      type: "engagement",
      templates: [
        "What's one thing you're grateful for today? Let's spread some positivity! 🌻 #Gratitude #Positivity #MentalHealth #Community",
        "How do you practice self-love when you're feeling low? Share your tips! 💛 #SelfCare #MentalHealthTips #Community #Support",
        "What song instantly lifts your mood? Drop it below! 🎵 #MusicHeals #Mood #Community #ShareYourVibes",
        "What's one piece of advice you'd give to your younger self? 💭 #Wisdom #Growth #Life #Reflection",
      ],
    },
  ];

  const replacements = {
    adjective: [
      "stronger",
      "braver",
      "more resilient",
      "more capable",
      "more beautiful",
      "wiser",
      "more powerful",
    ],
    quality: [
      "beautiful",
      "worthy",
      "amazing",
      "enough",
      "valued",
      "loved",
      "important",
    ],
    emotion: [
      "pain",
      "struggle",
      "healing",
      "journey",
      "growth",
      "transformation",
      "courage",
    ],
    action: [
      "resilience",
      "courage",
      "kindness",
      "strength",
      "growth",
      "healing",
      "journey",
    ],
    affirmation: [
      "enough as I am",
      "worthy of love",
      "deserving of happiness",
      "growing every day",
      "beautiful inside and out",
      "stronger than I know",
    ],
    desire: [
      "love that stays",
      "peace that lasts",
      "joy that heals",
      "respect that honors you",
      "kindness that lifts you",
    ],
    mantra: [
      "I am exactly where I need to be",
      "I choose peace over perfection",
      "I am worthy of good things",
      "I trust my journey",
      "I am healing at my own pace",
    ],
  };

  // Randomly select content type
  const contentType =
    contentTypes[Math.floor(Math.random() * contentTypes.length)];
  const template =
    contentType.templates[
      Math.floor(Math.random() * contentType.templates.length)
    ];

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
