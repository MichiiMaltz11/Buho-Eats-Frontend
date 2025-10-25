import axios from "axios";

// Funciones relacionadas con los usuarios
export const fetchUsers = async () => {
  const response = await axios.get("http://localhost:5001/users");
  return response.data;
};

export const registerUser = async (newUser) => {
  const users = await fetchUsers();

  // Validar si el correo ya existe
  const emailExists = users.some((user) => user.email === newUser.email);
  if (emailExists) {
    throw new Error("Este correo ya está registrado.");
  }

  // Crear usuario
  const response = await axios.post("http://localhost:5001/users", newUser);
  return response.data; // Devuelve el usuario registrado
};

// Funciones relacionadas con los locales
export const fetchLocales = async () => {
  try {
    const response = await axios.get("http://localhost:5001/local");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los locales:", error);
    throw new Error("No se pudieron obtener los datos de los locales.");
  }
};

export const fetchLocalById = async (id) => {
  try {
    const response = await axios.get(`http://localhost:5001/local/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el local con ID ${id}:`, error);
    throw new Error("No se pudo obtener la información del local.");
  }
};

// Función para agregar una reseña a un local
export const addReviewToLocal = async (id, newReview) => {
  try {
    const response = await axios.get(`http://localhost:5001/local/${id}`);
    const localData = response.data;

    // Añadir la nueva reseña al array de reseñas del local
    localData.reseñas.push(newReview);

    // Actualizar el local en el servidor (guardando los cambios)
    const updateResponse = await axios.put(`http://localhost:5001/local/${id}`, localData);
    return updateResponse.data; // Devuelve el local actualizado con la nueva reseña
  } catch (error) {
    console.error(`Error al agregar la reseña al local con ID ${id}:`, error);
    throw new Error("No se pudo agregar la reseña al local.");
  }
};

export const updateUserProfile = async (userId, updatedData) => {
  try {
      const response = await axios.put(`http://localhost:5001/users/${userId}`, updatedData);
      return response.data;
  } catch (error) {
      console.error(`Error al actualizar el perfil del usuario con ID ${userId}:`, error);
      throw new Error("No se pudo actualizar el perfil del usuario.");
  }
};// Añadir un local a favoritos
export const addToFavorites = async (userId, localId) => {
  try {
    const user = await axios.get(`http://localhost:5001/users/${userId}`);
    
    // Verificar si el local ya está en los favoritos
    if (!user.data.favoritos.includes(localId)) {
      // Si no está, agregarlo a los favoritos
      const updatedFavorites = [...user.data.favoritos, localId];
    
      const response = await axios.put(`http://localhost:5001/users/${userId}`, {
        ...user.data,
        favoritos: updatedFavorites,
      });

      return response.data;
    }

    console.log('Este local ya está en favoritos.');
    return user.data;  // Si el local ya está en favoritos, no hacer nada

  } catch (error) {
    console.error("Error al añadir a favoritos:", error);
    throw new Error("No se pudo añadir el local a favoritos.");
  }
};

// Eliminar un local de favoritos
export const removeFromFavorites = async (userId, localId) => {
  try {
    const user = await axios.get(`http://localhost:5001/users/${userId}`);
    
    // Filtrar el local de los favoritos (recorrer el arreglo)
    const updatedFavorites = user.data.favoritos.filter((id) => id !== localId);
    
    const response = await axios.put(`http://localhost:5001/users/${userId}`, {
      ...user.data,
      favoritos: updatedFavorites,
    });

    return response.data;
  } catch (error) {
    console.error("Error al eliminar de favoritos:", error);
    throw new Error("No se pudo eliminar el local de favoritos.");
  }
};
export const addPeticionLocal = async (idUsuario, nombre, tipoComida, imagenes) => {
  try {
    // Obtener el contenido actual del soporte
    const response = await axios.get("http://localhost:5001/soporte");
    const soporteData = response.data;

    // Crear la nueva petición de local
    const nuevaPeticion = {
      idUsuario,
      nombre,
      tipoComida,
      imagenes,
      estado: "Pendiente" // Estado inicial
    };

    // Añadir la nueva petición al arreglo peticionesLocal
    soporteData.peticionesLocal.push(nuevaPeticion);

    // Actualizar el soporte con la nueva petición
    const updateResponse = await axios.put("http://localhost:5001/soporte", soporteData);
    return updateResponse.data;
  } catch (error) {
    console.error("Error al agregar la petición de local:", error);
    throw new Error("No se pudo agregar la petición de local.");
  }
};