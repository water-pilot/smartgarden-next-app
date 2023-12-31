// apiActions.js
const API_ENDPOINTS = {
  electrovalves: "/api/proxy/electrovalves",
  valveSettings: "/api/proxy/valve_settings",
  schedules: "/api/proxy/schedules",
  irrigations: "/api/proxy/irrigations",
  // Ajoutez d'autres entités au besoin
};

export const getElectrovalve = async () => {
  const API_URL = API_ENDPOINTS.electrovalves;
  try {
    const apiRes = await fetch(API_URL, {
      method: "GET",
    });
    //console.log(await apiRes.json());
    if (!apiRes.ok) {
      throw new Error(`${apiRes.status}`);
    }
    return await apiRes.json();
  } catch (err) {
    throw err; // Propagez l'erreur pour pouvoir la gérer dans le composant.
  }
};
export const addElectrovalve = async (data) => {
  const API_URL = API_ENDPOINTS.electrovalves;
  console.log("data", data);
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de l'ajout de l'électrovanne"
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de l'envoi de la requête POST:", error);
    throw error;
  }
};
export const addData = async (endPoint, data) => {
  const API_URL = `/api/proxy/${endPoint}`;
  console.log("data", data);
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de l'ajout de l'électrovanne"
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de l'envoi de la requête POST:", error);
    throw error;
  }
};
export const deleteElectrovalve = async (id) => {
  const API_URL = `${API_ENDPOINTS.electrovalves}/${id}`;
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la suppression de l'électrovalve"
      );
    }
    return true; // Retournez true pour indiquer que la suppression a réussi.
  } catch (error) {
    console.error("Erreur lors de l'envoi de la requête DELETE:", error);
    throw error;
  }
};
export const deleteData = async (endPoint, id) => {
  const API_URL = `/api/proxy/${endPoint}/${id}`;
  console.log("API_URL", API_URL);
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la suppression de" + endPoint
      );
    }
    return true; // Retournez true pour indiquer que la suppression a réussi.
  } catch (error) {
    console.error("Erreur lors de l'envoi de la requête DELETE:", error);
    throw error;
  }
};

export const getSettings = async (id) => {
  const API_URL = `${API_ENDPOINTS.valveSettings}/${id}`;
  try {
    const apiRes = await fetch(API_URL, {
      method: "GET",
    });

    if (!apiRes.ok) {
      throw new Error(`HTTP error! status: ${apiRes.status}`);
    }
    return await apiRes.json();
  } catch (err) {
    console.log(err);
    throw err; // Propagez l'erreur pour pouvoir la gérer dans le composant.
  }
};

export const updateData = async (endPoint, id, data) => {
  const API_URL = `/api/proxy/${endPoint}/${id}`;
  try {
    const response = await fetch(API_URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
      body: JSON.stringify(data),
    });
    console.log(response);

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour de l'électrovanne");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de l'envoi de la requête PATCH:", error);
    throw error;
  }
};

export const getIrrigations = async () => {
    const API_URL = API_ENDPOINTS.irrigations;
    try {
        const apiRes = await fetch(API_URL, {
        method: "GET",
        });

        if (!apiRes.ok) {
        throw new Error(`${apiRes.status}`);
        }
        return await apiRes.json();
    } catch (err) {
        throw err; // Propagez l'erreur pour pouvoir la gérer dans le composant.
    }
}
