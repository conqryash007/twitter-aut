//? It is advisable to use environment variables instead of directly putting secrets in repository file but I have skipped this part as it would become complicated for many.
//? Alternatively you can download the repository instead or forking and upload it from your account and keep it private, in that way, your secrets will not be exposed to the public.

const APP_KEY = "qxsQhSZtofRER2zDsshfaDOr6";
const APP_SECRET = "nprjJ1ZYmWSw2rLqRqAbMfO0FPbxqGJEaQ7khfuUnHOGKKuRWa";
const ACCESS_TOKEN =  "1926507177553895424-cMVSa11IP4kVkvLXjIPsotcwA6bhBK";
const ACCESS_SECRET = "Af58pj7JjOwgFuMYlvos70mtpASRaDFSmhQnukMjLdGiQ";
const GEMINI_API_KEY = "AIzaSyAwCqWxM10LySK-ED333b2YbwTFYN3WXlI";

// Validate that all required environment variables are set
const requiredEnvVars = {
  APP_KEY,
  APP_SECRET,
  ACCESS_TOKEN,
  ACCESS_SECRET,
  GEMINI_API_KEY,
};
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
  process.exit(1);
}

const SECRETS = {
  APP_KEY,
  APP_SECRET,
  ACCESS_TOKEN,
  ACCESS_SECRET,
  GEMINI_API_KEY,
};

module.exports = SECRETS;
