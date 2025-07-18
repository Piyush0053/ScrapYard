const API_BASE_URL = 'http://localhost:3001'; // Replace with your backend API URL

export const saveUserToDatabase = async (userData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("User saved to database:", data);
    return data;
  } catch (error) {
    console.error("Error saving user to database:", error);
    throw error;
  }
};
