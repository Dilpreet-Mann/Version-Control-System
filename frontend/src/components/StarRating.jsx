import React, { useState, useEffect } from "react";
import { StarIcon } from "@primer/octicons-react";
import "./starRating.css";

const StarRating = ({ repoId, initialRating = 0, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
    // Fetch user's existing rating for this repo
    const fetchUserRating = async () => {
      const userId = localStorage.getItem("userId");
      if (userId && repoId) {
        try {
          const response = await fetch(
            `http://localhost:3002/repo/rating/${repoId}?userId=${userId}`
          );
          const data = await response.json();
          if (data.userRating) {
            setUserRating(data.userRating);
            setRating(data.userRating);
          } else {
            setRating(data.averageStars || 0);
          }
        } catch (err) {
          console.error("Error fetching rating:", err);
        }
      }
    };

    fetchUserRating();
  }, [repoId]);

  const handleStarClick = async (starValue) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login to rate repositories");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3002/repo/star/${repoId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            stars: starValue,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setRating(starValue);
        setUserRating(starValue);
        if (onRatingChange) {
          onRatingChange(starValue, data.averageStars);
        }
      }
    } catch (err) {
      console.error("Error rating repository:", err);
    }
  };

  const handleStarHover = (starValue) => {
    setHoveredStar(starValue);
  };

  const handleMouseLeave = () => {
    setHoveredStar(0);
  };

  return (
    <div className="star-rating-container">
      <div
        className="star-rating"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = hoveredStar
            ? star <= hoveredStar
            : star <= Math.round(rating);
          const isHalf = !hoveredStar && star - 0.5 <= rating && star > rating;

          return (
            <span
              key={star}
              className={`star ${isFilled ? "filled" : ""} ${isHalf ? "half" : ""}`}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
            >
              <StarIcon size={14} />
            </span>
          );
        })}
      </div>
      {rating > 0 && (
        <span className="rating-text">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;

