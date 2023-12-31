import React, { useState, useEffect } from "react";
import styles from "@/styles/dashboard/settingsSlider.module.scss";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { getSettings, updateData } from "@utils/data-fetcher";
import CustomButton from "@components/dashboard/utils/CustomButton";

export default function SettingsSlider({ valve, closeModal }) {
  const [settings, setSettings] = useState({
    duration: 0,
    moistureThreshold: 0,
    rainThreshold: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSettings(valve.id);
        setSettings({
          duration: data.duration,
          moistureThreshold: data.moistureThreshold,
          rainThreshold: data.rainThreshold,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [valve]);

  const sliders = [
    {
      key: "duration",
      label: "Durée d'arrosage",
      unit: "min",
      min: 0,
      max: 100,
    },
    {
      key: "moistureThreshold",
      label: "Seuil d'humidité",
      unit: "%",
      min: 0,
      max: 100,
    },
    {
      key: "rainThreshold",
      label: "Seuil de pluie",
      unit: "mm",
      min: 0,
      max: 100,
    },
  ];

  const handleSliderChange = (key, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  const handleApplyChanges = async () => {
    try {
      await updateData("valve_settings", valve.id, settings);
      console.log("Mise à jour réussie !");
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p>Paramétrage pour : {valve.name}</p>
      </div>
      {sliders.map((slider) => (
        <div key={slider.key}>
          <div className={styles.label}>
            <p>{slider.label}</p>
          </div>
          <div className={styles.sliderContainer}>
            <div className={styles.slider}>
              <Slider
                min={slider.min}
                max={slider.max}
                value={settings[slider.key]}
                onChange={(value) => handleSliderChange(slider.key, value)}
              />
              <input
                type="number"
                value={settings[slider.key]}
                onChange={(e) => handleSliderChange(slider.key, e.target.value)}
                className={styles.inputValue}
              />
              <p>{slider.unit}</p>
            </div>
          </div>
        </div>
      ))}
      <CustomButton
        variant="default"
        onClick={handleApplyChanges}
        text={"Appliquer"}
      ></CustomButton>
      <CustomButton text="Annuler" variant="cancel" onClick={closeModal} />
    </div>
  );
}
