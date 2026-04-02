import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./redux/slice/authSlice";
import AppRouter from "./routes/routes";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <>
      <RouterProvider router={AppRouter}></RouterProvider>
    </>
  );
}

export default App;
