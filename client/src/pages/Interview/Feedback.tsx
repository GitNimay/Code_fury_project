// InterviewFeedback.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, ChevronDown, Home, BookOpen, User, ArrowLeft } from "lucide-react"; //Added home book open user import

interface FeedbackItem {
    question: string;
    rating: number;
    userAnswer: string;
    correctAnswer: string;
    feedback: string;
}

const FEEDBACK_DATA: FeedbackItem[] = [
    {
        question:
            "Describe your experience with React.js, highlighting any specific projects or components you've developed.",
        rating: 7,
        userAnswer:
            "I’ve used React for 2 years, focusing on building reusable components and using hooks extensively...",
        correctAnswer:
            "Mention your years of experience, specific projects, custom hooks, performance optimizations, etc.",
        feedback:
            "Provide more concrete examples of React projects, libraries or frameworks you've used, and highlight any challenges you faced.",
    },
    {
        question:
            "Explain the differences between Spring Boot and Node.js, and why you might choose one over the other.",
        rating: 8,
        userAnswer:
            "I prefer Node.js for JavaScript-based stacks, but I'm also comfortable with Spring Boot...",
        correctAnswer:
            "Highlight concurrency models, language ecosystems (Java vs. JavaScript), performance, typical use cases, and deployment strategies.",
        feedback:
            "Add more detail about the architectural differences, enterprise support, and how each framework handles scalability.",
    },
    {
        question: "How do you handle state management in large React applications?",
        rating: 6,
        userAnswer:
            "I typically use Redux, but also have experience with Context API and Zustand.",
        correctAnswer:
            "Discuss advanced state management patterns, middleware, performance optimizations, and best practices for large apps.",
        feedback:
            "Consider elaborating on how you choose a state management library and how you structure your code for scalability.",
    },
    {
        question: "Describe your approach to testing React applications.",
        rating: 7,
        userAnswer:
            "I write unit tests using Jest and React Testing Library. I also incorporate integration tests...",
        correctAnswer:
            "Mention your testing strategy, including unit, integration, and end-to-end tests. Tools like Jest, RTL, Cypress, etc.",
        feedback:
            "Expand on how you handle mocking, coverage thresholds, and continuous integration setups for testing.",
    },
    {
        question: "How do you optimize performance in a React application?",
        rating: 9,
        userAnswer:
            "I use memoization, lazy loading, and code splitting. I also rely on dev tools to track performance bottlenecks...",
        correctAnswer:
            "Cover code splitting, memoization (React.memo, useMemo, useCallback), virtualization, and performance measurement tools.",
        feedback:
            "Great job! You could also mention how to handle large lists with virtualization and using profiling for advanced optimizations.",
    },
];

// Container animations for stagger effect
const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { when: "beforeChildren", staggerChildren: 0.1 },
    },
};

