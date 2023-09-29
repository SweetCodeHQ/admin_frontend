import { Navbar, Footer, Dashboard } from "./components";
import { UserContextProvider } from "./context/UserContext";
import { CartContextProvider } from "./context/CartContext";
import { EntityContextProvider } from "./context/EntityContext";

const App = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-purple-welcome">
        <UserContextProvider>
          <CartContextProvider>
            <Navbar />
            <EntityContextProvider>
              <Dashboard />
            </EntityContextProvider>
          </CartContextProvider>
          <Footer />
        </UserContextProvider>
      </div>
    </div>
  );
};
export default App;
