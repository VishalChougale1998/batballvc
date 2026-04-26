import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../api";
import "./RegisterPlayer.css";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function RegisterPlayer() {
    const { leagueId } = useParams();
    const navigate = useNavigate();
    const receiptRef = useRef();

    const [league, setLeague] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        village: "",
        phone: "",
        role: "",
        tshirtSize: "",
        pantSize: ""
    });

    // ================= FETCH LEAGUE =================
    useEffect(() => {
        fetch(`${BASE_URL}/api/leagues`)
            .then(res => res.json())
            .then(data => {
                const found = data.find(l => l._id === leagueId);
                setLeague(found);
            })
            .catch(() => alert("Failed to load league"));
    }, [leagueId]);

    // ================= EXPIRY CHECK =================
    const isExpired =
        league && new Date() > new Date(league.lastDate);

    useEffect(() => {
        if (league && isExpired) {
            alert("Registration Closed ❌");
            navigate("/view-leagues");
        }
    }, [league, isExpired, navigate]);

    // ================= INPUT =================
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ================= SAVE PLAYER =================
    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData();

            formDataToSend.append("name", formData.name);
            formDataToSend.append("role", formData.role);
            formDataToSend.append("village", formData.village);
            formDataToSend.append("mobile", formData.phone);
            formDataToSend.append("leagueId", leagueId);
            formDataToSend.append("tshirtSize", formData.tshirtSize);
            formDataToSend.append("pantSize", formData.pantSize);

            if (photo) {
                formDataToSend.append("photo", photo);
            }

            await fetch(`${BASE_URL}/api/register`, {
                method: "POST",
                body: formDataToSend
            });

            setShowReceipt(true);

        } catch (err) {
            alert("Registration failed ❌");
        }
    };

    // ================= PAYMENT =================
    const handlePayment = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.role) {
            return alert("Please fill required fields");
        }

        if (!league) return alert("Loading...");
        if (isExpired) return alert("Registration Closed ❌");

        try {
            const res = await fetch(`${BASE_URL}/api/payment/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: league.entryFee })
            });

            const data = await res.json();

            const options = {
                key: "rzp_test_SXN8BWLtjYtAmI",
                amount: data.amount,
                currency: "INR",
                name: "BatBallVc",
                description: `Registration ₹${league.entryFee}`,
                order_id: data.id,

                handler: async function () {
                    await handleSubmit();
                },

                prefill: {
                    name: formData.name,
                    contact: formData.phone
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            alert("Payment failed ❌");
        }
    };

    // ================= PDF =================
    const downloadPDF = async () => {
        try {
            const input = receiptRef.current;
            const canvas = await html2canvas(input, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");

            const logoImg = new Image();
            logoImg.src = "/logo.png"; // keep logo in public folder

            logoImg.onload = () => {
                pdf.addImage(logoImg, "PNG", 80, 10, 50, 20);

                const imgWidth = 190;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                pdf.addImage(imgData, "PNG", 10, 40, imgWidth, imgHeight);
                pdf.save("BatBall_Receipt.pdf");
            };

            logoImg.onerror = () => {
                pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
                pdf.save("BatBall_Receipt.pdf");
            };

        } catch (error) {
            alert("PDF failed ❌");
        }
    };

    // ================= RECEIPT =================
    if (showReceipt) {
        return (
            <div className="view-container">

                <div className="form-wrapper">

                    <div
                        ref={receiptRef}
                        className="form-card"
                        style={{ background: "white", color: "black" }}
                    >
                        <h2 className="text-success text-center">
                            Payment Successful ✅
                        </h2>

                        <h4 className="text-center">
                            {league?.name}
                        </h4>

                        <hr />

                        <p><b>Name:</b> {formData.name}</p>
                        <p><b>Village:</b> {formData.village}</p>
                        <p><b>Mobile:</b> {formData.phone}</p>
                        <p><b>Role:</b> {formData.role}</p>

                        <hr />

                        <h3 className="text-center text-warning">
                            ₹{league?.entryFee}
                        </h3>

                        <p className="text-center">
                            {new Date().toLocaleString()}
                        </p>
                    </div>

                </div>

                <div className="text-center mt-3">
                    <button className="league-btn" onClick={downloadPDF}>
                        Download PDF 📄
                    </button>
                </div>

            </div>
        );
    }

    // ================= FORM =================
    return (
        <div className="view-container">

            <div className="form-wrapper">

                <div className="form-card">

                    <h2 className="text-center mb-3">
                        🏏 Player Registration
                    </h2>

                    <h4 className="text-center">
                        {league?.name}
                    </h4>

                    <p className="text-center text-warning">
                        Entry Fee: ₹{league?.entryFee}
                    </p>

                    <hr />

                    <input className="input-field" name="name" placeholder="Name" onChange={handleChange} />
                    <input className="input-field" name="village" placeholder="Village" onChange={handleChange} />
                    <input className="input-field" name="phone" placeholder="Mobile" onChange={handleChange} />

                    <select className="input-field" name="role" onChange={handleChange}>
                        <option value="">Select Role</option>
                        <option>Batsman</option>
                        <option>Bowler</option>
                        <option>All Rounder</option>
                    </select>

                    <input className="input-field" name="tshirtSize" placeholder="T-Shirt Size" onChange={handleChange} />
                    <input className="input-field" name="pantSize" placeholder="Pant Size" onChange={handleChange} />

                    <input
                        type="file"
                        className="input-field"
                        onChange={(e) => setPhoto(e.target.files[0])}
                    />

                    <button className="league-btn mt-2" onClick={handlePayment}>
                        Pay & Register
                    </button>

                </div>

            </div>

        </div>
    );
}

export default RegisterPlayer;