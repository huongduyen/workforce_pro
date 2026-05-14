import type { User } from "../contexts/auth/types";
import { toastifyService } from "./toastifyService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

class UserService {
  async getProfile(): Promise<User> {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    const data = await response.json();
    return data.user;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ user: User; access_token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    if (!data.success || !data.access_token) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("access_token", data.access_token);
    
    toastifyService.loginSuccess(data.user?.name);
    
    return data;
  }

  async register(userData: {
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    const data = await response.json();
    return data;
  }

  async logout(): Promise<void> {
    const token = localStorage.getItem("access_token");

    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } finally {
      localStorage.removeItem("access_token");
    }
  }
}

export const userService = new UserService();
