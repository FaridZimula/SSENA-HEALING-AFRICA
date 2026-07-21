
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(username, password)) {
            toast({
                title: "Welcome Admin",
                description: "You have successfully logged in.",
            });
            navigate("/admin");
        } else {
            toast({
                title: "Access Denied",
                description: "Invalid credentials. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="bg-card border border-border p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto mb-4">
                        <img src="/SSENA LOGO.jpg" alt="Admin Access" className="w-full h-full object-contain rounded-full" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
                    <p className="text-muted-foreground">Enter password to access dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="py-6"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="py-6"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full py-6 text-lg">
                        Login
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;
