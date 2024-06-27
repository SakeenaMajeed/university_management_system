#! /usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';
console.log(chalk.bgMagenta('\n\t=========================== ..WELCOME.. ================================='));
console.log(chalk.bgBlue('\n\t-------------------- university management system --------------------'));
class Person {
    name;
    age;
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    getName() {
        return this.name;
    }
}
class Student extends Person {
    rollNumber;
    courses;
    constructor(name, age, rollNumber, courses = []) {
        super(name, age);
        this.rollNumber = rollNumber;
        this.courses = courses;
    }
    registerForCourse(course) {
        this.courses.push(course);
    }
}
class Instructor extends Person {
    salary;
    courses;
    constructor(name, age, salary, courses = []) {
        super(name, age);
        this.salary = salary;
        this.courses = courses;
    }
    assignCourse(course) {
        this.courses.push(course);
    }
}
class Course {
    id;
    name;
    students = [];
    instructor = null;
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    addStudent(student) {
        this.students.push(student);
    }
    setInstructor(instructor) {
        this.instructor = instructor;
    }
}
class Department {
    name;
    courses = [];
    constructor(name) {
        this.name = name;
    }
    addCourse(course) {
        this.courses.push(course);
    }
}
// Sample Data
const coursesList = [
    new Course('C001', 'Software Development'),
    new Course('C002', 'Computer Security and Networks'),
    new Course('C003', 'Web Development'),
    new Course('C004', 'Cyber Security'),
    new Course('C005', 'Machine Learning')
];
const departments = [
    new Department('Computer Science'),
    new Department('Information Technology')
];
const students = [];
const instructors = [];
// CLI Functions
async function addStudent() {
    const answers = await inquirer.prompt([
        { type: 'input', name: 'name', message: 'Enter student name:' },
        { type: 'input', name: 'age', message: 'Enter student age:', default: 18 },
        { type: 'input', name: 'rollNumber', message: 'Enter student roll number:' },
        { type: 'list', name: 'course', message: 'Select course:', choices: coursesList.map(c => c.name) }
    ]);
    const selectedCourse = coursesList.find(course => course.name === answers.course);
    if (parseInt(answers.age) < 18) {
        console.log(chalk.bgRed('Student not added: Age must be at least 18.'));
        return;
    }
    const student = new Student(answers.name, parseInt(answers.age), answers.rollNumber, selectedCourse ? [selectedCourse] : []);
    students.push(student);
    selectedCourse?.addStudent(student);
    console.log(chalk.bgMagenta('Student added successfully!'));
}
async function addInstructor() {
    const answers = await inquirer.prompt([
        { type: 'input', name: 'name', message: 'Enter instructor name:' },
        { type: 'input', name: 'age', message: 'Enter instructor age:', default: 30 },
        { type: 'input', name: 'salary', message: 'Enter instructor salary:' },
        { type: 'list', name: 'course', message: 'Select course:', choices: coursesList.map(c => c.name) }
    ]);
    const selectedCourse = coursesList.find(course => course.name === answers.course);
    if (parseInt(answers.age) < 30) {
        console.log(chalk.bgRed('Instructor not added: Age must be at least 30.'));
        return;
    }
    const instructor = new Instructor(answers.name, parseInt(answers.age), parseFloat(answers.salary), selectedCourse ? [selectedCourse] : []);
    instructors.push(instructor);
    selectedCourse?.setInstructor(instructor);
    console.log(chalk.bgHex('DAA520')('Instructor added successfully!'));
}
async function addDepartment() {
    const answers = await inquirer.prompt([
        { type: 'input', name: 'name', message: 'Enter department name:' },
        { type: 'checkbox', name: 'courses', message: 'Select courses:', choices: coursesList.map(c => c.name) }
    ]);
    const department = new Department(answers.name);
    const selectedCourses = coursesList.filter(course => answers.courses.includes(course.name));
    selectedCourses.forEach(course => department.addCourse(course));
    departments.push(department);
    console.log(chalk.yellowBright('Department added successfully!'));
}
async function listDepartments() {
    departments.forEach(department => {
        console.log(chalk.hex('98FB98').bold(`Department: ${department.name}`));
        department.courses.forEach(course => {
            console.log(chalk.yellowBright(`  - Course: ${course.name}`));
        });
    });
}
async function mainMenu() {
    while (true) {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'option',
                message: 'Choose an option:',
                choices: [
                    'Add Student',
                    'Add Instructor',
                    'Add Department',
                    'List Departments and Courses',
                    'Exit'
                ]
            }
        ]);
        switch (answers.option) {
            case 'Add Student':
                await addStudent();
                break;
            case 'Add Instructor':
                await addInstructor();
                break;
            case 'Add Department':
                await addDepartment();
                break;
            case 'List Departments and Courses':
                await listDepartments();
                break;
            case 'Exit':
                return;
        }
    }
}
// Start the CLI
mainMenu();
