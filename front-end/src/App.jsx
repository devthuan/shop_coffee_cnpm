import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultLayout from "./Layouts/DefaultLayout/DefaultLayout";
import { publicRoutes } from "./router/publicRoutes";
import { privateRoutes } from "./router/privateRoutes";
import { adminRoutes } from "./router/adminRoutes";
import { ProtectRoutesAdmin } from "./router/ProtectRoutesAdmin";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./router/ProtectRoute";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* init public routes */}
          {publicRoutes.map((route, i) => {
            const Page = route.component;
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route
                key={i}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
          {/* init private routes */}
          {privateRoutes.map((route, i) => {
            const Page = route.component;
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route
                key={i}
                path={route.path}
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Page />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            );
          })}
          {/* init admin routes */}
          {adminRoutes.map((route, i) => {
            const Page = route.component;
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route
                key={i}
                path={route.path}
                element={
                  <ProtectRoutesAdmin>
                    <Layout>
                      <Page />
                    </Layout>
                  </ProtectRoutesAdmin>
                }
              />
            );
          })}
        </Routes>

        {/*<ToastContainer

        {/* <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss 
          draggable
          pauseOnHover
          theme="light"
        />*/}
      </div>
    </Router>
  );
}

export default App;
