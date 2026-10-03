const Category = require("./models/Category");
const Department = require("./models/Department");

const defaultCategories = [
  { name: "Academic", description: "Curriculum, grades, attendance, course material" },
  { name: "Hostel & Accommodation", description: "Room allocation, sanitation, mess quality" },
  { name: "Examination & Evaluation", description: "Hall tickets, result publication" },
  { name: "Library Services", description: "Book issue, digital portal access" },
  { name: "Infrastructure & Facilities", description: "Classrooms, labs, Wi-Fi" },
  { name: "Fee & Financial Services", description: "Fee payment receipts, scholarship" },
  { name: "Canteen & Food Quality", description: "Food hygiene, pricing, canteen services" },
  { name: "General Inquiry", description: "General questions and institutional support" }
];

const defaultDepartments = [
  { name: "Computer Science & Engineering", description: "CS & IT academic department" },
  { name: "Electrical & Electronics Engineering", description: "EEE & ECE academic department" },
  { name: "Mechanical Engineering", description: "Mechanical & Civil engineering department" },
  { name: "Student Affairs", description: "Student welfare, hostels, activities" },
  { name: "Finance & Accounts", description: "Tuition, accounts, scholarships" },
  { name: "Maintenance & Sanitation", description: "Campus maintenance, Wi-Fi, sanitation" },
  { name: "Library Administration", description: "Library services, e-resources" },
  { name: "General Administration", description: "General institutional administration" }
];

async function seedData() {
  try {
    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      await Category.insertMany(defaultCategories);
      console.log("Successfully seeded default categories into MongoDB database!");
    } else {
      console.log(`Categories collection already has ${catCount} records.`);
    }

    const deptCount = await Department.countDocuments();
    if (deptCount === 0) {
      await Department.insertMany(defaultDepartments);
      console.log("Successfully seeded default departments into MongoDB database!");
    } else {
      console.log(`Departments collection already has ${deptCount} records.`);
    }
  } catch (error) {
    console.error("Error auto-seeding categories and departments:", error.message);
  }
}

module.exports = seedData;
