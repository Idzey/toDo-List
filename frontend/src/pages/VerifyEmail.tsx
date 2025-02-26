import { Button, Result } from "antd";
import userService from "../services/userService";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [resultVerify, setResultVerify] = useState(true);
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) {
            return;
        }

        hasRun.current = true;
        const verifyEmail = async () => {
            try {
                if (!token) {
                    setResultVerify(false);
                    return;
                }
                
                console.log(token);
                await userService.verifyEmail(token);
                setResultVerify(true);
            } catch {
                setResultVerify(false);
            }
        };

        verifyEmail();
    }, []);


    if (!token || !resultVerify) {
        return (
            <Result
                title="You are not register!"
                status="warning"
                extra={[
                    <Button type="primary" key="home" onClick={() =>  navigate("/")}>
                      Go Home
                    </Button>,
                ]}
            />
        )
    }

    return (
        <>
            <Result
                title="You are register!"
                status="success"
                extra={[
                    <Button type="primary" key="home" onClick={() =>  navigate("/")}>
                      Go Home
                    </Button>,
                ]}
            />
        </>
    )
}

export default VerifyEmail;