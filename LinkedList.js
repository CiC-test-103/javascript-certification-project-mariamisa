// Necessary Imports (you will need to use this)
const fs = require('fs').promises;
const { Student } = require('./Student')

/**
 * Node Class (GIVEN, you will need to use this)
 */
class Node {
  // Public Fields
  data               // Student
  next               // Object
  /**
   * REQUIRES:  The fields specified above
   * EFFECTS:   Creates a new Node instance
   * RETURNS:   None
   */
  constructor(data, next = null) {
    this.data = data;
    this.next = next
  }
}

/**
 * Create LinkedList Class (for student management)
 * The class should have the public fields:
 * - head, tail, length
 */
class LinkedList {
  // Public Fields
  head              // Object
  tail              // Object
  length            // Number representing size of LinkedList

  /**
   * REQUIRES:  None
   * EFFECTS:   Creates a new LinkedList instance (empty)
   * RETURNS:   None
   */
  constructor() {
    // TODO
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * REQUIRES:  A new student (Student)
   * EFFECTS:   Adds a Student to the end of the LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about adding to the 'end' of the LinkedList (Hint: tail)
   */
  addStudent(newStudent) {
    // TODO
    const node = new Node(newStudent);

    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }

    this.length++;
  }

  /**
   * REQUIRES:  email(String)
   * EFFECTS:   Removes a student by email (assume unique)
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about how removal might update head or tail
   */
  removeStudent(email) {
    // TODO
    if (!this.head) return;

    let current = this.head; //point the first item as current
    let prev = null; // no previous

    // loop to find the email
    while (current && current.data.getEmail() !== email) {
      prev = current;
      current = current.next;
    }
    if (!current) return; // if the loop ends without finding the email
    if (prev === null) { // if the student is the first item
      this.head = current.next; // make the next item head
    } else {
      prev.next = current.next; // if the deleted in the middle point the prev with next
    }
    if (current === this.tail) { // id the deleted it the end make the previous item the tail 
      this.tail = prev;
    }
    this.length--;
  }

  /**
   * REQUIRES:  email (String)
   * EFFECTS:   None
   * RETURNS:   The Student or -1 if not found
   */
  findStudent(email) {
    // TODO
    let current = this.head;
    while (current) {
      if (current.data.getEmail() === email) {
        return current.data;
      }
      current = current.next;
    }
    return -1
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   Clears all students from the Linked List
   * RETURNS:   None
   */
  #clearStudents() {
    // TODO
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  clearStudents() {
    this.#clearStudents();
    console.log("data cleared.")
  }
  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   LinkedList as a String for console.log in caller
   * CONSIDERATIONS:
   *  - Let's assume you have a LinkedList with two people
   *  - Output should appear as: "JohnDoe, JaneDoe"
   */
  displayStudents() {
    // TODO
    let current = this.head;
    let names = '';
    while (current) {
      names += `${names && ', '}${current.data.getName()}`
      current = current.next;
    }
    return names ? names : "no students yet!";
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   A sorted array of students by name
   */
  #sortStudentsByName() {
    // TODO
    const students = [];
    let current = this.head;
    while (current) {
      students.push(current.data);
      current = current.next;
    }
    students.sort((a, b) => a.getName().localeCompare(b.getName()));
    return students;
  }

  /**
   * REQUIRES:  specialization (String)
   * EFFECTS:   None
   * RETURNS:   An array of students matching the specialization, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterBySpecialization(specialization) {
    // TODO
    const sorted = this.#sortStudentsByName();
    return sorted.filter(el => el.getSpecialization() === specialization);
  }

  /**
   * REQUIRES:  minAge (Number)
   * EFFECTS:   None
   * RETURNS:   An array of students who are at least minAge, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterByMinAge(minAge) {
    // TODO
    const sorted = this.#sortStudentsByName();
    return sorted.filter(el => el.getYear() >= minAge);
  }

  #isValidJsonFile(fileName) {
    const fileNameRegex = /^\s*[\w-]+\.json\s*$/;
    if (!fileNameRegex.test(fileName.trim())) {
      throw new Error(
        "Invalid file name!"
      );
    }
  }

  /**
   * REQUIRES:  A valid file name (String)
   * EFFECTS:   Writes the LinkedList to a JSON file with the specified file name
   * RETURNS:   None
   */
  async saveToJson(fileName) {
    // TODO
    this.#isValidJsonFile(fileName)

    const studentsArray = [];
    let current = this.head;
    while (current) {
      const currentStudentData = current.data;
      studentsArray.push({
        name: currentStudentData.getName(),
        year: currentStudentData.getYear(),
        email: currentStudentData.getEmail(),
        specialization: currentStudentData.getSpecialization()
      });
      current = current.next;
    }
    await fs.writeFile(fileName, JSON.stringify(studentsArray, null, 2));
    return "file created successfully"
  }

  /**
   * REQUIRES:  A valid file name (String) that exists
   * EFFECTS:   Loads data from the specified fileName, overwrites existing LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   *  - Use clearStudents() to perform overwriting
   */
  async loadFromJSON(fileName) {
    // TODO
    this.#isValidJsonFile(fileName)

    const data = await fs.readFile(fileName, 'utf-8');
    const studentsArray = JSON.parse(data);

    this.#clearStudents();

    for (const el of studentsArray) {
      const student = new Student(el.name, el.year, el.email, el.specialization);
      this.addStudent(student);
    }
    return "data loaded successfully"
  }
}

module.exports = { LinkedList }
