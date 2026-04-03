export const config = {
  backend: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
  frontend: import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173"
}

// export const config = {
//   frontend: "http://localhost:5173/",
//   backend: "http://localhost:3000"
// }


