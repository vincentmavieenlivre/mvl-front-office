
import { Route, Routes } from "react-router-dom";

interface ErrorsRoutesProps {

}

export const ErrorsRoutes = (props: ErrorsRoutesProps) => {
    return (
        <Routes>
            <Route path="*" element={<div> Not Found or You do not have permission.</div>} />
        </Routes>
    )
};

export default ErrorsRoutes;
