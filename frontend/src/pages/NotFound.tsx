
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold text-humatrack-500 mb-6">404</h1>
        <p className="text-xl text-gray-700 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="text-gray-500 mb-8">
          We couldn't find the page you were looking for. Perhaps you mistyped the URL or the page has been moved.
        </p>
        <Button 
          onClick={() => navigate('/')}
          size="lg"
          className="bg-humatrack-500 hover:bg-humatrack-600"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
