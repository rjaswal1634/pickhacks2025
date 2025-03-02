// api/java/authApi.js
const BASE_URL = "http://localhost:8080"; // Adjust this to your Spring Boot URL

export class AuthApi { // Changed from Javaapi to AuthApi
  static async register(registrationData) {
    try {
      const response = await fetch(`${BASE_URL}/public/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Registration failed. Please try again.");
      }

      return await response.json(); // Returns ApiResponse<UserResponse>
    } catch (err) {
      throw err instanceof Error ? err : new Error("An unknown error occurred");
    }
  }

  static async login(loginData) {
    try {
      const { email, password } = loginData;
      const response = await fetch(`${BASE_URL}/public/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        {
          method: "POST", // Use GET because the backend expects query parameters
        }
      )
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Login failed. Please try again.");
      }

      return await response.json(); // Returns ApiResponse<String> (token)
    } catch (err) {
      throw err instanceof Error ? err : new Error("An unknown error occurred");
    }
  }

  static async getNumberOfChildren(userId) {
    try {
      const response = await fetch(`${BASE_URL}/children/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch number of children.");
      }

      return await response.json(); // Returns ApiResponse<Integer>
    } catch (err) {
      throw err instanceof Error ? err : new Error("An unknown error occurred");
    }
  }

  static async getAllChildren() {
    try {
      const response = await fetch(`${BASE_URL}/children/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch all children.");
      }

      return await response.json(); // Returns ApiResponse<List<Child>>
    } catch (err) {
      throw err instanceof Error ? err : new Error("An unknown error occurred");
    }
  }

  static async addChild(childData) {
    try {
      const response = await fetch(`${BASE_URL}/child/user/${childData.userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(childData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to add child.");
      }

      return await response.json(); // Returns ApiResponse<Child>
    } catch (err) {
      throw err instanceof Error ? err : new Error("An unknown error occurred");
    }
  }

  static async updateChild(id, childData) {
    try {
      const response = await fetch(`${BASE_URL}/child/id/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(childData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update child.");
      }

      return await response.json(); // Returns ApiResponse<Child>
    } catch (err) {
      throw err instanceof Error ? err : new Error("An unknown error occurred");
    }
  }

  static async deleteChild(id, childData) {
    try {
      const response = await fetch(`${BASE_URL}/child/id/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(childData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete child.");
      }

      return await response.json(); // Returns ApiResponse<Child>
    } catch (err) {
      throw err instanceof Error ? err : new Error("An unknown error occurred");
    }
  }

  static async getIntellectualScore(childId) {
    try {
      const response = await fetch(`${BASE_URL}/child/score/intellectual/${childId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch intellectual score.");
      }

      return await response.json(); // Returns ApiResponse<Integer>
    } catch (err) {
      throw err instanceof Error ? err : new Error("An unknown error occurred");
    }
  }

  static async getPhysicalScore(childId) {
    try {
      const response = await fetch(`${BASE_URL}/child/score/physical/${childId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch physical score.");
      }

      return await response.json(); // Returns ApiResponse<Integer>
    } catch (err) {
      throw err instanceof Error ? err : new Error("An unknown error occurred");
    }
  }

  static async getNumberOfGamesPlayed(childId) {
    try {
      const response = await fetch(`${BASE_URL}/child/games/child/${childId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch number of games played.");
      }

      return await response.json(); // Returns ApiResponse<Integer>
    } catch (err) {
      throw err instanceof Error ? err : new Error("An unknown error occurred");
    }
  }
}