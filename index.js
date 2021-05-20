const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output", "team.html");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./dist/render");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const teamMembers = []
const idArray = []
//The function to drive the user input
function appMenu() {
//Input for Manager role
function createManager() {
  console.log("Build your team!")
  inquirer.prompt([
    {
      type: "input",
      name: "managerName",
      message: "What is the team manager's name?",
      //Validating that some input has been entered
      validate: answer =>{
        if (answer !== ""){
          return true
        }
        return "Please enter the team manager's name."
      }
    },
    {
      type: "input",
      name: "managerId",
      message: "What is the team manager's ID?",
      //Using RegEx to validate that the ID is an integer greater than 0
      validate: answer => {
        const pass = answer.match(
          /^[1-9]\d*$/
        )
        if (pass){
          return true
        }
        return "Your answer must be greater than 0."
      }
    },
    {
      type: "input",
      name: "managerEmail",
      message: "What is the team manager's E-mail address?",
      //Using RedEx to validate that an acceptable email format has been entered
      validate: answer =>{
        const pass = answer.match(
          /\S+@\S+\.\S+/
        )
        if (pass){
          return true
          }
          return "Please provide a valid E-mail address."
        }
      },
      {
        type: "input",
        name: "managerOfficeNumber",
        message: "What is the team manager's office number?",
        //Using RegEx to validate that the number is an integer greater than 0
        validate: answer =>{
          const pass = answer.match(
            /^[1-9]\d*$/
          )
          if (pass){
            return true;
          }
          return "Your answer must be greater than 0."
        }
      }
      // Create the output directory if the output path doesn't exist and store answers
          ]).then(answers => {
      const manager = new Manager(answers.managerName, answers.managerId, answers.managerEmail, answers.managerOfficeNumber)
      //Push answers
      teamMembers.push(manager)
      idArray.push(answers.managerId)
      createTeam();
    });
  }
    function  createTeam(){
        inquirer.prompt([
        {
            type: "list",
            name: "role",
            message: "Which team member would you like to add?",
            choices: [
                "Engineer",
                "Intern",
                "None, I'm done."
            ]
    }
    ]).then(userChoice => {
        switch(userChoice.role) {
            case "Engineer":
                addEngineer();
                break;
            case "Intern":
                addIntern();
                break;
            default:
                buildTeam();
    }
    });
  }
//Input for Engineer role
    function addEngineer() {
        inquirer.prompt([
            {
                type: "input",
                name: "engineerName",
                message: "What is your engineer's name",
                validate: answer => {
                    if(answer !== "") {
                        return true
                    }

                    return "Please enter a valid name."
                }
            },
            {
                type: "input",
                name: "engineerId",
                message: "What is your engineer's ID?",
                validate: answer => {
          const pass = answer.match(
            /^[1-9]\d*$/
          );
          if (pass) {
            if (idArray.includes(answer)) {
              return "ID already in use, please choose another ID.";
            } else {
            return true;
          }
        }
          return "Your answer must be greater than 0.";
                }
            },
            {
                type: "input",
                name: "engineerEmail",
                message: "What is the engineer's E-mail address?",
                validate: answer => {
          const pass = answer.match(
            /\S+@\S+\.\S+/
          );
          if (pass) {
            return true;
          }
          return "Please provide a valid E-mail address.";
                }
            },
            {
                type: "input",
                name: "engineerGithub",
                message: "What is the engineer's Github?",
                validate: answer => {
                    if(answer !== "") {
                        return true
                    }

                    return "Please enter a valid github."
                }
            }
        ]).then(answers => {
            const engineer = new Engineer(answers.engineerName, answers.engineerId, answers.engineerEmail, answers.engineerGithub)
            teamMembers.push(engineer)
            idArray.push(answers.engineerId)
      createTeam();
    });
  }
  //Input for Intern role
    function addIntern() {
      inquirer.prompt([
        {
          type: "input",
          name: "internName",
          message: "What is the intern's name?",
          validate: answer => {
            if (answer !== "") {
            return true;
          }
          return "Please enter the intern's name.";
          }
        },
        {
            type: "input",
            name: "internId",
            message: "What is the intern's ID?",
            validate: answer => {
              const pass = answer.match(
                /^[1-9]\d*$/
              );
              if (pass) {
                if (idArray.includes(answer)) {
                  return "ID already in use, please choose another ID.";
                } else {
                return true;
              }
            }
              return "Your answer must be greater than 0.";
            }
          },
          {
            type: "input",
            name: "internEmail",
            message: "What is the intern's E-mail address?",
            validate: answer => {
              const pass = answer.match(
                /\S+@\S+\.\S+/
              );
              if (pass) {
                return true;
              }
              return "Please enter a valid E-mail address.";
            }
          },
          {
            type: "input",
            name: "internSchool",
            message: "What school does the intern attend?",
            validate: answer=> {
              if (answer !== "") {
                return true;
              }
              return "Please enter the name of the intern's school.";
            }
          }
        
        ]).then(answers => {
          const intern = new Intern(answers.internName, answers.internId, answers.internEmail, answers.internSchool);
          teamMembers.push(intern);
          idArray.push(answers.internId);
          createTeam();
        });
      }

      function buildTeam() {
        fs.writeFileSync("./output/team.html", render(teamMembers), "utf-8");
      }
  createManager();
  }
appMenu();