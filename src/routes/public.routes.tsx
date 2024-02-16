
import { Routes, Route } from "react-router-dom";
import RootPage from "../pages/root";
import Login from "../pages/auth/login";

interface PublicRoutesProps {

}

export const PublicRoutes = (props: PublicRoutesProps) => {
    return (
        <Routes>
            <Route path="/" element={<RootPage></RootPage>} />
            <Route path="/login" element={<Login></Login>} />
        </Routes>
    )
};

export default PublicRoutes;
