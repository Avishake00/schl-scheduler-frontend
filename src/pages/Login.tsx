import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { loginStudent } from "@/lib/api-service";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState<"teacher" | "student">("student");
	const { login, loading, error } = useAuth();
	const navigate = useNavigate();

 const handleSubmit = async (e: React.FormEvent) => {
	e.preventDefault();

	try {
		await login(email, password, role);
		toast.success('Logged in successfully');
		navigate('/dashboard');
	} catch (err) {
		console.error('Login error:', err);
		toast.error(err.message || 'Login failed');
	}
};

  

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="w-full max-w-md p-4">
				<Card>
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl font-bold text-center">
							Student Management
						</CardTitle>
						<CardDescription className="text-center">
							Select your role and enter credentials
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							{/* Email */}
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="your@email.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>

							{/* Password or Student ID */}
							<div className="space-y-2">
								<Label htmlFor="password">
								Password
								</Label>
								<Input
									id="password"
									type="password"
									placeholder={
										role === "student" ? "Enter password" : "Enter password"
									}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>
							{/* Role Selection */}
							<div className="space-y-2">
								<label htmlFor="role" className="block font-medium">
									Select Role
								</label>
								<div className="flex items-center gap-4">
									<label className="flex items-center space-x-2">
										<input
											type="radio"
											name="role"
											value="student"
											checked={role === "student"}
											onChange={() => setRole("student")}
											className="accent-blue-500"
										/>
										<span>Student</span>
									</label>
									<label className="flex items-center space-x-2">
										<input
											type="radio"
											name="role"
											value="teacher"
											checked={role === "teacher"}
											onChange={() => setRole("teacher")}
											className="accent-blue-500"
										/>
										<span>Teacher</span>
									</label>
								</div>
							</div>

							{error && <p className="text-sm text-red-500">{error}</p>}

							<Button
								type="submit"
								className="w-full bg-education-primary hover:bg-education-dark"
								disabled={loading}
							>
								{loading ? "Signing in..." : "Sign In"}
							</Button>
						</form>
					</CardContent>
					<CardFooter className="flex flex-col space-y-2">
						<p className="text-sm text-gray-500 text-center">
							Demo Accounts:
							<br />
							Teacher: teacher@gmail.com | Password: password
							<br />
							Student: student email | password : student id
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};

export default Login;
