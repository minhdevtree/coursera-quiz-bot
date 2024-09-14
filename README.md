# Coursera Quiz Auto Answer Chrome Extension

This Chrome extension is designed to help users automatically answer quiz questions on Coursera using Google Bard AI (Gemini-1.5 model). The extension extracts questions from the Coursera quiz page, sends them to the Google Bard API, and highlights the correct answers on the page.

## Features

- Automatically extracts quiz questions from Coursera.
- Uses Google Bard AI to generate answers.
- Highlights the correct answers directly on the quiz page.
- Supports multiple questions and ensures accurate mapping between questions and answers.

## How It Works

1. The extension reads the quiz questions from the Coursera page.
2. It sends the extracted text to Google Bard AI via an API call.
3. Once the response is received, the extension highlights the correct answers on the quiz page.

## Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** by toggling the switch in the top-right corner.
4. Click on **Load unpacked** and select the directory where you saved the extension files.
5. The extension will now be installed and can be accessed from the Chrome extensions menu.

## Usage

1. Navigate to any Coursera quiz page.
2. Click the extension icon in the Chrome toolbar.
3. The extension will automatically extract the questions and highlight the correct answers on the page.

## How the Code Works

- **Question Extraction**: The extension identifies question elements on the page using CSS selectors and extracts their content.
- **Answering with Google Bard AI**: It then sends the extracted questions to Google Bard (Gemini-1.5 model) via an API call. The request includes the quiz text, formatted as needed.
- **Answer Highlighting**: Upon receiving the answers from Google Bard, the extension compares them to the quiz content and highlights the correct ones on the page.

### Code Breakdown

1. **`getTextFromElement(element)`**: Extracts the full text from the question's HTML element, including all nested text nodes.
2. **`replaceSpecialChars(str)`**: Handles the replacement of special characters such as quotes and dashes, ensuring consistency in matching answers.
3. **Fetching Google Bard AI Response**: Sends the questions to the Google Bard API and parses the response to extract answers.
4. **Highlighting Answers**: Correct answers are highlighted with a green border to indicate the selected answers for each question.

## API Usage

This extension relies on Google Bard (Gemini-1.5 model) for generating answers. You need a valid API key to use the Bard model. The extension is pre-configured to work with the Google API service, and you will need to replace the placeholder API key with your own.

### Example of API Request

```javascript
const url =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY';
const payload = JSON.stringify({
  contents: [{ parts: [{ text: safeInput }] }],
});
```

## Contributing

Contributions are welcome! If you encounter a bug or want to suggest an improvement, please create an issue or submit a pull request. Your feedback helps make this extension better for everyone. Thank you for your support!
