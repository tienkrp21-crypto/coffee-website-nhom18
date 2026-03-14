import React, { useEffect, useState } from "react";
import "./User.css";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://coffee-website-nhom18.onrender.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="user-container">
      <h2>Danh sách user</h2>

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
