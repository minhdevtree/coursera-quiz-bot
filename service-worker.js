function injectedFunction() {
  const API_KEY = 'YOUR_API_KEY';
  let element;

  // Mapping special characters to normal characters
  const specialCharMap = {
    '“': '"',
    '”': '"',
    '‘': "'",
    '’': "'",
    '—': '-',
    '…': '...',
  };

  // Replace special characters
  function replaceSpecialChars(str) {
    return str.replace(/[“”‘’—…]/g, char => specialCharMap[char] || char);
  }

  // Function to get the complete text from an element and its descendants
  function getTextFromElement(element) {
    let textContent = '';
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    while (walker.nextNode()) {
      textContent += walker.currentNode.nodeValue;
    }
    return textContent;
  }

  const questionAnswerElement = document.querySelectorAll(
    '.rc-FormPartsQuestion p'
  );

  const questionAnswerArray = Array.from(questionAnswerElement).map(p =>
    replaceSpecialChars(getTextFromElement(p).toLowerCase().trim())
  );

  const answerElement = document.querySelectorAll('.rc-Option__input-text p');

  const answerArray = Array.from(answerElement).map(p =>
    replaceSpecialChars(getTextFromElement(p).toLowerCase().trim())
  );

  // Function to get the question text and answers to the array of objects
  function getQuestionText() {
    const result = [];
    let currentQuestion = null;
    let currentAnswers = [];

    questionAnswerArray.forEach((item, index) => {
      // If the current item exists in answerArray, it's an answer
      if (answerArray.includes(item)) {
        currentAnswers.push(item);
      } else {
        // If a new question is found, push the previous question and answers to the result
        if (currentQuestion) {
          result.push({
            question: currentQuestion,
            answer: currentAnswers,
          });
        }
        // Set the new question and reset the answers array
        currentQuestion = item;
        currentAnswers = [];
      }
    });

    // After the loop, push the last question and its answers
    if (currentQuestion) {
      result.push({
        question: currentQuestion,
        answer: currentAnswers,
      });
    }

    return result;
  }

  async function callApi(questions) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const data = {
      contents: [
        {
          parts: [
            {
              text:
                'i have a json file like this containing questions and answers, please answer the questions and send me the results in the format below (absolutely no further explanation, other than the answer format, please do not add any unnecessary words like "this is the result") \n [ \n { \n "question": "{index of question}", \n "answer": [ \n "{answer1}", \n "{answer2}" \n ] \n }, \n ] \n this is the question file \n' +
                JSON.stringify(questions),
            },
          ],
        },
      ],
    };
    let result;
    await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => (result = data.candidates[0].content.parts[0].text))
      .catch(() => (result = null));
    return result;
  }

  const questionText = getQuestionText();

  console.log(questionText);

  callApi(questionText)
    .then(result => {
      const jsonResult = JSON.parse(result);

      let currentIndex = 0;
      for (let i = 0; i < jsonResult.length; i++) {
        console.log(
          `Question ${+jsonResult[i].question + 1}:\n ${jsonResult[
            i
          ].answer.join('\n')}`
        );

        // Display the result in the page
        for (
          j = currentIndex;
          j < currentIndex + questionText[i].answer.length;
          j++
        ) {
          if (jsonResult[i].answer.includes(answerArray[j])) {
            element = answerElement[j];
            element.style = 'border-style: solid; border-color: #0d7a0d;';
          }
        }
        currentIndex += questionText[i].answer.length;
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Listen for the extension icon click to run the injected script
chrome.action.onClicked.addListener(tab => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: injectedFunction,
  });
});
