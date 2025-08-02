# Plan for Using Individual Gemini API Keys

This document outlines the plan for integrating and using individual teacher's Gemini API keys in the Future Classroom Forge project.

## 1. Update Edge Functions

The following edge functions need to be updated to retrieve the user's Gemini API key from the `profiles` table:

- `analyze-students`
- `generate-lesson-plan`
- `generate-lesson-questions`

The process for each function will be as follows:

1.  **Get User ID:** Get the user ID from the Supabase client.
2.  **Fetch Profile:** Fetch the user's profile from the `profiles` table using the user ID.
3.  **Retrieve API Key:** Get the `gemini_api_key` from the user's profile.

## 2. Pass API Key to Gemini

Once the API key has been retrieved, it needs to be passed to the Gemini API in the `x-goog-api-key` header of the API request.

## 3. Error Handling

If a user does not have a `gemini_api_key` in their profile, the edge functions should return a specific error message to the frontend. This error message should prompt the user to add their API key in the settings page.

The frontend will then display the API key modal, which is already implemented in the `SettingsPage.tsx` component.
