// App.jsx - Redesigned UI with existing functionality

import React, { useState } from "react";
import "./App.css";
import logo from "./assets/logo.svg";
import.meta.env.VITE_API_URL;

function App() {
  // State management
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [petNames, setPetNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Style options for pet names
  const nameStyles = [
    { id: "cute", label: "Cute", emoji: "💖", description: "Sweet names" },
    {
      id: "funny",
      label: "Funny",
      emoji: "😂",
      description: "Hilarious names",
    },
    {
      id: "whimsical",
      label: "Whimsical",
      emoji: "✨",
      description: "Playful and magical names",
    },
    { id: "edgy", label: "Edgy", emoji: "💀", description: "Epic names" },
    {
      id: "food",
      label: "Food",
      emoji: "🍍",
      description: "Food inspired names",
    },
    {
      id: "brainrot",
      label: "Brainrot",
      emoji: "🤪",
      description: "You already know",
    },
    {
      id: "colorful",
      label: "Colorful",
      emoji: "🎨",
      description: "color inspired names",
    },
    { id: "random", label: "Random", emoji: "🎲", description: "We'll pick!" },
  ];

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);

      // Create preview for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Reset other states when new image is uploaded
      setPetNames([]);
      setError(null);
    }
  };

  // Handle style selection
  const handleStyleSelect = (styleId) => {
    setSelectedStyle(styleId);
  };

  // Handle form submission to generate names
  const handleGenerateNames = async (e) => {
    if (e) e.preventDefault();

    // Validate inputs
    if (!selectedImage) {
      setError("Please upload an image of your pet first.");
      return;
    }

    if (!selectedStyle) {
      setError("Please select a naming style.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Prepare form data with image and style
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("style", selectedStyle);

      // API endpoint - update this with your actual backend URL
      // API endpoint - hardcoded for local testing
      const API_URL = import.meta.env.VITE_API_URL;
      console.log("Using API URL:", API_URL);

      // Make the API call to your backend
      const response = await fetch(`${API_URL}/api/generate-pet-names`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate pet names");
      }

      const data = await response.json();
      setPetNames(data.names);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card-container">
        {/* Header */}
        <header className="app-header">
          <div className="logo-container">
            <img src={logo} alt="PetPlace Logo" className="logo" />
          </div>
          <h1>Name Me AI</h1>
          <p>
            Upload a photo of your pet and get personalized name suggestions!
          </p>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="two-column">
            {/* Left Column - Upload & Style */}
            <div className="left-column">
              {/* Upload Section */}
              <div className="section upload-section">
                <h2>Upload Your Pet</h2>

                <label className="upload-label">
                  {imagePreview ? (
                    <div className="image-preview-container">
                      <img
                        src={imagePreview}
                        alt="Pet preview"
                        className="image-preview"
                      />
                      <button
                        className="change-image-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                        aria-label="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="upload-prompt">
                      <svg className="upload-icon" viewBox="0 0 24 24">
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                      </svg>
                      <p>Upload your pet's photo</p>
                      <span>Click or drag an image here</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                  />
                </label>
              </div>

              {/* Style Selection */}
              <div className="section">
                <h2>🤔 What style are we thinking?</h2>
                <div className="style-grid">
                  {nameStyles.map((style) => (
                    <button
                      key={style.id}
                      className={`style-button ${
                        selectedStyle === style.id ? "selected" : ""
                      }`}
                      onClick={() => handleStyleSelect(style.id)}
                    >
                      <span className="style-emoji">{style.emoji}</span>
                      <span className="style-label">{style.label}</span>
                    </button>
                  ))}
                </div>

                {imagePreview && selectedStyle && (
                  <div className="generate-section mt-4 text-center">
                    <button
                      className="btn btn-secondary"
                      onClick={handleGenerateNames}
                      disabled={isLoading}
                    >
                      {isLoading ? "Generating..." : "Generate Pet Names"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="right-column">
              <div className="results-section">
                <h2>Name Suggestions</h2>

                {error && <div className="error-message mb-4">{error}</div>}

                {!imagePreview && (
                  <div className="empty-state">
                    <svg
                      className="empty-state-icon"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <p>Upload a photo of your pet to get started</p>
                  </div>
                )}

                {imagePreview && !selectedStyle && (
                  <div className="empty-state">
                    <svg
                      className="empty-state-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      ></path>
                    </svg>
                    <p>Select a name style to generate suggestions</p>
                  </div>
                )}

                {isLoading && (
                  <div className="loading-animation">
                    <div className="spinner"></div>
                    <p>
                      Our AI is analyzing your pet and creating the perfect
                      names...
                    </p>
                  </div>
                )}

                {petNames.length > 0 && !isLoading && (
                  <>
                    <div className="name-grid">
                      {petNames.map((name, index) => (
                        <div key={index} className="name-card">
                          <h3>{name}</h3>
                        </div>
                      ))}
                    </div>

                    <div className="result-actions mt-4">
                      <div className="action-buttons">
                        <button
                          className="btn btn-primary"
                          onClick={handleGenerateNames}
                          disabled={isLoading}
                        >
                          Start Over
                        </button>
                      </div>

                      <div className="social-share mt-3">
                        <p className="share-text">Share with friends:</p>
                        <div className="social-icons">
                          <a
                            href="#"
                            className="social-icon"
                            aria-label="Share on Facebook"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                          </a>
                          <a
                            href="#"
                            className="social-icon"
                            aria-label="Share on Twitter"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                            </svg>
                          </a>
                          <a
                            href="#"
                            className="social-icon"
                            aria-label="Share via Email"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                              <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                          </a>
                          <a
                            href="#"
                            className="social-icon"
                            aria-label="Copy Link"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>
            PetPlace Test Product - Personal API Key - Model is
            unrestricted/unmonitored, some names might be hilarious, wrong, or
            inappropriate. For any requests or questions, email{" "}
            <a href="mailto:jacob.kennedy@petplace.com">here</a>.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