// Animation for each card
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const InterviewFeedback = () => {
    const navigate = useNavigate();

    // Calculate overall interview rating (average of all ratings).
    const overallRating =
        FEEDBACK_DATA.reduce((acc, item) => acc + item.rating, 0) /
        FEEDBACK_DATA.length;

    // Convert overall rating (out of 10) to a percentage for the progress bar.
    const progressValue = (overallRating / 10) * 100;

    // Track which feedback items are "open" in the accordion
    const [openIndices, setOpenIndices] = useState<boolean[]>(
        FEEDBACK_DATA.map(() => false)
    );

    const toggleAccordion = (index: number) => {
        setOpenIndices((prev) =>
            prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
        );
    };

    // Define a color palette to fit your general theme
    const primaryColor = "#2563eb"; // Indigo-600
    const secondaryColor = "#eef2ff"; // Indigo-50
    const successColor = "#34D399";  // Tailwind green-400
    const errorColor = "#F87171";    // Tailwind red-400
    const mutedColor = "#6B7280";   // Tailwind gray-500
    const accentColor = "#dbeafe";    // Light blue for a softer touch

     const handleLastReview = () => {
        // TODO: Replace '/candidate/last-interview' with the actual path to your last interview review page
        navigate("/candidate/last-interview");
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation Bar - Moved to the top */}
            <nav className="bg-white shadow-md w-full p-4">
                {/* Add right back button also move to the right side of main card the back butn from top  */}
                 <div className="flex items-center justify-between max-w-7xl mx-auto">
                  <Button
                        variant="ghost"
                        onClick={handleLastReview}
                        className="flex items-center"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </Button>

                    <span className="text-2xl font-bold" style={{ color: primaryColor }}>InterviewXpert</span>
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" className="flex items-center" onClick={() => navigate("/candidate/dashboard")}>
                            <Home className="h-4 w-4 mr-1" /> Home
                        </Button>
                        <Button variant="ghost" className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" /> Resources
                        </Button>
                        <Button variant="ghost" className="flex items-center" onClick={() => navigate("/candidate/profile")}>
                            <User className="h-4 w-4 mr-1" /> Profile
                        </Button>
                    </div>
                    </div>
            </nav>

            <div
                className="p-6 md:p-12 flex items-start flex-grow" /*Take remaining space*/
                style={{
                    background: `linear-gradient(to bottom, ${secondaryColor}, white)`, // Gentle gradient background
                }}
            >
                <motion.div
                    className="max-w-4xl mx-auto w-full space-y-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Heading & Overall Score */}
                    <motion.div variants={cardVariants}>
                        <Card className="p-6 rounded-2xl border border-gray-100">
                            <div className="space-y-4 text-center">
                                <h1 className="text-3xl md:text-4xl font-bold" style={{ color: successColor }}>
                                    Congratulations!
                                </h1>
                                <p className="text-xl font-semibold">
                                    Here is your interview feedback
                                </p>
                                <p className="text-md" style={{ color: mutedColor }}>
                                    Your overall interview rating:{" "}
                                    <span className="font-bold" style={{ color: primaryColor }}>
                                        {overallRating.toFixed(1)}/10
                                    </span>
                                </p>
                                {/* Progress Bar for Overall Rating */}
                                <div className="flex flex-col items-center mt-2">
                                    <Progress
                                        value={progressValue}
                                        className="w-full h-3 rounded-full"
                                        style={{ backgroundColor: accentColor, color: primaryColor }}
                                    />
                                    <p className="text-sm mt-1" style={{ color: mutedColor }}>
                                        {progressValue.toFixed(1)}%
                                    </p>
                                </div>
                                <p className="text-sm text-gray-600 mt-4">
                                    Below is a detailed breakdown of each question, the expected
                                    answers, and areas of improvement. Click on each question to
                                    expand or collapse details.
                                </p>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Detailed Feedback Accordion */}
                    <motion.div
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {FEEDBACK_DATA.map((item, idx) => {
                            const isOpen = openIndices[idx];
                            const isFullMark = item.rating === 10; // Determine if full mark

                            return (
                                <motion.div
                                    key={idx}
                                    className="rounded-2xl overflow-hidden border border-gray-100"
                                    variants={cardVariants}
                                >
                                    {/* Accordion Header */}
                                    <div
                                        className="p-4 md:p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => toggleAccordion(idx)}
                                        style={{ backgroundColor: secondaryColor }}
                                    >
                                        <div className="max-w-lg">
                                            <h2 className="text-lg font-semibold" style={{ color: primaryColor }}>
                                                {item.question}
                                            </h2>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {/* Show a check or cross icon based on rating threshold */}
                                            {item.rating >= 7 ? (
                                                <CheckCircle className="h-5 w-5" style={{ color: successColor }} />
                                            ) : (
                                                <XCircle className="h-5 w-5" style={{ color: errorColor }} />
                                            )}
                                            <span className="text-sm font-medium">
                                                Rating: {item.rating}/10
                                            </span>
                                            <motion.div
                                                animate={{ rotate: isOpen ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ChevronDown className="h-5 w-5" style={{ color: mutedColor }} />
                                            </motion.div>
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                key="content"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="px-4 md:px-6 pb-4 md:pb-6"
                                            >
                                                {/* User Answer */}
                                                <div className="mt-4">
                                                    <p className={`font-medium ${isFullMark ? "text-white" : "text-purple-600"}`} style={{ color: "#7c3aed" }}>
                                                        Your Answer:
                                                    </p>
                                                    <div className="bg-purple-50 p-3 rounded-md text-sm">
                                                        {item.userAnswer}
                                                    </div>
                                                </div>

                                                {/* Correct Answer */}
                                                <div className="mt-4">
                                                    <p className={`font-medium ${isFullMark ? "text-white" : ""}`} style={{ color: successColor }}>
                                                        Expected Answer:
                                                    </p>
                                                    <div className="bg-green-50 p-3 rounded-md text-sm">
                                                        {item.correctAnswer}
                                                    </div>
                                                </div>

                                                {/* Feedback */}
                                                <div className="mt-4">
                                                    <p className="font-medium" style={{ color: primaryColor }}>Feedback:</p>
                                                    <div className="bg-blue-50 p-3 rounded-md text-sm">
                                                        {item.feedback}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                </motion.div>
            </div>
              {/* Go Home Button - Placed at Bottom */}
              <div className="flex justify-center py-8">
                    <Button
                        variant="default"
                        onClick={() => navigate("/candidate/dashboard")}
                        className="px-6 py-2 rounded-full transition-colors"
                        style={{ backgroundColor: primaryColor, color: "white" }}
                    >
                        Go Home
                    </Button>
                </div>
        </div>
    );
};

export default InterviewFeedback;