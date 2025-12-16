import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";

// Function to generate random activity
const generateActivityData = (startDate, endDate) => {
  const data = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const count = Math.floor(Math.random() * 50);
    data.push({
      date: currentDate.toISOString().split("T")[0], //YYY-MM-DD
      count: count,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

const getPanelColors = (maxCount) => {
  const colors = {};
  for (let i = 0; i <= maxCount; i++) {
    const greenValue = Math.floor((i / maxCount) * 255);
    colors[i] = `rgb(0, ${greenValue}, 0)`;
  }

  return colors;
};

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);
  const [panelColors, setPanelColors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      // Generate data for the past year (53 weeks)
      const today = new Date();
      const oneYearAgo = new Date(today);
      oneYearAgo.setFullYear(today.getFullYear() - 1);
      
      const startDate = oneYearAgo.toISOString().split("T")[0];
      const endDate = today.toISOString().split("T")[0];
      
      const data = generateActivityData(startDate, endDate);
      setActivityData(data);

      if (data.length > 0) {
        const maxCount = Math.max(...data.map((d) => d.count));
        setPanelColors(getPanelColors(maxCount));
      }
    };

    fetchData();
  }, []);

  // Calculate start date for HeatMap (should be 53 weeks before today)
  const today = new Date();
  const startDateForHeatMap = new Date(today);
  startDateForHeatMap.setDate(today.getDate() - (53 * 7)); // 53 weeks ago

  return (
    <div>
      <HeatMap
        className="HeatMapProfile"
        style={{ 
          maxWidth: "100%", 
          height: "200px", 
          color: "var(--color-text-primary)",
          marginTop: "var(--spacing-sm)"
        }}
        value={activityData}
        weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        startDate={startDateForHeatMap}
        rectSize={15}
        space={3}
        rectProps={{
          rx: 2.5,
        }}
        panelColors={panelColors}
      />
    </div>
  );
};

export default HeatMapProfile;
