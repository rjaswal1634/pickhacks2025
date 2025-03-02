// app/test/page.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { AuthApi } from "../api/java/authApi"; // Ensure this path is correct and the module exists

function TestPage() {
  const [token, setToken] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, any>>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [registerData, setRegisterData] = useState({
    fullName: "",
    username: "",
    password: "",
    email: "",
    role: "",
  });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [childData, setChildData] = useState({ name: "", age: "" });
  const [userId, setUserId] = useState<string>("");
  const [childId, setChildId] = useState<string>("");

  const executeApiCall = async (apiMethod: (...args: any[]) => Promise<any>, ...args: any[]) => {
    setLoading(true);
    setError("");
    try {
      const response = await apiMethod(...args);
      setResults((prev) => ({
        ...prev,
        [apiMethod.name]: response,
      }));
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    executeApiCall(AuthApi.register, registerData);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    executeApiCall(AuthApi.login, loginData).then((response) => {
      if (response) setToken(response.data);
    });
  };

  const handleGetNumberOfChildren = () =>
    executeApiCall(AuthApi.getNumberOfChildren, Number(userId));

  const handleGetAllChildren = () => executeApiCall(AuthApi.getAllChildren);

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    executeApiCall(AuthApi.addChild, childData);
  };

  const handleUpdateChild = (e: React.FormEvent) => {
    e.preventDefault();
    executeApiCall(AuthApi.updateChild, Number(childId), childData);
  };

  const handleDeleteChild = (e: React.FormEvent) => {
    e.preventDefault();
    executeApiCall(AuthApi.deleteChild, Number(childId), childData);
  };

  const handleGetIntellectualScore = () =>
    executeApiCall(AuthApi.getIntellectualScore, Number(childId));

  const handleGetPhysicalScore = () =>
    executeApiCall(AuthApi.getPhysicalScore, Number(childId));

  const handleGetNumberOfGamesPlayed = () =>
    executeApiCall(AuthApi.getNumberOfGamesPlayed, Number(childId));

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>API Test Page</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {token && <p>Token: {token}</p>}

      <section>
        <h2>Register User</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={registerData.fullName}
            onChange={(e) => handleInputChange(e, setRegisterData)}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={registerData.username}
            onChange={(e) => handleInputChange(e, setRegisterData)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={registerData.password}
            onChange={(e) => handleInputChange(e, setRegisterData)}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={registerData.email}
            onChange={(e) => handleInputChange(e, setRegisterData)}
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={registerData.role}
            onChange={(e) => handleInputChange(e, setRegisterData)}
          />
          <button type="submit" disabled={loading}>
            Register
          </button>
        </form>
        {results.register && (
          <pre>{JSON.stringify(results.register, null, 2)}</pre>
        )}
      </section>

      <section>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="email"
            placeholder="email"
            value={loginData.email}
            onChange={(e) => handleInputChange(e, setLoginData)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) => handleInputChange(e, setLoginData)}
          />
          <button type="submit" disabled={loading}>
            Login
          </button>
        </form>
        {results.login && <pre>{JSON.stringify(results.login, null, 2)}</pre>}
      </section>

      <section>
        <h2>Get Number of Children</h2>
        <input
          type="number"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={handleGetNumberOfChildren} disabled={loading}>
          Get Number
        </button>
        {results.getNumberOfChildren && (
          <pre>{JSON.stringify(results.getNumberOfChildren, null, 2)}</pre>
        )}
      </section>

      <section>
        <h2>Get All Children</h2>
        <button onClick={handleGetAllChildren} disabled={loading}>
          Fetch Children
        </button>
        {results.getAllChildren && (
          <pre>{JSON.stringify(results.getAllChildren, null, 2)}</pre>
        )}
      </section>

      <section>
        <h2>Add Child</h2>
        <form onSubmit={handleAddChild}>
          <input
            type="text"
            name="name"
            placeholder="Child Name"
            value={childData.name}
            onChange={(e) => handleInputChange(e, setChildData)}
          />
          <input
            type="number"
            name="age"
            placeholder="Child Age"
            value={childData.age}
            onChange={(e) => handleInputChange(e, setChildData)}
          />
          <button type="submit" disabled={loading}>
            Add Child
          </button>
        </form>
        {results.addChild && (
          <pre>{JSON.stringify(results.addChild, null, 2)}</pre>
        )}
      </section>

      <section>
        <h2>Update/Delete Child</h2>
        <input
          type="number"
          placeholder="Child ID"
          value={childId}
          onChange={(e) => setChildId(e.target.value)}
        />
        <form onSubmit={handleUpdateChild} style={{ display: "inline" }}>
          <input
            type="text"
            name="name"
            placeholder="Child Name"
            value={childData.name}
            onChange={(e) => handleInputChange(e, setChildData)}
          />
          <input
            type="number"
            name="age"
            placeholder="Child Age"
            value={childData.age}
            onChange={(e) => handleInputChange(e, setChildData)}
          />
          <button type="submit" disabled={loading}>
            Update Child
          </button>
        </form>
        <button onClick={handleDeleteChild} disabled={loading}>
          Delete Child
        </button>
        {results.updateChild && (
          <pre>{JSON.stringify(results.updateChild, null, 2)}</pre>
        )}
        {results.deleteChild && (
          <pre>{JSON.stringify(results.deleteChild, null, 2)}</pre>
        )}
      </section>

      <section>
        <h2>Child Scores</h2>
        <input
          type="number"
          placeholder="Child ID"
          value={childId}
          onChange={(e) => setChildId(e.target.value)}
        />
        <button onClick={handleGetIntellectualScore} disabled={loading}>
          Intellectual Score
        </button>
        <button onClick={handleGetPhysicalScore} disabled={loading}>
          Physical Score
        </button>
        <button onClick={handleGetNumberOfGamesPlayed} disabled={loading}>
          Games Played
        </button>
        {results.getIntellectualScore && (
          <pre>{JSON.stringify(results.getIntellectualScore, null, 2)}</pre>
        )}
        {results.getPhysicalScore && (
          <pre>{JSON.stringify(results.getPhysicalScore, null, 2)}</pre>
        )}
        {results.getNumberOfGamesPlayed && (
          <pre>{JSON.stringify(results.getNumberOfGamesPlayed, null, 2)}</pre>
        )}
      </section>
    </div>
  );
}

export default TestPage;
