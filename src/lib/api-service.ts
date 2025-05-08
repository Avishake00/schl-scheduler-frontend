import { Class, Student, User } from "@/types";
const BASE_URL = "http://localhost:5000/api";

// API methods

// Helper for simulating network delay
const simulateNetworkDelay = () =>
	new Promise((resolve) => setTimeout(resolve, 300));


//LOGIN SERVICE

export const loginStudent = async (email: string, password: string) => {
	await simulateNetworkDelay();
	const res = await fetch(`${BASE_URL}/students/login`, {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
	  },
	  body: JSON.stringify({ email, password }),
	});	
  
	if (!res.ok) {
	  const error = await res.json();
	  throw new Error(error.message || 'Login failed');
	}
  
	return res.json();
  };
  
// ----- CLASS SERVICES -----

export const getAllClasses = async (): Promise<Class[]> => {
	await simulateNetworkDelay();
	const res = await fetch(`${BASE_URL}/classes`);
	return res.json();
};

export const deleteClassById = async (classId: string): Promise<boolean> => {
	await simulateNetworkDelay();
	const res = await fetch(`${BASE_URL}/classes/${classId}`, {
		method: "DELETE",
	});
	return res.ok;
};

export const getClassById = async (classId: string): Promise<Class> => {
	await simulateNetworkDelay();
	const res = await fetch(`${BASE_URL}/classes/${classId}`);
	return res.json();
};

export const getClassesByDate = async (date: string): Promise<Class[]> => {
	await simulateNetworkDelay();
	const res = await fetch(`${BASE_URL}/classes/date/${date}`);
	return res.json();
};

export const getStudentClasses = async (
	studentId: string
): Promise<Class[]> => {
	await simulateNetworkDelay();
	const res = await fetch(`${BASE_URL}/classes/student/${studentId}`);
	return res.json();
};

export const getStudentClassesByDate = async (
	studentId: string,
	date: string
): Promise<Class[]> => {
	await simulateNetworkDelay();
	const res = await fetch(
		`${BASE_URL}/classes/student/${studentId}/date/${date}`
	);
	return res.json();
};

export const createClass = async (
	classData: Omit<Class, "_id">
): Promise<Class> => {
	await simulateNetworkDelay();
	const res = await fetch(`${BASE_URL}/classes`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(classData),
	});
	return res.json();
};

// ----- STUDENT SERVICES -----

export const getAllStudents = async (): Promise<Student[]> => {
	await simulateNetworkDelay();
	const res = await fetch(`${BASE_URL}/students`);
	return res.json();
};

export const createStudent = async (
	studentData: Omit<Student, "_id">
): Promise<Student> => {
	await simulateNetworkDelay();
	const res = await fetch(`${BASE_URL}/students`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(studentData),
	});
	return res.json();
};

export const updateStudent = async (student: Student): Promise<Student> => {
	await simulateNetworkDelay();
	const res = await fetch(`${BASE_URL}/students/${student._id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(student),
	});
	return res.json();
};

export const deleteStudent = async (studentId: string): Promise<boolean> => {
	await simulateNetworkDelay();
	const res = await fetch(`${BASE_URL}/students/${studentId}`, {
		method: "DELETE",
	});
	return res.ok;
};
