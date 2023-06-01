//jshint esversion:6
const express = require('express');
const mathjs = require('mathjs');
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));



app.get('/', function(req, res) {
  res.render('dashboard', {outcomeResult: outcomeRes, result: expressionsResults});
});


/***********************************************************************
 * Task-1
 * Simulation of an Event that Follows Given Biasness
***********************************************************************/
function generateOutcome(outcomes) {
  const randomNum = Math.random() * 100; // Generate a random number between 0 and 100
  let cumulativeProb = 0;

  for (const outcome of outcomes) {
    cumulativeProb += outcome.probability;

    if (randomNum <= cumulativeProb) {
      return outcome.outcome;
    }
  }

  return null; // Shouldn't happen if probabilities are correct
}

//it initialzes all outcomes with val zero
function initializeOccObj() {
  for (const outcome of eventOutcomes) {
    occurrenceCount[outcome.outcome] = 0;
  }
}

// Example usage
const eventOutcomes = [
  { outcome: 'A', probability: 30 },
  { outcome: 'B', probability: 40 },
  { outcome: 'C', probability: 20 },
  { outcome: 'D', probability: 10 }
];

const numOccurrences = 1000;

// Generate outcomes for the given number of occurrences
const occurrenceCount = {};
initializeOccObj();

let outcomeRes = "";


app.get('/getoutcome', function(req, res) {
  outcomeRes = "";
  initializeOccObj();
  
  for (let i = 0; i < numOccurrences; i++) {
    const outcome = generateOutcome(eventOutcomes);
    occurrenceCount[outcome]++;
  }
  
  // Print the occurrence count for each outcome
  for (const [outcome, count] of Object.entries(occurrenceCount)) {
    console.log(`On triggering the event ${numOccurrences} times, ${outcome} appeared ${count} times`);
    outcomeRes += `On triggering the event ${numOccurrences} times, ${outcome} appeared ${count} times \n`;
  }
  
  res.redirect('/')
});





/***********************************************************************
 * Task-2
 * Evaluate multiple mathematical expressions at once using a Web API
 * Api name: MathJS library
***********************************************************************/

//this method calls the evaluate function of MathJS library by passing expression as an argument 
function evaluateExpression(expression) {
  try {
    return mathjs.evaluate(expression);
  } catch (error) {
    return 'Error: ' + error.message;
  }
}

// Example expressions
const expressions = [
  '2 * 4 * 4',
  '5 / (7 - 5)',
  'sqrt(5^2 - 4^2)',
  'sqrt(-3^2 - 4^2)',
  'log(10)',
  'sin(0.5)',
  'end'
];

let expressionsResults = ""; //results to display at UI

app.get('/evaluate', function(req, res) {
  expressionsResults = "";

  // Evaluate each expression and display the result on console
  expressions.forEach((expression) => {
    if (expression === 'end') {
      return; // Skip the 'end' expression
    }

    const result = evaluateExpression(expression);
    console.log(expression + ' = ' + result);

    expressionsResults += expression + ' = ' + result + ',\n';
  });

  res.redirect('/');
});





let port = process.env.PORT;
if(port == null || port == "") {
    port = 3000;
}
app.listen(port);