import { useState, useEffect } from "react";

export function useGreeting() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    
    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    } else if (hour >= 17 && hour < 22) {
      return "Good evening";
    } else {
      return "Good night";
    }
  };

  const getGreetingEmoji = () => {
    const hour = currentTime.getHours();
    
    if (hour >= 5 && hour < 12) {
      return "🌅"; // Morning sunrise
    } else if (hour >= 12 && hour < 17) {
      return "☀️"; // Afternoon sun
    } else if (hour >= 17 && hour < 22) {
      return "🌆"; // Evening sunset
    } else {
      return "🌙"; // Night moon
    }
  };

  const getTimeBasedMessage = () => {
    const hour = currentTime.getHours();
    
    if (hour >= 5 && hour < 12) {
      return "Start your day with fresh insights from your data!";
    } else if (hour >= 12 && hour < 17) {
      return "Ready to analyze your data? You have new insights waiting.";
    } else if (hour >= 17 && hour < 22) {
      return "Wind down with some data visualization and analysis.";
    } else {
      return "Working late? Your data insights are always available.";
    }
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return {
    currentTime,
    getGreeting,
    getGreetingEmoji,
    getTimeBasedMessage,
    formatDate,
    formatTime,
  };
}