import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5); // Start countdown from 5

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev === 1) {
                    clearInterval(timer); // Stop the interval at 1
                    navigate("/"); // Redirect after reaching 0
                }
                return prev - 1;
            });
        }, 1000); // Update every 1 second

        return () => clearInterval(timer); // Cleanup interval on unmount
    }, [navigate]);

    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>404 - Page Not Found</h1>
            <p>Redirecting to Home in <strong>{countdown}</strong> seconds...</p>
        </div>
    );
}