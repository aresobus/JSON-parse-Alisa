const readline = require('readline');
const readline = require('readline');

// Linking the Json files
const multipleChoiceData = JSON.parse(fs.readFileSync('./multipleChoice.json', 'utf8'));
const definitionsData = JSON.parse(fs.readFileSync('./definitions.json', 'utf8'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Defining the main menu function with choice options
function mainMenu() {
  console.log(`Study App\n\nModes:\n1. Multiple Choice\n2. Vocabulary Drill\n3. Exit\n`);
  rl.question('> ', answer => {
    switch (answer) {
      case '1':
        multipleChoice();
        break;
      case '2':
        vocabularyDrill();
        break;
      case '3':
        rl.close();
        break;
      default:
        console.log('Invalid option. Please enter 1, 2, or 3.');
        mainMenu();
    }
  });
}

// Defining the Multiple Choice quiz function 
function multipleChoice() {
    // Setting the intial score and syntax to 0
  let score = 0;
  let currentQuestionIndex = 0;

  function askQuestion() {
    if (currentQuestionIndex < multipleChoiceData.length) {
      const question = multipleChoiceData[currentQuestionIndex];
      console.log(`Q: ${question.question}\n`);
      question.possibleAnswers.forEach((answer, index) => {
        console.log(`${index + 1}. ${answer}`);
      });
      rl.question('\n> ', (answer) => {
        if (answer === 'q') {
          console.log(`Score: ${score}/${multipleChoiceData.length}`);
          mainMenu();
        } else if (parseInt(answer) === question.correctAnswer + 1) {
          console.log('Correct!');
          score++;
        } else {
          console.log('Incorrect.');
        }
        currentQuestionIndex++;
        askQuestion();
      });
    } else {
      console.log(`Score: ${score}/${multipleChoiceData.length}`);
      mainMenu();
    }
  }

  askQuestion();
}

// Defining the Vocabulary Drill quiz function 
function vocabularyDrill() {
    let score = 0;
    let definitionsAttempted = 0;
  
    function askDefinition() {
      if (definitionsAttempted < definitionsData.length) {
        const definition = definitionsData[Math.floor(Math.random() * definitionsData.length)];
        console.log(`Definition: ${definition.definition}\n`);
        definition.possibleTerms.forEach((term, index) => {
          console.log(`${index + 1}. ${term}`);
        });
  
        let timeExpired = false;
  
        // Set a timeout for 5 seconds
        const timer = setTimeout(() => {
          timeExpired = true;
          rl.write('\nYour time is up!\n');
          definitionsAttempted++;
          askDefinition();
        }, 5000);
  
        rl.question('\n> ', (termIndex) => {
          clearTimeout(timer); // Clear the timer as user has responded
          if (timeExpired) return; // If time expired, ignore the input
  
          if (termIndex === 'q') {
            console.log(`Score: ${score}/${definitionsAttempted}`);
            mainMenu();
            return;
          }
  
          if (parseInt(termIndex) - 1 === definition.correctDefinition) {
            console.log('Correct!');
            score++;
          } else {
            console.log('That\'s Incorrect.');
          }
  
          definitionsAttempted++;
          askDefinition();
        });
      } else {
        console.log(`Score: ${score}/${definitionsAttempted}`);
        mainMenu();
      }
    }
  
    askDefinition();
  }
  

mainMenu();