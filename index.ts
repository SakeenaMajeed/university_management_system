#! /usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';


console.log(chalk.bgMagenta('\n\t=========================== ..WELCOME.. ================================='));
console.log(chalk.bgBlue('\n\t-------------------- university management system --------------------'));


class Person {
    constructor(public name: string, public age: number) {}

    getName(): string {
        return this.name;
    }
}

class Student extends Person {
    constructor(name: string, age: number, public rollNumber: string, public courses: Course[] = []) {
        super(name, age);
    }

    registerForCourse(course: Course): void {
        this.courses.push(course);
    }
}

class Instructor extends Person {
    constructor(name: string, age: number, public salary: number, public courses: Course[] = []) {
        super(name, age);
    }

    assignCourse(course: Course): void {
        this.courses.push(course);
    }
}

class Course {
    public students: Student[] = [];
    public instructor: Instructor | null = null;

    constructor(public id: string, public name: string) {}

    addStudent(student: Student): void {
        this.students.push(student);
    }

    setInstructor(instructor: Instructor): void {
        this.instructor = instructor;
    }
}

class Department {
    public courses: Course[] = [];

    constructor(public name: string) {}

    addCourse(course: Course): void {
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

const departments: Department[] = [
    new Department('Computer Science'),
    new Department('Information Technology')
];

const students: Student[] = [];
const instructors: Instructor[] = [];

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
