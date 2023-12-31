"use client";
import { useEffect, useState } from "react";
import styles from "../../styles/authenticate/authenticate.module.scss";
import Link from "next/link";
import Navigation2 from "@components/Navigation2";
import Footer from "@components/Footer";
import Image from "next/image";
import profilePic from "../../public/images/herbe.png";
import { useRouter } from "next/navigation";
import { useConnected } from "@context/ConnectedContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
  });
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { updateConnection } = useConnected();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      email: email,
      password: password,
      longitude: String(selectedCity.coordinates[0]),
      latitude: String(selectedCity.coordinates[1]),
      city: selectedCity.city,
    };
    try {
      const res = await fetch("/api/proxy/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        //connexion
        const body = {
          username: email,
          password: password,
        };
        const res = await fetch("/api/proxy/login_check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          updateConnection(true);
          // Redirection vers la page dashboard
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(e.target.value);

    setPasswordValidations({
      minLength: value.length >= 13,
      upperCase: /[A-Z]/.test(value),
      lowerCase: /[a-z]/.test(value),
      number: /\d/.test(value),
      specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value),
    });
  };

  const handleCityChange = async (e) => {
    setCity(e.target.value);
    setSelectedCity(null);
    if (e.target.value.length > 2) {
      // Pour éviter les requêtes sur de très courtes saisies
      setLoading(true);
      try {
        const res = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${e.target.value}`
        );
        const response = await res.json();
        const data = response.features.map((feature) => {
          return {
            postcode: feature.properties.postcode,
            city: feature.properties.city,
            coordinates: feature.geometry.coordinates,
          };
        });
        setSearchResults(data);
      } catch (error) {
        console.error("Erreur lors de la recherche:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };
  const handleCitySelect = (cityProperties) => {
    setSelectedCity(cityProperties);
    setCity(`${cityProperties.postcode} ${cityProperties.city}`);
  };

  return (
    <div>
      <Navigation2 />
      <div className={styles.container}>
        <Image src={profilePic} alt="grass pictures" className={styles.image} />
        <div>
          <h2 className={styles.title}>Inscription</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input type="text" className={styles.input} placeholder="Nom" />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="email"
                className={styles.input}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                className={styles.input}
                placeholder="Mot de passe"
                value={password}
                onChange={handlePasswordChange}
              />
              <ul className={styles.passwordRequirements}>
                <li
                  className={
                    passwordValidations.minLength ? styles.valid : styles.card
                  }
                >
                  13 caractères
                </li>
                <li
                  className={
                    passwordValidations.upperCase ? styles.valid : styles.card
                  }
                >
                  1 majuscule
                </li>
                <li
                  className={
                    passwordValidations.lowerCase ? styles.valid : styles.card
                  }
                >
                  1 minuscule
                </li>
                <li
                  className={
                    passwordValidations.number ? styles.valid : styles.card
                  }
                >
                  1 chiffre
                </li>
                <li
                  className={
                    passwordValidations.specialChar ? styles.valid : styles.card
                  }
                >
                  1 caractère spécial
                </li>
              </ul>
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                className={styles.input}
                placeholder="Code postale"
                onChange={handleCityChange}
                value={city}
              />
              {selectedCity === null ? (
                loading ? (
                  <div>Chargement...</div>
                ) : (
                  <ul className={styles.resultsList}>
                    {searchResults.map((result, index) => (
                      <li
                        key={index}
                        className={styles.resultItem}
                        onClick={() => handleCitySelect(result)}
                      >
                        {result.postcode} {result.city}
                      </li>
                    ))}
                  </ul>
                )
              ) : null}
            </div>
            <button type="submit" className={styles.button}>
              S'inscrire
            </button>
            <p className={styles.loginLink}>
              Vous avez déjà un compte ? <Link href="/login">Se connecter</Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
